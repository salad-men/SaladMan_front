import React, { useState, useEffect } from "react";
import HqInventorySidebar from "./HqInventorySidebar";
import { myAxios } from "../../../config";
import styles from "./HqIngredientSetting.module.css";

export default function HqIngredientSetting() {
  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState("전체");
  const [searchName, setSearchName] = useState("");

  // [1] 분류 목록 불러오기
  useEffect(() => {
    myAxios().get("/hq/inventory/categories")
      .then(res => setCategories(["전체", ...(res.data.categories?.map(c => c.name) || [])]));
  }, []);

  // [2] 본사 재고 설정 목록 불러오기 (본사만 scope 고정)
  const fetchInventory = () => {
    myAxios()
      .post("/hq/inventory/list", {
        scope: "hq",
        category: selectedCategory === "전체" ? "" : selectedCategory,
        name: searchName,
        page: 1,
      })
      .then(res => {
        const hqList = res.data.hqInventory || [];
        setInventory(
          hqList.map(item => ({
            id: item.id,
            name: item.ingredientName,
            category: item.categoryName,
            unit: item.unit,
            min: item.minimumOrderUnit,
            max: item.expiredQuantity,
            price: item.unitCost,
          }))
        );
      })
      .catch(() => setInventory([]));
  };

  useEffect(() => {
    fetchInventory();
  }, [selectedCategory, searchName]);

  // [3] 입력 변경 시 상태 반영
  const handleInventoryInput = (idx, field, value) => {
    setInventory(cur =>
      cur.map((row, i) =>
        i === idx ? { ...row, [field]: value === "" ? "" : Number(value) } : row
      )
    );
  };

  // [4] 저장 버튼 클릭 시 수정 사항 서버에 전송
  const handleSaveEdit = async () => {
    try {
      await Promise.all(
        inventory.map(row =>
          myAxios().post("/hq/inventory/update", {
            id: row.id,
            minimumOrderUnit: row.min,
            expiredQuantity: row.max,
            unitCost: row.price,
          })
        )
      );
      alert("본사 재료 설정이 저장되었습니다.");
      setIsEditMode(false);
      fetchInventory();
    } catch (e) {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  // [5] 검색 버튼 클릭 시 강제 조회
  const handleSearchClick = () => fetchInventory();

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
              onChange={e => setSelectedCategory(e.target.value)}
              className={styles.select}
            >
              {categories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
            <input
              type="text"
              placeholder="재료명 검색"
              value={searchName}
              onChange={e => setSearchName(e.target.value)}
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
            <button className={styles.edit} onClick={() => setIsEditMode(true)}>수정모드</button>
          </div>
        ) : (
          <div className={styles.actions}>
            <button className={styles.cancel} onClick={() => setIsEditMode(false)}>취소</button>
            <button className={styles.save} onClick={handleSaveEdit}>저장</button>
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
            {inventory.length === 0 ? (
              <tr><td colSpan={6} className={styles.noData}>조건에 맞는 재료가 없습니다.</td></tr>
            ) : (
              inventory.map((row, idx) => (
                <tr key={row.id}>
                  <td>{row.name}</td>
                  <td>{row.category}</td>
                  <td>{row.unit}</td>
                  <td>
                    <input
                      type="number"
                      value={row.min}
                      disabled={!isEditMode}
                      className={isEditMode ? styles.editable : ""}
                      onChange={e => handleInventoryInput(idx, "min", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.max}
                      disabled={!isEditMode}
                      className={isEditMode ? styles.editable : ""}
                      onChange={e => handleInventoryInput(idx, "max", e.target.value)}
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
