import React, { useState, useEffect } from "react";
import { atom, useAtom } from "jotai";
import HqInventorySidebar from "./HqInventorySidebar";
import { myAxios } from "../../../config";
import styles from "./HqInventoryList.module.css";

// atoms
const pageInfoAtom    = atom({ curPage: 1, allPage: 1, startPage: 1, endPage: 1 });
const inventoryAtom   = atom([]);
const filtersAtom     = atom({ scope: "hq", store: "all", category: "all", name: "" });
const categoriesAtom  = atom([]);
const storesAtom      = atom([]);
const ingredientsAtom = atom([]);
const isEditModeAtom  = atom(false);
const isAddModeAtom   = atom(false);
const newItemsAtom    = atom([
  {
    store: "본사",
    category: "",
    ingredientId: "",
    name: "",
    unit: "",
    unitCost: 0,
    quantity: 0,
    minimumOrderUnit: 0,
    expiredQuantity: 0,
    expiredDate: ""
  }
]);

export default function HqInventoryList() {
  const [inventory, setInventory]     = useAtom(inventoryAtom);
  const [filters, setFilters]         = useAtom(filtersAtom);
  const [pageInfo, setPageInfo]       = useAtom(pageInfoAtom);
  const [categories, setCategories]   = useAtom(categoriesAtom);
  const [stores, setStores]           = useAtom(storesAtom);
  const [ingredients, setIngredients] = useAtom(ingredientsAtom);
  const [isEditMode, setIsEditMode]   = useAtom(isEditModeAtom);
  const [isAddMode, setIsAddMode]     = useAtom(isAddModeAtom);
  const [newItems, setNewItems]       = useAtom(newItemsAtom);
  const [pageNums, setPageNums]       = useState([]);

  // 초기 메타데이터 조회
  useEffect(() => {
    myAxios().get("/hq/inventory/categories").then(res => setCategories(res.data.categories));
    myAxios().get("/hq/inventory/stores").then(res => setStores(res.data.stores));
    myAxios().get("/hq/inventory/ingredients").then(res => setIngredients(res.data.ingredients));
  }, []);

  // 재고 목록 조회 (flat)
  const fetchInventory = (page = 1) => {
          

    const param = { ...filters, page };
    myAxios().post("/hq/inventory/list", param).then(res => {
            console.log("백엔드 응답 전체 데이터:", res.data);  // 여기서 전체 응답 데이터 확인

      const hqList = (res.data.hqInventory || []).map(x => ({ ...x, store: "본사" }));
      const storeList = res.data.storeInventory || [];
      const list = filters.scope === "hq"
        ? hqList
        : filters.scope === "store"
          ? storeList
          : [...hqList, ...storeList];

      // flat 구조로 재구성: ingredient, category 객체에서 필요한 필드 꺼내기
      const flatList = list.map(x => ({
        id: x.id,
        store: x.store,
        name: x.ingredientName || "",  // DTO에서 받은 이름
        unit: x.ingredient?.unit || "", // unit이 엔티티에서 필요하면 추가
        category: x.categoryName || "", // DTO에서 받은 분류명
        unitCost: x.unitCost,
        quantity: x.quantity,
        minimumOrderUnit: x.minimumOrderUnit,
        expiredQuantity: x.expiredQuantity,
        expiredDate: x.expiredDate
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

  useEffect(() => { fetchInventory(1); }, [filters.scope, filters.store]);

  const onFilterChange = e => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  };

  // 편집 모드에서 테이블 수정
  const onInvChange = (idx, field, value) => {
    setInventory(items =>
      items.map((item, i) => {
        if (i !== idx) return item;
        if (["unitCost", "quantity", "minimumOrderUnit", "expiredQuantity"].includes(field)) {
          return { ...item, [field]: Number(value) };
        }
        if (field === "expiredDate") {
          return { ...item, expiredDate: value };
        }
        return { ...item, [field]: value };
      })
    );
  };

  // 추가 행 추가
  const addRow = () => {
    setNewItems(items => items.concat({
      store: "본사",  // 본사 고정
      category: "",
      ingredientId: "",
      name: "",
      unit: "",
      unitCost: 0,
      quantity: 0,
      minimumOrderUnit: 0,
      expiredQuantity: 0,
      expiredDate: ""
    }));
  };

  // 추가 폼 내 입력값 변경
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
      if (["unitCost","quantity","minimumOrderUnit","expiredQuantity"].includes(field)) {
        return { ...row, [field]: Number(value) };
      }
      if (field === "expiredDate") {
        return { ...row, expiredDate: value };
      }
      return { ...row, [field]: value };
    }));
  };

  // 신규 등록 (본사 전용)
  const saveNewItems = () => {
    Promise.all(newItems.map(row =>
      myAxios().post("/hq/inventory/add", {
        store: "본사", // 본사 고정
        categoryId: categories.find(c => c.name === row.category)?.id,
        ingredientId: Number(row.ingredientId),
        name: row.name,
        unit: row.unit,
        unitCost: row.unitCost,
        quantity: row.quantity,
        minimumOrderUnit: row.minimumOrderUnit,
        expiredQuantity: row.expiredQuantity,
        expiredDate: row.expiredDate
      })
    )).then(() => {
      alert("등록 완료!");
      setIsAddMode(false);
      setNewItems([{
        store: "본사", category:"", ingredientId:"", name:"", unit:"",
        unitCost:0, quantity:0, minimumOrderUnit:0, expiredQuantity:0, expiredDate:""
      }]);
      fetchInventory(pageInfo.curPage);
    }).catch(e => {
      console.error("등록 실패", e);
      alert("등록 실패했습니다.");
    });
  };

  // 수정 저장
  const saveEdit = () => {
    Promise.all(inventory.map(item =>
      myAxios().post("/hq/inventory/update", {
        id: item.id,
        quantity: item.quantity,
        minimumOrderUnit: item.minimumOrderUnit,
        unitCost: item.unitCost,
        expiredQuantity: item.expiredQuantity ?? 0,
        expiredDate: item.expiredDate || null
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
                  {stores.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
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
            <button className={styles.search} onClick={() => fetchInventory(1)}>
              검색
            </button>
          </div>
        </div>

        {/* 액션 버튼 */}
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

        {/* 추가 입력 폼 */}
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
                <th>최소수량</th>
                <th>만료수량</th>
                <th>유통기한</th>
              </tr>
            </thead>
            <tbody>
              {newItems.map((row,i) => (
                <tr key={i}>
                  <td>
                    {/* 본사만 등록 가능하도록 select 제거하고 텍스트로 표시 */}
                    본사
                  </td>
                  <td>
                    <select value={row.category} onChange={e => onNewItemChange(i,"category",e.target.value)}>
                      <option value="">선택</option>
                      {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                    </select>
                  </td>
                  <td>
                    <select value={row.ingredientId} onChange={e => onNewItemChange(i,"ingredientId",e.target.value)}>
                      <option value="">선택</option>
                      {ingredients
                        .filter(ing => ing.categoryId === categories.find(c=>c.name===row.category)?.id)
                        .map(ing => <option key={ing.id} value={ing.id}>{ing.name}</option>)
                      }
                    </select>
                  </td>
                  <td><input value={row.unit} disabled /></td>
                  <td><input type="number" value={row.unitCost} onChange={e => onNewItemChange(i,"unitCost",e.target.value)} /></td>
                  <td><input type="number" value={row.quantity} onChange={e => onNewItemChange(i,"quantity",e.target.value)} /></td>
                  <td><input type="number" value={row.minimumOrderUnit} onChange={e => onNewItemChange(i,"minimumOrderUnit",e.target.value)} /></td>
                  <td><input type="number" value={row.expiredQuantity} onChange={e => onNewItemChange(i,"expiredQuantity",e.target.value)} /></td>
                  <td><input type="date" value={row.expiredDate} onChange={e => onNewItemChange(i,"expiredDate",e.target.value)} /></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {/* 재고 테이블 */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th>지점</th>
              <th>재료명</th>
              <th>분류</th>
              <th>단위</th>
              <th>단위가격</th>
              <th>재고량</th>
              <th>최소수량</th>
              <th>유통기한</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length > 0 ? inventory.map((r,i) => (
              <tr key={i}>
                <td>{r.store}</td>
                <td>{r.name}</td>
                <td>{r.category}</td>
                <td>{r.unit}</td>
                <td>
                  {isEditMode
                    ? <input
                        type="number"
                        value={r.unitCost}
                        onChange={e => onInvChange(i,"unitCost",e.target.value)}
                        className={styles.editable}
                      />
                    : r.unitCost}
                </td>
                <td>
                  {isEditMode
                    ? <input
                        type="number"
                        value={r.quantity}
                        onChange={e => onInvChange(i,"quantity",e.target.value)}
                        className={styles.editable}
                      />
                    : r.quantity}
                </td>
                <td>
                  {isEditMode
                    ? <input
                        type="number"
                        value={r.minimumOrderUnit}
                        onChange={e => onInvChange(i,"minimumOrderUnit",e.target.value)}
                        className={styles.editable}
                      />
                    : r.minimumOrderUnit}
                </td>
                <td>
                  {isEditMode
                    ? <input
                        type="date"
                        value={r.expiredDate}
                        onChange={e => onInvChange(i,"expiredDate",e.target.value)}
                        className={styles.editable}
                      />
                    : r.expiredDate || ""}
                </td>
              </tr>
            )) : (
              <tr>
                <td colSpan={8} className={styles.noData}>데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>

        {/* 페이징 */}
        <div className={styles.pagination}>
          <button onClick={() => fetchInventory(pageInfo.curPage - 1)} disabled={pageInfo.curPage === 1}>&lt;</button>
          {pageNums.map(p => (
            <button
              key={p}
              onClick={() => fetchInventory(p)}
              className={p === pageInfo.curPage ? styles.active : ""}
            >
              {p}
            </button>
          ))}
          <button onClick={() => fetchInventory(pageInfo.curPage + 1)} disabled={pageInfo.curPage >= pageInfo.allPage}>&gt;</button>
        </div>
      </div>
    </div>
  );
}
