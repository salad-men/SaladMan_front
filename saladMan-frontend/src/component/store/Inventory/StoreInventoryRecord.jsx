import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import StoreInventorySidebar from "./StoreInventorySidebar";
import { myAxios } from "../../../config";
import { accessTokenAtom, userAtom } from "/src/atoms";
import styles from "./StoreInventoryRecord.module.css";

export default function StoreInventoryRecord() {
  // 1. atom 값 읽기
  const token = useAtomValue(accessTokenAtom);
  const user = useAtomValue(userAtom);

  // 2. 필수 storeId 확보 (없으면 스킵)
  const storeId = user?.id;
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

  // 날짜 포맷
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

  // --- 데이터 불러오기 (최초 1회) ---
  useEffect(() => {
    console.log("[useEffect-최초] token:", token, "storeId:", storeId, "user:", user);

    if (!storeId) {
      console.log("❗️storeId가 없습니다! user:", user);
      return;
    }
    // --- 카테고리 불러오기 ---
    myAxios(token).get("/store/inventory/categories")
      .then(res => {
        const cats = res.data.categories || [];
        setCategories(cats);
        setFilterCategory("");
        console.log("카테고리 불러옴", cats);
      })
      .catch(e => {
        console.error("카테고리 불러오기 실패", e);
      });

    // --- 재료 목록 불러오기 ---
    myAxios(token).get("/store/inventory/ingredients")
      .then(res => {
        const list = res.data.ingredients || [];
        setIngredients(list);
        setSelectedIngredient(list[0]?.id || "");
        console.log("재료 목록 불러옴", list);
      })
      .catch(e => {
        console.error("재료 불러오기 실패", e);
      });

    // --- 기록 불러오기 ---
    myAxios(token).get("/store/inventory/record", {
      params: { storeId, type: activeTab }
    }).then(res => {
      setRecords(res.data.records || []);
      console.log("기록 불러옴", res.data.records);
    }).catch(e => {
      console.error("기록 불러오기 실패", e);
    });
  }, [token, storeId]);

  // --- 탭(입고/출고) 바뀔 때 기록만 새로고침 ---
  useEffect(() => {
    if (!storeId) return;
    myAxios(token).get("/store/inventory/record", {
      params: { storeId, type: activeTab }
    }).then(res => {
      setRecords(res.data.records || []);
      console.log("탭 변경, 기록 새로 불러옴", res.data.records);
    }).catch(e => {
      console.error("탭 변경 후 기록 불러오기 실패", e);
    });
  }, [activeTab, token, storeId]);

  // --- 필터링 ---
  useEffect(() => {
    let temp = records.filter(r => (r.changeType?.trim() === activeTab.trim()));
    if (filterCategory !== "") temp = temp.filter(r => r.categoryName === filterCategory);
    if (filterName) temp = temp.filter(r => r.ingredientName?.includes(filterName));
    if (filterStartDate) temp = temp.filter(r => new Date(r.date) >= new Date(filterStartDate));
    if (filterEndDate) {
      const end = new Date(filterEndDate);
      end.setHours(23, 59, 59, 999);
      temp = temp.filter(r => new Date(r.date) <= end);
    }
    setFilteredRecords(temp);
  }, [records, activeTab, filterCategory, filterName, filterStartDate, filterEndDate]);

  // --- 모달 오픈 ---
  const openModal = () => {
    setSelectedIngredient(ingredients[0]?.id || "");
    setChangeQuantity("");
    setMemo("");
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  // --- 등록(저장) ---
  const handleSubmit = e => {
    e.preventDefault();
    if (!changeQuantity || Number(changeQuantity) <= 0) {
      alert("수량을 입력해주세요.");
      return;
    }
    if (!selectedIngredient) {
      alert("재료를 선택하세요.");
      return;
    }
    myAxios(token).post("/store/inventory/record-add", {
      ingredientId: Number(selectedIngredient),
      storeId,
      quantity: Number(changeQuantity),
      memo,
      changeType: activeTab,
    }).then(() => {
      alert("저장 완료!");
      closeModal();
      return myAxios(token).get("/store/inventory/record", {
        params: { storeId, type: activeTab }
      });
    }).then(res => {
      setRecords(res.data.records || []);
      console.log("등록 후 기록 새로고침", res.data.records);
    }).catch(err => {
      console.error("등록 실패", err);
      alert("등록에 실패했습니다.");
    });
  };

  // 날짜 필터 유틸
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

  return (
    <div className={styles.container}>
      <StoreInventorySidebar />
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
            <button type="button">검색</button>
            <button type="button" onClick={() => {
              setFilterStartDate(""); setFilterEndDate("");
              setFilterCategory(""); setFilterName("");
            }}>초기화</button>
          </div>
        </div>

        {/* 탭 + 등록 */}
        <div className={styles.actions}>
          <button type="button" className={activeTab === "입고" ? styles.edit : ""} onClick={() => setActiveTab("입고")}>입고</button>
          <button type="button" className={activeTab === "출고" ? styles.edit : ""} onClick={() => setActiveTab("출고")}>출고</button>
          <button type="button" className={styles.add} onClick={openModal}>+ 등록</button>
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

        {/* 모달 */}
        {modalOpen && (
          <div className={styles.modal} onClick={closeModal}>
            <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
              <h3>{activeTab} 등록</h3>
              <form onSubmit={handleSubmit} className={styles.form}>
                <label>
                  재료
                  <select value={selectedIngredient} onChange={e => setSelectedIngredient(e.target.value)} required>
                  {ingredients.map(i => (
                    <option key={i.id} value={i.id}>
                      {i.name}{i.categoryName ? ` (${i.categoryName})` : ""}
                    </option>
                  ))}
                </select>

                </label>
                <label>
                  수량
                  <input type="number" min="1" value={changeQuantity} onChange={e => setChangeQuantity(e.target.value)} required />
                </label>
                <label>
                  메모
                  <textarea value={memo} onChange={e => setMemo(e.target.value)} />
                </label>
                <div className={styles.modalActions}>
                  <button type="button" className={styles.cancel} onClick={closeModal}>취소</button>
                  <button type="submit" className={styles.save}>저장</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
