import React, { useState, useEffect } from "react";
import "./HqInventoryRecord.css";

const sampleIngredients = [
  { i_id: "101", name: "닭가슴살", category: "단백질" },
  { i_id: "102", name: "로메인", category: "베이스채소" },
  { i_id: "103", name: "토마토", category: "과채류" },
  { i_id: "104", name: "양파", category: "채소" },
  { i_id: "105", name: "두부", category: "단백질" },
];

// 카테고리 목록 생성 ("전체" 포함)
const categories = ["전체", ...new Set(sampleIngredients.map((i) => i.category))];

export default function HqInventoryRecord() {
  const [records, setRecords] = useState([
    {
      id: 1,
      ingredient_id: "102",
      ingredient_name: "로메인",
      category: "베이스채소",
      quantity: 200,
      memo: "",
      change_type: "입고",
      date: "2025-06-10 10:00",
    },
    {
      id: 2,
      ingredient_id: "101",
      ingredient_name: "닭가슴살",
      category: "단백질",
      quantity: 150,
      memo: "출고 테스트",
      change_type: "출고",
      date: "2025-06-09 15:00",
    },
  ]);

  const [activeTab, setActiveTab] = useState("입고");
  const [modalOpen, setModalOpen] = useState(false);

  // 검색 상태
  const [filterCategory, setFilterCategory] = useState("전체");
  const [filterName, setFilterName] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  // 모달 폼 상태
  const [selectedIngredient, setSelectedIngredient] = useState(sampleIngredients[0].i_id);
  const [changeQuantity, setChangeQuantity] = useState("");
  const [memo, setMemo] = useState("");

  const openModal = () => {
    setSelectedIngredient(sampleIngredients[0].i_id);
    setChangeQuantity("");
    setMemo("");
    setModalOpen(true);
  };

  const closeModal = () => setModalOpen(false);

  // 검색 필터 적용
  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    let filtered = records.filter((r) => r.change_type === activeTab);

    if (filterCategory !== "전체") {
      filtered = filtered.filter((r) => r.category === filterCategory);
    }
    if (filterName.trim() !== "") {
      filtered = filtered.filter((r) =>
        r.ingredient_name.toLowerCase().includes(filterName.toLowerCase())
      );
    }
    if (filterStartDate) {
      filtered = filtered.filter((r) => new Date(r.date) >= new Date(filterStartDate));
    }
    if (filterEndDate) {
      const end = new Date(filterEndDate);
      end.setHours(23, 59, 59, 999);
      filtered = filtered.filter((r) => new Date(r.date) <= end);
    }

    setFilteredRecords(filtered);
  }, [records, activeTab, filterCategory, filterName, filterStartDate, filterEndDate]);

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!changeQuantity || Number(changeQuantity) <= 0) {
      alert("수량을 올바르게 입력하세요.");
      return;
    }

    const selected = sampleIngredients.find((i) => i.i_id === selectedIngredient);

    const newRecord = {
      id: Date.now(),
      ingredient_id: selectedIngredient,
      ingredient_name: selected?.name || "",
      category: selected?.category || "",
      quantity: Number(changeQuantity),
      memo,
      change_type: activeTab,
      date: new Date().toISOString().slice(0, 19).replace("T", " "),
    };

    setRecords((prev) => [newRecord, ...prev]);
    alert(`${activeTab} 기록이 저장되었습니다.`);
    setModalOpen(false);
  };

  return (
    <div className="inventory-wrap">
      <h2>재고 입출고 기록</h2>

      {/* 검색바 (왼쪽 정렬) */}
      <div className="search-bar" style={{ justifyContent: "flex-start", gap: "16px" }}>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value)}
          style={{ minWidth: 140 }}
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="재료명 검색"
          value={filterName}
          onChange={(e) => setFilterName(e.target.value)}
          style={{ minWidth: 180 }}
        />

        <input
          type="date"
          value={filterStartDate}
          onChange={(e) => setFilterStartDate(e.target.value)}
        />
        <span style={{ margin: "0 8px" }}>~</span>
        <input
          type="date"
          value={filterEndDate}
          onChange={(e) => setFilterEndDate(e.target.value)}
        />

        <button className="btn btn-search" onClick={() => {}}>
          검색
        </button>
      </div>

      {/* 탭과 등록 버튼 (오른쪽 정렬) */}
      <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginBottom: 20 }}>
        <button
          className={`btn ${activeTab === "입고" ? "btn-edit" : "btn"}`}
          onClick={() => setActiveTab("입고")}
          style={{ minWidth: 100 }}
        >
          입고 기록
        </button>
        <button
          className={`btn ${activeTab === "출고" ? "btn-edit" : "btn"}`}
          onClick={() => setActiveTab("출고")}
          style={{ minWidth: 100 }}
        >
          출고 기록
        </button>

        <button className="btn btn-add" onClick={openModal}>
          + {activeTab} 등록
        </button>
      </div>

      {/* 기록 테이블 */}
      <table className="inventory-table">
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
          {filteredRecords.length === 0 ? (
            <tr>
              <td colSpan="5" style={{ textAlign: "center", padding: "20px" }}>
                등록된 기록이 없습니다.
              </td>
            </tr>
          ) : (
            filteredRecords.map((rec) => (
              <tr key={rec.id}>
                <td>{rec.ingredient_name}</td>
                <td>{rec.category}</td>
                <td>{rec.quantity}</td>
                <td>{rec.memo || "-"}</td>
                <td>{rec.date}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 모달 */}
      {modalOpen && (
        <div className="modal" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>{activeTab} 등록</h3>
            <form onSubmit={handleSubmit}>
              <label>
                재료 선택:
                <select
                  value={selectedIngredient}
                  onChange={(e) => setSelectedIngredient(e.target.value)}
                >
                  {sampleIngredients.map((item) => (
                    <option key={item.i_id} value={item.i_id}>
                      {item.name} ({item.category})
                    </option>
                  ))}
                </select>
              </label>

              <label>
                수량:
                <input
                  type="number"
                  min="1"
                  value={changeQuantity}
                  onChange={(e) => setChangeQuantity(e.target.value)}
                  autoFocus
                />
              </label>

              <label>
                메모:
                <textarea
                  value={memo}
                  onChange={(e) => setMemo(e.target.value)}
                  placeholder="특이사항이나 참고 메모를 입력하세요"
                  rows={3}
                />
              </label>

              <div className="modal-actions">
                <button type="button" className="btn btn-cancel" onClick={closeModal}>
                  취소
                </button>
                <button type="submit" className="btn save">
                  저장
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
