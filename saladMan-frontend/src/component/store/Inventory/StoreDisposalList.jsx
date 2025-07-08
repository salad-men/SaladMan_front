import React, { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import StoreInventorySidebar from "./StoreInventorySidebar";
import { myAxios } from "../../../config";
import styles from "./StoreDisposalList.module.css";
import { userAtom, accessTokenAtom } from "/src/atoms";

// 상태 옵션
const STATUS_OPTIONS = [
  { value: "all", label: "전체" },
  { value: "대기", label: "대기" },
  { value: "완료", label: "완료" },
  { value: "반려됨", label: "반려" }
];

export default function StoreDisposalList() {
  const token = useAtomValue(accessTokenAtom);
  const user = useAtomValue(userAtom);

  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("all");
  const [status, setStatus] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [searchTrigger, setSearchTrigger] = useState(0);

  const [data, setData] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    curPage: 1, startPage: 1, endPage: 1, allPage: 1
  });

  // 카테고리 로드
  useEffect(() => {
    if (!token) return;
    myAxios(token)
      .get("/store/inventory/categories")
      .then(res => setCategories(res.data.categories || []))
      .catch(() => setCategories([]));
  }, [token]);

  // 목록 조회
  const fetchDisposalList = async (page = 1) => {
    if (!user?.id || !token) return;
    const params = {
      storeId: user.id,
      status: status === "all" ? null : status,
      category: category === "all" ? null : Number(category),
      keyword: keyword.trim() || null,
      startDate: startDate || null,
      endDate: endDate || null,
      sortOption: "dateDesc",
      page
    };
    try {
      const res = await myAxios(token).post("/store/inventory/disposal-list", params);
      setData(res.data.disposals || []);
      setPageInfo(res.data.pageInfo || {
        curPage: 1, startPage: 1, endPage: 1, allPage: 1
      });
    } catch (e) {
      setData([]);
      setPageInfo({
        curPage: 1, startPage: 1, endPage: 1, allPage: 1
      });
    }
  };

  useEffect(() => {
    fetchDisposalList(pageInfo.curPage);
    // eslint-disable-next-line
  }, [searchTrigger, pageInfo.curPage, token, category, status]);

  // 필터 변경
  const handleFilterChange = setter => e => {
    setter(e.target.value);
    setPageInfo(pi => ({ ...pi, curPage: 1 }));
  };
  // 날짜 직접 입력
  const handleStartDate = e => { setStartDate(e.target.value); setPageInfo(pi => ({ ...pi, curPage: 1 })); };
  const handleEndDate = e => { setEndDate(e.target.value); setPageInfo(pi => ({ ...pi, curPage: 1 })); };

  // 기간 버튼
  const setPeriod = (type) => {
    const today = new Date();
    let s = "", e = "";
    if (type === "all") {
      s = ""; e = "";
    } else if (type === "today") {
      s = e = today.toISOString().slice(0, 10);
    } else if (type === "week") {
      const from = new Date(today);
      from.setDate(from.getDate() - 6);
      s = from.toISOString().slice(0, 10);
      e = today.toISOString().slice(0, 10);
    } else { // month
      const from = new Date(today);
      from.setMonth(from.getMonth() - 1);
      s = from.toISOString().slice(0, 10);
      e = today.toISOString().slice(0, 10);
    }
    setStartDate(s);
    setEndDate(e);
    setPageInfo(pi => ({ ...pi, curPage: 1 }));
    setSearchTrigger(x => x + 1);
  };

  // 검색 버튼/엔터
  const doSearch = () => {
    setPageInfo(pi => ({ ...pi, curPage: 1 }));
    setSearchTrigger(x => x + 1);
  };

  // 페이지 이동
  const movePage = (p) => {
    if (p < 1 || p > pageInfo.allPage || p === pageInfo.curPage) return;
    setPageInfo(pi => ({ ...pi, curPage: p }));
  };

  // 페이징 배열
  const pages = [];
  for (let i = pageInfo.startPage; i <= pageInfo.endPage; i++) pages.push(i);

  return (
    <div className={styles.container}>
      <StoreInventorySidebar />
      <div className={styles.content}>
        <div className={styles.innerContainer}>

          <h2 className={styles.title}> 폐기신청 목록</h2>

          {/* 필터 */}
          <div className={styles.filters}>
            <div className={styles.row}>
              <label className={styles.label}>기간</label>
              <input
                type="date"
                value={startDate}
                onChange={handleStartDate}
                className={styles.inputDate}
              />
              <span>~</span>
              <input
                type="date"
                value={endDate}
                onChange={handleEndDate}
                className={styles.inputDate}
              />
              <div className={styles.periodButtons}>
                {["all", "today", "week", "month"].map(t => (
                  <button
                    type="button"
                    key={t}
                    className={styles.periodBtn}
                    onClick={() => setPeriod(t)}
                  >
                    {t === "all" ? "전체" : t === "today" ? "오늘" : t === "week" ? "1주" : "1달"}
                  </button>
                ))}
              </div>
            </div>
            <div className={styles.row}>
              <select
                value={category}
                onChange={handleFilterChange(setCategory)}
                className={styles.selectBox}
              >
                <option value="all">전체 분류</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <select
                value={status}
                onChange={handleFilterChange(setStatus)}
                className={styles.selectBox}
                style={{ width: 120 }}
              >
                {STATUS_OPTIONS.map(opt =>
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                )}
              </select>
              <input
                type="text"
                className={styles.inputSearch}
                placeholder="재료명 검색"
                value={keyword}
                onChange={handleFilterChange(setKeyword)}
                onKeyDown={e => e.key === "Enter" && doSearch()}
              />
              <button className={styles.searchBtn} onClick={doSearch}>검색</button>
            </div>
          </div>

          {/* 테이블 */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>분류</th>
                  <th>단위</th>
                  <th>폐기량</th>
                  <th>신청일</th>
                  <th>처리일</th>
                  <th>상태</th>
                  <th>메모</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0
                  ? (
                    <tr>
                      <td colSpan={7} className={styles.noData}>데이터가 없습니다.</td>
                    </tr>
                  )
                  : data.map(row => (
                    <tr key={row.id}>
                      <td>{row.categoryName || '-'}</td>
                      <td>{row.unit || '-'}</td>
                      <td>{row.quantity ?? '-'}</td>
                      <td>{row.requestedAt ? row.requestedAt.slice(0, 10) : '-'}</td>
                      <td>{row.processedAt ? row.processedAt.slice(0, 10) : '-'}</td>
                      <td>{row.status || '-'}</td>
                      <td>{row.memo || '-'}</td>
                    </tr>
                  ))
                }
              </tbody>
            </table>
          </div>

          {/* 페이징 */}
          <div className={styles.pagination}>
            <button onClick={() => movePage(1)} disabled={pageInfo.curPage === 1}>&lt;&lt;</button>
            <button onClick={() => movePage(pageInfo.curPage - 1)} disabled={pageInfo.curPage === 1}>&lt;</button>
            {pages.map(p => (
              <button
                key={p}
                className={p === pageInfo.curPage ? styles.active : ""}
                onClick={() => movePage(p)}
              >{p}</button>
            ))}
            <button onClick={() => movePage(pageInfo.curPage + 1)} disabled={pageInfo.curPage === pageInfo.allPage}>&gt;</button>
            <button onClick={() => movePage(pageInfo.allPage)} disabled={pageInfo.curPage === pageInfo.allPage}>&gt;&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
