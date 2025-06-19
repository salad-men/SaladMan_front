import React, { useState, useEffect } from "react";
import { useAtomValue} from "jotai";
import HqInventorySidebar from "./HqInventorySidebar";
import { myAxios } from "../../../config";
import styles from "./HqInventoryList.module.css";
import { tokenAtom } from "/src/atoms";

export default function HqInventoryList() {
  const token = useAtomValue(tokenAtom);

  const [inventory, setInventory] = useState([]);
  const [filters, setFilters] = useState({ scope: "hq", store: "all", category: "all", name: "" });
  const [pageInfo, setPageInfo] = useState({ curPage: 1, allPage: 1, startPage: 1, endPage: 1 });
  const [categories, setCategories] = useState([]);
  const [stores, setStores] = useState([]);
  const [ingredients, setIngredients] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [isAddMode, setIsAddMode] = useState(false);
  const [newItems, setNewItems] = useState([{
    store: "본사",
    category: "",
    ingredientId: "",
    name: "",
    unit: "",
    unitCost: 0,
    quantity: 0,
    minimumOrderUnit: 0,
    expiredDate: "",
    receivedDate: ""
  }]);
  const [pageNums, setPageNums] = useState([]);

  useEffect(() => {
    myAxios(token).get("/hq/inventory/categories").then(res => setCategories(res.data.categories));
    myAxios(token).get("/hq/inventory/stores").then(res => setStores(res.data.stores));
    myAxios(token).get("/hq/inventory/ingredients").then(res => setIngredients(res.data.ingredients));
  }, [token]);

  useEffect(() => { fetchInventory(1); }, [token, filters.scope, filters.store]);

  const fetchInventory = (page = 1) => {
    const param = {
       ...filters, 
       page,
       store: filters.store !== "all" ? Number(filters.store) : "all",};
    
       myAxios(token).post("/hq/inventory/list", param).then(res => {
      const hqList = res.data.hqInventory || [];
      const storeList = res.data.storeInventory || [];
      const list = filters.scope === "hq" ? hqList : filters.scope === "store" ? storeList : [...hqList, ...storeList];

      const flatList = list.map(x => ({
        id: x.id,
        store: x.storeName || "",  
        name: x.ingredientName || "",
        unit: x.unit || "",
        category: x.categoryName || "",
        unitCost: x.unitCost,
        quantity: x.quantity,
        minimumOrderUnit: x.minimumOrderUnit,
        minquantity: x.minquantity ?? 0,
        expiredDate: x.expiredDate,
        receivedDate: x.receivedDate || ""
      }));

      setInventory(flatList);
      const pi = res.data.pageInfo;
      setPageInfo(pi);
      setPageNums(Array.from({ length: pi.endPage - pi.startPage + 1 }, (_, i) => pi.startPage + i));
    }).catch(e => {
      console.error("재고 목록 조회 실패", e);
      setInventory([]);
    });
  };

    // 검색 버튼 클릭 시 강제로 fetchInventory 실행
  const handleSearchClick = () => {
    fetchInventory(1);
  };

  const onFilterChange = e => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  };

  const onInvChange = (idx, field, value) => {
    setInventory(items => items.map((item, i) => {
      if (i !== idx) return item;
      if (["unitCost", "quantity", "minimumOrderUnit"].includes(field)) {
        return { ...item, [field]: Number(value) };
      }
      if (field === "expiredDate" || field === "receivedDate") {
        return { ...item, [field]: value };
      }
      return { ...item, [field]: value };
    }));
  };

  const addRow = () => {
    setNewItems(items => items.concat({
      store: "본사",
      category: "",
      ingredientId: "",
      name: "",
      unit: "",
      unitCost: 0,
      quantity: 0,
      minimumOrderUnit: 0,
      expiredDate: "",
      receivedDate: ""
    }));
  };

  const onNewItemChange = (idx, field, value) => {
    setNewItems(items => items.map((row, i) => {
      if (i !== idx) return row;
      if (field === "category") {
        return { ...row, category: value, ingredientId: "", name: "", unit: "" };
      }
      if (field === "ingredientId") {
        const ing = ingredients.find(x => x.id === Number(value));
        return {
          ...row,
          ingredientId: value,
          name: ing?.name || "",
          unit: ing?.unit || ""
        };
      }
      if (["unitCost", "quantity", "minimumOrderUnit"].includes(field)) {
        return { ...row, [field]: Number(value) };
      }
      if (field === "expiredDate" || field === "receivedDate") {
        return { ...row, [field]: value };
      }
      return { ...row, [field]: value };
    }));
  };

  const saveNewItems = () => {
    Promise.all(newItems.map(row =>
      myAxios(token).post("/hq/inventory/add", {
        store: "본사",
        categoryId: categories.find(c => c.name === row.category)?.id,
        ingredientId: Number(row.ingredientId),
        name: row.name,
        unit: row.unit,
        unitCost: row.unitCost,
        quantity: row.quantity,
        minimumOrderUnit: row.minimumOrderUnit,
        expiredDate: row.expiredDate,
        receivedDate: row.receivedDate
      })
    )).then(() => {
      alert("등록 완료!");
      setIsAddMode(false);
      setNewItems([{
        store: "본사", category: "", ingredientId: "", name: "", unit: "",
        unitCost: 0, quantity: 0, minimumOrderUnit: 0, expiredDate: "", receivedDate: ""
      }]);
      fetchInventory(pageInfo.curPage);
    }).catch(e => {
      console.error("등록 실패", e);
      alert("등록 실패했습니다.");
    });
  };

  const saveEdit = () => {
    Promise.all(inventory.map(item =>
      myAxios(token).post("/hq/inventory/update", {
        id: item.id,
        quantity: item.quantity,
        minimumOrderUnit: item.minimumOrderUnit,
        unitCost: item.unitCost,
        expiredDate: item.expiredDate || null,
        receivedDate: item.receivedDate || null
      })
    )).then(() => {
      alert("저장되었습니다.");
      setIsEditMode(false);
      fetchInventory(pageInfo.curPage);
    }).catch(e => {
      console.error("수정 실패", e);
      alert("수정 실패했습니다.");
    });
  };

  return (
    <div className={styles.container}>
      <HqInventorySidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>재고 조회</h2>

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
                    {stores
                      .filter(s => s.id !== 1)
                      .map(s => (
                      <option key={s.id} value={s.id}>
                        {s.name}
                      </option>
                    ))}
                  </select>
              </>
            )}

            <label>분류</label>
            <select name="category" value={filters.category} onChange={onFilterChange}>
              <option value="all">전체</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>

            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={onFilterChange}
              placeholder="재료명 검색"
            />
            <button className={styles.search} onClick={() => handleSearchClick}>
              검색
            </button>
          </div>
        </div>

        <div className={styles.actions}>
          {!isEditMode && !isAddMode && (
            <>
              <button className={styles.add} onClick={() => setIsAddMode(true)}>
                추가입력
              </button>
              <button className={styles.edit} onClick={() => setIsEditMode(true)}>
                수정입력
              </button>
            </>
          )}
          {isAddMode && (
            <>
              <button className={styles.save} onClick={saveNewItems}>
                등록하기
              </button>
              <button className={styles.cancel} onClick={() => setIsAddMode(false)}>
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
                등록하기
              </button>
              <button className={styles.cancel} onClick={() => setIsEditMode(false)}>
                취소
              </button>
            </>
          )}
        </div>

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
              {newItems.map((row, i) => (
                <tr key={i}>
                  <td>본사</td>
                  <td>
                    <select
                      value={row.category}
                      onChange={e => onNewItemChange(i, "category", e.target.value)}
                    >
                      <option value="">선택</option>
                      {categories.map(c => (
                        <option key={c.id} value={c.name}>
                          {c.name}
                        </option>
                      ))}
                    </select>
                  </td>
                  <td>
                    <select
                      value={row.ingredientId}
                      onChange={e => onNewItemChange(i, "ingredientId", e.target.value)}
                    >
                      <option value="">선택</option>
                      {ingredients
                        .filter(ing => ing.categoryId === categories.find(c => c.name === row.category)?.id)
                        .map(ing => (
                          <option key={ing.id} value={ing.id}>
                            {ing.name}
                          </option>
                        ))}
                    </select>
                  </td>
                  <td>
                    <input value={row.unit} disabled />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.unitCost}
                      onChange={e => onNewItemChange(i, "unitCost", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.quantity}
                      onChange={e => onNewItemChange(i, "quantity", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.minimumOrderUnit}
                      onChange={e => onNewItemChange(i, "minimumOrderUnit", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={row.expiredDate}
                      onChange={e => onNewItemChange(i, "expiredDate", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="date"
                      value={row.receivedDate}
                      onChange={e => onNewItemChange(i, "receivedDate", e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

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
            {inventory.length > 0
              ? inventory.map((r, i) => (
                  <tr key={i}>
                    <td>{r.store}</td>
                    <td>{r.name}</td>
                    <td>{r.category}</td>
                    <td>{r.unit}</td>
                    <td>
                      {isEditMode ? (
                        <input
                          type="number"
                          value={r.unitCost}
                          onChange={e => onInvChange(i, "unitCost", e.target.value)}
                          className={styles.editable}
                        />
                      ) : (
                        r.unitCost
                      )}
                    </td>
                    <td>
                      {isEditMode ? (
                        <input
                          type="number"
                          value={r.quantity}
                          onChange={e => onInvChange(i, "quantity", e.target.value)}
                          className={styles.editable}
                        />
                      ) : (
                        r.quantity
                      )}
                    </td>
                    <td>
                      {isEditMode ? (
                        <input
                          type="number"
                          value={r.minimumOrderUnit}
                          onChange={e => onInvChange(i, "minimumOrderUnit", e.target.value)}
                          className={styles.editable}
                        />
                      ) : (
                        r.minimumOrderUnit
                      )}
                    </td>
                    <td>{r.minquantity ?? 0}</td>
                    <td>
                      {isEditMode ? (
                        <input
                          type="date"
                          value={r.expiredDate || ""}
                          onChange={e => onInvChange(i, "expiredDate", e.target.value)}
                          className={styles.editable}
                        />
                      ) : (
                        r.expiredDate || ""
                      )}
                    </td>
                    <td>
                      {isEditMode ? (
                        <input
                          type="date"
                          value={r.receivedDate || ""}
                          onChange={e => onInvChange(i, "receivedDate", e.target.value)}
                          className={styles.editable}
                        />
                      ) : (
                        r.receivedDate || ""
                      )}
                    </td>
                  </tr>
                ))
              : (
                <tr>
                  <td colSpan={10} className={styles.noData}>
                    데이터가 없습니다.
                  </td>
                </tr>
              )}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <button onClick={() => fetchInventory(pageInfo.curPage - 1)} disabled={pageInfo.curPage === 1}>
            &lt;
          </button>
          {pageNums.map(p => (
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
    </div>
  );
}
