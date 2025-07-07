import React, { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import StoreInventorySidebar from "./StoreInventorySidebar";
import { myAxios } from "../../../config";
import styles from "./StoreDisposalList.module.css";
import { userAtom, accessTokenAtom } from "/src/atoms";

export default function StoreDisposalList() {
  const token = useAtomValue(accessTokenAtom);
  const user = useAtomValue(userAtom);

  const [disposals, setDisposals] = useState([]);
  const [filters, setFilters] = useState({
    category: "all",
    name: "",
  });
  const [categories, setCategories] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    curPage: 1,
    allPage: 1,
    startPage: 1,
    endPage: 1,
  });
  const [pageNums, setPageNums] = useState([]);

  // 카테고리 목록
  useEffect(() => {
    if (!token) return;
    myAxios(token)
      .get("/store/inventory/categories")
      .then((res) => setCategories(res.data.categories || []))
      .catch(() => setCategories([]));
  }, [token]);

  // 폐기목록 조회
  useEffect(() => {
    if (!token) return;
    fetchDisposals(1);
  }, [token, user.id, filters.category, filters.name]);

  const fetchDisposals = (page = 1) => {
    if (!user.id) return;
    const param = {
      storeId: user.id,
      page,
      category: filters.category === "all" ? "all" : Number(filters.category),
      keyword: filters.name,
    };

    myAxios(token)
      .post("/store/inventory/disposal-list", param)
      .then((res) => {
        const list = res.data.disposals || [];
        setDisposals(list.map((x) => ({
          id: x.id,
          name: x.ingredientName,
          category: x.categoryName,
          unit: x.unit,
          quantity: x.quantity,
          requestedAt: x.requestedAt,
          processedAt: x.processedAt,
          status: x.status,
          memo: x.memo,
        })));

        const pi = res.data.pageInfo;
        setPageInfo(pi);
        const nums = [];
        for (let i = pi.startPage; i <= pi.endPage; i++) {
          nums.push(i);
        }
        setPageNums(nums);
      })
      .catch(() => {
        setDisposals([]);
      });
  };

  // 필터 상태 변경
  const onFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const handleSearchClick = () => fetchDisposals(1);

  return (
    <div className={styles.container}>
      <StoreInventorySidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>{user.name} 폐기 신청 내역</h2>
        <div className={styles.filters}>
          <label>
            <select
              name="category"
              value={filters.category}
              onChange={onFilterChange}
            >
              <option value="all">전체</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.name}</option>
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
        <table className={styles.table}>
          <thead>
            <tr>
              <th>재료명</th>
              <th>분류</th>
              <th>단위</th>
              <th>폐기량</th>
              <th>신청일</th>
              <th>처리일</th>
              <th>상태</th>
              <th>메모</th>
            </tr>
          </thead>
          <tbody>
            {disposals.length === 0 ? (
              <tr>
                <td colSpan={8}>데이터가 없습니다.</td>
              </tr>
            ) : (
              disposals.map((d) => (
                <tr key={d.id}>
                  <td>{d.name}</td>
                  <td>{d.category}</td>
                  <td>{d.unit}</td>
                  <td>{d.quantity}</td>
                  <td>{d.requestedAt ? d.requestedAt : "-"}</td>
                  <td>{d.processedAt ? d.processedAt : "-"}</td>
                  <td>{d.status}</td>
                  <td>{d.memo || "-"}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        {/* 페이징 */}
        <div className={styles.pagination}>
          <button
            onClick={() => fetchDisposals(pageInfo.curPage - 1)}
            disabled={pageInfo.curPage === 1}
          >
            &lt;
          </button>
          {pageNums.map((p) => (
            <button
              key={p}
              onClick={() => fetchDisposals(p)}
              className={p === pageInfo.curPage ? styles.active : ""}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => fetchDisposals(pageInfo.curPage + 1)}
            disabled={pageInfo.curPage >= pageInfo.allPage}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
}
