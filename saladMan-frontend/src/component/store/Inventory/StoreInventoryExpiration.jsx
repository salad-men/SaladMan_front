import React, { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import StoreInventorySidebar from "./StoreInventorySidebar";
import { myAxios } from "../../../config";
import styles from "./StoreInventoryExpiration.module.css";
import { userAtom, accessTokenAtom } from "/src/atoms";

// 날짜 포맷 함수
function formatDate(d) {
  if (!d) return "";
  const dt = typeof d === "string" ? new Date(d) : d;
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

// 기간 선택 함수
function getPeriod(type) {
  const today = new Date();
  if (type === "today") {
    const d = formatDate(today);
    return { start: d, end: d };
  }
  if (type === "week") {
    const t = new Date(today);
    t.setDate(t.getDate() - 6);
    return { start: formatDate(t), end: formatDate(today) };
  }
  if (type === "month") {
    const t = new Date(today);
    t.setMonth(t.getMonth() - 1);
    t.setDate(t.getDate() + 1);
    return { start: formatDate(t), end: formatDate(today) };
  }
  return { start: "", end: "" };
}

// 남은 날짜 D-day 표시 함수
function calcDiffDays(expiry) {
  if (!expiry) return null;
  const today = new Date();
  const exp = new Date(expiry);
  return Math.floor((exp - today) / (1000 * 60 * 60 * 24));
}
function formatDday(diff) {
  if (diff == null) return "";
  return diff < 0 ? `D+${-diff}` : `D-${diff}`;
}

export default function StoreInventoryExpiration() {
  const token = useAtomValue(accessTokenAtom);
  const user = useAtomValue(userAtom);

  // 필터/정렬 상태
  const [category, setCategory] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOption, setSortOption] = useState("default");

  // 데이터 상태
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    curPage: 1, allPage: 1, startPage: 1, endPage: 1
  });
  const [pageNums, setPageNums] = useState([]);

  // 선택/모달/폐기량/사유 상태
  const [selectedIds, setSelectedIds] = useState([]);
  const [disposalAmounts, setDisposalAmounts] = useState({});
  const [disposalReasons, setDisposalReasons] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 사유, 폐기량 입력 변경 핸들러
  const onAmount = (id, val) => {
    const maxQ = inventory.find(i => i.id === id)?.quantity || 0;
    const num = Math.max(0, Math.min(Number(val) || 0, maxQ));
    setDisposalAmounts(d => ({ ...d, [id]: num }));
  };
  const onReason = (id, val) => {
    setDisposalReasons(d => ({ ...d, [id]: val }));
  };

  // 폐기 모달 오픈
  const openModal = ids => {
    if (!ids.length) return alert("품목을 하나 이상 선택하세요.");
    // 기본값: 폐기량 = 현재 재고량, 사유는 빈값
    const newAmounts = {}, newReasons = {};
    ids.forEach(id => {
      const it = inventory.find(x => x.id === id);
      newAmounts[id] = it ? it.quantity : 0;
      newReasons[id] = "";
    });
    setSelectedIds(ids);
    setDisposalAmounts(newAmounts);
    setDisposalReasons(newReasons);
    setIsModalOpen(true);
  };
  // 행별 폐기
  const openModalSingle = id => openModal([id]);
  // 일괄 폐기
  const openModalBulk = () => openModal(selectedIds);

  const closeModal = () => setIsModalOpen(false);

  // 전체 선택/해제
  const toggleAll = () => {
    const avail = inventory.map(x => x.id);
    const allSel = avail.length > 0 && avail.every(id => selectedIds.includes(id));
    setSelectedIds(allSel ? [] : avail);
  };
  // 개별 선택
  const toggleSelect = id => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  // 카테고리 로드
  useEffect(() => {
    if (!token) return;
    myAxios(token)
      .get("/store/inventory/categories")
      .then(res => setCategories(res.data.categories || []))
      .catch(() => setCategories([]));
  }, [token]);

  // 재고 조회
  const fetchInventory = (page = 1) => {
    if (!user?.id || !token) return;
    const params = {
      store: user.id,
      category: category === "all" ? "all" : Number(category),
      keyword: keyword || "",
      startDate: startDate || "",
      endDate: endDate || "",
      page,
      sortOption
    };
    myAxios(token)
      .post("/store/inventory/expiration-list", params)
      .then(res => {
        const storeList = res.data.storeInventory || [];
        const transformed = storeList.map(item => {
          const diff = calcDiffDays(item.expiredDate?.slice(0, 10));
          return {
            id: item.id,
            name: item.ingredientName || "",
            category: item.categoryName || "",
            unit: item.unit || "",
            quantity: item.quantity || 0,
            price: item.unitCost || 0,
            expiry: item.expiredDate ? item.expiredDate.slice(0, 10) : "",
            dday: formatDday(diff)
          };
        });
        setInventory(transformed);
        setSelectedIds([]);
        setDisposalAmounts({});
        setDisposalReasons({});
        // 페이지 정보
        const pi = res.data.pageInfo;
        if (pi) {
          setPageInfo(pi);
          setPageNums(Array.from({length: pi.endPage - pi.startPage + 1}, (_, i) => pi.startPage + i));
        }
      })
      .catch(() => setInventory([]));
  };

  // 필터/정렬/페이지 변경 시 새로고침
  useEffect(() => {
    if (!token) return;
    fetchInventory(1);
  }, [token, user?.id, category, keyword, startDate, endDate, sortOption]);

  // 페이지 이동
  const movePage = p => {
    if (p < 1 || p > pageInfo.allPage) return;
    fetchInventory(p);
  };

  // 필터 입력 핸들러
  const onFilterChange = setter => e => {
    setter(e.target.value);
    setPageInfo(pi => ({ ...pi, curPage: 1 }));
  };

  // 기간 버튼
  const setPeriodFn = type => {
    if (type === "all") {
      setStartDate(""); setEndDate("");
    } else {
      const { start, end } = getPeriod(type);
      setStartDate(start);
      setEndDate(end);
    }
    setPageInfo(pi => ({ ...pi, curPage: 1 }));
  };

  // 폐기 신청
  const submit = () => {
    // 폐기량, 사유 모두 필수
    const items = selectedIds.map(id => {
      const qty = disposalAmounts[id] || 0;
      const memo = (disposalReasons[id] || "").trim();
      return {
        id,
        quantity: qty,
        memo,
        storeId: user.id

      };
    }).filter(x => x.quantity > 0 && x.memo);

    if (items.length !== selectedIds.length) {
      return alert("폐기량과 사유를 모두 입력하세요.");
    }
    // 서버 전송
    myAxios(token)
      .post("/store/inventory/disposal-request", items)
      .then(() => {
        alert(`총 ${items.length}건 폐기 신청 완료!`);
        setIsModalOpen(false);
        setSelectedIds([]);
        setDisposalAmounts({});
        setDisposalReasons({});
        fetchInventory(pageInfo.curPage);
      })
      .catch(() => {
        alert("폐기 신청에 실패했습니다.");
      });
  };

  return (
    <div className={styles.container}>
      <StoreInventorySidebar />
      <div className={styles.content}>
        <div className={styles.innerContainer}>
          <h2 className={styles.title}>유통기한 목록</h2>

          {/* 필터/정렬 */}
          <div className={styles.filters}>
            <div className={styles.row}>
              <input type="date" value={startDate} onChange={onFilterChange(setStartDate)} />
              <span>~</span>
              <input type="date" value={endDate} onChange={onFilterChange(setEndDate)} />
              <div className={styles.periodButtons}>
                <button onClick={() => setPeriodFn("all")}>전체</button>
                <button onClick={() => setPeriodFn("today")}>오늘</button>
                <button onClick={() => setPeriodFn("week")}>한 주</button>
                <button onClick={() => setPeriodFn("month")}>한 달</button>
              </div>
            </div>
            <div className={styles.row}>
              <select value={category} onChange={onFilterChange(setCategory)}>
                <option value="all">전체 분류</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="재료명 검색"
                value={keyword}
                onChange={onFilterChange(setKeyword)}
                className={styles.keywordInput}
              />
              <button className={styles.searchBtn} onClick={() => movePage(1)}>검색</button>
              <div className={styles.rightActions}>
                <button className={styles.disposalBtn} onClick={openModalBulk}>폐기</button>
                <select
                  className={styles.sortSelect}
                  value={sortOption}
                  onChange={e => {
                    setSortOption(e.target.value);
                    setPageInfo(pi => ({ ...pi, curPage: 1 }));
                  }}
                >
                  <option value="default">기본(분류-재료-유통기한)</option>
                  <option value="expiryAsc">유통기한↑-분류-재료</option>
                  <option value="expiryDesc">유통기한↓-분류-재료</option>
                </select>
              </div>
            </div>
          </div>

          {/* 목록 테이블 */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th className={styles.checkbox}>
                    <input
                      type="checkbox"
                      checked={inventory.length > 0 && inventory.every(i => selectedIds.includes(i.id))}
                      onChange={toggleAll}
                    />
                  </th>
                  <th>품목명</th>
                  <th>분류</th>
                  <th>단위</th>
                  <th>재고량</th>
                  <th>단가</th>
                  <th>유통기한</th>
                  <th>남은 날짜</th>
                  <th>폐기</th>
                </tr>
              </thead>
              <tbody>
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan={9} className={styles.noData}>
                      데이터가 없습니다.
                    </td>
                  </tr>
                ) : (
                  inventory.map(it => (
                    <tr
                      key={it.id}
                      className={typeof it.dday === "string" && it.dday.includes("D+") ? styles.expired : ""}
                    >
                      <td className={styles.checkbox}>
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(it.id)}
                          onChange={() => toggleSelect(it.id)}
                        />
                      </td>
                      <td>{it.name}</td>
                      <td>{it.category}</td>
                      <td>{it.unit}</td>
                      <td>{it.quantity}</td>
                      <td>{it.price}</td>
                      <td>{it.expiry}</td>
                      <td>{it.dday}</td>
                      <td>
                        <button
                          className={styles.rowDisposalBtn}
                          onClick={() => openModalSingle(it.id)}
                        >
                          폐기
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className={styles.pagination}>
            <button onClick={() => movePage(1)} disabled={pageInfo.curPage === 1}>&lt;&lt;</button>
            <button onClick={() => movePage(pageInfo.curPage - 1)} disabled={pageInfo.curPage === 1}>&lt;</button>
            {pageNums.map(p => (
              <button
                key={p}
                className={p === pageInfo.curPage ? styles.active : ""}
                onClick={() => movePage(p)}
              >
                {p}
              </button>
            ))}
            <button onClick={() => movePage(pageInfo.curPage + 1)} disabled={pageInfo.curPage === pageInfo.allPage}>&gt;</button>
            <button onClick={() => movePage(pageInfo.allPage)} disabled={pageInfo.curPage === pageInfo.allPage}>&gt;&gt;</button>
          </div>

          {/* 폐기 모달 */}
          {isModalOpen && (
            <div className={styles.modal} onClick={closeModal}>
              <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
                <button className={styles.modalClose} onClick={closeModal}>
                  &times;
                </button>
                <h3>폐기 신청</h3>
                <div className={styles.modalTopActions}>
                  <button className={styles.save} onClick={submit}>신청</button>
                </div>
                <div className={styles.modalTableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr>
                        <th>품목명</th>
                        <th>분류</th>
                        <th>단위</th>
                        <th>재고량</th>
                        <th>폐기량</th>
                        <th>폐기 사유</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedIds.map(id => {
                        const it = inventory.find(x => x.id === id);
                        return (
                          <tr key={id}>
                            <td>{it?.name}</td>
                            <td>{it?.category}</td>
                            <td>{it?.unit}</td>
                            <td>{it?.quantity}</td>
                            <td>
                              <input
                                type="number"
                                min={0}
                                max={it?.quantity}
                                value={disposalAmounts[id] || 0}
                                onChange={e => onAmount(id, e.target.value)}
                                className={styles.editable}
                              />
                            </td>
                            <td>
                              <input
                                type="text"
                                placeholder="폐기 사유"
                                value={disposalReasons[id] || ""}
                                onChange={e => onReason(id, e.target.value)}
                                className={styles.editable}
                                style={{ minWidth: 120 }}
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
