import React, { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import HqInventorySidebar from "./HqInventorySidebar";
import { myAxios } from "../../../config";
import styles from "./HqInventoryList.module.css";
import { accessTokenAtom } from "/src/atoms";

// ────── 모달 컴포넌트 (클래식 스타일) ──────
function Modal({ open, onClose, children }) {
  if (!open) return null;
  return (
    <div style={{
      position: "fixed", top: 0, left: 0, width: "100vw", height: "100vh",
      background: "rgba(0,0,0,0.15)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000
    }}
      onClick={onClose}
    >
      <div
        style={{
          minWidth: 520,
          minHeight: 340,
          background: "#fff",
          border: "2px solid #222",
          borderRadius: 12,
          boxShadow: "0 4px 32px #2223",
          padding: "30px 32px 32px",
          position: "relative",
        }}
        onClick={e => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          style={{
            position: "absolute", right: 16, top: 14, fontWeight: 900, fontSize: 20, background: "none", border: "none", cursor: "pointer"
          }}
          aria-label="닫기"
        >×</button>
        {children}
      </div>
    </div>
  );
}

export default function HqInventoryList() {
  const token = useAtomValue(accessTokenAtom);

  // ----- 재고 목록 상태 -----
  const [inventory, setInventory] = useState([]);
  const [filters, setFilters] = useState({
    scope: "hq", store: "all", category: "all", name: "",
  });
  const [pageInfo, setPageInfo] = useState({ curPage: 1, allPage: 1, startPage: 1, endPage: 1 });
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [pageNums, setPageNums] = useState([]);

  // ----- 재고 신규 입력 행 -----
  const [newItems, setNewItems] = useState([
    {
      store: "본사",
      category: "",
      ingredientId: "",
      name: "",
      unit: "",
      unitCost: 0,
      quantity: 0,
      minimumOrderUnit: 0,
      expiredDate: "",
      receivedDate: "",
    },
  ]);

  // ======= 모달: 재료/카테고리 추가 관련 =======
  const [addModalOpen, setAddModalOpen] = useState(false); // 모달 open/close

  // 카테고리 추가
  const [catInput, setCatInput] = useState("");
  const [catAddLoading, setCatAddLoading] = useState(false);
  const [catAddError, setCatAddError] = useState("");
  const [catSelect, setCatSelect] = useState(""); // 선택된 카테고리 id

  // 재료 추가
  const [ingInput, setIngInput] = useState("");
  const [unitInput, setUnitInput] = useState("");
  const [ingAddLoading, setIngAddLoading] = useState(false);
  const [ingAddError, setIngAddError] = useState("");
  const [ingSelect, setIngSelect] = useState(""); // 선택된 재료 id

  // 데이터 fetch
  useEffect(() => {
    myAxios(token).get("/hq/inventory/categories").then(res => setCategories(res.data.categories || []));
    myAxios(token).get("/hq/inventory/stores").then(res => setStores(res.data.stores || []));
    myAxios(token).get("/hq/inventory/ingredients").then(res => setIngredients(res.data.ingredients || []));
  }, [token]);

  useEffect(() => {
    fetchInventory(1);
  }, [token, filters.scope, filters.store, filters.category, filters.name]);

  // ----- 재고 목록 불러오기 -----
  const fetchInventory = (page = 1) => {
    const param = {
      ...filters,
      page,
      store: filters.store !== "all" ? Number(filters.store) : "all",
      category: filters.category === "all" ? "all" : Number(filters.category),
    };
    myAxios(token)
      .post("/hq/inventory/list", param)
      .then((res) => {
        const hqList = res.data.hqInventory || [];
        const storeList = res.data.storeInventory || [];
        const list =
          filters.scope === "hq"
            ? hqList
            : filters.scope === "store"
              ? storeList
              : [...hqList, ...storeList];
        const flatList = list.map((x) => ({
          id: x.id,
          store: x.storeName || "",
          name: x.ingredientName || "",
          unit: x.unit || "",
          category: x.categoryName || "",
          unitCost: x.unitCost,
          quantity: Number(x.quantity),
          minimumOrderUnit: Number(x.minimumOrderUnit),
          minquantity: x.minquantity ?? 0,
          expiredDate: x.expiredDate,
          receivedDate: x.receivedDate || "",
        }));
        setInventory(flatList);
        const pi = res.data.pageInfo;
        setPageInfo(pi);
        setPageNums(Array.from({ length: pi.endPage - pi.startPage + 1 }, (_, i) => pi.startPage + i));
      })
      .catch(() => setInventory([]));
  };

  // ----- 필터 변경 -----
  const onFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({
      ...f,
      [name]: name === "category" && value !== "all" ? Number(value) : value,
    }));
  };

  // ----- 수정모드 행 변경 -----
  const onInvChange = (idx, field, value) => {
    setInventory((items) =>
      items.map((item, i) => {
        if (i !== idx) return item;
        if (["unitCost", "quantity", "minimumOrderUnit"].includes(field)) {
          return { ...item, [field]: Number(value) };
        }
        if (field === "expiredDate" || field === "receivedDate") {
          return { ...item, [field]: value };
        }
        return { ...item, [field]: value };
      })
    );
  };

  // ----- 신규 행 추가 -----
  const addRow = () => {
    setNewItems((items) => items.concat({
      store: "본사",
      category: "",
      ingredientId: "",
      name: "",
      unit: "",
      unitCost: 0,
      quantity: 0,
      minimumOrderUnit: 0,
      expiredDate: "",
      receivedDate: "",
    }));
  };

  // ----- 신규 입력폼 값 변경 -----
  const onNewItemChange = (idx, field, value) => {
    setNewItems((items) =>
      items.map((row, i) => {
        if (i !== idx) return row;
        if (field === "category") {
          return { ...row, category: value, ingredientId: "", name: "", unit: "" };
        }
        if (field === "ingredientId") {
          const ing = ingredients.find((x) => x.id === Number(value));
          return {
            ...row,
            ingredientId: value,
            name: ing?.name || "",
            unit: ing?.unit || "",
          };
        }
        if (["unitCost", "quantity", "minimumOrderUnit"].includes(field)) {
          return { ...row, [field]: Number(value) };
        }
        if (field === "expiredDate" || field === "receivedDate") {
          return { ...row, [field]: value };
        }
        return { ...row, [field]: value };
      })
    );
  };

  // ----- 재고 신규 등록 -----
  const saveNewItems = async () => {
    try {
      for (let idx = 0; idx < newItems.length; idx++) {
        let row = newItems[idx];
        let categoryId = categories.find(c => c.name === row.category)?.id;
        let ingredientId = Number(row.ingredientId);
        let unit = row.unit;
        // (여기서는 셀렉트박스에서만 추가)
        await myAxios(token).post("/hq/inventory/add", {
          store: "본사",
          storeId: 1,
          categoryId,
          ingredientId,
          name: row.name,
          unit,
          unitCost: row.unitCost,
          quantity: row.quantity,
          minimumOrderUnit: row.minimumOrderUnit,
          expiredDate: row.expiredDate === "" ? null : row.expiredDate,
          receivedDate: row.receivedDate === "" ? null : row.receivedDate,
        });
      }
      alert("등록 완료!");
      setIsAddMode(false);
      setNewItems([{
        store: "본사", category: "", ingredientId: "", name: "", unit: "",
        unitCost: 0, quantity: 0, minimumOrderUnit: 0, expiredDate: "", receivedDate: ""
      }]);
      fetchInventory(pageInfo.curPage);
    } catch (e) {
      alert("등록 실패했습니다.");
    }
  };

  // ----- 재고 수정 저장 -----
  const saveEdit = async () => {
    try {
      for (const item of inventory) {
        myAxios(token).post("/hq/inventory/update", {
          id: item.id,
          quantity: item.quantity,
          minimumOrderUnit: item.minimumOrderUnit,
          unitCost: item.unitCost,
          expiredDate: item.expiredDate || null,
          receivedDate: item.receivedDate || null,
        });
      }
      alert("저장되었습니다.");
      setIsEditMode(false);
      fetchInventory(pageInfo.curPage);
    } catch (e) {
      alert("수정 실패했습니다.");
    }
  };

  // ========== [카테고리 추가] ==========
  const handleAddCategory = async () => {
    setCatAddError("");
    if (!catInput.trim()) return setCatAddError("카테고리명을 입력하세요.");
    setCatAddLoading(true);
    try {
      const res = await myAxios(token).post("/hq/inventory/category-add", { name: catInput.trim() });
      setCatInput("");
      // 목록 새로고침
      const result = await myAxios(token).get("/hq/inventory/categories");
      setCategories(result.data.categories || []);
      setCatSelect(res.data.id);
      setCatAddLoading(false);
    } catch {
      setCatAddError("등록 실패. 이미 존재하거나 서버에러");
      setCatAddLoading(false);
    }
  };

  // ========== [재료 추가] ==========
  const handleAddIngredient = async () => {
    setIngAddError("");
    if (!catSelect || catSelect === "all") return setIngAddError("카테고리 선택 필요");
    if (!ingInput.trim() || !unitInput.trim()) return setIngAddError("재료명/단위 모두 입력");
    setIngAddLoading(true);
    try {
      const res = await myAxios(token).post("/hq/inventory/ingredient-add", {
        name: ingInput.trim(), categoryId: Number(catSelect), unit: unitInput.trim()
      });
      setIngInput(""); setUnitInput("");
      // 목록 새로고침
      const result = await myAxios(token).get("/hq/inventory/ingredients");
      setIngredients(result.data.ingredients || []);
      setIngSelect(res.data.id);
      setIngAddLoading(false);
    } catch {
      setIngAddError("등록 실패. 이미 존재하거나 서버에러");
      setIngAddLoading(false);
    }
  };

  // ────────────────────────────── UI ──────────────────────────────
  return (
    <div className={styles.container}>
      <HqInventorySidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>재고 조회</h2>
        {/* 필터 */}
        <div className={styles.filters}>
          <div className={styles.row}>
            <label>대상</label>
            <select name="scope" value={filters.scope} onChange={onFilterChange}>
              <option value="all">전체</option>
              <option value="hq">본사</option>
              <option value="store">지점</option>
            </select>
            {filters.scope === "store" && (
              <>
                <label>지점</label>
                <select name="store" value={filters.store} onChange={onFilterChange}>
                  <option value="all">전체지점</option>
                  {stores.filter((s) => s.id !== 1).map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </>
            )}
            <label>분류</label>
            <select name="category" value={filters.category} onChange={onFilterChange}>
              <option value="all">전체</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={onFilterChange}
              placeholder="재료명 검색"
            />
            <button className={styles.search} onClick={() => fetchInventory(1)}>
              검색
            </button>
          </div>
        </div>

        {/* 액션버튼 */}
        <div className={styles.actions}>
          {!isEditMode && !isAddMode && (
            <>
              <button className={styles.add} onClick={() => setIsAddMode(true)}>재고추가</button>
              <button className={styles.edit} onClick={() => setIsEditMode(true)}>수정입력</button>
              <button className={styles.save} onClick={() => setAddModalOpen(true)}>
                재료추가
              </button>
            </>
          )}
          {isAddMode && (
            <>
              <button className={styles.save} onClick={saveNewItems}>등록하기</button>
              <button className={styles.cancel} onClick={() => setIsAddMode(false)}>취소</button>
              <button className={styles.addRow} onClick={addRow}>행추가</button>
            </>
          )}
          {isEditMode && (
            <>
              <button className={styles.save} onClick={saveEdit}>저장하기</button>
              <button className={styles.cancel} onClick={() => setIsEditMode(false)}>취소</button>
            </>
          )}
        </div>

        {/* ----- 신규 재고 추가입력폼 ----- */}
        {isAddMode && (
          <table className={styles.table}>
            <thead>
              <tr>
                <th>지점</th>
                <th>분류</th>
                <th>재료명</th>
                <th>단위</th>
                <th>단위가격</th>
                <th>재고량</th>
                <th>최소주문단위</th>
                <th>유통기한</th>
                <th>입고날짜</th>
              </tr>
            </thead>
            <tbody>
              {newItems.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.store}</td>
                  {/* ---- 분류 ---- */}
                  <td>
                    <select
                      value={row.category}
                      onChange={e => onNewItemChange(idx, "category", e.target.value)}
                    >
                      <option value="">선택</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>{c.name}</option>
                      ))}
                    </select>
                  </td>
                  {/* ---- 재료명 ---- */}
                  <td>
                    <select
                      value={row.ingredientId}
                      onChange={e => onNewItemChange(idx, "ingredientId", e.target.value)}
                    >
                      <option value="">선택</option>
                      {ingredients
                        .filter(
                          (ing) =>
                            ing.categoryId === categories.find((c) => c.name === row.category)?.id
                        )
                        .map((ing) => (
                          <option key={ing.id} value={ing.id}>{ing.name}</option>
                        ))}
                    </select>
                  </td>
                  {/* ---- 단위 ---- */}
                  <td>
                    <input
                      type="text"
                      value={row.unit}
                      readOnly
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.unitCost}
                      onChange={e => onNewItemChange(idx, "unitCost", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.quantity}
                      onChange={e => onNewItemChange(idx, "quantity", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.minimumOrderUnit}
                      onChange={e => onNewItemChange(idx, "minimumOrderUnit", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={row.expiredDate}
                      onChange={e => onNewItemChange(idx, "expiredDate", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={row.receivedDate}
                      onChange={e => onNewItemChange(idx, "receivedDate", e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* --- 재고 리스트 --- */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>지점</th>
              <th>재료명</th>
              <th>분류</th>
              <th>단위</th>
              <th>단위가격</th>
              <th>재고량</th>
              <th>최소주문단위</th>
              <th>매장별 최소수량</th>
              <th>유통기한</th>
              <th>입고날짜</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 ? (
              <tr>
                <td colSpan={10} className={styles.noData}>데이터가 없습니다.</td>
              </tr>
            ) : (
              inventory.map((r, i) => {
                const isLowStock = r.quantity < r.minimumOrderUnit;
                return (
                  <tr key={r.id} className={isLowStock ? styles.lowStockRow : ""}>
                    <td>{r.store}</td>
                    <td>{r.name}</td>
                    <td>{r.category}</td>
                    <td>{r.unit}</td>
                    <td>
                      <input type="number" value={r.unitCost} disabled={true} />
                    </td>
                    <td>
                      {isEditMode ? (
                        <input type="number" value={r.quantity} onChange={e => onInvChange(i, "quantity", e.target.value)} />
                      ) : (
                        <input type="number" value={r.quantity} disabled />
                      )}
                    </td>
                    <td>
                      <input type="number" value={r.minimumOrderUnit} disabled={true} />
                    </td>
                    <td>
                      <input type="number" value={r.minquantity ?? 0} disabled={true} />
                    </td>
                    <td>
                      <input type="date" value={r.expiredDate ? r.expiredDate.substring(0, 10) : ""} disabled={true} />
                    </td>
                    <td>
                      <input type="date" value={r.receivedDate ? r.receivedDate.substring(0, 10) : ""} disabled={true} />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* --- 페이징 --- */}
        <div className={styles.pagination}>
          <button onClick={() => fetchInventory(pageInfo.curPage - 1)} disabled={pageInfo.curPage === 1}>
            &lt;
          </button>
          {pageNums.map((p) => (
            <button
              key={p}
              onClick={() => fetchInventory(p)}
              className={p === pageInfo.curPage ? styles.active : ""}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => fetchInventory(pageInfo.curPage + 1)}
            disabled={pageInfo.curPage >= pageInfo.allPage}
          >
            &gt;
          </button>
        </div>
      </div>

      {/* ────────── [재료추가 모달] ────────── */}
      <Modal open={addModalOpen} onClose={() => setAddModalOpen(false)}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <h2 style={{ fontWeight: 600, marginBottom: 20 }}>재료추가</h2>
          {/* 카테고리/재료 2단 패널 */}
          <div style={{
            display: "flex", gap: 40, justifyContent: "center", width: 500, marginBottom: 16,
          }}>
            {/* 카테고리 추가/조회 */}
            <div style={{ flex: 1, border: "3px solid #111", borderRadius: 8, padding: 20 }}>
              <div style={{ fontWeight: 500, fontSize: 17, marginBottom: 8, textAlign: "center" }}>카테고리</div>
              <select
                style={{ width: "100%", marginBottom: 8 }}
                value={catSelect}
                onChange={e => setCatSelect(e.target.value)}
              >
                <option value="">카테고리 선택</option>
                {categories.map(cat => (
                  <option key={cat.id} value={cat.id}>{cat.name}</option>
                ))}
              </select>
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  style={{ flex: 1, border: "1px solid #aaa", borderRadius: 4, padding: "4px 8px" }}
                  type="text"
                  placeholder="새 카테고리명"
                  value={catInput}
                  onChange={e => setCatInput(e.target.value)}
                  disabled={catAddLoading}
                  onKeyDown={e => e.key === "Enter" && handleAddCategory()}
                />
                <button
                  style={{ background: "#232", color: "#fff", borderRadius: 4, padding: "4px 10px" }}
                  onClick={handleAddCategory}
                  disabled={catAddLoading}
                  type="button"
                >추가</button>
              </div>
              {catAddError && <div style={{ color: "crimson", marginTop: 4, fontSize: 12 }}>{catAddError}</div>}
            </div>

            {/* 재료 추가/조회 */}
            <div style={{ flex: 1, border: "3px solid #111", borderRadius: 8, padding: 20 }}>
              <div style={{ fontWeight: 500, fontSize: 17, marginBottom: 8, textAlign: "center" }}>재료</div>
              <select
                style={{ width: "100%", marginBottom: 8 }}
                value={ingSelect}
                onChange={e => setIngSelect(e.target.value)}
                disabled={!catSelect}
              >
                <option value="">재료 선택</option>
                {ingredients.filter(ing => String(ing.categoryId) === String(catSelect)).map(ing =>
                  <option key={ing.id} value={ing.id}>{ing.name}</option>
                )}
              </select>
              <div style={{ display: "flex", gap: 6 }}>
                <input
                  style={{ flex: 1, border: "1px solid #aaa", borderRadius: 4, padding: "4px 8px" }}
                  type="text"
                  placeholder="새 재료명"
                  value={ingInput}
                  onChange={e => setIngInput(e.target.value)}
                  disabled={ingAddLoading}
                />
                <input
                  style={{ width: 60, border: "1px solid #aaa", borderRadius: 4, padding: "4px 6px" }}
                  type="text"
                  placeholder="단위"
                  value={unitInput}
                  onChange={e => setUnitInput(e.target.value)}
                  disabled={ingAddLoading}
                  maxLength={8}
                />
                <button
                  style={{ background: "#232", color: "#fff", borderRadius: 4, padding: "4px 10px" }}
                  onClick={handleAddIngredient}
                  disabled={ingAddLoading}
                  type="button"
                >추가</button>
              </div>
              {ingAddError && <div style={{ color: "crimson", marginTop: 4, fontSize: 12 }}>{ingAddError}</div>}
            </div>
          </div>
          <div style={{ marginTop: 10 }}>
            <button
              onClick={() => setAddModalOpen(false)}
              style={{
                background: "#eee", color: "#111", border: "1px solid #aaa",
                borderRadius: 5, padding: "7px 24px", fontWeight: 600,
                fontSize: 16, cursor: "pointer",
              }}
            >닫기</button>
          </div>
        </div>
      </Modal>
    </div>
  );
}
