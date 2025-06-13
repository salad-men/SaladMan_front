import React, { useState } from "react";
import { atom, useAtom } from "jotai";
import HqInventorySidebar from "./HqInventorySidebar";
import styles from "./HqIngredientSetting.module.css";

const inventoryAtom = atom([
  { store: "본사", name: "로메인", category: "베이스채소", unit: "kg", min: 100, max: 500, price: 180 },
  { store: "본사", name: "닭가슴살", category: "단백질", unit: "kg", min: 50, max: 300, price: 450 },
  { store: "본사", name: "퀴노아", category: "탄수화물", unit: "g", min: 300, max: 800, price: 250 },
]);

const isEditModeAtom = atom(false);

export default function HqIngredientSetting() {
  const [inventory, setInventory] = useAtom(inventoryAtom);
  const [isEditMode, setIsEditMode] = useAtom(isEditModeAtom);

  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchName, setSearchName] = useState("");

  const categories = ["전체", ...Array.from(new Set(inventory.map((item) => item.category)))];

  const handleInventoryInput = (idx, field, value) => {
    setInventory((cur) =>
      cur.map((row, i) => (i === idx ? { ...row, [field]: value === "" ? "" : Number(value) } : row))
    );
  };

  const handleEditMode = () => setIsEditMode(true);
  const handleCancelEdit = () => setIsEditMode(false);
  const handleSaveEdit = () => {
    setIsEditMode(false);
    alert("본사 재료 설정이 저장되었습니다.");
  };

  const filteredInventory = inventory.filter((item) => {
    const categoryMatch = selectedCategory === "전체" || item.category === selectedCategory;
    const nameMatch = item.name.toLowerCase().includes(searchName.toLowerCase());
    return categoryMatch && nameMatch;
  });

  const handleSearchClick = () => {
    // 실제 검색 로직 필요 시 여기에 작성 가능
    alert(`검색어: ${searchName}\n분류: ${selectedCategory}`);
  };

  return (
    <div className={styles.container}>
      <HqInventorySidebar />

      <div className={styles.content}>
        <h2 className={styles.title}>본사 재료 설정</h2>

        {/* 필터 */}
        <div className={styles.filters}>
          <div className={styles.row}>
            <label>분류</label>
            <select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              className={styles.select}
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
              value={searchName}
              onChange={(e) => setSearchName(e.target.value)}
              className={styles.inputText}
            />

            <button type="button" className={styles.search} onClick={handleSearchClick}>
              검색
            </button>
          </div>
        </div>

        {/* 버튼 */}
        {!isEditMode ? (
          <div className={styles.actions}>
            <button className={styles.edit} onClick={handleEditMode}>
              수정모드
            </button>
          </div>
        ) : (
          <div className={styles.actions}>
            <button className={styles.cancel} onClick={handleCancelEdit}>
              취소
            </button>
            <button className={styles.save} onClick={handleSaveEdit}>
              저장
            </button>
          </div>
        )}

        {/* 테이블 */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>재료명</th>
              <th>분류</th>
              <th>단위</th>
              <th>최소수량</th>
              <th>최대수량</th>
              <th>단가</th>
            </tr>
          </thead>
          <tbody>
            {filteredInventory.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.noData}>
                  조건에 맞는 재료가 없습니다.
                </td>
              </tr>
            ) : (
              filteredInventory.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.name}</td>
                  <td>{row.category}</td>
                  <td>{row.unit}</td>
                  <td>
                    <input
                      type="number"
                      value={row.min}
                      disabled={!isEditMode}
                      className={isEditMode ? styles.editable : ""}
                      onChange={(e) => handleInventoryInput(idx, "min", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.max}
                      disabled={!isEditMode}
                      className={isEditMode ? styles.editable : ""}
                      onChange={(e) => handleInventoryInput(idx, "max", e.target.value)}
                    />
                  </td>
                  <td>{row.price}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
