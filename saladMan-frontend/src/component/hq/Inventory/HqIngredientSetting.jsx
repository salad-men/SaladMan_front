import React, { useState, useEffect } from "react";
import HqInventorySidebar from "./HqInventorySidebar";
import { myAxios } from "/src/config";
import { accessTokenAtom } from "/src/atoms";
import { useAtomValue } from "jotai";
import styles from "./HqIngredientSetting.module.css";

export default function HqIngredientSetting() {
  const token = useAtomValue(accessTokenAtom);

  const [settings, setSettings] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filterCategory, setFilterCategory] = useState("all");
  const [filterName, setFilterName] = useState("");
  const [editingIdx, setEditingIdx] = useState(null);
  const [editingRow, setEditingRow] = useState(null);
  const [isAddMode, setIsAddMode] = useState(false);
  const [addingRows, setAddingRows] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    curPage: 1, startPage: 1, endPage: 1, allPage: 1
  });

  const STORE_ID = 1; // 본사 고정

  // 옵션 불러오기
  useEffect(() => {
    if (!token) return;
    myAxios(token).get("/hq/inventory/categories").then(res => setCategories(res.data.categories || []));
    myAxios(token).get("/hq/inventory/ingredients").then(res => setIngredients(res.data.ingredients || []));
  }, [token]);

  // 데이터 불러오기
  useEffect(() => {
    fetchSettings(pageInfo.curPage);
    // eslint-disable-next-line
  }, [token, filterCategory, filterName, pageInfo.curPage]);

  const fetchSettings = (page = 1) => {
    if (!token) return;
    myAxios(token)
      .get("/hq/inventory/settings", {
        params: {
          storeId: STORE_ID,
          categoryId: filterCategory === "all" ? undefined : filterCategory,
          keyword: filterName || undefined,
          page
        }
      })
      .then(res => {
        setSettings(res.data.settings || []);
        setPageInfo(res.data.pageInfo || { curPage: 1, startPage: 1, endPage: 1, allPage: 1 });
        setEditingIdx(null);
        setEditingRow(null);
      })
      .catch(() => {
        setSettings([]);
        setPageInfo({ curPage: 1, startPage: 1, endPage: 1, allPage: 1 });
        setEditingIdx(null);
        setEditingRow(null);
      });
  };

  // 페이징 이동
  const movePage = p => {
    if (p < 1 || p > pageInfo.allPage) return;
    setPageInfo(pi => ({ ...pi, curPage: p }));
  };
  const { curPage, startPage, endPage, allPage } = pageInfo;
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  // 필터 변경
  const onFilterChange = setter => e => {
    setter(e.target.value);
    setPageInfo(pi => ({ ...pi, curPage: 1 }));
  };

  // 재료명 얻기
  const getIngredientName = (ingredientId) => {
    const found = ingredients.find(ing => ing.id === Number(ingredientId));
    return found ? found.name : "-";
  };

  // ----------- 행 단위 수정 -----------
  const handleEdit = (idx) => {
    console.log("editingRow", editingRow);
console.log("categories", categories);
    setEditingIdx(idx);
    setEditingRow({ ...settings[idx] });
  };

  const handleEditInput = (field, value) => {
    setEditingRow(r => ({ ...r, [field]: value }));
  };

  const handleSaveEdit = (id) => {
    
    if (!editingRow.minQuantity || !editingRow.maxQuantity) {
      alert("최소/최대 수량을 입력하세요.");
      return;
    }
    myAxios(token)
      .post("/hq/inventory/settings-update", [
        {
          ...editingRow,
          storeId: STORE_ID,
          ingredientId: editingRow.ingredientId,
          minQuantity: Number(editingRow.minQuantity),
          maxQuantity: Number(editingRow.maxQuantity),
        }
      ])
      .then(() => {
        
        alert("수정 완료!");
        setEditingIdx(null);
        setEditingRow(null);
        fetchSettings(pageInfo.curPage);
      })
      .catch(() => alert("수정 중 오류 발생"));
  };

  const handleCancelEdit = () => {
    setEditingIdx(null);
    setEditingRow(null);
  };

  // ----------- 행 삭제 -----------
  const handleDelete = (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    myAxios(token)
      .post("/hq/inventory/settings-delete", { id })
      .then(() => {
        alert("삭제 완료!");
        fetchSettings(pageInfo.curPage);
      })
      .catch(() => alert("삭제 중 오류 발생"));
  };

  // ----------- 추가 row (+, x) -----------
  const handleAddRowInput = (key, field, value) => {
    setAddingRows(rows =>
      rows.map(row =>
        row.key === key
          ? { ...row, [field]: value, ...(field === "categoryId" ? { ingredientId: "" } : {}) }
          : row
      )
    );
  };
  // 추가 row 저장
  const handleAddRowSave = (row) => {
    if (!row.categoryId || !row.ingredientId || row.minQuantity === "" || row.maxQuantity === "") {
      alert("모든 필드를 입력하세요.");
      return;
    }
    myAxios(token)
      .post("/hq/inventory/settings-add", {
        storeId: STORE_ID,
        ingredientId: Number(row.ingredientId),
        minQuantity: Number(row.minQuantity),
        maxQuantity: Number(row.maxQuantity),
      })
      .then(() => {
        alert("추가 완료!");
        // 남은 추가 row 없으면 추가모드 해제
        setAddingRows(rows => {
          const newRows = rows.length > 1 ? rows.filter(r => r.key !== row.key) : [];
          if (newRows.length === 0) setIsAddMode(false);
          return newRows;
        });
        fetchSettings(pageInfo.curPage);
      })
      .catch(() => alert("추가 중 오류 발생"));
  };

  // 추가 row + 버튼
  const handleAddNewRow = () => {
    setAddingRows(rows => [
      ...rows,
      {
        categoryId: "",
        ingredientId: "",
        minQuantity: "",
        maxQuantity: "",
        key: Date.now() + Math.random()
      }
    ]);
  };
  // 추가 row x 버튼
  const handleRemoveAddRow = (key) => {
    setAddingRows(rows => rows.length === 1
      ? []
      : rows.filter(r => r.key !== key));
    if (addingRows.length === 1) setIsAddMode(false);
  };

  // [추가] 버튼 눌렀을 때만 추가 행 보임
  const onClickAddMode = () => {
    setIsAddMode(true);
    setAddingRows([
      { categoryId: "", ingredientId: "", minQuantity: "", maxQuantity: "", key: Date.now() }
    ]);
  };
  // [취소] 버튼 누르면 추가모드 해제
  const cancelAddMode = () => {
    setIsAddMode(false);
    setAddingRows([]);
  };

  return (
    <div className={styles.container}>
      <HqInventorySidebar />
      <div className={styles.content}>
        <div className={styles.innerContainer}>
          <h2 className={styles.title}>재료 설정</h2>
          {/* 필터 */}
          <div className={styles.filters}>
            <div className={styles.row}>
              {/* <span className={styles.label}>분류</span> */}
              <select
                className={styles.selectBox}
                value={filterCategory}
                onChange={onFilterChange(setFilterCategory)}
              >
                <option value="all">전체 재료</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <input
                type="text"
                className={styles.keywordInput}
                value={filterName}
                onChange={onFilterChange(setFilterName)}
                placeholder="재료명 검색"
              />
              <button className={styles.searchBtn} onClick={() => fetchSettings(1)}>검색</button>
              <div className={styles.rightActions}>
                <button className={styles.addBtn} onClick={onClickAddMode} disabled={isAddMode}>추가</button>
              </div>
            </div>
          </div>
          {/* 테이블 */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>분류</th>
                  <th>재료명</th>
                  <th>최소수량</th>
                  <th>최대수량</th>
                  <th style={{width:"170px"}}>관리</th>
                </tr>
              </thead>
              <tbody>
                {settings.length === 0 && !isAddMode ? (
                  <tr>
                    <td colSpan={5} className={styles.noData}>설정된 재료가 없습니다.</td>
                  </tr>
                ) : (
                  <>
                    {settings.map((row, idx) =>
                      editingIdx === idx ? (
                        <tr key={row.id || idx}>
                          <td>
                            {editingRow.categoryId
                              ? (categories.find(cat => String(cat.id) === String(editingRow.categoryId))?.name || "-")
                              : (editingRow.categoryName || "-")
                            }
                          </td>
                          <td>
                            {getIngredientName(editingRow.ingredientId)}
                          </td>
                          <td>
                            <input
                              type="number"
                              value={editingRow.minQuantity}
                              onChange={e => handleEditInput("minQuantity", e.target.value)}
                              className={styles.editable}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={editingRow.maxQuantity}
                              onChange={e => handleEditInput("maxQuantity", e.target.value)}
                              className={styles.editable}
                            />
                          </td>
                          <td>
                            <button className={styles.saveBtn} onClick={() => handleSaveEdit(row.id)}>저장</button>
                            <button className={styles.cancelBtn} onClick={handleCancelEdit}>취소</button>
                          </td>
                        </tr>
                      ) : (
                        <tr key={row.id || idx}>
                          <td>{row.categoryName || "-"}</td>
                          <td>{getIngredientName(row.ingredientId)}</td>
                          <td>{row.minQuantity ?? ""}</td>
                          <td>{row.maxQuantity ?? ""}</td>
                          <td>
                            <button className={styles.editBtn} onClick={() => handleEdit(idx)}>수정</button>
                            <button className={styles.deleteBtn} onClick={() => handleDelete(row.id)}>삭제</button>
                          </td>
                        </tr>
                      )
                    )}
                    {/* 추가 row: 추가모드일 때만 */}
                    {isAddMode && addingRows.map((row, i) => {
                      const filteredIngredients = row.categoryId
                        ? ingredients.filter(ing => ing.categoryId === Number(row.categoryId))
                        : [];
                      return (
                        <tr key={row.key}>
                          <td>
                            <select
                              className={styles.selectBox}
                              value={row.categoryId}
                              onChange={e => handleAddRowInput(row.key, "categoryId", e.target.value)}
                            >
                              <option value="">분류 선택</option>
                              {categories.map(cat => (
                                <option key={cat.id} value={cat.id}>{cat.name}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <select
                            className={styles.selectBox}
                              value={row.ingredientId}
                              onChange={e => handleAddRowInput(row.key, "ingredientId", e.target.value)}
                            >
                              <option value="">재료 선택</option>
                              {filteredIngredients.map(ing => (
                                <option key={ing.id} value={ing.id}>{ing.name}</option>
                              ))}
                            </select>
                          </td>
                          <td>
                            <input
                              type="number"
                              value={row.minQuantity}
                              onChange={e => handleAddRowInput(row.key, "minQuantity", e.target.value)}
                              min={0}
                              className={styles.editable}
                            />
                          </td>
                          <td>
                            <input
                              type="number"
                              value={row.maxQuantity}
                              onChange={e => handleAddRowInput(row.key, "maxQuantity", e.target.value)}
                              min={0}
                              className={styles.editable}
                            />
                          </td>
                          <td>
                            <button className={styles.saveBtn} onClick={() => handleAddRowSave(row)}>저장</button>
                            <button className={styles.addRowBtn} title="행 추가" onClick={handleAddNewRow}>＋</button>
                            <button className={styles.deleteRowBtn} title="행 삭제" onClick={() => handleRemoveAddRow(row.key)}>✕</button>
                            {addingRows.length === 1 && (
                              <button className={styles.cancelBtn} onClick={cancelAddMode}>취소</button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </>
                )}
              </tbody>
            </table>
          </div>
          {/* 페이징 */}
          <div className={styles.pagination}>
            <button onClick={() => movePage(1)} disabled={curPage === 1}>&lt;&lt;</button>
            <button onClick={() => movePage(curPage - 1)} disabled={curPage === 1}>&lt;</button>
            {pages.map(p => (
              <button
                key={p}
                className={p === curPage ? styles.active : ""}
                onClick={() => movePage(p)}
              >{p}</button>
            ))}
            <button onClick={() => movePage(curPage + 1)} disabled={curPage === allPage}>&gt;</button>
            <button onClick={() => movePage(allPage)} disabled={curPage === allPage}>&gt;&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
