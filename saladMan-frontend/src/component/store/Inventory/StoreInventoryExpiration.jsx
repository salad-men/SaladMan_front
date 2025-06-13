import React, { useState, useEffect } from "react";
import { atom, useAtom } from "jotai";
import StoreInventorySidebar from "./StoreInventorySidebar";
import styles from "./StoreInventoryExpiration.module.css";

const categoryAtom = atom("all");
const keywordAtom = atom("");
const startDateAtom = atom("");
const endDateAtom = atom("");
const selectedIdsAtom = atom([]);
const inventoryAtom = atom([
  { id: 1, store: "본사", name: "렌틸콩", category: "탄수화물", unit: "g", quantity: 600, price: 270, expiry: "2025-05-25", usage: 450, dday: "D+0" },
  { id: 2, store: "본사", name: "두부", category: "단백질", unit: "kg", quantity: 130, price: 500, expiry: "2025-05-29", usage: 100, dday: "D-4" },
  { id: 3, store: "강남점", name: "귀리밥", category: "탄수화물", unit: "g", quantity: 980, price: 150, expiry: "2025-05-23", usage: 850, dday: "D+1" },
]);

export default function StoreInventoryExpiration() {
  const [category, setCategory] = useAtom(categoryAtom);
  const [keyword, setKeyword] = useAtom(keywordAtom);
  const [startDate, setStartDate] = useAtom(startDateAtom);
  const [endDate, setEndDate] = useAtom(endDateAtom);
  const [inventory] = useAtom(inventoryAtom);
  const [selectedIds, setSelectedIds] = useAtom(selectedIdsAtom);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disposalAmounts, setDisposalAmounts] = useState({});

  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const parseDate = (str) => {
    if (!str) return null;
    const [y, m, d] = str.split("-");
    return new Date(y, m - 1, d);
  };

  const setPeriod = (days) => {
    const today = new Date();
    const end = today.toISOString().slice(0, 10);
    const startObj = days === 0 ? null : new Date(today.getTime() - days * 86400000);
    setStartDate(startObj ? startObj.toISOString().slice(0, 10) : "");
    setEndDate(end);
  };

  const filteredSorted = inventory
    .filter((it) => {
      const mCat = category === "all" || it.category === category;
      const mKey = it.name.toLowerCase().includes(keyword.toLowerCase());
      const exp = parseDate(it.expiry);
      const mStart = !startDate || !exp || exp >= parseDate(startDate);
      const mEnd = !endDate || !exp || exp <= parseDate(endDate);
      return mCat && mKey && mStart && mEnd;
    })
    .sort((a, b) => {
      if (a.store === "본사" && b.store !== "본사") return -1;
      if (a.store !== "본사" && b.store === "본사") return 1;
      return parseDate(a.expiry) - parseDate(b.expiry);
    });

  const toggleSelect = (id) => {
    const it = inventory.find((x) => x.id === id);
    if (!it || it.store !== "본사") return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleAll = () => {
    const avail = filteredSorted.filter((x) => x.store === "본사").map((x) => x.id);
    const allSel = avail.every((id) => selectedIds.includes(id));
    setSelectedIds((prev) =>
      allSel ? prev.filter((id) => !avail.includes(id)) : Array.from(new Set([...prev, ...avail]))
    );
  };

  const onAmount = (id, val) => {
    const num = Math.max(0, Math.min(Number(val) || 0, inventory.find((i) => i.id === id)?.quantity || 0));
    setDisposalAmounts((p) => ({ ...p, [id]: num }));
  };

  const openModal = () => {
    if (selectedIds.length === 0) return alert("본사 품목을 하나 이상 선택하세요.");
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  const submit = () => {
    const items = selectedIds
      .map((id) => ({ ...inventory.find((i) => i.id === id), disposalAmount: disposalAmounts[id] || 0 }))
      .filter((i) => i.disposalAmount > 0);
    if (items.length === 0) return alert("폐기량을 입력하세요.");
    alert(`총 ${items.length}건 폐기 신청 완료!`);
    setIsModalOpen(false);
    setSelectedIds([]);
    setDisposalAmounts({});
  };

  return (
    <div className={styles.container}>
      <StoreInventorySidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>유통기한 조회</h2>

        {/* 기간 입력 + 기간 버튼 */}
        <div className={styles.row} style={{ justifyContent: "flex-start", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <label>기간</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <span>~</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

          <div className={styles.periodButtons}>
            <button onClick={() => { setStartDate(""); setEndDate(""); }}>전체</button>
            <button onClick={() => setPeriod(0)}>오늘</button>
            <button onClick={() => setPeriod(7)}>1주</button>
            <button onClick={() => setPeriod(14)}>2주</button>
            <button onClick={() => setPeriod(30)}>1달</button>
          </div>
        </div>

        {/* 분류, 검색 + 폐기 신청 버튼 */}
        <div className={styles.row} style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label>분류</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">전체</option>
              <option value="베이스채소">베이스채소</option>
              <option value="단백질">단백질</option>
              <option value="토핑">토핑</option>
              <option value="드레싱">드레싱</option>
              <option value="탄수화물">탄수화물</option>
            </select>
            <input type="text" placeholder="재료명 검색" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
            <button className={styles.search}>검색</button>
          </div>
          <button className={styles.disposalBtn} onClick={openModal}>폐기 신청</button>
        </div>

        {/* 목록 테이블 */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filteredSorted.filter((i) => i.store === "본사").every((i) => selectedIds.includes(i.id)) && filteredSorted.some((i) => i.store === "본사")}
                  onChange={toggleAll}
                />
              </th>
              <th>지점</th>
              <th>품목명</th>
              <th>분류</th>
              <th>단위</th>
              <th>재고량</th>
              <th>단가</th>
              <th>유통기한</th>
              <th>소비량</th>
              <th>남은 날짜</th>
            </tr>
          </thead>
          <tbody>
            {filteredSorted.length === 0 ? (
              <tr>
                <td colSpan={10} className={styles.noData}>데이터가 없습니다.</td>
              </tr>
            ) : (
              filteredSorted.map((it) => (
                <tr key={it.id} className={it.dday.includes("D+") ? styles.expired : ""}>
                  <td className={styles.checkbox}>
                    <input
                      type="checkbox"
                      disabled={it.store !== "본사"}
                      checked={selectedIds.includes(it.id)}
                      onChange={() => toggleSelect(it.id)}
                    />
                  </td>
                  <td>{it.store}</td>
                  <td>{it.name}</td>
                  <td>{it.category}</td>
                  <td>{it.unit}</td>
                  <td>{it.quantity}</td>
                  <td>{it.price}</td>
                  <td>{it.expiry}</td>
                  <td>{it.usage}</td>
                  <td>{it.dday}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 모달 */}
        {isModalOpen && (
          <div className={styles.modal} onClick={closeModal}>
            <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
              <button className={styles.modalClose} onClick={closeModal}>&times;</button>
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
                      <th>단가</th>
                      <th>폐기량</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedIds.map((id) => {
                      const it = inventory.find((x) => x.id === id);
                      return (
                        <tr key={id}>
                          <td>{it.name}</td>
                          <td>{it.category}</td>
                          <td>{it.unit}</td>
                          <td>{it.quantity}</td>
                          <td>{it.price}</td>
                          <td>
                            <input
                              type="number"
                              min={0}
                              max={it.quantity}
                              value={disposalAmounts[id] || 0}
                              onChange={(e) => onAmount(id, e.target.value)}
                              className={styles.editable}
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
  );
}
