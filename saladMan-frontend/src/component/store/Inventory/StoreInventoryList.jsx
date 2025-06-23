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

  // 날짜를 YYYY-MM-DD 형식으로 포맷팅
  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return dateStr.length > 10 ? dateStr.slice(0, 10) : dateStr;
  };

  // 분류 가져오기
  useEffect(() => {
    myAxios(token)
      .get("/store/inventory/categories")
      .then((res) => setCategories(res.data.categories))
      .catch(() => setCategories([]));
  }, [token]);

  // 재고 리스트 조회 (자기 매장만)
  useEffect(() => {
    fetchInventory(1);
  }, [token, filters.category, filters.name, user.id]);

  const fetchInventory = (page = 1) => {
    if (!user.id) return; // 매장 아이디 없으면 실행 안 함

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
        console.log(res.data);
        const flatList = list.map((x) => ({
          id: x.id,
          store: x.storeName || "",
          name: x.ingredientName || "",
          unit: x.unit || "",
          category: x.categoryName || "",
          unitCost: x.unitCost,
          quantity: Number(x.quantity),
          minimumOrderUnit: Number(x.minimumOrderUnit),
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

  const saveEdit = async () => {
    try {
      for (const item of inventory) {
        await myAxios(token).post("/store/inventory/update", {
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
              <th>유통기한</th>
              <th>입고날짜</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 ? (
              <tr>
                <td colSpan={9}>데이터가 없습니다.</td>
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
                        disabled={!isEditMode}
                        onChange={(e) => onInvChange(i, "unitCost", e.target.value)}
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
                        disabled={!isEditMode}
                        onChange={(e) => onInvChange(i, "minimumOrderUnit", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={r.expiredDate ? r.expiredDate.substring(0, 10) : ""}
                        disabled={!isEditMode}
                        onChange={(e) => onInvChange(i, "expiredDate", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="date"
                        value={r.receivedDate ? r.receivedDate.substring(0, 10) : ""}
                        disabled={!isEditMode}
                        onChange={(e) => onInvChange(i, "receivedDate", e.target.value)}
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
