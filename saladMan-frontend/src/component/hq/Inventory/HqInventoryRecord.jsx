import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import HqInventorySidebar from "./HqInventorySidebar";
import { myAxios } from "/src/config";
import { accessTokenAtom } from "/src/atoms";
import styles from "./HqInventoryRecord.module.css";

//날짜포멧변경
function formatDate(dateStr) {
  if (!dateStr) return "-";
  const d = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  const hh = String(d.getHours()).padStart(2, "0");
  const min = String(d.getMinutes()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd} ${hh}:${min}`;
}

export default function HqInventoryRecord() {
  const token = useAtomValue(accessTokenAtom);
  const storeId = 1;
  const [records, setRecords] = useState([]);
  const [filteredRecords, setFilteredRecords] = useState([]);

  const [activeTab, setActiveTab] = useState("입고");

  const [filterCategory, setFilterCategory] = useState("all");
  const [filterName, setFilterName] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");
  const [categories, setCategories] = useState([]);

  // 페이징
  const [pageInfo, setPageInfo] = useState({
    curPage: 1, allPage: 1, startPage: 1, endPage: 1,
  });

  // 옵션 로드
  useEffect(() => {
    if (!token) return;
    myAxios(token).get("/hq/inventory/categories").then(res => {
      setCategories(res.data.categories || []);
    });
    myAxios(token).get("/hq/inventory/ingredients").then(res => {
      const list = res.data.ingredients || [];
      setIngredients(list);
      setSelectedIngredient(list[0]?.id || "");
    });
    fetchRecords(1);
    // eslint-disable-next-line
  }, [token]);

  const fetchRecords = (page = 1) => {
    if (!token) return;
    myAxios(token).get("/hq/inventory/record", {
      params: { storeId, type: activeTab, page }
    }).then(res => {
      setRecords(res.data.records || []);
      setPageInfo(res.data.pageInfo || {});
    });
  };

  useEffect(() => {
    if (!token) return;
    fetchRecords(1);
    // eslint-disable-next-line
  }, [activeTab, token, storeId]);

  useEffect(() => {
    let temp = records;
    if (filterCategory !== "all") temp = temp.filter(r => r.categoryName === filterCategory);
    if (filterName) temp = temp.filter(r => r.ingredientName.includes(filterName));
    if (filterStartDate) temp = temp.filter(r => new Date(r.date) >= new Date(filterStartDate));
    if (filterEndDate) {
      const end = new Date(filterEndDate);
      end.setHours(23, 59, 59, 999);
      temp = temp.filter(r => new Date(r.date) <= end);
    }
    setFilteredRecords(temp);
  }, [records, filterCategory, filterName, filterStartDate, filterEndDate]);

  // 기간 버튼
  const setPeriod = type => {
    const today = new Date();
    if (type === "today") {
      const d = today.toISOString().slice(0, 10);
      setFilterStartDate(d);
      setFilterEndDate(d);
    } else if (type === "week") {
      const t = new Date(today);
      t.setDate(t.getDate() - 6);
      setFilterStartDate(t.toISOString().slice(0, 10));
      setFilterEndDate(today.toISOString().slice(0, 10));
    } else if (type === "month") {
      const t = new Date(today);
      t.setMonth(t.getMonth() - 1);
      t.setDate(t.getDate() + 1);
      setFilterStartDate(t.toISOString().slice(0, 10));
      setFilterEndDate(today.toISOString().slice(0, 10));
    } else {
      setFilterStartDate("");
      setFilterEndDate("");
    }
  };

  // 페이징
  const { curPage, startPage, endPage, allPage } = pageInfo;
  const pages = Array.from({ length: (endPage || 1) - (startPage || 1) + 1 }, (_, i) => (startPage || 1) + i);

  const movePage = p => {
    if (p < 1 || p > allPage) return;
    fetchRecords(p);
  };

  return (
    <div className={styles.container}>
      <HqInventorySidebar />
      <div className={styles.content}>
        <div className={styles.innerContainer}>
          <h2 className={styles.title}>입/출고 내역</h2>

          {/* 필터 */}
          <div className={styles.filters}>
            <div className={styles.row}>
              <span className={styles.label}>기간</span>
              <input type="date" value={filterStartDate} onChange={e => setFilterStartDate(e.target.value)} />
              <span>~</span>
              <input type="date" value={filterEndDate} onChange={e => setFilterEndDate(e.target.value)} />
              <div className={styles.periodButtons}>
                <button onClick={() => setPeriod("all")}>전체</button>
                <button onClick={() => setPeriod("today")}>오늘</button>
                <button onClick={() => setPeriod("week")}>한 주</button>
                <button onClick={() => setPeriod("month")}>한 달</button>
              </div>
            </div>
            <div className={styles.row}>
              <select value={filterCategory} onChange={e => setFilterCategory(e.target.value)}>
                <option value="all">전체</option>
                {categories.map(c => (
                  <option key={c.id} value={c.name}>{c.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="재료명 검색"
                value={filterName}
                onChange={e => setFilterName(e.target.value)}
                className={styles.keywordInput}
              />
              <button className={styles.searchBtn} onClick={() => fetchRecords(1)}>검색</button>
              <button className={styles.resetBtn} onClick={() => {
                setFilterStartDate(""); setFilterEndDate("");
                setFilterCategory("all"); setFilterName("");
                fetchRecords(1);
              }}>초기화</button>
              <div className={styles.rightActions}>
                <div className={styles.tabBtns}>
                <button className={activeTab === "입고" ? styles.tabActive : ""} onClick={() => setActiveTab("입고")}>입고</button>
                <button className={activeTab === "사용" ? styles.tabActive : ""} onClick={() => setActiveTab("출고")}>출고</button>
              </div>
              </div>
            </div>
          </div>

          {/* 테이블 */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>분류</th>
                  <th>재료명</th>
                  <th>수량</th>
                  <th>메모</th>
                  <th>날짜</th>
                </tr>
              </thead>
              <tbody>
                {filteredRecords.length > 0 ? (
                  filteredRecords.map(r => (
                    <tr key={r.id}>
                      <td>{r.categoryName}</td>
                      <td>{r.ingredientName}</td>
                      <td>{Number(r.quantity).toLocaleString()}</td>
                      <td>{r.memo || "-"}</td>
                      <td>{formatDate(r.date)}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className={styles.noData}>기록이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className={styles.pagination}>
            <button onClick={() => movePage(1)} disabled={curPage === 1}>&lt;&lt;</button>
            <button onClick={() => movePage(curPage - 1)} disabled={curPage === 1}>&lt;</button>
            {pages.map(p => (
              <button
                key={p}
                className={p === curPage ? styles.active : ""}
                onClick={() => movePage(p)}
              >{p}</button>
            ))}
            <button onClick={() => movePage(curPage + 1)} disabled={curPage === allPage}>&gt;</button>
            <button onClick={() => movePage(allPage)} disabled={curPage === allPage}>&gt;&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
