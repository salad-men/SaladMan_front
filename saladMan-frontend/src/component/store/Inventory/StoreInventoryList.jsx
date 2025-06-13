import React from "react";
import { atom, useAtom } from "jotai";
import StoreInventorySidebar from "./StoreInventorySidebar";
import styles from "./StoreInventoryList.module.css";

// 자기 매장 이름 지정
const MY_STORE = "강남점";

const inventoryAtom = atom([
  { store: "본사", name: "로메인", category: "베이스채소", unit: "kg", stock: 200, min: 100, price: 180 },
  { store: "강남점", name: "상추", category: "베이스채소", unit: "kg", stock: 150, min: 80, price: 120 },
  { store: "강남점", name: "닭가슴살", category: "단백질", unit: "kg", stock: 90, min: 50, price: 900 },
]);

const isEditModeAtom = atom(false);
const filtersAtom = atom({ category: "all", name: "" });

const categories = ["all", "베이스채소", "단백질", "토핑", "드레싱"];

export default function StoreInventoryList() {
  const [inventory, setInventory] = useAtom(inventoryAtom);
  const [isEditMode, setIsEditMode] = useAtom(isEditModeAtom);
  const [filters, setFilters] = useAtom(filtersAtom);

  // 자기 매장 필터링
  let storeInventory = inventory.filter(r => r.store === MY_STORE);

  // 분류, 재료명 필터링
  storeInventory = storeInventory.filter(r =>
    (filters.category === "all" || r.category === filters.category) &&
    (!filters.name || r.name.includes(filters.name))
  );

  // 재고 - 최소수량 차이 정렬
  const sorted = [...storeInventory].sort((a, b) => (a.stock - a.min) - (b.stock - b.min));

  const onFilterChange = e => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  };

  const clearAll = () => {
    setFilters({ category: "all", name: "" });
  };

  const startEdit = () => setIsEditMode(true);
  const cancelEdit = () => setIsEditMode(false);
  const saveEdit = () => {
    setIsEditMode(false);
    alert("저장되었습니다.");
  };

  const onInv = (i, field, v) => {
    setInventory(cur =>
      cur.map(r => {
        if (r.store === MY_STORE && r.name === sorted[i].name) {
          return { ...r, [field]: v ? Number(v) : "" };
        }
        return r;
      })
    );
  };

  return (
    <div className={styles.container}>
      <StoreInventorySidebar />

      <div className={styles.content}>
        <h2 className={styles.title}>{MY_STORE} 재고 조회</h2>

        {/* 필터 영역 */}
        <div className={styles.filters}>
          <label className={styles.filterLabel}>
            분류
            <select
              name="category"
              value={filters.category}
              onChange={onFilterChange}
              className={styles.filterSelect}
            >
              {categories.map(c => (
                <option key={c} value={c}>
                  {c === "all" ? "전체" : c}
                </option>
              ))}
            </select>
          </label>

          <input
            type="text"
            name="name"
            value={filters.name}
            placeholder="재료명 검색"
            onChange={onFilterChange}
            className={styles.filterInput}
          />

          <button className={styles.searchButton} onClick={() => { /* 검색은 onChange로 필터 적용됨 */ }}>
            검색
          </button>

          <button className={styles.resetButton} onClick={clearAll}>
            초기화
          </button>
        </div>

        {/* 수정 버튼 */}
        <div className={styles.actions}>
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

        {/* 재고 테이블 */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: "40px" }}></th>
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
                <td colSpan={7} className={styles.noData}>
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              sorted.map((r, i) => (
                <tr key={i}>
                  <td>{i + 1}</td>
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
      </div>
    </div>
  );
}
