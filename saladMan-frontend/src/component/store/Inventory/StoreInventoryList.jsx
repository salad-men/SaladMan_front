// StoreInventoryList.jsx
import React, { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import StoreInventorySidebar from "./StoreInventorySidebar";
import { myAxios } from "../../../config";
import styles from "./StoreInventoryList.module.css";
import { userAtom, accessTokenAtom } from "/src/atoms";

export default function StoreInventoryList() {
  const token = useAtomValue(accessTokenAtom);
  const user = useAtomValue(userAtom);

  const [inventory, setInventory] = useState([]);
  const [categories, setCategories] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [filters, setFilters] = useState({
    category: "all",
    keyword: "",
    startDate: "",
    endDate: "",
    sortOption: "default",
  });

  const [pageInfo, setPageInfo] = useState({
    curPage: 1,
    allPage: 1,
    startPage: 1,
    endPage: 1,
  });
  const [pageNums, setPageNums] = useState([]);

  // 인라인 수정 상태
  const [editRow, setEditRow] = useState(null);
  const [editForm, setEditForm] = useState({});

  // 모달 상태(기존 코드와 동일)
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

  // 카테고리, 재료 불러오기
  useEffect(() => {
    if (!token) return;
    const ax = myAxios(token);
    ax.get("/store/inventory/categories")
      .then((res) => setCategories(res.data.categories))
      .catch(() => setCategories([]));
    ax.get("/store/inventory/ingredients")
      .then((res) => setIngredients(res.data.ingredients))
      .catch(() => setIngredients([]));
  }, [token]);

  // 재고 목록 조회
  const fetchInventory = (page = 1) => {
    if (!token || !user.id) return;
    myAxios(token)
      .post("/store/inventory/list", {
        storeId: user.id,
        page,
        category: filters.category === "all" ? "all" : Number(filters.category),
        keyword: filters.keyword,
        startDate: filters.startDate || null,
        endDate: filters.endDate || null,
        sortOption: filters.sortOption,
      })
      .then((res) => {
        console.log(res.data);
        const list = res.data.storeInventory || [];
        const flatList = list.map((x) => ({
          id: x.id,
          store: x.storeName || "",
          name: x.ingredientName || "",
          unit: x.unit || "",
          category: x.categoryName || "",
          categoryId: x.categoryId ? Number(x.categoryId) : "", 
          ingredientId: x.ingredientId ? Number(x.ingredientId) : "", 
          unitCost: x.unitCost,
          quantity: Number(x.quantity),
          minimumOrderUnit: Number(x.minimumOrderUnit),
          minQuantity: Number(x.minQuantity),
          expiredDate: x.expiredDate,
          receivedDate: x.receivedDate || "",
        }));
        setInventory(flatList);

        const pi = res.data.pageInfo;
        setPageInfo(pi);
        const nums = [];
        for (let i = pi.startPage; i <= pi.endPage; i++) {
          nums.push(i);
        }
        setPageNums(nums);
      })
      .catch(() => setInventory([]));
  };

  // 필터 변경
  const onFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
    setPageInfo((pi) => ({ ...pi, curPage: 1 }));
  };

  // 기간 버튼 클릭
  const setPeriod = (type) => {
    const today = new Date().toISOString().slice(0, 10);
    let sd = "", ed = "";
    if (type === "today") {
      sd = ed = today;
    } else if (type === "week") {
      const weekAgo = new Date();
      weekAgo.setDate(weekAgo.getDate() - 6);
      sd = weekAgo.toISOString().slice(0, 10);
      ed = today;
    } else if (type === "month") {
      const monthAgo = new Date();
      monthAgo.setMonth(monthAgo.getMonth() - 1);
      sd = monthAgo.toISOString().slice(0, 10);
      ed = today;
    } else {
      sd = "";
      ed = "";
    }
    setFilters((prev) => ({
      ...prev,
      startDate: sd,
      endDate: ed,
    }));
    fetchInventory(1);
  };

  // 검색
  const onSearchClick = () => fetchInventory(1);

  // 정렬 변경
  const onSortChange = (e) => {
    setFilters((prev) => ({ ...prev, sortOption: e.target.value }));
    setPageInfo((pi) => ({ ...pi, curPage: 1 }));
  };

  // 행별 인라인 수정 핸들러
  const handleEditChange = (key, value) => {
    // categoryId를 바꾸면 재료명/단위 자동 초기화
    if (key === "categoryId") {
      setEditForm((prev) => ({
        ...prev,
        categoryId: value,
        ingredientId: "",
        unit: "",
      }));
    } else if (key === "ingredientId") {
      const ing = ingredients.find((i) => i.id === Number(value));
      setEditForm((prev) => ({
        ...prev,
        ingredientId: value,
        unit: ing?.unit || "",
      }));
    } else {
      setEditForm((prev) => ({
        ...prev,
        [key]: value,
      }));
    }
  };

  // 저장
  const onRowSave = async (row) => {
  if (!token) return;
  // 모든 값이 정확히 들어가도록 가드
  const payload = {
    id: row.id,
    categoryId: Number(editForm.categoryId ?? row.categoryId),
    ingredientId: Number(editForm.ingredientId ?? row.ingredientId),
    unitCost: Number(editForm.unitCost ?? row.unitCost),
    quantity: Number(editForm.quantity ?? row.quantity),
    minimumOrderUnit: Number(editForm.minimumOrderUnit ?? row.minimumOrderUnit),
    expiredDate: (editForm.expiredDate ?? row.expiredDate) || null,
    receivedDate: (editForm.receivedDate ?? row.receivedDate) || null,
  };
  // 빈값/문자열 오류 방지
  Object.keys(payload).forEach(key => {
    if (typeof payload[key] === 'string' && payload[key].trim() === '') {
      payload[key] = null;
    }
  });
  console.log("저장요청", payload);
  try {
    await myAxios(token).post("/store/inventory/update", payload);
    setEditRow(null);
    setEditForm({});
    fetchInventory(pageInfo.curPage);
  } catch (e) {
    alert("저장 실패: " + (e.response?.data?.error || e.message));
  }
};


  useEffect(() => {
    if (!token || !user.id) return;
    fetchInventory(pageInfo.curPage);
    // eslint-disable-next-line
  }, [token, filters.category, filters.keyword, filters.startDate, filters.endDate, filters.sortOption, pageInfo.curPage, user.id]);

  // 페이지 이동
  const movePage = (p) => {
    if (p < 1 || p > pageInfo.allPage) return;
    fetchInventory(p);
  };

  // 페이지 파싱
  const { curPage, allPage } = pageInfo;

  return (
    <div className={styles.container}>
      <StoreInventorySidebar />
      <div className={styles.content}>
        <div className={styles.innerContainer}>
          <h2 className={styles.title}>재고 관리</h2>

          {/* 필터 영역 */}
          <div className={styles.filterArea}>
            <div className={styles.rowDate}>
              <input
                type="date"
                className={styles.inputDate}
                name="startDate"
                value={filters.startDate}
                onChange={onFilterChange}
              />
              <span className={styles.labelSep}>~</span>
              <input
                type="date"
                className={styles.inputDate}
                name="endDate"
                value={filters.endDate}
                onChange={onFilterChange}
              />
              {["all", "today", "week", "month"].map((type) => (
                <button
                  key={type}
                  type="button"
                  className={styles.periodBtn}
                  onClick={() => setPeriod(type)}
                >
                  {type === "all"
                    ? "전체"
                    : type === "today"
                    ? "오늘"
                    : type === "week"
                    ? "한 주"
                    : "한 달"}
                </button>
              ))}
            </div>

            <div className={styles.rowFilter}>
              <select
                className={styles.selectCategory}
                name="category"
                value={filters.category}
                onChange={onFilterChange}
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
                name="keyword"
                placeholder="재료명 검색"
                value={filters.keyword}
                onChange={onFilterChange}
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
                value={filters.sortOption}
                onChange={onSortChange}
              >
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
                  <th>분류</th>
                  <th>재료명</th>
                  <th>단위</th>
                  <th>단가</th>
                  <th>수량</th>
                  <th>최소주문단위</th>
                  <th>최소수량</th>
                  <th>유통기한</th>
                  <th>입고일</th>
                  <th>수정</th>
                </tr>
              </thead>
              <tbody>
                {inventory.length === 0 ? (
                  <tr>
                    <td colSpan={11}>데이터가 없습니다.</td>
                  </tr>
                ) : (
                  inventory.map((r, idx) => {
                    const isEdit = editRow === r.id;
                    const isLowStock = r.quantity < r.minimumOrderUnit;
                    // 카테고리/재료명 dropdown 옵션 구성
                    const catValue =
                      isEdit && editForm.categoryId !== undefined
                        ? editForm.categoryId
                        : r.categoryId;
                    const ingValue =
                      isEdit && editForm.ingredientId !== undefined
                        ? editForm.ingredientId
                        : r.ingredientId;
                    return (
                      <tr key={r.id} className={isLowStock ? styles.trLow : ""}>
                        {/* <td>{r.store}</td> */}
                        <td>
                          {isEdit ? (

                            <select
                            className={styles.editSelect}
                            value={editForm.categoryId !== undefined ? Number(editForm.categoryId) : Number(r.categoryId)}
                            onChange={e => handleEditChange("categoryId", Number(e.target.value))}
                          >
                            {categories.map(c => (
                              <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                          </select>

                          ) : (
                            r.category
                          )}
                        </td>
                        <td>
                          {isEdit ? (

                            <select
                              className={styles.editSelect}
                              value={editForm.ingredientId !== undefined ? Number(editForm.ingredientId) : Number(r.ingredientId)}
                              onChange={e => handleEditChange("ingredientId", Number(e.target.value))}
                            >
                              <option value="">선택</option>
                              {ingredients
                                .filter(i => i.categoryId === (editForm.categoryId !== undefined ? Number(editForm.categoryId) : Number(r.categoryId)))
                                .map(i => (
                                  <option key={i.id} value={i.id}>{i.name}</option>
                                ))}
                            </select>

                          ) : (
                            r.name
                          )}
                        </td>
                        <td>
                          {isEdit ? (
                            <input
                              type="text"
                              className={styles.editUnit}
                              value={
                                editForm.unit !== undefined
                                  ? editForm.unit
                                  : r.unit
                              }
                              disabled
                            />
                          ) : (
                            r.unit
                          )}
                        </td>
                        <td>
                          {isEdit ? (
                            <input
                              type="number"
                              className={styles.editInput}
                              value={editForm.unitCost ?? r.unitCost}
                              onChange={e =>
                                handleEditChange("unitCost", e.target.value)
                              }
                            />
                          ) : (
                            r.unitCost
                          )}
                        </td>
                        <td>
                          {isEdit ? (
                            <input
                              type="number"
                              className={styles.editInput}
                              value={editForm.quantity ?? r.quantity}
                              onChange={e =>
                                handleEditChange("quantity", e.target.value)
                              }
                            />
                          ) : (
                            r.quantity
                          )}
                        </td>
                        <td>
                          {isEdit ? (
                            <input
                              type="number"
                              className={styles.editInput}
                              value={editForm.minimumOrderUnit ?? r.minimumOrderUnit}
                              onChange={e =>
                                handleEditChange("minimumOrderUnit", e.target.value)
                              }
                            />
                          ) : (
                            r.minimumOrderUnit
                          )}
                        </td>
                        <td>{r.minQuantity}</td>
                        <td>
                          {isEdit ? (
                            <input
                              type="date"
                              className={styles.editInput}
                              value={editForm.expiredDate ?? (r.expiredDate ? r.expiredDate.substring(0, 10) : "")}
                              onChange={e =>
                                handleEditChange("expiredDate", e.target.value)
                              }
                            />
                          ) : (
                            r.expiredDate ? r.expiredDate.substring(0, 10) : ""
                          )}
                        </td>
                        <td>
                          {isEdit ? (
                            <input
                              type="date"
                              className={styles.editInput}
                              value={editForm.receivedDate ?? (r.receivedDate ? r.receivedDate.substring(0, 10) : "")}
                              onChange={e =>
                                handleEditChange("receivedDate", e.target.value)
                              }
                            />
                          ) : (
                            r.receivedDate ? r.receivedDate.substring(0, 10) : ""
                          )}
                        </td>
                        <td>
                          {isEdit ? (
                            <>
                              <button
                                type="button"
                                className={styles.btnSave}
                                onClick={() => onRowSave(r)}
                              >
                                저장
                              </button>
                              <button
                                type="button"
                                className={styles.btnCancel}
                                onClick={() => {
                                  setEditRow(null);
                                  setEditForm({});
                                }}
                              >
                                취소
                              </button>
                            </>
                          ) : (
                            <button
                              type="button"
                              className={styles.btnEdit}
                              onClick={() => {
                                setEditRow(r.id);
                                setEditForm({
                                  categoryId: r.categoryId ? Number(r.categoryId) : "",
                                  ingredientId: r.ingredientId ? Number(r.ingredientId) : "",
                                  unit: r.unit,
                                  unitCost: r.unitCost,
                                  quantity: r.quantity,
                                  minimumOrderUnit: r.minimumOrderUnit,
                                  expiredDate: r.expiredDate ? r.expiredDate.substring(0, 10) : "",
                                  receivedDate: r.receivedDate ? r.receivedDate.substring(0, 10) : "",
                                });
                              }}
                            >
                              수정
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>

{/* 신규 입력 모달 */}
{addModalOpen && (
  <div className={styles.modalBg} onClick={() => setAddModalOpen(false)}>
    <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
      <h3 className={styles.modalHeader}>재고 추가</h3>
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
          {newItems.map((row, idx) => {
            // 현재 선택된 카테고리 id
            const categoryId = categories.find(c => c.id === Number(row.category) || c.name === row.category)?.id;
            // 현재 재료 id에 해당하는 단위 가져오기
            const unit = ingredients.find(i => i.id === Number(row.ingredientId))?.unit || row.unit || "";
            return (
              <tr key={idx} className={styles.modalTr}>
                <td>
                  <select
                    value={row.category}
                    onChange={e =>
                      setNewItems(ni =>
                        ni.map((r, i) =>
                          i === idx
                            ? { ...r, category: e.target.value, ingredientId: "", unit: "" }
                            : r
                        )
                      )
                    }
                  >
                    <option value="">선택</option>
                    {categories.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </td>
                <td>
                  <select
                    value={row.ingredientId}
                    onChange={e => {
                      const selected = ingredients.find(i => i.id === Number(e.target.value));
                      setNewItems(ni =>
                        ni.map((r, i) =>
                          i === idx
                            ? { ...r, ingredientId: e.target.value, unit: selected?.unit || "" }
                            : r
                        )
                      );
                    }}
                  >
                    <option value="">선택</option>
                    {ingredients
                      .filter(i => i.categoryId === Number(row.category))
                      .map(i => (
                        <option key={i.id} value={i.id}>{i.name}</option>
                      ))}
                  </select>
                </td>
                <td>
                  <input type="text" value={unit} disabled />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.unitCost}
                    onChange={e =>
                      setNewItems(ni =>
                        ni.map((r, i) =>
                          i === idx ? { ...r, unitCost: Number(e.target.value) } : r
                        )
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.quantity}
                    onChange={e =>
                      setNewItems(ni =>
                        ni.map((r, i) =>
                          i === idx ? { ...r, quantity: Number(e.target.value) } : r
                        )
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.minimumOrderUnit}
                    onChange={e =>
                      setNewItems(ni =>
                        ni.map((r, i) =>
                          i === idx ? { ...r, minimumOrderUnit: Number(e.target.value) } : r
                        )
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={row.expiredDate}
                    onChange={e =>
                      setNewItems(ni =>
                        ni.map((r, i) =>
                          i === idx ? { ...r, expiredDate: e.target.value } : r
                        )
                      )
                    }
                  />
                </td>
                <td>
                  <input
                    type="date"
                    value={row.receivedDate}
                    onChange={e =>
                      setNewItems(ni =>
                        ni.map((r, i) =>
                          i === idx ? { ...r, receivedDate: e.target.value } : r
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
                      setNewItems(ni => ni.filter((_, i) => i !== idx))
                    }
                  >
                    X
                  </button>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      <div className={styles.modalFooter}>
        <button
          type="button"
          className={styles.btnAddRow}
          onClick={() =>
            setNewItems(ni => [
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
              if (!user?.id) return;
              const ax = myAxios(token);
              for (const row of newItems) {
                await ax.post("/store/inventory/add", {
                  storeId: user.id,
                  categoryId: Number(row.category),
                  ingredientId: Number(row.ingredientId),
                  unitCost: row.unitCost,
                  quantity: row.quantity,
                  minimumOrderUnit: row.minimumOrderUnit,
                  expiredDate: row.expiredDate || null,
                  receivedDate: row.receivedDate || null,
                });
              }
              setAddModalOpen(false);
              setNewItems([
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
              fetchInventory(1);
            } catch (e) {
              console.error(e);
              alert("등록 중 오류가 발생했습니다.");
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
            {pageNums.map((p) => (
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
