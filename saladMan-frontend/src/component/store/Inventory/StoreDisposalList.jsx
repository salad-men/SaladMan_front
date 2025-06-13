import React, { useState, useEffect } from "react";
import { atom, useAtom } from "jotai";
import StoreInventorySidebar from "./StoreInventorySidebar";
import styles from "./StoreDisposalList.module.css";

const initialData = [
  { id: 1, store: "본사", name: "렌틸콩", category: "단백질", unit: "kg", stock: 300, discardQty: 100, reason: "폐기 예정", discardDate: "2025-05-27", status: "완료", remark: "-" },
  { id: 2, store: "강남점", name: "로메인", category: "베이스채소", unit: "kg", stock: 100, discardQty: 200, reason: "유통기한 경과로 인한 폐기", discardDate: "2025-05-27", status: "대기", remark: "-" },
  { id: 3, store: "잠실점", name: "닭가슴살", category: "단백질", unit: "팩", stock: 50, discardQty: 200, reason: "포장 훼손으로 인한 폐기", discardDate: "2025-05-25", status: "대기", remark: "-" },
  { id: 4, store: "신촌점", name: "토마토", category: "야채", unit: "개", stock: 80, discardQty: 30, reason: "부패로 인한 폐기", discardDate: "2025-05-26", status: "대기", remark: "-" },
  { id: 5, store: "홍대점", name: "아보카도", category: "과일", unit: "개", stock: 40, discardQty: 5, reason: "숙성 과잉으로 인한 폐기", discardDate: "2025-05-27", status: "대기", remark: "-" },
];

const dataAtom = atom(initialData);

const initialFilters = {
  category: "all",
  keyword: "",
  startDate: "",
  endDate: "",
  status: "all",
};

export default function StoreDisposalList() {
  const [filters, setFilters] = useState(initialFilters);
  const [tempFilters, setTempFilters] = useState(initialFilters);
  const [data] = useAtom(dataAtom);

  // 기간 버튼 클릭 시 기간 필터 업데이트 함수
  const setPeriod = (days) => {
    const today = new Date();
    const end = today.toISOString().slice(0, 10);
    const startObj = days === 0 ? null : new Date(today.getTime() - days * 86400000);
    setTempFilters((f) => ({
      ...f,
      startDate: startObj ? startObj.toISOString().slice(0, 10) : "",
      endDate: end,
    }));
  };

  const applyFilters = () => {
    setFilters(tempFilters);
  };

  const resetFilters = () => {
    setTempFilters(initialFilters);
  };

  const filteredData = data.filter((item) => {
    const matchCategory = filters.category === "all" || item.category === filters.category;
    const matchKeyword = item.name.toLowerCase().includes(filters.keyword.toLowerCase());
    const matchStatus = filters.status === "all" || item.status === filters.status;

    const itemDate = new Date(item.discardDate);
    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;

    const matchStart = !start || itemDate >= start;
    const matchEnd = !end || itemDate <= end;

    return matchCategory && matchKeyword && matchStatus && matchStart && matchEnd;
  });

  return (
    <div className={styles.container}>
      <StoreInventorySidebar />

      <div className={styles.content}>
        <h2 className={styles.title}>내 폐기 신청 목록</h2>

        {/* 필터 */}
        <div className={styles.filters}>
          <div
            className={styles.row}
            style={{ justifyContent: "flex-start", alignItems: "center", gap: 12, marginBottom: 10 }}
          >
            <label>기간</label>
            <input
              type="date"
              value={tempFilters.startDate}
              onChange={(e) => setTempFilters((f) => ({ ...f, startDate: e.target.value }))}
              className={styles.dateInput}
            />
            <span className={styles.dateSeparator}>~</span>
            <input
              type="date"
              value={tempFilters.endDate}
              onChange={(e) => setTempFilters((f) => ({ ...f, endDate: e.target.value }))}
              className={styles.dateInput}
            />

            {/* 기간 버튼들 */}
            <div className={styles.periodButtons}>
              <button onClick={() => setPeriod(null)}>전체</button>
              <button onClick={() => setPeriod(0)}>오늘</button>
              <button onClick={() => setPeriod(7)}>1주</button>
              <button onClick={() => setPeriod(14)}>2주</button>
              <button onClick={() => setPeriod(30)}>1달</button>
            </div>
          </div>

          <div className={styles.row}>
            <label>분류</label>
            <select
              value={tempFilters.category}
              onChange={(e) => setTempFilters((f) => ({ ...f, category: e.target.value }))}
              className={styles.selectInput}
            >
              <option value="all">전체</option>
              <option value="베이스채소">베이스채소</option>
              <option value="단백질">단백질</option>
              <option value="야채">야채</option>
              <option value="과일">과일</option>
            </select>

            <label>상태</label>
            <select
              value={tempFilters.status}
              onChange={(e) => setTempFilters((f) => ({ ...f, status: e.target.value }))}
              className={styles.selectInput}
            >
              <option value="all">전체</option>
              <option value="대기">대기</option>
              <option value="반려됨">반려</option>
              <option value="완료">완료</option>
            </select>

            <input
              type="text"
              placeholder="재료명 검색"
              value={tempFilters.keyword}
              onChange={(e) => setTempFilters((f) => ({ ...f, keyword: e.target.value }))}
              className={styles.textInput}
            />

            <button className={styles.searchButton} onClick={applyFilters}>
              검색
            </button>
            <button className={styles.resetButton} onClick={resetFilters}>
              초기화
            </button>
          </div>
        </div>

        {/* 데이터 테이블 */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>지점</th>
              <th>품목명</th>
              <th>분류</th>
              <th>단위</th>
              <th>재고량</th>
              <th>폐기량</th>
              <th>사유</th>
              <th>폐기날짜</th>
              <th>상태</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            {filteredData.length === 0 ? (
              <tr>
                <td colSpan={10} className={styles.noData}>
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              filteredData.map((row) => (
                <tr key={row.id}>
                  <td>{row.store}</td>
                  <td>{row.name}</td>
                  <td>{row.category}</td>
                  <td>{row.unit}</td>
                  <td>{row.stock}</td>
                  <td>{row.discardQty}</td>
                  <td>{row.reason}</td>
                  <td>{row.discardDate}</td>
                  <td>{row.status}</td>
                  <td>{row.remark}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
