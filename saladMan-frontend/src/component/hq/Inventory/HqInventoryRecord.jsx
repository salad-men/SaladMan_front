import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import HqInventorySidebar from "./HqInventorySidebar";
import { myAxios } from "../../../config";
import { accessTokenAtom } from "/src/atoms";
import styles from "./HqInventoryRecord.module.css";

export default function HqInventoryRecord() {
  const token = useAtomValue(accessTokenAtom);
  const storeId = 1;
  const [ingredients, setIngredients] = useState([]);
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);

  const [activeTab, setActiveTab] = useState("입고");
  const [modalOpen, setModalOpen] = useState(false);

  const [selectedIngredient, setSelectedIngredient] = useState("");
  const [changeQuantity, setChangeQuantity] = useState("");
  const [memo, setMemo] = useState("");

  const [filterCategory, setFilterCategory] = useState("");
  const [filterName, setFilterName] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const [categories, setCategories] = useState([]);

  // --- 추가: 페이징 상태
  const [currentPage, setCurrentPage] = useState(1);
  const [pageInfo, setPageInfo] = useState({
    curPage: 1,
    allPage: 1,
    startPage: 1,
    endPage: 1,
  });

  const formatDate = (dateStr) => {
    if (!dateStr) return "-";
    return new Date(dateStr).toLocaleString("ko-KR", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      hour12: false,
    });
  };

  useEffect(() => {
    if (!token) return;
    myAxios(token).get("/hq/inventory/categories").then(res => {
      const cats = res.data.categories || [];
      setCategories(cats);
      setFilterCategory(""); 
    });

    myAxios(token).get("/hq/inventory/ingredients").then(res => {
      const list = res.data.ingredients || [];
      setIngredients(list);
      setSelectedIngredient(list[0]?.id || "");
    });

    // --- 페이지도 1로 초기화
    fetchRecords(1);
  // eslint-disable-next-line
  }, [token]);

  // --- 페이징, 탭, 필터 적용해서 서버에서 가져오는 함수 (추가/수정)
  const fetchRecords = (page = 1) => {
    myAxios(token).get("/hq/inventory/record", {
      params: {
        storeId,
        type: activeTab,
        page, // 서버에 페이지 파라미터 전달
      }
    }).then(res => {
      setRecords(res.data.records || []);
      setPageInfo(res.data.pageInfo || {});
      setCurrentPage(page);
    });
  };

  // --- 탭(입고/출고) 바뀔 때 기록만 새로고침
  useEffect(() => {
    if (!token) return;
    fetchRecords(1); // 탭 바뀌면 1페이지부터
  // eslint-disable-next-line
  }, [activeTab, token, storeId]);

  // --- 필터 적용: 여전히 프론트에서(필요시 서버필터로 변경)
  useEffect(() => {
    if (!token) return;
    let temp = records.filter(r => r.changeType.trim() === activeTab.trim());
    if (filterCategory !== "") temp = temp.filter(r => r.categoryName === filterCategory);
    if (filterName) temp = temp.filter(r => r.ingredientName.includes(filterName));
    if (filterStartDate) temp = temp.filter(r => new Date(r.date) >= new Date(filterStartDate));
    if (filterEndDate) {
      const end = new Date(filterEndDate);
      end.setHours(23, 59, 59, 999);
      temp = temp.filter(r => new Date(r.date) <= end);
    }
    setFilteredRecords(temp);
  }, [records, activeTab, filterCategory, filterName, filterStartDate, filterEndDate]);

  const openModal = () => {
    setSelectedIngredient(ingredients[0]?.id || "");
    setChangeQuantity("");
    setMemo("");
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  const handleSubmit = e => {
    e.preventDefault();
    if (!changeQuantity || Number(changeQuantity) <= 0) {
      alert("수량을 입력해주세요.");
      return;
    }

    myAxios(token).post("/hq/inventory/record-add", {
      ingredientId: Number(selectedIngredient),
      storeId: 1,
      quantity: Number(changeQuantity),
      memo,
      changeType: activeTab,
    }).then(() => {
      alert("저장 완료!");
      closeModal();
      fetchRecords(1); // 등록 후 1페이지 새로고침
    }).catch(err => {
      console.error("등록 실패", err);
      alert("등록에 실패했습니다.");
    });
  };

  const setToday = () => {
    const today = new Date().toISOString().slice(0, 10);
    setFilterStartDate(today);
    setFilterEndDate(today);
  };

  const setLastDays = (days) => {
    const to = new Date();
    const from = new Date();
    from.setDate(to.getDate() - days);
    setFilterStartDate(from.toISOString().slice(0, 10));
    setFilterEndDate(to.toISOString().slice(0, 10));
  };

  // --- 숫자버튼 페이지네이션 UI 함수 (추가)
  const renderPagination = () => {
    if (pageInfo.allPage <= 1) return null;
    const pages = [];
    for (let i = pageInfo.startPage; i <= pageInfo.endPage; i++) {
      pages.push(
        <button
          key={i}
          className={i === currentPage ? styles.activePage : ""}
          onClick={() => fetchRecords(i)}
        >
          {i}
        </button>
      );
    }
    return (
      <div className={styles.pagination}>
        <button
          onClick={() => fetchRecords(currentPage - 1)}
          disabled={currentPage === 1}
        >이전</button>
        {pages}
        <button
          onClick={() => fetchRecords(currentPage + 1)}
          disabled={currentPage === pageInfo.allPage}
        >다음</button>
      </div>
    );
  };

  return (
    <div className={styles.container}>
      <HqInventorySidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>재고 입출고 기록</h2>

        {/* 필터 */}
        <div className={styles.filters}>
          <div className={styles.row}>
            <label>기간</label>
            <input type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} />
            <span>~</span>
            <input type="date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} />
            <div className={styles.dateButtons}>
              <button onClick={() => { setFilterStartDate(""); setFilterEndDate(""); }}>전체</button>
              <button onClick={setToday}>오늘</button>
              <button onClick={() => setLastDays(7)}>1주</button>
              <button onClick={() => setLastDays(30)}>1달</button>
            </div>
          </div>

          <div className={styles.row}>
            <label>분류</label>
            <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
              <option value="">전체</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="재료명 검색"
              value={filterName}
              onChange={e => setFilterName(e.target.value)}
            />
            <button onClick={() => fetchRecords(1)}>검색</button>
            <button onClick={() => {
              setFilterStartDate(""); setFilterEndDate("");
              setFilterCategory(""); setFilterName("");
              fetchRecords(1); // 초기화 시도 1페이지로 새로고침
            }}>초기화</button>
          </div>
        </div>

        {/* 탭 + 등록 */}
        <div className={styles.actions}>
          <button className={activeTab === "입고" ? styles.edit : ""} onClick={() => setActiveTab("입고")}>입고</button>
          <button className={activeTab === "출고" ? styles.edit : ""} onClick={() => setActiveTab("출고")}>출고</button>
          <button onClick={openModal}>+ 등록</button>
        </div>

        {/* 테이블 */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>재료명</th>
              <th>분류</th>
              <th>수량</th>
              <th>메모</th>
              <th>날짜</th>
            </tr>
          </thead>
          <tbody>
            {filteredRecords.length > 0 ? (
              filteredRecords.map(r => (
                <tr key={r.id}>
                  <td>{r.ingredientName}</td>
                  <td>{r.categoryName}</td>
                  <td>{r.quantity}</td>
                  <td>{r.memo || "-"}</td>
                  <td>{formatDate(r.date)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5">기록이 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* --- 페이징 UI 추가 (수정/추가) */}
        {renderPagination()}

        {/* 모달 */}
        {modalOpen && (
          <div className={styles.modal} onClick={closeModal}>
            <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
              <h3>{activeTab} 등록</h3>
              <form onSubmit={handleSubmit}>
                <label>
                  재료
                  <select value={selectedIngredient} onChange={e => setSelectedIngredient(e.target.value)}>
                    {ingredients.map(i => (
                      <option key={i.id} value={i.id}>
                        {i.name} ({i.categoryName})
                      </option>
                    ))}
                  </select>
                </label>
                <label>
                  수량
                  <input type="number" min="1" value={changeQuantity} onChange={e => setChangeQuantity(e.target.value)} />
                </label>
                <label>
                  메모
                  <textarea value={memo} onChange={e => setMemo(e.target.value)} />
                </label>
                <div className={styles.modalActions}>
                  <button type="button" onClick={closeModal}>취소</button>
                  <button type="submit">저장</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
