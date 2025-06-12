import React, { useState, useEffect } from "react";
import "./HqDisposalList.module.css";

const initialData = [
  { id: 1, store: "본사", name: "렌틸콩", category: "단백질", unit: "kg", stock: 300, discardQty: 100, reason: "폐기 예정", discardDate: "2025-05-27", status: "완료", remark: "-" },
  { id: 2, store: "강남점", name: "로메인", category: "베이스채소", unit: "kg", stock: 100, discardQty: 200, reason: "유통기한 경과로 인한 폐기", discardDate: "2025-05-27", status: "대기", remark: "-" },
  { id: 3, store: "잠실점", name: "닭가슴살", category: "단백질", unit: "팩", stock: 50, discardQty: 200, reason: "포장 훼손으로 인한 폐기", discardDate: "2025-05-25", status: "대기", remark: "-" },
  { id: 4, store: "신촌점", name: "토마토", category: "야채", unit: "개", stock: 80, discardQty: 30, reason: "부패로 인한 폐기", discardDate: "2025-05-26", status: "대기", remark: "-" },
  { id: 5, store: "홍대점", name: "아보카도", category: "과일", unit: "개", stock: 40, discardQty: 5, reason: "숙성 과잉으로 인한 폐기", discardDate: "2025-05-27", status: "대기", remark: "-" },
];

