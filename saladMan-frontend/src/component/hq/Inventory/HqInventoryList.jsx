import React from "react";
import { atom, useAtom } from "jotai";
import HqInventorySidebar from "./HqInventorySidebar";
import styles from "./HqInventoryList.module.css";

const inventoryAtom = atom([
  { store: "본사", name: "로메인", category: "베이스채소", unit: "kg", stock: 200, min: 100, price: 180 },
]);

const filtersAtom = atom({ from: "", to: "", store: "all", category: "all", name: "" });
const isEditModeAtom = atom(false);
const addModalOpenAtom = atom(false);
const addRowsAtom = atom([{ name: "", category: "", unit: "g", stock: "", min: "", price: "" }]);

const stores = ["all", "본사", "강남점", "홍대점", "건대점"];
const categories = ["all", "베이스채소", "단백질", "토핑", "드레싱"];

export default function HqInventoryList() {
  const [inventory, setInventory] = useAtom(inventoryAtom);
  const [filters, setFilters] = useAtom(filtersAtom);
  const [isEditMode, setIsEditMode] = useAtom(isEditModeAtom);
  const [addModalOpen, setAddModalOpen] = useAtom(addModalOpenAtom);
  const [addRows, setAddRows] = useAtom(addRowsAtom);

  const filtered = inventory.filter(r =>
    (filters.store === "all" || r.store === filters.store) &&
    (filters.category === "all" || r.category === filters.category) &&
    (!filters.name || r.name.includes(filters.name))
  );
  const sorted = [...filtered].sort((a, b) => (a.stock - a.min) - (b.stock - b.min));

  const onFilterChange = e => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  };

  const quick = days => {
    const to = new Date().toISOString().slice(0, 10);
    const fromD = new Date();
    fromD.setDate(fromD.getDate() - days);
    const from = fromD.toISOString().slice(0, 10);
    setFilters(f => ({ ...f, from, to }));
  };

  const clearAll = () => setFilters({ from: "", to: "", store: "all", category: "all", name: "" });

  const startEdit = () => setIsEditMode(true);
  const cancelEdit = () => setIsEditMode(false);
  const saveEdit = () => {
    setIsEditMode(false);
    alert("저장되었습니다.");
  };

  const onInv = (i, field, v) => {
    setInventory(cur =>
      cur.map((r, idx) => (idx === i ? { ...r, [field]: v ? Number(v) : "" } : r))
    );
  };

  const onAdd = (i, field, v) => {
    setAddRows(cur => cur.map((r, idx) => (idx === i ? { ...r, [field]: v } : r)));
  };

  const addRow = () =>
    setAddRows(cur => [...cur, { name: "", category: "", unit: "g", stock: "", min: "", price: "" }]);
  const removeRow = i => setAddRows(cur => cur.filter((_, idx) => idx !== i));
  const submitAdd = () => {
    const valid = addRows.filter(r => r.name && r.category);
    if (!valid.length) {
      alert("추가할 재료를 입력하세요.");
      return;
    }
    setInventory(cur => [
      ...cur,
      ...valid.map(r => ({
        store: "본사",
        name: r.name,
        category: r.category,
        unit: r.unit,
        stock: Number(r.stock) || 0,
        min: Number(r.min) || 0,
        price: Number(r.price) || 0
      }))
    ]);
    setAddRows([{ name: "", category: "", unit: "g", stock: "", min: "", price: "" }]);
    setAddModalOpen(false);
    alert("등록되었습니다.");
  };

  return (
    <div className={styles.container}>
      <HqInventorySidebar />

      <div className={styles.content}>
        <h2 className={styles.title}>전체 재고 조회</h2>

        {/* 필터 */}
        <div className={styles.filters}>
          <div className={styles.row}>
            <label>기간</label>
            <input type="date" name="from" value={filters.from} onChange={onFilterChange} />
            <span>~</span>
            <input type="date" name="to" value={filters.to} onChange={onFilterChange} />
            <button className={styles.btnSmall} onClick={() => setFilters(f => ({ ...f, from: "", to: "" }))}>
              전체
            </button>
            <button className={styles.btnSmall} onClick={() => quick(0)}>
              오늘
            </button>
            <button className={styles.btnSmall} onClick={() => quick(7)}>
              1주
            </button>
            <button className={styles.btnSmall} onClick={() => quick(14)}>
              2주
            </button>
            <button
              className={styles.btnSmall}
              onClick={() => {
                const d = new Date();
                d.setMonth(d.getMonth() - 1);
                setFilters(f => ({
                  ...f,
                  from: d.toISOString().slice(0, 10),
                  to: new Date().toISOString().slice(0, 10)
                }));
              }}
            >
              1달
            </button>
          </div>

          <div className={styles.row}>
            <label>지점</label>
            <select name="store" value={filters.store} onChange={onFilterChange}>
              <option value="all">전체지점</option>
              {stores
                .filter(s => "all" !== s)
                .map(s => (
                  <option key={s} value={s}>
                    {s}
                  </option>
                ))}
            </select>

            <label>분류</label>
            <select name="category" value={filters.category} onChange={onFilterChange}>
              <option value="all">전체</option>
              {categories
                .filter(c => "all" !== c)
                .map(c => (
                  <option key={c} value={c}>
                    {c}
                  </option>
                ))}
            </select>

            <input
              type="text"
              name="name"
              placeholder="재료명 검색"
              value={filters.name}
              onChange={onFilterChange}
            />
            <button className={styles.search}>검색</button>
            <button className={styles.reset} onClick={clearAll}>
              초기화
            </button>
          </div>

          <div className={styles.actions} style={{ justifyContent: "flex-end" }}>
            <button className={styles.add} onClick={() => setAddModalOpen(true)}>
              + 재료 추가
            </button>
            {!isEditMode ? (
              <button className={styles.edit} onClick={startEdit}>
                수정입력
              </button>
            ) : (
              <>
                <button className={styles.save} onClick={saveEdit}>
                  등록하기
                </button>
                <button className={styles.cancel} onClick={cancelEdit}>
                  취소하기
                </button>
              </>
            )}
          </div>
        </div>

        {/* 테이블 */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.checkbox}></th>
              <th>지점</th>
              <th>재료명</th>
              <th>분류</th>
              <th>단위</th>
              <th>단위가격</th>
              <th>재고량</th>
              <th>최소수량</th>
            </tr>
          </thead>
          <tbody>
            {sorted.length === 0 ? (
              <tr>
                <td colSpan={8} className={styles.noData}>
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              sorted.map((r, i) => (
                <tr key={i}>
                  <td className={styles.checkbox}></td>
                  <td>{r.store}</td>
                  <td>{r.name}</td>
                  <td>{r.category}</td>
                  <td>{r.unit}</td>
                  <td>{r.price}</td>
                  <td>
                    <input
                      type="number"
                      value={r.stock}
                      disabled={!isEditMode}
                      className={styles.editable}
                      onChange={e => onInv(i, "stock", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={r.min}
                      disabled={!isEditMode}
                      className={styles.editable}
                      onChange={e => onInv(i, "min", e.target.value)}
                    />
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 모달 */}
        {addModalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalBox}>
              <h3>재료 추가</h3>

              <div className={styles.modalTableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>품목명</th>
                      <th>구분</th>
                      <th>단위</th>
                      <th>재고량</th>
                      <th>최소수량</th>
                      <th>단위가격</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {addRows.map((r, i) => (
                      <tr key={i}>
                        <td>
                          <input
                            type="text"
                            value={r.name}
                            onChange={e => onAdd(i, "name", e.target.value)}
                            className={styles.editable}
                          />
                        </td>
                        <td>
                          <select value={r.category} onChange={e => onAdd(i, "category", e.target.value)}>
                            <option value="">선택</option>
                            {categories.filter(c => "all" !== c).map(c => (
                              <option key={c} value={c}>
                                {c}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select value={r.unit} onChange={e => onAdd(i, "unit", e.target.value)}>
                            {["g", "kg", "ml", "ea"].map(u => (
                              <option key={u} value={u}>
                                {u}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <input
                            type="number"
                            value={r.stock}
                            onChange={e => onAdd(i, "stock", e.target.value)}
                            className={styles.editable}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={r.min}
                            onChange={e => onAdd(i, "min", e.target.value)}
                            className={styles.editable}
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={r.price}
                            onChange={e => onAdd(i, "price", e.target.value)}
                            className={styles.editable}
                          />
                        </td>
                        <td style={{ width: "35px", padding: 0, textAlign: "center" }}>
                          <button
                            onClick={() => removeRow(i)}
                            style={{
                              background: "transparent",
                              border: "none",
                              color: "#f44336",
                              fontWeight: "bold",
                              fontSize: "18px",
                              cursor: "pointer",
                              lineHeight: "1",
                              userSelect: "none",
                            }}
                            aria-label="행 삭제"
                            title="행 삭제"
                          >
                            ×
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={styles.modalActions}>
                <button onClick={addRow}>+ 행 추가</button>
                <button onClick={submitAdd}>등록</button>
                <button onClick={() => setAddModalOpen(false)}>취소</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
