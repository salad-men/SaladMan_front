import React, { useState, useEffect } from "react";
import HqInventorySidebar from "./HqInventorySidebar";
import { myAxios } from "../../../config";
import { accessTokenAtom } from "/src/atoms";
import { useAtomValue } from "jotai";
import styles from "./HqIngredientSetting.module.css";

export default function HqIngredientSetting() {
  const token = useAtomValue(accessTokenAtom);

  const [settings, setSettings] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);

  const [filterCategory, setFilterCategory] = useState("");
  const [filterName, setFilterName] = useState("");

  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);

  const [newSetting, setNewSetting] = useState({
    categoryId: "",
    ingredientId: "",
    minQuantity: "",
    maxQuantity: "",
  });

  const STORE_ID = 1; // 본사 고정

  // 분류, 재료 리스트 초기 로드
  useEffect(() => {
    myAxios(token).get("/hq/inventory/categories").then(res => {
      setCategories(res.data.categories || []);
    });
    myAxios(token).get("/hq/inventory/ingredients").then(res => {
      setIngredients(res.data.ingredients || []);
    });
  }, [token]);

  // 필터 변경 시, 재고 설정 목록 호출
  useEffect(() => {
    fetchSettings();
  }, [token, filterCategory, filterName]);

  const fetchSettings = () => {
    myAxios(token)
      .get("/hq/inventory/settings", {
        params: {
          storeId: STORE_ID,
          categoryId: filterCategory || undefined,
          keyword: filterName || undefined,
          page: 1,  // 현재 페이지 고정 또는 상태로 관리 가능
        }
      })
      .then(res => setSettings(res.data.settings || []))
      .catch(() => setSettings([]));
  };

  const handleInputChange = (idx, field, value) => {
    setSettings(current =>
      current.map((row, i) => (i === idx ? { ...row, [field]: value === "" ? "" : Number(value) } : row))
    );
  };

  const handleSaveEdit = async () => {
    try {
      await Promise.all(
        settings.map(row =>
          myAxios(token).post("/hq/inventory/settings-save", {
            id: row.id,
            storeId: STORE_ID,
            ingredientId: row.ingredientId,
            minQuantity: row.minQuantity,
            maxQuantity: row.maxQuantity,
          })
        )
      );
      alert("설정이 저장되었습니다.");
      setIsEditMode(false);
      fetchSettings();
    } catch {
      alert("저장 중 오류가 발생했습니다.");
    }
  };

  const handleNewInputChange = (field, value) => {
    setNewSetting(prev => {
      if (field === "categoryId") {
        return { ...prev, categoryId: value, ingredientId: "" };
      }
      return { ...prev, [field]: value };
    });
  };

  const filteredIngredients = newSetting.categoryId
    ? ingredients.filter(ing => ing.categoryId === Number(newSetting.categoryId))
    : [];

  const handleAddSave = async () => {
    if (!newSetting.categoryId) {
      alert("분류를 선택하세요.");
      return;
    }
    if (!newSetting.ingredientId) {
      alert("재료를 선택하세요.");
      return;
    }
    if (newSetting.minQuantity === "" || newSetting.maxQuantity === "") {
      alert("최소수량과 최대수량을 입력하세요.");
      return;
    }
    try {
      await myAxios(token).post("/hq/inventory/settings-save", {
        storeId: STORE_ID,
        ingredientId: Number(newSetting.ingredientId),
        minQuantity: Number(newSetting.minQuantity),
        maxQuantity: Number(newSetting.maxQuantity),
      });
      alert("새 설정이 추가되었습니다.");
      setIsAddMode(false);
      setNewSetting({ categoryId: "", ingredientId: "", minQuantity: "", maxQuantity: "" });
      fetchSettings();
    } catch {
      alert("추가 중 오류가 발생했습니다.");
    }
  };

  const getIngredientName = (ingredientId) => {
    const found = ingredients.find(ing => ing.id === Number(ingredientId));
    return found ? found.name : "-";
  };

  return (
    <div className={styles.container}>
      <HqInventorySidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>본사 재료 설정</h2>

        <form
          className={styles.filters}
          style={{ display: "flex", alignItems: "center", marginBottom: 24 }}
          onSubmit={e => {
            e.preventDefault();
            fetchSettings();
          }}
        >
          <select
            value={filterCategory}
            onChange={e => setFilterCategory(e.target.value)}
            style={{ width: 120, marginRight: 12 }}
          >
            <option value="">전체</option>
            {categories.map(cat => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
          <input
            type="text"
            value={filterName}
            onChange={e => setFilterName(e.target.value)}
            placeholder="재료명 검색"
            style={{ width: 160, marginRight: 12 }}
          />
          <button type="submit" className={styles.search}>조회</button>
        </form>

        <div className={styles.actions}>
          {!isEditMode && !isAddMode && (
            <>
              <button className={styles.edit} onClick={() => setIsEditMode(true)}>수정모드</button>
              <button className={styles.add} onClick={() => setIsAddMode(true)}>추가</button>
            </>
          )}
          {isEditMode && (
            <>
              <button className={styles.cancel} onClick={() => setIsEditMode(false)}>취소</button>
              <button className={styles.save} onClick={handleSaveEdit}>저장</button>
            </>
          )}
          {isAddMode && (
            <>
              <button className={styles.cancel} onClick={() => {
                setIsAddMode(false);
                setNewSetting({ categoryId: "", ingredientId: "", minQuantity: "", maxQuantity: "" });
              }}>취소</button>
              <button className={styles.save} onClick={handleAddSave}>추가 저장</button>
            </>
          )}
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>분류</th>
              <th>재료명</th>
              <th>최소수량</th>
              <th>최대수량</th>
            </tr>
          </thead>
          <tbody>
            {settings.length === 0 ? (
              <tr>
                <td colSpan={4} className={styles.noData}>설정된 재료가 없습니다.</td>
              </tr>
            ) : (
              settings.map((row, idx) => (
                <tr key={row.id || idx}>
                  <td>{row.categoryName || "-"}</td>
                  <td>{getIngredientName(row.ingredientId)}</td>
                  <td>
                    <input
                      type="number"
                      value={row.minQuantity || ""}
                      disabled={!isEditMode}
                      className={isEditMode ? styles.editable : ""}
                      onChange={e => handleInputChange(idx, "minQuantity", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.maxQuantity || ""}
                      disabled={!isEditMode}
                      className={isEditMode ? styles.editable : ""}
                      onChange={e => handleInputChange(idx, "maxQuantity", e.target.value)}
                    />
                  </td>
                </tr>
              ))
            )}
            {isAddMode && (
              <tr>
                <td>
                  <select
                    value={newSetting.categoryId}
                    onChange={e => handleNewInputChange("categoryId", e.target.value)}
                  >
                    <option value="">분류 선택</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>
                        {cat.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={newSetting.ingredientId}
                    onChange={e => handleNewInputChange("ingredientId", e.target.value)}
                  >
                    <option value="">재료 선택</option>
                    {filteredIngredients.map(ing => (
                      <option key={ing.id} value={ing.id}>
                        {ing.name}
                      </option>
                    ))}
                  </select>
                </td>
                <td>
                  <input
                    type="number"
                    value={newSetting.minQuantity}
                    onChange={e => handleNewInputChange("minQuantity", e.target.value)}
                    min={0}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={newSetting.maxQuantity}
                    onChange={e => handleNewInputChange("maxQuantity", e.target.value)}
                    min={0}
                  />
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
