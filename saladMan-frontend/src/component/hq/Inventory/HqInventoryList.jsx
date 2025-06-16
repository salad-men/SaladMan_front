// HqInventoryList.jsx
import React, { useState, useEffect } from "react";
import { atom, useAtom } from "jotai";
import HqInventorySidebar from "./HqInventorySidebar";
import { myAxios } from "../../../config";
import styles from "./HqInventoryList.module.css";

// atoms
const pageInfoAtom = atom({ curPage: 1, allPage: 1, startPage: 1, endPage: 1 });
const inventoryAtom = atom([]);
const filtersAtom = atom({ store: "all", category: "all", name: "", page: 1 });
const categoriesAtom = atom([]);
const storesAtom = atom([]);

export default function HqInventoryList() {
  const [inventory, setInventory] = useAtom(inventoryAtom);
  const [filters, setFilters] = useAtom(filtersAtom);
  const [pageInfo, setPageInfo] = useAtom(pageInfoAtom);
  const [categories, setCategories] = useAtom(categoriesAtom);
  const [stores, setStores] = useAtom(storesAtom);

  const [pageNums, setPageNums] = useState([]);

  // 서버에서 카테고리와 지점 목록 불러오기
  useEffect(() => {
    myAxios().get("/hq/inventory/categories")
      .then(res => setCategories(res.data.categories))
      .catch(err => console.error("카테고리 조회 실패", err));

    myAxios().get("/hq/inventory/stores")
      .then(res => setStores(res.data.stores))
      .catch(err => console.error("지점 조회 실패", err));
  }, []);

  // 재고 목록 조회 (페이징 + 필터)
  const fetchInventory = (page = 1) => {
    const param = { ...filters, page };
    myAxios().post("/hq/inventory/list", param)
      .then(res => {
        setInventory(res.data.inventoryList);
        const pi = res.data.pageInfo;
        setPageInfo(pi);
        setPageNums(Array.from({ length: pi.endPage - pi.startPage + 1 }, (_, i) => pi.startPage + i));
      })
      .catch(err => console.error("재고 목록 조회 실패", err));
  };

  // 페이지 로드시 목록 호출
  useEffect(() => {
    fetchInventory(1);
  }, []);

  // 필터값 변경 핸들러
  const onFilterChange = e => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  };

  // 검색 버튼 클릭
  const search = () => fetchInventory(1);

  return (
    <div className={styles.container}>
      <HqInventorySidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>전체 재고 조회</h2>

        <div className={styles.filters}>
          <div className={styles.row}>
            <label>지점</label>
            <select name="store" value={filters.store} onChange={onFilterChange}>
              <option value="all">전체지점</option>
              {stores.map(s => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>

            <label>분류</label>
            <select name="category" value={filters.category} onChange={onFilterChange}>
              <option value="all">전체</option>
              {categories.map(c => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>

            <input
              type="text"
              name="name"
              value={filters.name}
              onChange={onFilterChange}
              placeholder="재료명 검색"
            />
            <button className={styles.search} onClick={search}>검색</button>
          </div>
        </div>

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
            </tr>
          </thead>
          <tbody>
            {inventory.length ? (
              inventory.map((r, i) => (
                <tr key={i}>
                  <td>{r.store}</td>
                  <td>{r.name}</td>
                  <td>{r.category}</td>
                  <td>{r.unit}</td>
                  <td>{r.price}</td>
                  <td>{r.stock}</td>
                  <td>{r.min}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={7} className={styles.noData}>데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <button
            onClick={() => fetchInventory(pageInfo.curPage - 1)}
            disabled={pageInfo.curPage === 1}
          >
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
