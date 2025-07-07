import React, { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import HqInventorySidebar from "./HqInventorySidebar";
import { myAxios } from "/src/config";
import { accessTokenAtom } from "/src/atoms";
import styles from "./HqDisposalRequestList.module.css";

export default function HqDisposalRequestList() {
  const token = useAtomValue(accessTokenAtom);

  // 필터 상태
  const [stores, setStores] = useState([]);
  const [store, setStore] = useState("all");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [ingredientName, setIngredientName] = useState(""); // 검색어
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOption, setSortOption] = useState("dateDesc");
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [bulkRejectMemo, setBulkRejectMemo] = useState("");

  // 데이터 + 페이징
  const [data, setData] = useState([]);
  const [pageInfo, setPageInfo] = useState({ curPage:1, startPage:1, endPage:1, allPage:1 });

  // Bulk 체크박스
  const [checkedIds, setCheckedIds] = useState(new Set());

  // per-row 반려 인라인 상태
  const [rejectingRows, setRejectingRows] = useState(new Set());
  const [rejectReasons, setRejectReasons] = useState({});

  // 1) 옵션 불러오기
  useEffect(() => {
    if (!token) return;
    const ax = myAxios(token);
    ax.get("/hq/inventory/stores").then(r => setStores(r.data.stores || []));
    ax.get("/hq/inventory/categories").then(r => setCategories(r.data.categories || []));
  }, [token]);

  // 2) 필터/검색어/페이지 변경 시 데이터 fetch
  useEffect(() => {
    if (!token) return;
    fetchData(pageInfo.curPage);
    
  }, [
    token,
    store, category, status,
    startDate, endDate,
    sortOption,
    ingredientName,            
    pageInfo.curPage
  ]);

  // 데이터 가져오기
  const fetchData = async (page) => {
    if (!token) return;
    try {
      const res = await myAxios(token).post("/hq/inventory/disposal-list", {
        store,
        category,
        status,
        keyword: ingredientName.trim() || null,
        startDate: startDate || null,
        endDate: endDate || null,
        sortOption,
        page
      });
      setData(res.data.disposals || []);
      setPageInfo(res.data.pageInfo || { curPage:1, startPage:1, endPage:1, allPage:1 });
      setCheckedIds(new Set());
      setRejectingRows(new Set());
      setRejectReasons({});
    } catch (e) {
      console.error(e);
      setData([]);
    }
  };

  // 3) 필터 변경 시 페이지 초기화
  const onFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPageInfo(pi => ({ ...pi, curPage: 1 }));
  };

  // 4) 검색 버튼 클릭
  const onSearchClick = () => {
    setPageInfo(pi => ({ ...pi, curPage: 1 }));
  };

  // 5) 기간 버튼
  const onPeriodClick = (type) => {
    const today = new Date();
    let s = "", e = "";
    if (type === "all") {
      s = ""; e = "";
    } else if (type === "today") {
      s = today.toISOString().slice(0,10); e = s;
    } else if (type === "week") {
      const t = new Date(today);
      t.setDate(t.getDate() - 6);
      s = t.toISOString().slice(0,10);
      e = today.toISOString().slice(0,10);
    } else { // month
      const t = new Date(today);
      t.setMonth(t.getMonth() - 1);
      s = t.toISOString().slice(0,10);
      e = today.toISOString().slice(0,10);
    }
    setStartDate(s);
    setEndDate(e);
    setPageInfo(pi => ({ ...pi, curPage: 1 }));
  };

  // 6) 페이지 이동
  const movePage = (p) => {
    if (p < 1 || p > pageInfo.allPage) return;
    setPageInfo(pi => ({ ...pi, curPage: p }));
  };

  // 7) 체크박스 토글
  const toggleCheck = (id) => {
    setCheckedIds(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  // 단일 승인
  const approveOne = async (id) => {
    await myAxios(token).post("/hq/inventory/disposal/approve", [id]);
    fetchData(pageInfo.curPage);
  };

  // per-row 반려 인라인
  const startRejectOne = (id) => {
    setRejectingRows(prev => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };
  const cancelRejectOne = (id) => {
    setRejectingRows(prev => {
      const next = new Set(prev);
      next.delete(id);
      return next;
    });
    setRejectReasons(prev => {
      const copy = { ...prev };
      delete copy[id];
      return copy;
    });
  };
  const changeReason = (id, txt) => {
    setRejectReasons(prev => ({ ...prev, [id]: txt }));
  };
  const confirmRejectOne = async (id) => {
    const memo = rejectReasons[id] || "";
    await myAxios(token).post("/hq/inventory/disposal/reject", [{ id, memo }]);
    fetchData(pageInfo.curPage);
  };

  // Bulk 승인/반려
const approveSelected = async () => {
  const ids = Array.from(checkedIds);
  console.log('승인 ids:', ids);
  const filteredIds = ids.filter(id => id != null && id !== '');
  console.log('filtered 승인 ids:', filteredIds);
  if (!filteredIds.length) return;
  await myAxios(token).post("/hq/inventory/disposal/approve", filteredIds);
  fetchData(pageInfo.curPage);
};

  const rejectSelected = () => {
    const ids = Array.from(checkedIds).filter(id => id != null && id !== '');
    if (!ids.length) return;
    const memo = prompt("선택한 항목 전체에 적용할 반려 사유를 입력하세요:");
    if (!memo) return;
    const body = ids.map(id => ({ id, memo }));
    myAxios(token).post("/hq/inventory/disposal/reject", body).then(() => fetchData(pageInfo.curPage));
  };

  // 선택 반려 버튼
  const handleBulkRejectClick = () => {
    if (!checkedIds.size) return;
    setShowRejectModal(true);
    setBulkRejectMemo(""); // 초기화
  };

  // 모달 내 "확인" 버튼
  const handleConfirmBulkReject = async () => {
    const ids = Array.from(checkedIds).filter(id => id != null && id !== '');
    if (!ids.length || !bulkRejectMemo.trim()) return;
    const body = ids.map(id => ({ id, memo: bulkRejectMemo }));
    await myAxios(token).post("/hq/inventory/disposal/reject", body);
    setShowRejectModal(false);
    fetchData(pageInfo.curPage);
  };


  // 페이징 계산
  const { curPage, startPage, endPage, allPage } = pageInfo;
  const pages = [];
  for (let i = startPage; i <= endPage; i++) pages.push(i);

  return  (
    <div className={styles.container}>
      <HqInventorySidebar/>
      <div className={styles.content}>
        <div className={styles.innerContainer}>

          <h2 className={styles.title}>폐기요청 목록</h2>

          {/* 필터 + Bulk */}
          <div className={styles.filters}>
            <div className={styles.row}>
              <span className={styles.label}>기간</span>
              <input
                type="date"
                className={styles.inputDate}
                value={startDate}
                onChange={e => { setStartDate(e.target.value); setPageInfo(pi => ({ ...pi, curPage:1 })); }}
              />
              <span>~</span>
              <input
                type="date"
                className={styles.inputDate}
                value={endDate}
                onChange={e => { setEndDate(e.target.value); setPageInfo(pi => ({ ...pi, curPage:1 })); }}
              />
              <div className={styles.periodButtons}>
                {["all","today","week","month"].map(t => (
                  <button key={t} className={styles.periodBtn} onClick={() => onPeriodClick(t)}>
                    {t==="all"?"전체": t==="today"?"오늘": t==="week"?"한 주":"한 달"}
                  </button>
                ))}
              </div>
              <div className={styles.bulkActions}>
                <button className={styles.btnRow} onClick={approveSelected} disabled={!checkedIds.size}>선택 승인</button>
                <button className={styles.btnReject} onClick={handleBulkRejectClick} disabled={!checkedIds.size}>선택 반려</button>
              </div>
            </div>

            <div className={styles.row}>
              <select className={styles.selectBox} value={store} onChange={onFilterChange(setStore)}>
                <option value="all">전체 지점</option>
                {stores
                  .filter(s => s.id !== 1) 
                  .map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>

              <select className={styles.selectBox} value={category} onChange={onFilterChange(setCategory)}>
                <option value="all">전체 분류</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <select className={styles.selectBox} value={status} onChange={onFilterChange(setStatus)}>
                <option value="all">상태</option>
                <option value="대기">대기</option>
                <option value="완료">완료</option>
                <option value="반려됨">반려됨</option>
              </select>

              <input
                type="text"
                className={styles.inputSearch}
                placeholder="재료명 입력"
                value={ingredientName}
                onChange={e => setIngredientName(e.target.value)}
                onKeyDown={e => e.key==="Enter" && onSearchClick()}
              />
              <button className={styles.searchBtn} onClick={onSearchClick}>검색</button>

              <div className={styles.rightActions}>
                <select
                  className={styles.sortSelect}
                  value={sortOption}
                  onChange={e => { setSortOption(e.target.value); setPageInfo(pi => ({ ...pi, curPage:1 })); }}
                >
                  <option value="dateDesc">요청일↓</option>
                  <option value="dateAsc">요청일↑</option>
                  <option value="default">분류·품목·요청일</option>
                </select>
              </div>
            </div>
          </div>

          {/* 테이블 */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>선택</th>
                  <th>지점</th>
                  <th>분류</th>
                  <th>품목명</th>
                  <th>단위</th>
                  <th>요청량</th>
                  <th>요청일</th>
                  <th>상태</th>
                  <th>조치</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={9} className={styles.noData}>데이터가 없습니다.</td>
                  </tr>
                ) : (
                  data.map(d => {
                    const enabled = d.status === "대기";
                    const isRejecting = rejectingRows.has(d.id);
                    return (
                      <tr key={d.id}>
                        <td>
                          <input
                            type="checkbox"
                            className={styles.inputCheckbox}
                            checked={checkedIds.has(d.id)}
                            onChange={() => toggleCheck(d.id)}
                            disabled={!enabled}
                          />
                        </td>
                        <td>{d.storeName}</td>
                        <td>{d.categoryName}</td>
                        <td>{d.ingredientName}</td>
                        <td>{d.unit}</td>
                        <td>{d.quantity}</td>
                        <td>{d.requestedAt?.slice(0,10)}</td>
                        <td>{d.status}</td>
                        <td>
                          {isRejecting ? (
                            <>
                              <input
                                type="text"
                                className={styles.rejectInput}
                                value={rejectReasons[d.id]||""}
                                placeholder="반려 사유"
                                onChange={e => changeReason(d.id, e.target.value)}
                              />
                              <button className={styles.btnConfirmReject} onClick={() => confirmRejectOne(d.id)}>반려</button>
                              <button className={styles.btnCancel} onClick={() => cancelRejectOne(d.id)}>취소</button>
                            </>
                          ) : (
                            <>
                              <button className={styles.btnRow} onClick={() => approveOne(d.id)} disabled={!enabled}>승인</button>
                              <button className={styles.btnReject} onClick={() => startRejectOne(d.id)} disabled={!enabled}>반려</button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

          {/* 페이징 */}
          <div className={styles.pagination}>
            <button className={styles.pageBtn} onClick={() => movePage(1)} disabled={curPage === 1}>&lt;&lt;</button>
            <button className={styles.pageBtn} onClick={() => movePage(curPage - 1)} disabled={curPage === 1}>&lt;</button>
            {pages.map(p => (
              <button
                key={p}
                className={`${styles.pageBtn} ${p === curPage ? styles.active : ""}`}
                onClick={() => movePage(p)}
              >
                {p}
              </button>
            ))}
            <button className={styles.pageBtn} onClick={() => movePage(curPage + 1)} disabled={curPage === allPage}>&gt;</button>
            <button className={styles.pageBtn} onClick={() => movePage(allPage)} disabled={curPage === allPage}>&gt;&gt;</button>
          </div>

          {/* Bulk Reject 모달 */}
          {showRejectModal && (
            <div className={styles.modalOverlay}>
              <div className={styles.modalBox}>
                <h3>선택 반려 사유 입력</h3>
                <textarea
                  className={styles.textarea}
                  value={bulkRejectMemo}
                  onChange={e => setBulkRejectMemo(e.target.value)}
                  placeholder="반려 사유를 입력하세요."
                  rows={4}
                />
                <div className={styles.modalActions}>
                  <button className={styles.btnConfirmReject} onClick={handleConfirmBulkReject} disabled={!bulkRejectMemo.trim()}>확인</button>
                  <button className={styles.btnCancel} onClick={() => setShowRejectModal(false)}>취소</button>
                </div>
              </div>
            </div>
          )}    

        </div>
      </div>
    </div>
  );
}
