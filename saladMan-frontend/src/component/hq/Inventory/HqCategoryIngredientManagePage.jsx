import React, { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { myAxios } from "/src/config";
import { accessTokenAtom } from "/src/atoms";
import HqInventorySidebar from "./HqInventorySidebar";
import styles from "./HqCategoryIngredientManagePage.module.css";

export default function HqCategoryIngredientManagePage() {
  const token = useAtomValue(accessTokenAtom);

  const [categories, setCategories] = useState([]);
  const [allIngredients, setAllIngredients] = useState([]);
  const [selectedCat, setSelectedCat] = useState(null);
  const [selectedIng, setSelectedIng] = useState(null);

  const [showCatInput, setShowCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [catError, setCatError] = useState("");

  const [showIngInput, setShowIngInput] = useState(false);
  const [newIngName, setNewIngName] = useState("");
  const [newIngUnit, setNewIngUnit] = useState("");
  const [ingError, setIngError] = useState("");

  const [editCatId, setEditCatId] = useState(null);
  const [editCatName, setEditCatName] = useState("");
  const [editIngId, setEditIngId] = useState(null);
  const [editIngName, setEditIngName] = useState("");
  const [editIngUnit, setEditIngUnit] = useState("");

  const [catLoading, setCatLoading] = useState(false);
  const [ingLoading, setIngLoading] = useState(false);

  useEffect(() => {
    if (!token) return;
    fetchCategories();
    fetchIngredients();
  }, [token]);

  const fetchCategories = async () => {
    setCatLoading(true);
    try {
      const res = await myAxios(token).get("/hq/inventory/categories");
      const cats = res.data.categories || [];
      setCategories(cats);
      if (!selectedCat && cats.length) setSelectedCat(cats[0]);
    } finally {
      setCatLoading(false);
    }
  };

  const fetchIngredients = async () => {
    setIngLoading(true);
    try {
      const res = await myAxios(token).get("/hq/inventory/ingredients");
      setAllIngredients(res.data.ingredients || []);
    } finally {
      setIngLoading(false);
    }
  };

  const ingredients = selectedCat
    ? allIngredients.filter(i => i.categoryId === selectedCat.id)
    : [];

  const addCategory = async () => {
    if (!newCatName.trim()) return setCatError("이름을 입력하세요.");
    setCatError("");
    try {
      const res = await myAxios(token).post("/hq/inventory/category-add", { name: newCatName.trim() });
      setCategories(prev => [...prev, { id: res.data.id, name: newCatName.trim() }]);
      setNewCatName("");
      setShowCatInput(false);
    } catch {
      setCatError("추가 실패");
    }
  };

  const saveCategory = async id => {
    if (!editCatName.trim()) return setCatError("이름을 입력하세요.");
    setCatError("");
    try {
      await myAxios(token).post("/hq/inventory/category-update", { id, name: editCatName.trim() });
      setCategories(prev => prev.map(c => c.id === id ? { ...c, name: editCatName.trim() } : c));
      setEditCatId(null);
    } catch {
      setCatError("수정 실패");
    }
  };

  const deleteCategory = async cat => {
    try {
      await myAxios(token).post("/hq/inventory/category-delete", { id: cat.id });
      setCategories(prev => prev.filter(c => c.id !== cat.id));
      if (selectedCat?.id === cat.id) setSelectedCat(null);
    } catch {
      setCatError("삭제 실패");
    }
  };

  const addIngredient = async () => {
    if (!newIngName.trim() || !newIngUnit.trim()) return setIngError("이름과 단위를 모두 입력하세요.");
    setIngError("");
    try {
      const res = await myAxios(token).post("/hq/inventory/ingredient-add", {
        name: newIngName.trim(),
        unit: newIngUnit.trim(),
        categoryId: selectedCat.id,
      });
      setAllIngredients(prev => [...prev, {
        id: res.data.id,
        name: newIngName.trim(),
        unit: newIngUnit.trim(),
        categoryId: selectedCat.id
      }]);
      setNewIngName("");
      setNewIngUnit("");
      setShowIngInput(false);
    } catch {
      setIngError("추가 실패");
    }
  };

  const saveIngredient = async id => {
    if (!editIngName.trim() || !editIngUnit.trim()) return setIngError("이름과 단위를 모두 입력하세요.");
    setIngError("");
    try {
      await myAxios(token).post("/hq/inventory/ingredient-update", { id, name: editIngName.trim(), unit: editIngUnit.trim() });
      setAllIngredients(prev => prev.map(i => i.id === id ? { ...i, name: editIngName.trim(), unit: editIngUnit.trim() } : i));
      setEditIngId(null);
    } catch {
      setIngError("수정 실패");
    }
  };

  const deleteIngredient = async ing => {
    try {
      await myAxios(token).post("/hq/inventory/ingredient-delete", { id: ing.id });
      setAllIngredients(prev => prev.filter(i => i.id !== ing.id));
      if (selectedIng?.id === ing.id) setSelectedIng(null);
    } catch {
      setIngError("삭제 실패");
    }
  };

  const selectCategory = cat => {
    setSelectedCat(cat);
    setSelectedIng(null);
    setEditCatId(null);
    setShowIngInput(false);
    setCatError("");
    setIngError("");
  };

  const selectIngredient = ing => {
    setSelectedIng(ing);
    setEditIngId(null);
  };

  return (
    <div className={styles.container}>
      <HqInventorySidebar />
      <div className={styles.content}>
        <div className={styles.innerContainer}>
          {/* 제목을 innerContainer 안으로 이동 */}
          <h2 className={styles.title}>카테고리 / 재료 관리</h2>

          <div className={styles.columns}>
            {/* 카테고리 컬럼 */}
            <div className={styles.column}>
              <div className={styles.header}>
                <span className={styles.boxTitle}>카테고리</span>
                <button
                  className={styles.plusBtn}
                  onClick={() => { setShowCatInput(v => !v); setCatError(""); }}
                >
                  ＋
                </button>
              </div>

              {showCatInput && (
                <div className={styles.catInputWrapper} onClick={e => e.stopPropagation()}>
                  <input
                    className={styles.catInput}
                    placeholder="새 카테고리"
                    value={newCatName}
                    onChange={e => setNewCatName(e.target.value)}
                  />
                  <button className={styles.confirmBtn} onClick={addCategory}>추가</button>
                </div>
              )}
              {catError && <div className={styles.error}>{catError}</div>}

              <div className={styles.listBox}>
                {catLoading
                  ? <div className={styles.loading}>로딩중…</div>
                  : categories.map(cat => (
                    <div
                      key={cat.id}
                      className={`${styles.item} ${selectedCat?.id === cat.id ? styles.active : ""}`}
                      onClick={() => selectCategory(cat)}
                    >
                      {editCatId === cat.id ? (
                        <div className={styles.catInputWrapper} onClick={e => e.stopPropagation()}>
                          <input
                            className={styles.catInput}
                            value={editCatName}
                            onChange={e => setEditCatName(e.target.value)}
                          />
                          <button className={styles.confirmBtn} onClick={() => saveCategory(cat.id)}>저장</button>
                          <button className={styles.cancelBtn} onClick={() => setEditCatId(null)}>취소</button>
                        </div>
                      ) : (
                        <>
                          <span>{cat.name}</span>
                          <div className={styles.btns}>
                            <button
                              className={styles.editBtn}
                              onClick={e => { e.stopPropagation(); setEditCatId(cat.id); setEditCatName(cat.name); }}
                            >수정</button>
                            <button
                              className={styles.delBtn}
                              onClick={e => { e.stopPropagation(); deleteCategory(cat); }}
                            >삭제</button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                }
              </div>
            </div>

            {/* 재료 컬럼 */}
            <div className={`${styles.column} ${styles.ingColumn}`}>
              <div className={styles.header}>
                <span className={styles.boxTitle}>
                  {selectedCat ? `${selectedCat.name} 재료` : "재료"}
                </span>
                {selectedCat && (
                  <button
                    className={styles.plusBtn}
                    onClick={() => { setShowIngInput(v => !v); setIngError(""); }}
                  >
                    ＋
                  </button>
                )}
              </div>

              {showIngInput && selectedCat && (
                <div className={styles.ingInputWrapper} onClick={e => e.stopPropagation()}>
                  <input
                    className={styles.ingInput}
                    placeholder="새 재료"
                    value={newIngName}
                    onChange={e => setNewIngName(e.target.value)}
                  />
                  <input
                    className={styles.ingInput}
                    placeholder="단위"
                    value={newIngUnit}
                    onChange={e => setNewIngUnit(e.target.value)}
                  />
                  <button className={styles.confirmBtn} onClick={addIngredient}>추가</button>
                </div>
              )}
              {ingError && <div className={styles.error}>{ingError}</div>}

              <div className={styles.listBox}>
                {ingLoading
                  ? <div className={styles.loading}>로딩중…</div>
                  : ingredients.map(ing => (
                    <div
                      key={ing.id}
                      className={`${styles.item} ${selectedIng?.id === ing.id ? styles.active : ""}`}
                      onClick={() => selectIngredient(ing)}
                    >
                      {editIngId === ing.id ? (
                        <div className={styles.ingInputWrapper} onClick={e => e.stopPropagation()}>
                          <input
                            className={styles.ingInput}
                            value={editIngName}
                            onChange={e => setEditIngName(e.target.value)}
                          />
                          <input
                            className={styles.ingInput}
                            value={editIngUnit}
                            onChange={e => setEditIngUnit(e.target.value)}
                          />
                          <button className={styles.confirmBtn} onClick={() => saveIngredient(ing.id)}>저장</button>
                          <button className={styles.cancelBtn} onClick={() => setEditIngId(null)}>취소</button>
                        </div>
                      ) : (
                        <>
                          <span>{ing.name} ({ing.unit})</span>
                          <div className={styles.btns}>
                            <button
                              className={styles.editBtn}
                              onClick={e => { e.stopPropagation(); setEditIngId(ing.id); setEditIngName(ing.name); setEditIngUnit(ing.unit); }}
                            >수정</button>
                            <button
                              className={styles.delBtn}
                              onClick={e => { e.stopPropagation(); deleteIngredient(ing); }}
                            >삭제</button>
                          </div>
                        </>
                      )}
                    </div>
                  ))
                }
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}