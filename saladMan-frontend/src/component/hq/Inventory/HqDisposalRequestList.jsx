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
  const [ingredientName, setIngredientName] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOption, setSortOption] = useState("dateDesc");

  // 데이터 + 페이징
  const [data, setData] = useState([]);
  const [pageInfo, setPageInfo] = useState({ curPage:1, startPage:1, endPage:1, allPage:1 });

  // Bulk 체크박스
  const [checkedIds, setCheckedIds] = useState(new Set());

  // per-row 반려 인라인 상태
  const [rejectingRows, setRejectingRows] = useState(new Set());
  const [rejectReasons, setRejectReasons] = useState({});

  // 초기 로드 & 필터 변경
  useEffect(() => {
    if (!token) return;
    myAxios(token).get("/hq/inventory/stores").then(r => setStores(r.data.stores||[]));
    myAxios(token).get("/hq/inventory/categories").then(r => setCategories(r.data.categories||[]));
    fetchData(1);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [token, store, category, status, startDate, endDate, sortOption]);

  const fetchData = page => {
    if (!token) return;
    myAxios(token)
      .post("/hq/inventory/disposal-list", {
        store, category, status,
        keyword: ingredientName.trim(),
        startDate, endDate,
        sortOption, page
      })
      .then(r => {
        setData(r.data.disposals||[]);
        setPageInfo(r.data.pageInfo||{curPage:1,startPage:1,endPage:1,allPage:1});
        setCheckedIds(new Set());
        setRejectingRows(new Set());
        setRejectReasons({});
      });
  };

  // 페이징
  const movePage = p => { if (p<1||p>pageInfo.allPage) return; fetchData(p); };
  const { curPage, startPage, endPage, allPage } = pageInfo;
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  // 체크박스
  const toggleCheck = id => {
    setCheckedIds(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };

  // 단일 승인
  const approveOne = async id => {
    await myAxios(token).post("/hq/inventory/disposal/approve",[id]);
    fetchData(curPage);
  };

  // per-row 반려 인라인
  const startRejectOne = id => {
    setRejectingRows(prev => {
      const s = new Set(prev);
      s.has(id) ? s.delete(id) : s.add(id);
      return s;
    });
  };
  const cancelRejectOne = id => {
    setRejectingRows(prev => {
      const s = new Set(prev);
      s.delete(id);
      return s;
    });
    setRejectReasons(prev => {
      const c = { ...prev };
      delete c[id];
      return c;
    });
  };
  const changeReason = (id, txt) => {
    setRejectReasons(prev => ({ ...prev, [id]: txt }));
  };
  const confirmRejectOne = async id => {
    const memo = rejectReasons[id]||"";
    await myAxios(token).post("/hq/inventory/disposal/reject", [{ id, memo }]);
    fetchData(curPage);
  };

  // Bulk 승인/반려
  const approveSelected = async () => {
    if (!checkedIds.size) return;
    await myAxios(token).post("/hq/inventory/disposal/approve",[...checkedIds]);
    fetchData(curPage);
  };
  const rejectSelected = () => {
    if (!checkedIds.size) return;
    alert("Bulk 반려는 인라인 모달을 지원하지 않습니다.");
  };

  // 기간 단축
  const setPeriod = type => {
    const today = new Date();
    let s="", e="";
    if (type==="all")       { s=""; e=""; }
    else if (type==="today"){ s = today.toISOString().slice(0,10); e=s; }
    else if (type==="week") { const t=new Date(today); t.setDate(t.getDate()-6); s=t.toISOString().slice(0,10); e=today.toISOString().slice(0,10); }
    else                    { const t=new Date(today); t.setMonth(t.getMonth()-1); s=t.toISOString().slice(0,10); e=today.toISOString().slice(0,10); }
    setStartDate(s); setEndDate(e);
    fetchData(1);
  };

  return (
    <div className={styles.container}>
      <HqInventorySidebar/>
      <div className={styles.content}>
        <div className={styles.innerContainer}>

          <h2 className={styles.title}>지점 폐기 요청</h2>

          {/* 필터 + Bulk */}
          <div className={styles.filters}>
            <div className={styles.row}>
              <span className={styles.label}>기간</span>
              <input type="date" value={startDate} onChange={e=>setStartDate(e.target.value)} />
              <span>~</span>
              <input type="date" value={endDate}   onChange={e=>setEndDate(e.target.value)} />
              <div className={styles.periodButtons}>
                {["all","today","week","month"].map(t=>(
                  <button key={t} onClick={()=>setPeriod(t)}>
                    {t==="all"?"전체":t==="today"?"오늘":t==="week"?"1주":"1달"}
                  </button>
                ))}
              </div>
              <div className={styles.bulkActions}>
                <button onClick={approveSelected} disabled={!checkedIds.size}>선택 승인</button>
                <button onClick={rejectSelected}  disabled={!checkedIds.size}>선택 반려</button>
              </div>
            </div>

            <div className={styles.row}>
              <label>지점</label>
              <select value={store} onChange={e=>setStore(e.target.value)}>
                <option value="all">전체</option>
                {stores.map(s=><option key={s.id} value={s.id}>{s.name}</option>)}
              </select>

              <label>분류</label>
              <select value={category} onChange={e=>setCategory(e.target.value)}>
                <option value="all">전체</option>
                {categories.map(c=><option key={c.id} value={c.id}>{c.name}</option>)}
              </select>

              <label>상태</label>
              <select value={status} onChange={e=>setStatus(e.target.value)}>
                <option value="all">전체</option>
                <option value="대기">대기</option>
                <option value="완료">완료</option>
                <option value="반려됨">반려됨</option>
              </select>

              <label>재료명</label>
              <input
                type="text"
                className={styles.inputSearch}
                placeholder="재료명 입력"
                value={ingredientName}
                onChange={e=>setIngredientName(e.target.value)}
                onKeyDown={e=>e.key==="Enter"&&fetchData(1)}
              />
              <button className={styles.searchBtn} onClick={()=>fetchData(1)}>검색</button>

              <div className={styles.rightActions}>
                <label>정렬</label>
                <select
                  className={styles.sortSelect}
                  value={sortOption}
                  onChange={e=>setSortOption(e.target.value)}
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
                {data.length===0
                  ? <tr><td colSpan={9} className={styles.noData}>데이터가 없습니다.</td></tr>
                  : data.map(d=>{
                      const enabled = d.status==="대기";
                      const isRejecting = rejectingRows.has(d.id);
                      return (
                        <tr key={d.id}>
                          <td>
                            <input
                              type="checkbox"
                              checked={checkedIds.has(d.id)}
                              onChange={()=>toggleCheck(d.id)}
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
                                  onChange={e=>changeReason(d.id, e.target.value)}
                                />
                                <button
                                  className={styles.btnConfirmReject}
                                  onClick={()=>confirmRejectOne(d.id)}
                                >반려</button>
                                <button
                                  className={styles.btnCancel}
                                  onClick={()=>cancelRejectOne(d.id)}
                                >취소</button>
                              </>
                            ) : (
                              <>
                                <button
                                  className={styles.btnRow}
                                  onClick={()=>approveOne(d.id)}
                                  disabled={!enabled}
                                >승인</button>
                                <button
                                  className={styles.btnReject}
                                  onClick={()=>startRejectOne(d.id)}
                                  disabled={!enabled}
                                >반려</button>
                              </>
                            )}
                          </td>
                        </tr>
                      );
                    })
                }
              </tbody>
            </table>
          </div>

          {/* 페이징 */}
          <div className={styles.pagination}>
            <button onClick={()=>movePage(1)} disabled={curPage===1}>&lt;&lt;</button>
            <button onClick={()=>movePage(curPage-1)} disabled={curPage===1}>&lt;</button>
            {pages.map(p=>(
              <button
                key={p}
                className={p===curPage?styles.active:""}
                onClick={()=>movePage(p)}
              >{p}</button>
            ))}
            <button onClick={()=>movePage(curPage+1)} disabled={curPage===allPage}>&gt;</button>
            <button onClick={()=>movePage(allPage)} disabled={curPage===allPage}>&gt;&gt;</button>
          </div>

        </div>
      </div>
    </div>
  );
}
