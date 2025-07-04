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
  const [selectedCatId, setSelectedCatId] = useState("");
  const [catError, setCatError] = useState("");
  const [ingError, setIngError] = useState("");
  const [catLoading, setCatLoading] = useState(false);
  const [ingLoading, setIngLoading] = useState(false);

  // 카테고리 추가/수정
  const [showCatInput, setShowCatInput] = useState(false);
  const [newCatName, setNewCatName] = useState("");
  const [editCatId, setEditCatId] = useState(null);
  const [editCatName, setEditCatName] = useState("");

  // 재료 추가/수정
  const [showIngInput, setShowIngInput] = useState(false);
  const [newIngName, setNewIngName] = useState("");
  const [newIngUnit, setNewIngUnit] = useState("");
  const [editIngId, setEditIngId] = useState(null);
  const [editIngName, setEditIngName] = useState("");
  const [editIngUnit, setEditIngUnit] = useState("");

  useEffect(() => {
    if (!token) return;
    fetchCategories();
    fetchIngredients();
  }, [token]);

  const fetchCategories = async () => {
    setCatLoading(true);
    try {
      const res = await myAxios(token).get("/hq/inventory/categories");
      setCategories(res.data.categories || []);
      if (!selectedCatId && res.data.categories?.[0]?.id) setSelectedCatId(String(res.data.categories[0].id));
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
  const selectedCat = categories.find(cat => String(cat.id) === selectedCatId);

  // 필터된 재료
  const ingredients = selectedCat
    ? allIngredients.filter(i => String(i.categoryId) === selectedCatId)
    : [];

  // 카테고리 추가/수정/삭제
  const addCategory = async () => {
    if (!token) return;

    if (!newCatName.trim()) return setCatError("이름을 입력하세요.");
    setCatError("");
    try {
      const res = await myAxios(token).post("/hq/inventory/category-add", { name: newCatName.trim() });
      console.log("token:", token);
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
    if (!token) return;

    try {
      await myAxios(token).post("/hq/inventory/category-update", { id, name: editCatName.trim() });
      setCategories(prev => prev.map(c => c.id === id ? { ...c, name: editCatName.trim() } : c));
      setEditCatId(null);
    } catch {
      setCatError("수정 실패");
    }
  };
  const deleteCategory = async cat => {
    if (!token) return;

    try {
      await myAxios(token).post("/hq/inventory/category-delete", { id: cat.id });
      setCategories(prev => prev.filter(c => c.id !== cat.id));
      if (selectedCatId === String(cat.id)) setSelectedCatId("");
    } catch {
      setCatError("삭제 실패");
    }
  };

  // 재료 추가/수정/삭제
  const addIngredient = async () => {
    if (!newIngName.trim() || !newIngUnit.trim()) return setIngError("이름과 단위를 모두 입력하세요.");
    setIngError("");
    if (!token) return;

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
      setNewIngName(""); setNewIngUnit("");
      setShowIngInput(false);
    } catch {
      setIngError("추가 실패");
    }
  };
  const saveIngredient = async id => {
    if (!token) return;

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
    if (!token) return;

    try {
      await myAxios(token).post("/hq/inventory/ingredient-delete", { id: ing.id });
      setAllIngredients(prev => prev.filter(i => i.id !== ing.id));
    } catch {
      setIngError("삭제 실패");
    }
  };

  return (
    <div className={styles.managerContainer}>
      <HqInventorySidebar />
      <div className={styles.managerContent}>
        <div className={styles.managerInner}>
          <h2 className={styles.managerTitle}>카테고리 / 재료 관리</h2>
          <div className={styles.managerFlex}>
            {/* === 카테고리 컬럼 === */}
            <div className={styles.managerCol}>
              <div className={styles.catFilters}>
                <div className={styles.catRow}>
                  <span className={styles.catLabel}>카테고리</span>
                  <button
                    className={styles.catAddBtn}
                    type="button"
                    onClick={() => { setShowCatInput(v => !v); setCatError(""); }}
                  >카테고리 추가</button>
                </div>
                {showCatInput && (
                  <div className={styles.catRow}>
                    <input
                      className={styles.catInput}
                      placeholder="새 카테고리명"
                      value={newCatName}
                      onChange={e => setNewCatName(e.target.value)}
                    />
                    <button className={styles.catAddSubmitBtn} onClick={addCategory}>추가</button>
                    <button className={styles.catAddCancelBtn} onClick={() => { setShowCatInput(false); setNewCatName(""); }}>취소</button>
                  </div>
                )}
                {catError && <div className={styles.catError}>{catError}</div>}
              </div>
              <div className={styles.catTableWrap}>
                <table className={styles.catTable}>
                  <thead>
                    <tr>
                      <th>카테고리명</th>
                      <th className={styles.catManageTh}>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {catLoading ? (
                      <tr><td colSpan={2} className={styles.catNoData}>로딩중…</td></tr>
                    ) : categories.length === 0 ? (
                      <tr><td colSpan={2} className={styles.catNoData}>카테고리가 없습니다.</td></tr>
                    ) : (
                      categories.map(cat => (
                        <tr key={cat.id} className={selectedCatId === String(cat.id) ? styles.catRowActive : ""}>
                          {editCatId === cat.id ? (
                            <>
                              <td>
                                <input
                                  className={styles.catEditInput}
                                  value={editCatName}
                                  onChange={e => setEditCatName(e.target.value)}
                                />
                              </td>
                              <td>
                                <button className={styles.catEditSubmitBtn} onClick={() => saveCategory(cat.id)}>저장</button>
                                <button className={styles.catEditCancelBtn} onClick={() => setEditCatId(null)}>취소</button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td onClick={() => setSelectedCatId(String(cat.id))} style={{ cursor: "pointer" }}>
                                {cat.name}
                              </td>
                              <td>
                                <button
                                  className={styles.catEditBtn}
                                  onClick={() => { setEditCatId(cat.id); setEditCatName(cat.name); }}
                                >수정</button>
                                <button
                                  className={styles.catDeleteBtn}
                                  onClick={() => deleteCategory(cat)}
                                >삭제</button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
            {/* === 재료 컬럼 === */}
            <div className={styles.managerCol}>
              <div className={styles.ingFilters}>
                <div className={styles.ingRow}>
                  <span className={styles.ingLabel}>재료</span>
                  <select
                    value={selectedCatId}
                    onChange={e => setSelectedCatId(e.target.value)}
                    className={styles.ingCatSelect}
                  >
                    <option value="">전체</option>
                    {categories.map(cat => (
                      <option key={cat.id} value={cat.id}>{cat.name}</option>
                    ))}
                  </select>
                  <button
                    className={styles.ingAddBtn}
                    type="button"
                    disabled={!selectedCat}
                    onClick={() => { setShowIngInput(v => !v); setIngError(""); }}
                  >재료 추가</button>
                </div>
                {showIngInput && selectedCat && (
                  <div className={styles.ingRow}>
                    <input
                      className={styles.ingInput}
                      placeholder="재료명"
                      value={newIngName}
                      onChange={e => setNewIngName(e.target.value)}
                    />
                    <input
                      className={styles.ingInput}
                      placeholder="단위"
                      value={newIngUnit}
                      onChange={e => setNewIngUnit(e.target.value)}
                    />
                    <button className={styles.ingAddSubmitBtn} onClick={addIngredient}>추가</button>
                    <button className={styles.ingAddCancelBtn} onClick={() => { setShowIngInput(false); setNewIngName(""); setNewIngUnit(""); }}>취소</button>
                  </div>
                )}
                {ingError && <div className={styles.ingError}>{ingError}</div>}
              </div>
              <div className={styles.ingTableWrap}>
                <table className={styles.ingTable}>
                  <thead>
                    <tr>
                      <th>재료명</th>
                      <th>단위</th>
                      <th className={styles.ingManageTh}>관리</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingLoading ? (
                      <tr><td colSpan={3} className={styles.ingNoData}>로딩중…</td></tr>
                    ) : ingredients.length === 0 ? (
                      <tr><td colSpan={3} className={styles.ingNoData}>재료가 없습니다.</td></tr>
                    ) : (
                      ingredients.map(ing => (
                        <tr key={ing.id}>
                          {editIngId === ing.id ? (
                            <>
                              <td>
                                <input
                                  className={styles.ingEditInput}
                                  value={editIngName}
                                  onChange={e => setEditIngName(e.target.value)}
                                />
                              </td>
                              <td>
                                <input
                                  className={styles.ingEditInput}
                                  value={editIngUnit}
                                  onChange={e => setEditIngUnit(e.target.value)}
                                />
                              </td>
                              <td>
                                <button className={styles.ingEditSubmitBtn} onClick={() => saveIngredient(ing.id)}>저장</button>
                                <button className={styles.ingEditCancelBtn} onClick={() => setEditIngId(null)}>취소</button>
                              </td>
                            </>
                          ) : (
                            <>
                              <td>{ing.name}</td>
                              <td>{ing.unit}</td>
                              <td>
                                <button
                                  className={styles.ingEditBtn}
                                  onClick={() => { setEditIngId(ing.id); setEditIngName(ing.name); setEditIngUnit(ing.unit); }}
                                >수정</button>
                                <button
                                  className={styles.ingDeleteBtn}
                                  onClick={() => deleteIngredient(ing)}
                                >삭제</button>
                              </td>
                            </>
                          )}
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
