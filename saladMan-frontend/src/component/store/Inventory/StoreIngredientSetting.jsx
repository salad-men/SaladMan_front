import React, { useState } from "react";
import { atom, useAtom } from "jotai";
import StoreInventorySidebar from "./StoreInventorySidebar";
import styles from "./StoreIngredientSetting.module.css";

// 강남점 데이터만 보유
const inventoryAtom = atom([
  { store: "강남점", name: "로메인", category: "베이스채소", unit: "kg", min: 100, max: 500, price: 180 },
  { store: "강남점", name: "닭가슴살", category: "단백질", unit: "kg", min: 50, max: 300, price: 450 },
  { store: "강남점", name: "퀴노아", category: "탄수화물", unit: "g", min: 300, max: 800, price: 250 },
]);

const isEditModeAtom = atom(false);

export default function StoreIngredientSetting() {
  const [inventory, setInventory] = useAtom(inventoryAtom);
  const [isEditMode, setIsEditMode] = useAtom(isEditModeAtom);

  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchName, setSearchName] = useState("");

  // 강남점 데이터 중 카테고리만 뽑아서 "전체" 포함 배열 생성
  const categories = ["전체", ...Array.from(new Set(inventory.map((item) => item.category)))];

  // 강남점 데이터만 필터링
  const filteredInventory = inventory.filter((item) => {
    const categoryMatch = selectedCategory === "전체" || item.category === selectedCategory;
    const nameMatch = item.name.toLowerCase().includes(searchName.toLowerCase());
    return categoryMatch && nameMatch;
  });

  const handleInventoryInput = (idx, field, value) => {
    setInventory((cur) =>
      cur.map((row, i) => (i === idx ? { ...row, [field]: value === "" ? "" : Number(value) } : row))
    );
  };

  const handleEditMode = () => setIsEditMode(true);
  const handleCancelEdit = () => setIsEditMode(false);
  const handleSaveEdit = () => {
    setIsEditMode(false);
    alert("강남점 재료 설정이 저장되었습니다.");
  };

  const handleSearchClick = () => {
    alert(`검색어: ${searchName}\n분류: ${selectedCategory}`);
  };

  return (
    <div className={styles.container}>
      <StoreInventorySidebar />

      <div className={styles.content}>
        <h2 className={styles.title}>강남점 재료 설정</h2>

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
