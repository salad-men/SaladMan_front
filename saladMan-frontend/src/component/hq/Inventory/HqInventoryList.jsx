import React, { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import HqInventorySidebar from "./HqInventorySidebar";
import { myAxios } from "/src/config";
import styles from "./HqInventoryList.module.css";
import { accessTokenAtom } from "/src/atoms";

export default function HqInventoryList() {
  const token = useAtomValue(accessTokenAtom);

  // 필터 상태
  const [scope, setScope] = useState("hq");
  const [store, setStore] = useState("all");
  const [category, setCategory] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOption, setSortOption] = useState("default");

  // 옵션 리스트
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [data, setData] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    curPage: 1, startPage: 1, endPage: 1, allPage: 1,
  });

  // 추가 모달
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [newItems, setNewItems] = useState([{
    categoryId: "", ingredientId: "", unit: "", unitCost: 0, quantity: 0, minimumOrderUnit: 0, expiredDate: "", receivedDate: "",
  }]);

  // 수정모드/폼
  const [editRow, setEditRow] = useState(null);
  const [editForm, setEditForm] = useState({});

  // 옵션 불러오기
  useEffect(() => {
    if (!token) return;
    const ax = myAxios(token);
    Promise.all([
      ax.get("/hq/inventory/stores"),
      ax.get("/hq/inventory/categories"),
      ax.get("/hq/inventory/ingredients"),
    ]).then(([r1, r2, r3]) => {
      setStores(r1.data.stores.filter((s) => s.id !== 1));
      setCategories(r2.data.categories || []);
      setIngredients(r3.data.ingredients || []);
    }).catch(console.error);
  }, [token]);

  // 데이터 조회
  const fetchInventory = async (
    page = 1, sd = startDate, ed = endDate, sort = sortOption, kw = keyword
  ) => {
    if (!token) return;
    try {
      const ax = myAxios(token);
      const res = await ax.post("/hq/inventory/list", {
        scope,
        store: scope === "store" && store !== "all" ? Number(store) : "all",
        category: category === "all" ? "all" : Number(category),
        keyword: kw,
        startDate: sd || null,
        endDate: ed || null,
        sortOption: sort,
        page,
      });
      const { hqInventory = [], storeInventory = [], pageInfo: pi } = res.data;
      const list = scope === "hq" ? hqInventory
        : scope === "store" ? storeInventory
        : [...hqInventory, ...storeInventory];
      setData(list.map(x => ({
        id: x.id,
        store: x.storeName || "본사",
        categoryId: x.categoryId, category: x.categoryName || "",
        ingredientId: x.ingredientId, name: x.ingredientName || "",
        unit: x.unit || "",
        unitCost: x.unitCost || 0,
        quantity: Number(x.quantity) || 0,
        minimumOrderUnit: Number(x.minimumOrderUnit) || 0,
        minquantity: Number(x.minquantity) || 0,
        receivedDate: x.receivedDate?.slice(0, 10) || "",
        expiredDate: x.expiredDate?.slice(0, 10) || "",
      })));
      setPageInfo(pi);
    } catch (e) {
      setData([]);
      console.error("재고 조회 실패", e);
    }
  };

  useEffect(() => {
    if (!token) return;
    fetchInventory(pageInfo.curPage);
    // eslint-disable-next-line
  }, [token, scope, store, category, keyword, startDate, endDate, sortOption, pageInfo.curPage]);

  // 필터 변경
  const onFilterChange = (setter) => (e) => {
    setter(e.target.value);
    setPageInfo((pi) => ({ ...pi, curPage: 1 }));
  };

  // 기간버튼
  const setPeriod = (type) => {
    const today = new Date().toISOString().slice(0, 10);
    let sd = "", ed = "";
    if (type === "today") sd = ed = today;
    else if (type === "week") {
      sd = new Date(new Date().setDate(new Date().getDate() - 6)).toISOString().slice(0, 10); ed = today;
    } else if (type === "month") {
      sd = new Date(new Date().setMonth(new Date().getMonth() - 1)).toISOString().slice(0, 10); ed = today;
    }
    setStartDate(sd); setEndDate(ed); fetchInventory(1, sd, ed, sortOption, keyword);
  };

  // 테이블 인라인 수정 핸들러
  const handleEditChange = (key, value) => {
    setEditForm((prev) => ({ ...prev, [key]: value }));
    // 재료명 변경 시 단위 자동
    if (key === "ingredientId") {
      const ing = ingredients.find(i => i.id === Number(value));
      setEditForm((prev) => ({ ...prev, unit: ing?.unit || "" }));
    }
    if (key === "categoryId") setEditForm((prev) => ({ ...prev, ingredientId: "", unit: "" }));
  };

  // 페이징
  const { startPage, endPage, curPage, allPage } = pageInfo;
  const pages = Array.from({ length: endPage - startPage + 1 }, (_, i) => startPage + i);

  return (
    <div className={styles.container}>
      <HqInventorySidebar />
      <div className={styles.content}>
        <div className={styles.innerContainer}>
          <h2 className={styles.title}>재고 관리</h2>

          {/* 필터 영역 */}
          <div className={styles.filterArea}>
            <div className={styles.rowDate}>
              <label className={styles.labelDate}>기간</label>
              <input type="date" className={styles.inputDate}
                value={startDate} onChange={e => setStartDate(e.target.value)} />
              <span className={styles.labelSep}>~</span>
              <input type="date" className={styles.inputDate}
                value={endDate} onChange={e => setEndDate(e.target.value)} />
              {["all", "today", "week", "month"].map((type) => (
                <button key={type} type="button" className={styles.periodBtn}
                  onClick={() => setPeriod(type)}>
                  {type === "all" ? "전체" : type === "today" ? "오늘" : type === "week" ? "한 주" : "한 달"}
                </button>
              ))}
            </div>
            <div className={styles.rowFilter}>
              <select className={styles.selectScope} value={scope} onChange={onFilterChange(setScope)}>
                <option value="hq">본사</option>
                <option value="store">지점</option>
                <option value="all">전체</option>
              </select>
              {scope === "store" && (
                <select className={styles.selectStore} value={store} onChange={onFilterChange(setStore)}>
                  <option value="all">전체지점</option>
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              )}
              <select className={styles.selectCategory} value={category} onChange={onFilterChange(setCategory)}>
                <option value="all">전체 분류</option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input type="text" className={styles.inputSearch}
                placeholder="재료명 검색" value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && fetchInventory(1)} />
              <button type="button" className={styles.btnSearch} onClick={() => fetchInventory(1)}>
                검색
              </button>
              <button type="button" className={styles.btnNew} onClick={() => setAddModalOpen(true)}>
                재고추가
              </button>
              <select className={styles.selectSort} value={sortOption} onChange={onFilterChange(setSortOption)}>
                <option value="default">이름순</option>
                <option value="receivedAsc">입고일 오름</option>
                <option value="receivedDesc">입고일 내림</option>
              </select>
            </div>
          </div>

          {/* 메인 테이블 */}
          <div className={styles.tableArea}>
            <table className={styles.mainTable}>
              <thead>
                <tr>
                  <th>지점</th><th>분류</th><th>재료명</th><th>단위</th>
                  <th>단가</th><th>수량</th><th>최소주문단위</th>
                  <th>최소수량</th><th>입고일</th><th>유통기한</th><th>수정</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr><td colSpan={11}>데이터가 없습니다.</td></tr>
                ) : data.map(r => {
                  const low = r.quantity < r.minimumOrderUnit;
                  const isEdit = editRow === r.id;
                  return (
                    <tr key={r.id} className={low ? styles.trLow : ""}>
                      <td>{r.store}</td>
<td>
  {isEdit ? (
    <select
      className={styles.editCategory}
      value={editForm.categoryId !== undefined
        ? String(editForm.categoryId)
        : (r.categoryId !== undefined ? String(r.categoryId) : "")}
      onChange={e => handleEditChange("categoryId", Number(e.target.value))}
    >
      {categories.map(c => (
        <option key={c.id} value={String(c.id)}>{c.name}</option>
      ))}
    </select>
  ) : r.category}
</td>
<td>
  {isEdit ? (
    <select
      className={styles.editIngredient}
      value={editForm.ingredientId !== undefined
        ? String(editForm.ingredientId)
        : (r.ingredientId !== undefined ? String(r.ingredientId) : "")}
      onChange={e => handleEditChange("ingredientId", Number(e.target.value))}
    >
      {ingredients
        .filter(i =>
          (editForm.categoryId !== undefined
            ? editForm.categoryId
            : r.categoryId
          ) === i.categoryId
        )
        .map(i => (
          <option key={i.id} value={String(i.id)}>{i.name}</option>
        ))}
    </select>
  ) : r.name}
</td>
<td>
  {isEdit ? (
    <input
      type="text"
      className={styles.editUnit}
      value={editForm.unit ?? r.unit}
      disabled
    />
  ) : r.unit}
</td>
<td>
  {isEdit ? (
    <input
      type="number"
      className={styles.editUnitCost}
      value={editForm.unitCost ?? r.unitCost}
      onChange={e => handleEditChange("unitCost", Number(e.target.value))}
    />
  ) : r.unitCost}
</td>
<td>
  {isEdit ? (
    <input
      type="number"
      className={styles.editQuantity}
      value={editForm.quantity ?? r.quantity}
      onChange={e => handleEditChange("quantity", Number(e.target.value))}
    />
  ) : r.quantity}
</td>
<td>
  {isEdit ? (
    <input
      type="number"
      className={styles.editMinOrderUnit}
      value={editForm.minimumOrderUnit ?? r.minimumOrderUnit}
      onChange={e => handleEditChange("minimumOrderUnit", Number(e.target.value))}
    />
  ) : r.minimumOrderUnit}
</td>

                      <td>{r.minquantity}</td>
                      <td>
                        {isEdit ? (
                          <input type="date" value={editForm.receivedDate ?? r.receivedDate}
                            onChange={e => handleEditChange("receivedDate", e.target.value)} />
                        ) : r.receivedDate}
                      </td>
                      <td>
                        {isEdit ? (
                          <input type="date" value={editForm.expiredDate ?? r.expiredDate}
                            onChange={e => handleEditChange("expiredDate", e.target.value)} />
                        ) : r.expiredDate}
                      </td>
                      <td className={styles.tdEdit}>
                        {isEdit ? (
                          <div className={styles.editBtns}>
                            <button type="button" className={styles.btnSave}
                            
                              onClick={async () => {
  try {
    const payload = {
      id: r.id,
      categoryId: editForm.categoryId ?? r.categoryId,
      ingredientId: editForm.ingredientId ?? r.ingredientId,
      unit: editForm.unit ?? r.unit,
      unitCost: editForm.unitCost ?? r.unitCost,
      quantity: editForm.quantity ?? r.quantity,
      minimumOrderUnit: editForm.minimumOrderUnit ?? r.minimumOrderUnit,
      expiredDate: editForm.expiredDate ?? r.expiredDate,
      receivedDate: editForm.receivedDate ?? r.receivedDate,
    };
    await myAxios(token).post("/hq/inventory/update", payload);
    console.log("UPDATE PAYLOAD", payload);

    setEditRow(null); setEditForm({});
    fetchInventory(curPage);
  } catch (e) {
    alert("저장 실패"); console.error(e);
  }
}}
>저장</button>
                            <button type="button" className={styles.btnCancel}
                              onClick={() => { setEditRow(null); setEditForm({}); }}>
                              취소
                            </button>
                          </div>
                        ) : (
                          <button type="button" className={styles.btnEdit}
                            onClick={() => {
                              setEditRow(r.id);
                              console.log(r);
                              setEditForm({
                                categoryId: r.categoryId,
                                ingredientId: r.ingredientId,
                                unit: r.unit, unitCost: r.unitCost,
                                quantity: r.quantity, minimumOrderUnit: r.minimumOrderUnit,
                                receivedDate: r.receivedDate, expiredDate: r.expiredDate,
                              });
                            }}>
                            수정
                          </button>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

           {/* 신규 입력 모달 */}
          {addModalOpen && (
            <div className={styles.modalBg} onClick={() => setAddModalOpen(false)}>
              <div
                className={styles.modalBox}
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className={styles.modalHeader}>재고추가</h3>
                <table className={styles.modalTable}>
                  <thead>
                    <tr>
                      <th>분류</th>
                      <th>재료명</th>
                      <th>단위</th>
                      <th>단가</th>
                      <th>수량</th>
                      <th>최소주문단위</th>
                      <th>유통기한</th>
                      <th>입고일</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {newItems.map((row, idx) => (
                      <tr key={idx} className={styles.modalTr}>
                        <td>
                          <select
                            value={row.category}
                            onChange={(e) =>
                              setNewItems((ni) =>
                                ni.map((r, i) =>
                                  i === idx ? { ...r, category: e.target.value } : r
                                )
                              )
                            }
                          >
                            <option value="">선택</option>
                            {categories.map((c) => (
                              <option key={c.id} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        <td>
                          <select
                            value={row.ingredientId}
                            onChange={(e) =>
                              setNewItems((ni) =>
                                ni.map((r, i) =>
                                  i === idx
                                    ? { ...r, ingredientId: e.target.value }
                                    : r
                                )
                              )
                            }
                          >
                            <option value="">선택</option>
                            {ingredients
                              .filter((i) => {
                                const cid = categories.find(
                                  (c) => c.name === row.category
                                )?.id;
                                return i.categoryId === cid;
                              })
                              .map((i) => (
                                <option key={i.id} value={i.id}>
                                  {i.name}
                                </option>
                              ))}
                          </select>
                        </td>
                        <td>
                          <input type="text" value={row.unit} disabled />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.unitCost}
                            onChange={(e) =>
                              setNewItems((ni) =>
                                ni.map((r, i) =>
                                  i === idx
                                    ? { ...r, unitCost: Number(e.target.value) }
                                    : r
                                )
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.quantity}
                            onChange={(e) =>
                              setNewItems((ni) =>
                                ni.map((r, i) =>
                                  i === idx
                                    ? { ...r, quantity: Number(e.target.value) }
                                    : r
                                )
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="number"
                            value={row.minimumOrderUnit}
                            onChange={(e) =>
                              setNewItems((ni) =>
                                ni.map((r, i) =>
                                  i === idx
                                    ? {
                                        ...r,
                                        minimumOrderUnit: Number(e.target.value),
                                      }
                                    : r
                                )
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            value={row.expiredDate}
                            onChange={(e) =>
                              setNewItems((ni) =>
                                ni.map((r, i) =>
                                  i === idx
                                    ? { ...r, expiredDate: e.target.value }
                                    : r
                                )
                              )
                            }
                          />
                        </td>
                        <td>
                          <input
                            type="date"
                            value={row.receivedDate}
                            onChange={(e) =>
                              setNewItems((ni) =>
                                ni.map((r, i) =>
                                  i === idx
                                    ? { ...r, receivedDate: e.target.value }
                                    : r
                                )
                              )
                            }
                          />
                        </td>
                        <td>
                          <button
                            type="button"
                            className={styles.btnRemoveRow}
                            onClick={() =>
                              setNewItems((ni) =>
                                ni.filter((_, i) => i !== idx)
                              )
                            }
                          >
                            X
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.btnAddRow}
                    onClick={() =>
                      setNewItems((ni) => [
                        ...ni,
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
                      ])
                    }
                  >
                    행추가
                  </button>
                  <button
                    type="button"
                    className={styles.btnModalSave}
                    onClick={async () => {
                      try {
                        const ax = myAxios(token);
                        for (const row of newItems) {
                          await ax.post("/hq/inventory/add", {
                            storeId: 1,
                            categoryId:
                              categories.find((c) => c.name === row.category)
                                ?.id || 0,
                            ingredientId: Number(row.ingredientId) || 0,
                            unitCost: row.unitCost,
                            quantity: row.quantity,
                            minimumOrderUnit: row.minimumOrderUnit,
                            expiredDate: row.expiredDate || new Date().toISOString().slice(0,10),
                            receivedDate: row.receivedDate || new Date().toISOString().slice(0,10),
                          });
                        }
                        setAddModalOpen(false);
                        fetchInventory(curPage);
                      } catch (e) {
                        console.error(e);
                        alert("등록 중 오류");
                      }
                    }}
                  >
                    저장
                  </button>
                  <button
                    type="button"
                    className={styles.btnModalCancel}
                    onClick={() => setAddModalOpen(false)}
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}    

          

          {/* 페이징 */}
          <div className={styles.paginationArea}>
            <button type="button" className={styles.btnPageFirst}
              onClick={() => fetchInventory(1)} disabled={curPage === 1}>&lt;&lt;</button>
            <button type="button" className={styles.btnPagePrev}
              onClick={() => fetchInventory(curPage - 1)} disabled={curPage === 1}>&lt;</button>
            {pages.map(p => (
              <button key={p} type="button"
                className={p === curPage ? styles.btnPageActive : styles.btnPage}
                onClick={() => fetchInventory(p)}>{p}</button>
            ))}
            <button type="button" className={styles.btnPageNext}
              onClick={() => fetchInventory(curPage + 1)} disabled={curPage === allPage}>&gt;</button>
            <button type="button" className={styles.btnPageLast}
              onClick={() => fetchInventory(allPage)} disabled={curPage === allPage}>&gt;&gt;</button>
          </div>
        </div>
      </div>
    </div>
  );
}
