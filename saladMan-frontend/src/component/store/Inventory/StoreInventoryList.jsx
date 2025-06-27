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
  const [filters, setFilters] = useState({
    category: "all",
    name: "",
  });
  const [categories, setCategories] = useState([]);
  const [isEditMode, setIsEditMode] = useState(false);
  const [pageInfo, setPageInfo] = useState({
    curPage: 1,
    allPage: 1,
    startPage: 1,
    endPage: 1,
  });
  const [pageNums, setPageNums] = useState([]);

  // 날짜 포맷
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return dateStr.length > 10 ? dateStr.slice(0, 10) : dateStr;
  };

  // 분류 가져오기
  useEffect(() => {
    if (!token) return;
    myAxios(token)
      .get("/store/inventory/categories")
      .then((res) => setCategories(res.data.categories))
      .catch(() => setCategories([]));
  }, [token]);

  // 재고 리스트 조회 (자기 매장만)
  useEffect(() => {
    if (!token) return;
    fetchInventory(1);
  }, [token, filters.category, filters.name, user.id]);

  const fetchInventory = (page = 1) => {
    if (!token) return;
    if (!user.id) return;

    const param = {
      storeId: user.id,
      page,
      category: filters.category === "all" ? "all" : Number(filters.category),
      name: filters.name,
    };

    myAxios(token)
      .post("/store/inventory/list", param)
      .then((res) => {
        const list = res.data.storeInventory || [];
        console.log(res.data.minQuantity);
        const flatList = list.map((x) => ({
          id: x.id,
          store: x.storeName || "",
          name: x.ingredientName || "",
          unit: x.unit || "",
          category: x.categoryName || "",
          unitCost: x.unitCost,
          quantity: Number(x.quantity),
          minimumOrderUnit: Number(x.minimumOrderUnit),
          minQuantity: Number(x.minQuantity), // 추가
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
      .catch(() => {
        setInventory([]);
      });
  };

  const handleSearchClick = () => {
    fetchInventory(1);
  };

  const onFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({
      ...f,
      [name]: name === "category" && value !== "all" ? Number(value) : value,
    }));
  };

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

    const saveEdit = () => {
      if (!token) return;
    inventory.forEach(item => {
      myAxios(token).post("/store/inventory/update", {
        id: item.id,
        quantity: item.quantity,
        minimumOrderUnit: item.minimumOrderUnit,
        unitCost: item.unitCost,
        expiredDate: item.expiredDate || null,
        receivedDate: item.receivedDate || null,
      });
    });
    alert("저장되었습니다.");
    setIsEditMode(false);
    fetchInventory(pageInfo.curPage);
  };

  return (
    <div className={styles.container}>
      <StoreInventorySidebar />

      <div className={styles.content}>
        <h2 className={styles.title}>{user.name} 재고 조회</h2>

        {/* 필터 영역 */}
        <div className={styles.filters}>
          <label>
            분류
            <select name="category" value={filters.category} onChange={onFilterChange}>
              <option value="all">전체</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <input
            type="text"
            name="name"
            value={filters.name}
            placeholder="재료명 검색"
            onChange={onFilterChange}
          />

          <button className={styles.search} onClick={handleSearchClick}>
            검색
          </button>
        </div>

        {/* 수정 버튼 */}
        <div className={styles.actions}>
          {!isEditMode ? (
            <button className={styles.edit} onClick={() => setIsEditMode(true)}>
              수정입력
            </button>
          ) : (
            <>
              <button className={styles.save} onClick={saveEdit}>
                저장하기
              </button>
              <button className={styles.cancel} onClick={() => setIsEditMode(false)}>
                취소
              </button>
            </>
          )}
        </div>

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
              <th>최소주문단위</th>
              <th>최소보유량</th> 
              <th>유통기한</th>
              <th>입고날짜</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 ? (
              <tr>
                <td colSpan={10}>데이터가 없습니다.</td>
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
                      <input
                        type="number"
                        value={r.unitCost}
                        disabled={true}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={r.quantity}
                        disabled={!isEditMode}
                        onChange={(e) => onInvChange(i, "quantity", e.target.value)}
                      />
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
                        value={r.minQuantity ?? ""}
                        disabled={true}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={r.expiredDate ? r.expiredDate.substring(0, 10) : ""}
                        disabled={true}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={r.receivedDate ? r.receivedDate.substring(0, 10) : ""}
                        disabled={true}
                      />
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>

        {/* 페이징 */}
        <div className={styles.pagination}>
          <button
            onClick={() => fetchInventory(pageInfo.curPage - 1)}
            disabled={pageInfo.curPage === 1}
          >
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
    </div>
  );
}