export default function HqDisposalList() {
  const [filters, setFilters] = useState({
    store: "all",
    category: "all",
    keyword: "",
    startDate: "",
    endDate: "",
  });

  const [data, setData] = useState(initialData);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);

  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReasons, setRejectReasons] = useState({});

  const [tempFilters, setTempFilters] = useState(filters);

  const applyFilters = () => {
    setFilters(tempFilters);
    setSelectedIds([]);
  };

  const filteredData = data.filter((item) => {
    const matchStore = filters.store === "all" || item.store === filters.store;
    const matchCategory = filters.category === "all" || item.category === filters.category;
    const matchKeyword = item.name.toLowerCase().includes(filters.keyword.toLowerCase());

    const itemDate = new Date(item.discardDate);
    const start = filters.startDate ? new Date(filters.startDate) : null;
    const end = filters.endDate ? new Date(filters.endDate) : null;

    const matchStart = !start || itemDate >= start;
    const matchEnd = !end || itemDate <= end;

    return matchStore && matchCategory && matchKeyword && matchStart && matchEnd;
  });

  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((sid) => sid !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectAll) {
      setSelectedIds([]);
      setSelectAll(false);
    } else {
      setSelectedIds(filteredData.map((item) => item.id));
      setSelectAll(true);
    }
  };

  useEffect(() => {
    const allSelected =
      filteredData.length > 0 && filteredData.every((item) => selectedIds.includes(item.id));
    setSelectAll(allSelected);
  }, [selectedIds, filteredData]);

  const approveSelected = () => {
    if (selectedIds.length === 0) {
      alert("선택된 항목이 없습니다.");
      return;
    }
    setData((cur) =>
      cur.map((item) =>
        selectedIds.includes(item.id) ? { ...item, status: "완료" } : item
      )
    );
    setSelectedIds([]);
  };

  const openRejectModal = () => {
    if (selectedIds.length === 0) {
      alert("반려할 항목을 선택하세요.");
      return;
    }
    setRejectReasons({});
    setRejectModalOpen(true);
  };

  const handleRejectReasonChange = (id, value) => {
    setRejectReasons((prev) => ({ ...prev, [id]: value }));
  };

  const confirmReject = () => {
    if (selectedIds.some((id) => !rejectReasons[id] || rejectReasons[id].trim() === "")) {
      alert("모든 항목에 반려 사유를 입력해주세요.");
      return;
    }
    setData((cur) =>
      cur.map((item) =>
        selectedIds.includes(item.id)
          ? { ...item, status: "반려됨", remark: rejectReasons[item.id] }
          : item
      )
    );
    setSelectedIds([]);
    setRejectModalOpen(false);
  };

  const closeRejectModal = () => setRejectModalOpen(false);

  return (
    <div className="inventory-wrap">
      <h2>폐기 목록</h2>

      {/* 기간조회 필터 */}
      <div className="period-filter">
        <div className="date-inputs">
          <input
            type="date"
            value={tempFilters.startDate || ""}
            onChange={(e) => setTempFilters((f) => ({ ...f, startDate: e.target.value }))}
            className="date-input"
          />
          <input
            type="date"
            value={tempFilters.endDate || ""}
            onChange={(e) => setTempFilters((f) => ({ ...f, endDate: e.target.value }))}
            className="date-input"
          />
        </div>
        {/* <span className="period-label">기간조회</span> */}
      </div>

      {/* 기타 필터 */}
      <div className="other-filters">
        <select
          value={tempFilters.store}
          onChange={(e) => setTempFilters((f) => ({ ...f, store: e.target.value }))}
        >
          <option value="all">전체 지점</option>
          <option value="본사">본사</option>
          <option value="강남점">강남점</option>
          <option value="홍대점">홍대점</option>
          <option value="잠실점">잠실점</option>
          <option value="신촌점">신촌점</option>
        </select>

        <select
          value={tempFilters.category}
          onChange={(e) => setTempFilters((f) => ({ ...f, category: e.target.value }))}
        >
          <option value="all">전체</option>
          <option value="베이스채소">베이스채소</option>
          <option value="단백질">단백질</option>
          <option value="야채">야채</option>
          <option value="과일">과일</option>
        </select>

        <input
          type="text"
          placeholder="재료명을 입력하세요"
          value={tempFilters.keyword}
          onChange={(e) => setTempFilters((f) => ({ ...f, keyword: e.target.value }))}
        />

        <button className="btn-search" onClick={applyFilters}>
          검색
        </button>
      </div>

      {/* 액션 버튼 */}
      <div className="action-buttons">
        <button
          className="btn save"
          onClick={approveSelected}
          disabled={selectedIds.length === 0}
        >
          선택 승인
        </button>
        <button
          className="btn cancel"
          onClick={openRejectModal}
          disabled={selectedIds.length === 0}
        >
          선택 반려
        </button>
      </div>

      {/* 데이터 테이블 */}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>
              <input type="checkbox" checked={selectAll} onChange={toggleSelectAll} />
            </th>
            <th>지점</th>
            <th>품목명</th>
            <th>구류</th>
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
              <td colSpan={11} style={{ textAlign: "center" }}>
                데이터가 없습니다.
              </td>
            </tr>
          ) : (
            filteredData.map((row) => (
              <tr key={row.id}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(row.id)}
                    onChange={() => toggleSelect(row.id)}
                  />
                </td>
                <td>{row.store}</td>
                <td>{row.name}</td>
                <td>{row.category}</td>
                <td>{row.unit}</td>
                <td>{row.stock}</td>
                <td>{row.discardQty}</td>
                <td>{row.reason}</td>
                <td>{row.discardDate}</td>
                <td className="status">{row.status}</td>
                <td className="remark">{row.remark}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 반려 모달 */}
      {rejectModalOpen && (
        <div className="modal">
          <div className="modal-content">
            <h3>반려 사유 입력</h3>
            <table className="reject-table">
              <thead>
                <tr>
                  <th>지점</th>
                  <th>품목명</th>
                  <th>카테고리</th>
                  <th>폐기량</th>
                  <th>반려 사유</th>
                </tr>
              </thead>
              <tbody>
                {selectedIds.map((id) => {
                  const row = data.find((d) => d.id === id);
                  return (
                    <tr key={id}>
                      <td>{row.store}</td>
                      <td>{row.name}</td>
                      <td>{row.category}</td>
                      <td>{row.discardQty}</td>
                      <td>
                        <input
                          type="text"
                          placeholder="사유 입력"
                          value={rejectReasons[id] || ""}
                          onChange={(e) => handleRejectReasonChange(id, e.target.value)}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            <div className="modal-actions">
              <button onClick={confirmReject} className="btn save">
                확인
              </button>
              <button onClick={closeRejectModal} className="btn cancel">
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
