import React, { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import StoreInventorySidebar from "./StoreInventorySidebar";
import { myAxios } from "../../../config";
import styles from "./StoreInventoryList.module.css";
import { userAtom, accessTokenAtom } from "/src/atoms";

export default function StoreInventoryList() {
  const token = useAtomValue(accessTokenAtom);
  const user = useAtomValue(userAtom);

  // 상태 선언
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
  const [editRow, setEditRow] = useState(null);
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
        const list = res.data.storeInventory || [];
        const flatList = list.map((x) => ({
          id: x.id,
          store: x.storeName || "",
          name: x.ingredientName || "",
          unit: x.unit || "",
          category: x.categoryName || "",
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

  // 행별 인풋 수정
  const onInvChange = (idx, field, value) => {
    setInventory((items) =>
      items.map((item, i) =>
        i !== idx ? item : { ...item, [field]: ["unitCost", "quantity", "minimumOrderUnit"].includes(field) ? Number(value) : value }
      )
    );
  };

  // 저장
  const onRowSave = async (row, idx) => {
    if (!token) return;
    try {
      await myAxios(token).post("/store/inventory/update", {
        id: row.id,
        quantity: row.quantity,
        minimumOrderUnit: row.minimumOrderUnit,
        unitCost: row.unitCost,
        expiredDate: row.expiredDate || null,
        receivedDate: row.receivedDate || null,
      });
      setEditRow(null);
      fetchInventory(pageInfo.curPage);
    } catch (e) {
      alert("저장 실패");
    }
  };

  // 추가 모달 저장
  const onModalSave = async () => {
    try {
      const ax = myAxios(token);
      for (const row of newItems) {
        await ax.post("/store/inventory/add", {
          storeId: user.id,
          categoryId: categories.find((c) => c.name === row.category)?.id || 0,
          ingredientId: Number(row.ingredientId) || 0,
          unitCost: row.unitCost,
          quantity: row.quantity,
          minimumOrderUnit: row.minimumOrderUnit,
          expiredDate: row.expiredDate || new Date().toISOString().slice(0, 10),
          receivedDate: row.receivedDate || new Date().toISOString().slice(0, 10),
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
      fetchInventory(pageInfo.curPage);
    } catch (e) {
      alert("등록 중 오류");
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
          <h2 className={styles.title}> 재고 목록</h2>

          {/* 필터 영역 */}
          <div className={styles.filterArea}>
            <div className={styles.rowDate}>
              <label className={styles.labelDate}>기간</label>
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
                        {/* 분류 선택 */}
                        <td>
                          <select
                            value={row.category}
                            onChange={(e) => {
                              setNewItems((ni) =>
                                ni.map((r, i) =>
                                  i === idx
                                    ? { ...r, category: e.target.value, ingredientId: "", unit: "" }
                                    : r
                                )
                              );
                            }}
                          >
                            <option value="">선택</option>
                            {categories.map((c) => (
                              <option key={c.id} value={c.name}>
                                {c.name}
                              </option>
                            ))}
                          </select>
                        </td>
                        {/* 재료명 선택 */}
                        <td>
                          <select
                            value={row.ingredientId}
                            onChange={(e) => {
                              const ingId = e.target.value;
                              const ingredient = ingredients.find(i => String(i.id) === String(ingId));
                              setNewItems((ni) =>
                                ni.map((r, i) =>
                                  i === idx
                                    ? {
                                        ...r,
                                        ingredientId: ingId,
                                        unit: ingredient?.unit || "",
                                      }
                                    : r
                                )
                              );
                            }}
                          >
                            <option value="">선택</option>
                            {ingredients
                              .filter((i) => {
                                const cid = categories.find((c) => c.name === row.category)?.id;
                                return i.categoryId === cid;
                              })
                              .map((i) => (
                                <option key={i.id} value={i.id}>
                                  {i.name}
                                </option>
                              ))}
                          </select>
                        </td>
                        {/* 단위 (자동 입력/비활성화) */}
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
                              setNewItems((ni) => ni.filter((_, i) => i !== idx))
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
                    onClick={onModalSave}
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

          {/* 메인 테이블 */}
          <div className={styles.tableArea}>
            <table className={styles.mainTable}>
              <thead>
                <tr>
                  <th>지점</th>
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
                    const isLowStock = r.quantity < r.minimumOrderUnit;
                    return (
                      <tr
                        key={r.id}
                        className={isLowStock ? styles.trLow : ""}
                      >
                        <td>{r.store}</td>
                        <td>{r.category}</td>
                        <td>{r.name}</td>
                        <td>{r.unit}</td>
                        <td>
                          {editRow === r.id ? (
                            <input
                              type="number"
                              className={styles.inputQty}
                              value={r.unitCost}
                              onChange={(e) =>
                                onInvChange(idx, "unitCost", e.target.value)
                              }
                            />
                          ) : (
                            r.unitCost
                          )}
                        </td>
                        <td>
                          {editRow === r.id ? (
                            <input
                              type="number"
                              className={styles.inputQty}
                              value={r.quantity}
                              onChange={(e) =>
                                onInvChange(idx, "quantity", e.target.value)
                              }
                            />
                          ) : (
                            r.quantity
                          )}
                        </td>
                        <td>{r.minimumOrderUnit}</td>
                        <td>{r.minQuantity}</td>
                        <td>
                          {editRow === r.id ? (
                            <input
                              type="date"
                              className={styles.inputQty}
                              value={r.expiredDate ? r.expiredDate.substring(0, 10) : ""}
                              onChange={(e) =>
                                onInvChange(idx, "expiredDate", e.target.value)
                              }
                            />
                          ) : (
                            r.expiredDate ? r.expiredDate.substring(0, 10) : ""
                          )}
                        </td>
                        <td>
                          {editRow === r.id ? (
                            <input
                              type="date"
                              className={styles.inputQty}
                              value={r.receivedDate ? r.receivedDate.substring(0, 10) : ""}
                              onChange={(e) =>
                                onInvChange(idx, "receivedDate", e.target.value)
                              }
                            />
                          ) : (
                            r.receivedDate ? r.receivedDate.substring(0, 10) : ""
                          )}
                        </td>
                        <td>
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
                                onClick={() => onRowSave(r, idx)}
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
