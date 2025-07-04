import React, { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import HqInventorySidebar from "./HqInventorySidebar";
import { myAxios } from "/src/config";
import styles from "./HqInventoryList.module.css";
import { accessTokenAtom } from "/src/atoms";

export default function HqInventoryList() {
  const token = useAtomValue(accessTokenAtom);

  // 재고/카테고리/재료/지점 등 상태
  const [inventory, setInventory] = useState([]);
  const [filters, setFilters] = useState({
    scope: "hq",
    store: "all",
    category: "all",
    name: "",
  });
  const [pageInfo, setPageInfo] = useState({
    curPage: 1,
    allPage: 1,
    startPage: 1,
    endPage: 1,
  });
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [pageNums, setPageNums] = useState([]);

  // 옵션 리스트
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  // 데이터 및 페이징
  const [data, setData] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    curPage: 1,
    startPage: 1,
    endPage: 1,
    allPage: 1,
  });

  // 모달 입력 상태
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newItems, setNewItems] = useState([
    {
      category: "",
      ingredientId: "",
      unit: "",
      unitCost: 0,
      quantity: 0,
      minimumOrderUnit: 0,
      expiredDate: "",
      receivedDate: "",
    },
  ]);

  // 수정 모드
  const [editRow, setEditRow] = useState(null);

  // 옵션 불러오기
  useEffect(() => {
    if (!token) return;
    const axios = myAxios(token);

    axios
      .get("/hq/inventory/categories")
      .then((res) => setCategories(res.data.categories || []));
    axios
      .get("/hq/inventory/stores")
      .then((res) => setStores(res.data.stores || []));
    axios
      .get("/hq/inventory/ingredients")
      .then((res) => setIngredients(res.data.ingredients || []));
  }, [token]);

  // 재고 조회 함수
  const fetchInventory = async (
    page = 1,
    sd = startDate,
    ed = endDate,
    sort = sortOption,
    kw = keyword
  ) => {
    if (!token) return;

    const axios = myAxios(token);

    const param = {
      ...filters,
      page,
      store: filters.store !== "all" ? Number(filters.store) : "all",
      category: filters.category === "all" ? "all" : Number(filters.category),
    };
    axios
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
        setPageNums(
          Array.from(
            { length: pi.endPage - pi.startPage + 1 },
            (_, i) => pi.startPage + i
          )
        );
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
    setNewItems((items) =>
      items.concat({
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
      })
    );
  };

  // ----- 추가입력 폼 변경 -----
  const onNewItemChange = (idx, field, value) => {
    setNewItems((items) =>
      items.map((row, i) => {
        if (i !== idx) return row;
        if (field === "category") {
          return {
            ...row,
            category: value,
            ingredientId: "",
            name: "",
            unit: "",
          };
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

  // ====== [재료추가 모달 로직] ======
  const openAddModal = () => {
    setAddModalOpen(true);
    setCatSelect("");
    setIngSelect("");
    setShowCatInput(false);
    setShowIngInput(false);
    setCatInput("");
    setIngInput("");
    setUnitInput("");
    setErrorMsg("");
  };
  const closeAddModal = () => {
    setAddModalOpen(false);
    setCatSelect("");
    setIngSelect("");
    setShowCatInput(false);
    setShowIngInput(false);
    setCatInput("");
    setIngInput("");
    setUnitInput("");
    setErrorMsg("");
  };

  // 카테고리 직접 추가
  const handleAddCategory = async () => {
    if (!token) return;

    try {
      if (!catInput) return setErrorMsg("카테고리명을 입력하세요");
      const res = await myAxios(token).post("/hq/inventory/category-add", {
        name: catInput,
      });
      setCatSelect(String(res.data.id)); // 추가된 카테고리로 선택
      setShowCatInput(false);
      setCatInput("");
      setErrorMsg("");
      // 카테고리 목록 새로고침
      myAxios(token)
        .get("/hq/inventory/categories")
        .then((res) => setCategories(res.data.categories || []));
    } catch (e) {
      setErrorMsg("카테고리 등록 실패 (중복/서버오류)");
    }
  };

  // 재료 직접 추가
  const handleAddIngredient = async () => {
    if (!token) return;

    try {
      if (!ingInput || !unitInput || !catSelect)
        return setErrorMsg("재료명, 단위, 카테고리를 모두 입력하세요");
      const res = await myAxios(token).post("/hq/inventory/ingredient-add", {
        name: ingInput,
        categoryId: Number(catSelect),
        unit: unitInput,
        available: true,
      });
      setIngSelect(String(res.data.id));
      setShowIngInput(false);
      setIngInput("");
      setUnitInput("");
      setErrorMsg("");
      // 재료 목록 새로고침
      myAxios(token)
        .get("/hq/inventory/ingredients")
        .then((res) => setIngredients(res.data.ingredients || []));
    } catch (e) {
      console.error("재고 조회 실패", e);
      setData([]);
    }
  };

  // ----- 신규 등록 (직접입력 포함) -----
  const saveNewItems = async () => {
    try {
      for (let idx = 0; idx < newItems.length; idx++) {
        let row = newItems[idx];
        let categoryId = categories.find((c) => c.name === row.category)?.id;
        if (row.category === "__custom__") {
          const res = await myAxios(token).post("/hq/inventory/category-add", {
            name: row.category,
          });
          categoryId = res.data.id;
        }
        let ingredientId = Number(row.ingredientId);
        let unit = row.unit;
        if (row.ingredientId === "__custom__") {
          const res = await myAxios(token).post(
            "/hq/inventory/ingredient-add",
            {
              name: row.name,
              categoryId,
              unit: row.unit,
            }
          );
          ingredientId = res.data.id;
          unit = row.unit;
        }
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
      setNewItems([
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
      // 목록 새로고침
      myAxios(token)
        .get("/hq/inventory/categories")
        .then((res) => setCategories(res.data.categories || []));
      myAxios(token)
        .get("/hq/inventory/ingredients")
        .then((res) => setIngredients(res.data.ingredients || []));
      fetchInventory(pageInfo.curPage);
    } catch (e) {
      alert("등록 실패했습니다.");
    }
  };

  // 페이징 이동
  const movePage = (p) => {
    if (p < 1 || p > pageInfo.allPage) return;
    setPageInfo((pi) => ({ ...pi, curPage: p }));
  };

  // 기간 버튼
  const setPeriod = (type) => {
    const today = new Date().toISOString().slice(0, 10);
    let sd = "",
      ed = "";
    switch (type) {
      case "today":
        sd = today;
        ed = today;
        break;
      case "week":
        sd = new Date(
          new Date().setDate(new Date().getDate() - 6)
        )
          .toISOString()
          .slice(0, 10);
        ed = today;
        break;
      case "month":
        sd = new Date(
          new Date().setMonth(new Date().getMonth() - 1)
        )
          .toISOString()
          .slice(0, 10);
        ed = today;
        break;
      default:
        sd = "";
        ed = "";
    }
    setStartDate(sd);
    setEndDate(ed);
    fetchInventory(1, sd, ed, sortOption, keyword);
  };

  // 검색
  const onSearchClick = () =>
    fetchInventory(1, startDate, endDate, sortOption, keyword);

  // 정렬 변경
  const onSortChange = (e) => {
    setSortOption(e.target.value);
    setPageInfo((pi) => ({ ...pi, curPage: 1 }));
  };

  // 페이징 배열 생성
  const { startPage, endPage, curPage, allPage } = pageInfo;
  const pages = Array.from(
    { length: endPage - startPage + 1 },
    (_, i) => startPage + i
  );

  return (
    <div className={styles.container}>
      <HqInventorySidebar />
      <div className={styles.content}>
        <div className={styles.innerContainer}>
          <h2 className={styles.title}>재고 목록</h2>

        {/* 필터 */}
        <div className={styles.filters}>
          <div className={styles.row}>
            <label>대상</label>
            <select
              name="scope"
              value={filters.scope}
              onChange={onFilterChange}
            >
              <option value="all">전체</option>
              <option value="hq">본사</option>
              <option value="store">지점</option>
            </select>
            {filters.scope === "store" && (
              <>
                <label>지점</label>
                <select
                  name="store"
                  value={filters.store}
                  onChange={onFilterChange}
                >
                  <option value="all">전체지점</option>
                  {stores
                    .filter((s) => s.id !== 1)
                    .map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                </select>
              </>
            )}
            <label>분류</label>
            <select
              name="category"
              value={filters.category}
              onChange={onFilterChange}
            >
              <option value="all">전체</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
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
          <div className={styles.actions}>
            <button className={styles.add} onClick={openAddModal}>
              재료추가
            </button>
            {!isEditMode && !isAddMode && (
              <>
                <button
                  className={styles.add}
                  onClick={() => setIsAddMode(true)}
                >
                  추가입력
                </button>
                <button
                  className={styles.edit}
                  onClick={() => setIsEditMode(true)}
                >
                  수정입력
                </button>
              </>
            )}
            {isAddMode && (
              <>
                <button className={styles.save} onClick={saveNewItems}>
                  등록하기
                </button>
                <button
                  className={styles.cancel}
                  onClick={() => setIsAddMode(false)}
                >
                  취소
                </button>
                <button className={styles.addRow} onClick={addRow}>
                  행추가
                </button>
              </>
            )}
            {isEditMode && (
              <>
                <button className={styles.save} onClick={saveEdit}>
                  저장하기
                </button>
                <button
                  className={styles.cancel}
                  onClick={() => setIsEditMode(false)}
                >
                  취소
                </button>
              </>
            )}
          </div>
        </div>
        {/* --- 재료추가 모달 --- */}
        {addModalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalBox}>
              <h3 style={{ textAlign: "center" }}>재료</h3>
              {/* 카테고리 영역 */}
              <div className={styles.row}>
                <label style={{ flex: "0 0 60px" }}>카테고리</label>
                <select
                  value={catSelect}
                  onChange={(e) => setCatSelect(e.target.value)}
                >
                  <option value="">카테고리 선택</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                <button
                  className={styles.btnSmall}
                  onClick={() => setShowCatInput((v) => !v)}
                >
                  {showCatInput ? "취소" : "추가"}
                </button>
                {showCatInput && (
                  <>
                    <input
                      type="text"
                      placeholder="새 카테고리명"
                      value={catInput}
                      onChange={(e) => setCatInput(e.target.value)}
                      className={styles.editable}
                    />
                    <button className={styles.save} onClick={handleAddCategory}>
                      추가
                    </button>
                  </>
                )}
              </div>
              {/* 재료 영역 */}
              <div className={styles.row}>
                <label style={{ flex: "0 0 60px" }}>재료명</label>
                <select
                  value={ingSelect}
                  onChange={(e) => setIngSelect(e.target.value)}
                >
                  <option value="">재료 선택</option>
                  {ingredients
                    .filter((i) => String(i.categoryId) === String(catSelect))
                    .map((i) => (
                      <option key={i.id} value={i.id}>
                        {i.name} ({i.unit})
                      </option>
                    ))}
                </select>
                <button
                  className={styles.btnSmall}
                  onClick={() => setShowIngInput((v) => !v)}
                >
                  {showIngInput ? "취소" : "추가"}
                </button>
                {showIngInput && (
                  <>
                    <input
                      type="text"
                      placeholder="재료명"
                      value={ingInput}
                      onChange={(e) => setIngInput(e.target.value)}
                      className={styles.editable}
                    />
                    <input
                      type="text"
                      placeholder="단위 (ex. g, ml)"
                      value={unitInput}
                      onChange={(e) => setUnitInput(e.target.value)}
                      className={styles.editable}
                    />
                    <button
                      className={styles.save}
                      onClick={handleAddIngredient}
                    >
                      추가
                    </button>
                  </>
                )}
              </div>
              {errorMsg && (
                <div
                  style={{
                    color: "crimson",
                    fontSize: 13,
                    margin: "12px 0 0 2px",
                  }}
                >
                  {errorMsg}
                </div>
              )}
              <select
                className={styles.selectCategory}
                value={category}
                onChange={onFilterChange(setCategory)}
              >
                <option value="all">전체 분류</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
              <input
                type="text"
                className={styles.inputSearch}
                placeholder="재료명 검색"
                value={keyword}
                onChange={(e) => setKeyword(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && onSearchClick()}
              />
              <button
                type="button"
                className={styles.btnSearch}
                onClick={onSearchClick}
              >
                검색
              </button>
              <button
                type="button"
                className={styles.btnNew}
                onClick={() => setAddModalOpen(true)}
              >
                재고추가
              </button>
              <select
                className={styles.selectSort}
                value={sortOption}
                onChange={onSortChange}
              >
                <option value="default">이름순</option>
                <option value="receivedAsc">입고일 오름</option>
                <option value="receivedDesc">입고일 내림</option>
              </select>
            </div>
          </div>

        {/* --- 신규 추가입력폼 --- */}
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
                  <td>
                    <select
                      value={row.category}
                      onChange={(e) =>
                        onNewItemChange(idx, "category", e.target.value)
                      }
                    >
                      <option value="">선택</option>
                      {categories.map((c) => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                      {/* <option value="__custom__">직접입력</option> */}
                    </select>
                  </td>
                  <td>
                    <select
                      value={row.ingredientId}
                      onChange={(e) =>
                        onNewItemChange(idx, "ingredientId", e.target.value)
                      }
                    >
                      <option value="">선택</option>
                      {ingredients
                        .filter((ing) =>
                          row.category === "__custom__"
                            ? true
                            : ing.categoryId ===
                              categories.find((c) => c.name === row.category)
                                ?.id
                        )
                        .map((ing) => (
                          <option key={ing.id} value={ing.id}>
                            {ing.name}
                          </option>
                        ))}
                      {/* <option value="__custom__">직접입력</option> */}
                    </select>
                  </td>
                  <td>
                    <input
                      type="text"
                      value={row.unit}
                      disabled={row.ingredientId !== "__custom__"}
                      className={styles.editable}
                      onChange={(e) =>
                        onNewItemChange(idx, "unit", e.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.unitCost}
                      onChange={(e) =>
                        onNewItemChange(idx, "unitCost", e.target.value)
                      }
                      className={styles.editable}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.quantity}
                      onChange={(e) =>
                        onNewItemChange(idx, "quantity", e.target.value)
                      }
                      className={styles.editable}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.minimumOrderUnit}
                      onChange={(e) =>
                        onNewItemChange(idx, "minimumOrderUnit", e.target.value)
                      }
                      className={styles.editable}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={row.expiredDate}
                      onChange={(e) =>
                        onNewItemChange(idx, "expiredDate", e.target.value)
                      }
                      className={styles.editable}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={row.receivedDate}
                      onChange={(e) =>
                        onNewItemChange(idx, "receivedDate", e.target.value)
                      }
                      className={styles.editable}
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
                <td colSpan={10} className={styles.noData}>
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              inventory.map((r, i) => {
                const isLowStock = r.quantity < r.minimumOrderUnit;
                return (
                  <tr
                    key={r.id}
                    className={isLowStock ? styles.lowStockRow : ""}
                  >
                    <td>{r.store}</td>
                    <td>{r.name}</td>
                    <td>{r.category}</td>
                    <td>{r.unit}</td>
                    <td>
                      <input type="number" value={r.unitCost} disabled={true} />
                    </td>
                    <td>
                      {isEditMode ? (
                        <input
                          type="number"
                          value={r.quantity}
                          onChange={(e) =>
                            onInvChange(i, "quantity", e.target.value)
                          }
                        />
                      ) : (
                        <input type="number" value={r.quantity} disabled />
                      )}
                    </td>
                    <td>
                      <input
                        type="number"
                        value={r.minimumOrderUnit}
                        disabled={true}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={r.minquantity ?? 0}
                        disabled={true}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={
                          r.expiredDate ? r.expiredDate.substring(0, 10) : ""
                        }
                        disabled={true}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={
                          r.receivedDate ? r.receivedDate.substring(0, 10) : ""
                        }
                        disabled={true}
                      />
                    </td>
                  </tr>
                ) : (
                  data.map((r) => {
                    const low = r.quantity < r.minimumOrderUnit;
                    return (
                      <tr key={r.id} className={low ? styles.trLow : ""}>
                        <td className={styles.tdStore}>{r.store}</td>
                        <td className={styles.tdCategory}>{r.category}</td>
                        <td className={styles.tdName}>{r.name}</td>
                        <td className={styles.tdUnit}>{r.unit}</td>
                        <td className={styles.tdCost}>{r.unitCost}</td>
                        <td className={styles.tdQty}>
                          {editRow === r.id ? (
                            <input
                              type="number"
                              className={styles.inputQty}
                              value={r.quantity}
                              onChange={(e) =>
                                setData((d) =>
                                  d.map((x) =>
                                    x.id === r.id
                                      ? { ...x, quantity: Number(e.target.value) }
                                      : x
                                  )
                                )
                              }
                            />
                          ) : (
                            r.quantity
                          )}
                        </td>
                        <td className={styles.tdMin}>{r.minimumOrderUnit}</td>
                        <td className={styles.tdStoreMin}>{r.minquantity}</td>
                        <td className={styles.tdReceived}>{r.received}</td>
                        <td className={styles.tdEdit}>
                          {editRow !== r.id ? (
                            <button
                              type="button"
                              className={styles.btnEdit}
                              onClick={() => setEditRow(r.id)}
                            >
                              수정
                            </button>
                          ) : (
                            <>
                              <button
                                type="button"
                                className={styles.btnSave}
                                onClick={async () => {
                                  try {
                                    await myAxios(token).post("/hq/inventory/update", {
                                      id: r.id,
                                      quantity: r.quantity,
                                      minimumOrderUnit: r.minimumOrderUnit,
                                      unitCost: r.unitCost,
                                      expiredDate: r.expired || new Date().toISOString().slice(0,10),
                                      receivedDate: r.received || new Date().toISOString().slice(0,10),
                                    });
                                    setEditRow(null);
                                    fetchInventory(curPage);
                                  } catch (e) {
                                    console.error(e);
                                    alert("저장 실패");
                                  }
                                }}
                              >
                                저장
                              </button>
                              <button
                                type="button"
                                className={styles.btnCancel}
                                onClick={() => setEditRow(null)}
                              >
                                취소
                              </button>
                            </>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

        {/* --- 페이징 --- */}
        <div className={styles.pagination}>
          <button
            onClick={() => fetchInventory(pageInfo.curPage - 1)}
            disabled={pageInfo.curPage === 1}
          >
            &lt;
          </button>
          {pageNums.map((p) => (
            <button
              type="button"
              className={styles.btnPageFirst}
              onClick={() => movePage(1)}
              disabled={curPage === 1}
            >
              &lt;&lt;
            </button>
            <button
              type="button"
              className={styles.btnPagePrev}
              onClick={() => movePage(curPage - 1)}
              disabled={curPage === 1}
            >
              &lt;
            </button>
            {pages.map((p) => (
              <button
                key={p}
                type="button"
                className={p === curPage ? styles.btnPageActive : styles.btnPage}
                onClick={() => movePage(p)}
              >
                {p}
              </button>
            ))}
            <button
              type="button"
              className={styles.btnPageNext}
              onClick={() => movePage(curPage + 1)}
              disabled={curPage === allPage}
            >
              &gt;
            </button>
            <button
              type="button"
              className={styles.btnPageLast}
              onClick={() => movePage(allPage)}
              disabled={curPage === allPage}
            >
              &gt;&gt;
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
