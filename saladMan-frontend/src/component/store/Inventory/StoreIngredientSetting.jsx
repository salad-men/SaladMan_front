import React, { useState, useEffect } from "react";
import StoreInventorySidebar from "./StoreInventorySidebar";
import { myAxios } from "../../../config";
import { accessTokenAtom, userAtom } from "/src/atoms";
import { useAtomValue } from "jotai";
import styles from "./StoreIngredientSetting.module.css";

export default function StoreIngredientSetting() {
  const token = useAtomValue(accessTokenAtom);
  const user = useAtomValue(userAtom);

  const STORE_ID = user?.id || null;

  const [settings, setSettings] = useState([]);
  const [originalSettings, setOriginalSettings] = useState([]);
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

  useEffect(() => {
    myAxios(token).get("/store/inventory/categories").then(res => {
      setCategories(res.data.categories || []);
    });
    myAxios(token).get("/store/inventory/ingredients").then(res => {
      setIngredients(res.data.ingredients || []);
    });
  }, [token]);

  useEffect(() => {
    fetchSettings();
    // eslint-disable-next-line
  }, [token, STORE_ID, filterCategory, filterName]);

  const fetchSettings = () => {
    if (!STORE_ID) return;
    myAxios(token)
      .get("/store/inventory/settings", {
        params: {
          storeId: STORE_ID,
          categoryId: filterCategory || undefined,
          keyword: filterName || undefined,
          page: 1,
        }
      })
      .then(res => {
        setSettings(res.data.settings || []);
        if (!isEditMode) setOriginalSettings(res.data.settings || []);
      })
      .catch(() => {
        setSettings([]);
        if (!isEditMode) setOriginalSettings([]);
      });
  };

  const handleInputChange = (idx, field, value) => {
    setSettings(current =>
      current.map((row, i) => (i === idx ? { ...row, [field]: value === "" ? "" : Number(value) } : row))
    );
  };

  const handleSaveEdit = () => {
    const changed = settings.filter((row) => {
      if (!row.id) return false;
      const origin = originalSettings.find((x) => x.id === row.id);
      return (
        !!origin &&
        (row.minQuantity !== origin.minQuantity ||
          row.maxQuantity !== origin.maxQuantity)
      );
    });

    if (changed.length === 0) {
      alert("수정된 내용이 없습니다.");
      setIsEditMode(false);
      return;
    }

    myAxios(token)
      .post("/store/inventory/settings-update", changed)
      .then(() => {
        alert(`총 ${changed.length}건 저장 완료!`);
        setIsEditMode(false);
        fetchSettings();
      })
      .catch((err) => {
        console.log(err);
        alert("저장 중 오류가 발생했습니다.");
      });
  };

  const handleAddSave = () => {
    if (!newSetting.categoryId || !newSetting.ingredientId ||
        newSetting.minQuantity === "" || newSetting.maxQuantity === "") {
      alert("모든 필드를 입력하세요.");
      return;
    }
    myAxios(token)
      .post("/store/inventory/settings-add", {
        storeId: STORE_ID,
        ingredientId: Number(newSetting.ingredientId),
        minQuantity: Number(newSetting.minQuantity),
        maxQuantity: Number(newSetting.maxQuantity),
      })
      .then(() => {
        alert("새 설정이 추가되었습니다.");
        setIsAddMode(false);
        setNewSetting({ categoryId: "", ingredientId: "", minQuantity: "", maxQuantity: "" });
        fetchSettings();
      })
      .catch(() => {
        alert("추가 중 오류가 발생했습니다.");
      });
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

  const getIngredientName = (ingredientId) => {
    const found = ingredients.find(ing => ing.id === Number(ingredientId));
    return found ? found.name : "-";
  };

  return (
    <div className={styles.container}>
      <StoreInventorySidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>{user?.name || ""} 재료 설정</h2>

        {/* ⭐ 필터+버튼 한줄 정렬 */}
        <div className={styles.topRow}>
          <form
            className={styles.filters}
            onSubmit={e => {
              e.preventDefault();
              fetchSettings();
            }}
          >
            <select
              className={styles.selectNarrow}
              value={filterCategory}
              onChange={e => setFilterCategory(e.target.value)}
            >
              <option value="">분류</option>
              {categories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
            <input
              className={styles.inputNarrow}
              type="text"
              value={filterName}
              onChange={e => setFilterName(e.target.value)}
              placeholder="재료명"
            />
            <button type="submit" className={styles.searchNarrow}>조회</button>
          </form>
          <div className={styles.actionBtns}>
            {!isEditMode && !isAddMode && (
              <>
                <button className={styles.edit} onClick={() => {
                  setIsEditMode(true);
                  setOriginalSettings(JSON.parse(JSON.stringify(settings)));
                }}>수정모드</button>
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
                    className={styles.selectNarrow}
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
                    className={styles.selectNarrow}
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
                    className={styles.inputNarrow}
                    value={newSetting.minQuantity}
                    onChange={e => handleNewInputChange("minQuantity", e.target.value)}
                    min={0}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    className={styles.inputNarrow}
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
