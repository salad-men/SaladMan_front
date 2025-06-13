import React, { useState, useEffect } from "react";
import StoreInventorySidebar from "./StoreInventorySidebar";
import styles from "./StoreInventoryRecord.module.css";

const sampleIngredients = [
  { i_id: "101", name: "닭가슴살", category: "단백질" },
  { i_id: "102", name: "로메인", category: "베이스채소" },
  { i_id: "103", name: "토마토", category: "과채류" },
  { i_id: "104", name: "양파", category: "채소" },
  { i_id: "105", name: "두부", category: "단백질" },
];

const categories = ["전체", ...new Set(sampleIngredients.map((i) => i.category))];

export default function StoreInventoryRecord() {
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
  ]);

  const [activeTab, setActiveTab] = useState("입고");
  const [modalOpen, setModalOpen] = useState(false);

  const [filterCategory, setFilterCategory] = useState("전체");
  const [filterName, setFilterName] = useState("");
  const [filterStartDate, setFilterStartDate] = useState("");
  const [filterEndDate, setFilterEndDate] = useState("");

  const [selectedIngredient, setSelectedIngredient] = useState(sampleIngredients[0].i_id);
  const [changeQuantity, setChangeQuantity] = useState("");
  const [memo, setMemo] = useState("");

  const clearDateFilters = () => {
    setFilterStartDate("");
    setFilterEndDate("");
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
  const setLastMonth = () => {
    const to = new Date();
    const from = new Date();
    from.setMonth(to.getMonth() - 1);
    setFilterStartDate(from.toISOString().slice(0, 10));
    setFilterEndDate(to.toISOString().slice(0, 10));
  };

  const openModal = () => {
    setSelectedIngredient(sampleIngredients[0].i_id);
    setChangeQuantity("");
    setMemo("");
    setModalOpen(true);
  };
  const closeModal = () => setModalOpen(false);

  const [filteredRecords, setFilteredRecords] = useState([]);

  useEffect(() => {
    let filtered = records.filter((r) => r.change_type === activeTab);
    if (filterCategory !== "전체") filtered = filtered.filter((r) => r.category === filterCategory);
    if (filterName.trim() !== "")
      filtered = filtered.filter((r) =>
        r.ingredient_name.toLowerCase().includes(filterName.toLowerCase())
      );
    if (filterStartDate) filtered = filtered.filter((r) => new Date(r.date) >= new Date(filterStartDate));
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
    <div className={styles.container}>
      <StoreInventorySidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>재고 입출고 기록</h2>

        {/* 필터 */}
        <div className={styles.filters}>
          <div className={styles.row}>
            <label htmlFor="startDate">기간</label>
            <input
              id="startDate"
              type="date"
              value={filterStartDate}
              onChange={(e) => setFilterStartDate(e.target.value)}
              className={styles.editable}
            />
            <span>~</span>
            <input
              id="endDate"
              type="date"
              value={filterEndDate}
              onChange={(e) => setFilterEndDate(e.target.value)}
              className={styles.editable}
            />
            <div className={styles.dateButtons}>
              <button className={styles.btnSmall} onClick={clearDateFilters}>전체</button>
              <button className={styles.btnSmall} onClick={setToday}>오늘</button>
              <button className={styles.btnSmall} onClick={() => setLastDays(7)}>1주</button>
              <button className={styles.btnSmall} onClick={() => setLastDays(14)}>2주</button>
              <button className={styles.btnSmall} onClick={setLastMonth}>1달</button>
            </div>
          </div>

          <div className={styles.row}>
            <label htmlFor="categorySelect">분류</label>
            <select
              id="categorySelect"
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className={styles.editable}
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="재료명 검색"
              value={filterName}
              onChange={(e) => setFilterName(e.target.value)}
              className={styles.editable}
              aria-label="재료명 검색"
            />

            <button
              className={`${styles.btnSmall} ${styles.search}`}
              onClick={() => {}}
            >
              검색
            </button>

            <button
              className={`${styles.btnSmall} ${styles.reset}`}
              onClick={() => {
                setFilterStartDate("");
                setFilterEndDate("");
                setFilterCategory("전체");
                setFilterName("");
              }}
            >
              초기화
            </button>
          </div>
        </div>

        {/* 탭과 등록 버튼 */}
        <div className={styles.actions}>
          <button
            className={`${styles.btn} ${activeTab === "입고" ? styles.edit : ""}`}
            onClick={() => setActiveTab("입고")}
          >
            입고 기록
          </button>
          <button
            className={`${styles.btn} ${activeTab === "출고" ? styles.edit : ""}`}
            onClick={() => setActiveTab("출고")}
          >
            출고 기록
          </button>

          <button className={`${styles.btn} ${styles.add}`} onClick={openModal}>
            + {activeTab} 등록
          </button>
        </div>

        {/* 기록 테이블 */}
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
            {filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={5} className={styles.noData}>
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
          <div className={styles.modal} onClick={closeModal}>
            <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
              <h3>{activeTab} 등록</h3>
              <form onSubmit={handleSubmit} className={styles.form}>
                <label>
                  재료 선택:
                  <select
                    value={selectedIngredient}
                    onChange={(e) => setSelectedIngredient(e.target.value)}
                    className={styles.editable}
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
                    className={styles.editable}
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
                    className={styles.editable}
                  />
                </label>

                <div className={styles.modalActions}>
                  <button
                    type="button"
                    className={`${styles.cancel} ${styles.btn}`}
                    onClick={closeModal}
                  >
                    취소
                  </button>
                  <button type="submit" className={`${styles.save} ${styles.btn}`}>
                    저장
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
