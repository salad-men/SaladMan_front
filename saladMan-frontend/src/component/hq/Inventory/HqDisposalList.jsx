import React, { useState, useEffect } from "react";
import {useAtomValue } from "jotai";
import HqInventorySidebar from "./HqInventorySidebar";
import { myAxios } from "../../../config";
import styles from "./HqDisposalList.module.css";
import { accessTokenAtom } from "/src/atoms";

const initialFilters = {
  store: "all",
  category: "all",
  keyword: "",
  startDate: "",
  endDate: "",
};

export default function HqDisposalList() {
  const [filters, setFilters] = useState(initialFilters);
  const [tempFilters, setTempFilters] = useState(initialFilters);
  const [data, setData] = useState([]);
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReasons, setRejectReasons] = useState({});
  const [pageInfo, setPageInfo] = useState({});

  const token = useAtomValue(accessTokenAtom);
  

  // 지점 목록 호출
  useEffect((token) => {
    myAxios(token)
      .get("/hq/inventory/stores")
      .then((res) => setStores(res.data.stores || []));
  }, [token]);

  // 분류 목록 호출
  useEffect(() => {
    myAxios(token)
      .get("/hq/inventory/categories")
      .then((res) => setCategories(res.data.categories || []));
  }, [token]);

  // 폐기 목록 호출
  const fetchDisposalList = (page = 1) => {
    myAxios(token)
      .post("/hq/inventory/disposal-list", { ...filters, page })
      .then((res) => {
        setData(res.data.disposals || []);
        setPageInfo(res.data.pageInfo || {});
        setSelectedIds([]);
      })
      .catch(() => setData([]));
  };

  useEffect(() => {
    fetchDisposalList();
  }, [token,filters]);

  // 필터 적용
  const applyFilters = () => setFilters(tempFilters);
  // 필터 초기화
  const resetFilters = () => setTempFilters(initialFilters);

  // 전체 선택 동기화
  useEffect(() => {
    const allSelected = data.length > 0 && data.every((item) => selectedIds.includes(item.id));
    setSelectAll(allSelected);
  }, [selectedIds, data]);

  // 승인
  const approveSelected = () => {
    if (!selectedIds.length) return alert("선택된 항목이 없습니다.");
    myAxios(token)
      .post("/hq/inventory/disposal/approve", selectedIds)
      .then(() => fetchDisposalList(pageInfo.curPage));
  };

  // 반려
  const openRejectModal = () => {
    if (!selectedIds.length) return alert("반려할 항목을 선택하세요.");
    setRejectReasons({});
    setRejectModalOpen(true);
  };
  const confirmReject = () => {
    const req = selectedIds.map((id) => ({
      id,
      memo: rejectReasons[id] || "",
    }));
    if (req.some((r) => !r.memo.trim())) return alert("모든 항목에 사유 입력!");
    myAxios(token).post("/hq/inventory/disposal/reject", req).then(() => {
      setRejectModalOpen(false);
      fetchDisposalList(pageInfo.curPage);
    });
  };

  // 페이징 이동
  const movePage = (p) => fetchDisposalList(p);

  return (
    <div className={styles.container}>
      <HqInventorySidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>폐기 목록</h2>

        {/* 필터 섹션 */}
        <div className={styles.filters}>
          <div className={styles.row}>
            <label>기간</label>
            <input type="date" value={tempFilters.startDate} onChange={(e) => setTempFilters(f => ({ ...f, startDate: e.target.value }))} />
            <span className={styles.dateSeparator}>~</span>
            <input type="date" value={tempFilters.endDate} onChange={(e) => setTempFilters(f => ({ ...f, endDate: e.target.value }))} />
          </div>
          <div className={styles.row}>
            <label>지점</label>
            <select value={tempFilters.store} onChange={(e) => setTempFilters(f => ({ ...f, store: e.target.value }))}>
              <option value="all">전체</option>
              {stores.map(s => <option key={s.id} value={s.name}>{s.name}</option>)}
            </select>
            <label>분류</label>
            <select value={tempFilters.category} onChange={(e) => setTempFilters(f => ({ ...f, category: e.target.value }))}>
              <option value="all">전체</option>
              {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
            </select>
            <input type="text" placeholder="재료명" value={tempFilters.keyword} onChange={e => setTempFilters(f => ({ ...f, keyword: e.target.value }))} />
            <button onClick={applyFilters}>검색</button>
            <button onClick={resetFilters}>초기화</button>
          </div>
        </div>

        <div className={styles.actions}>
          <button onClick={approveSelected} disabled={!selectedIds.length}>선택 승인</button>
          <button onClick={openRejectModal} disabled={!selectedIds.length}>선택 반려</button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th><input type="checkbox" checked={selectAll} onChange={() => setSelectedIds(selectAll ? [] : data.map(row => row.id))} /></th>
              <th>지점</th>
              <th>품목명</th>
              <th>분류</th>
              <th>단위</th>
              <th>재고량</th>
              <th>폐기량</th>
              <th>사유</th>
              <th>폐기날짜</th>
              <th>상태</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            {data.length === 0
              ? <tr><td colSpan={11}>데이터가 없습니다.</td></tr>
              : data.map(row => (
                <tr key={row.id}>
                  <td>
                    {/* 본사 계정이면 체크박스 없이 */}
                    {(row.storeId === 1 || row.store === 1 || row.storeName === "본사계정")
                      ? null
                      : (
                        <input
                          type="checkbox"
                          checked={selectedIds.includes(row.id)}
                          onChange={() =>
                            setSelectedIds(ids =>
                              ids.includes(row.id)
                                ? ids.filter(id => id !== row.id)
                                : [...ids, row.id]
                            )
                          }
                        />
                      )
                    }
                  </td>
                  <td>{row.storeName || row.store || ""}</td>
                  <td>{row.ingredientName || row.name || ""}</td>
                  <td>{row.categoryName || row.category || ""}</td>
                  <td>{row.unit}</td>
                  <td>{row.stock || row.quantity || ""}</td>
                  <td>{row.discardQty || row.quantity || ""}</td>
                  <td>{row.reason || row.memo || ""}</td>
                  <td>{row.requestedAt || row.discardDate || ""}</td>
                  <td>{row.status}</td>
                  <td>{row.remark || ""}</td>
                </tr>
              ))}
          </tbody>

        </table>
        {/* 페이지네이션 */}
        <div>
          {pageInfo.startPage && pageInfo.endPage && [...Array(pageInfo.endPage - pageInfo.startPage + 1).keys()]
            .map(i => {
              const p = pageInfo.startPage + i;
              return <button key={p} disabled={p === pageInfo.curPage} onClick={() => movePage(p)}>{p}</button>;
            })}
        </div>

        {/* 반려 모달 */}
        {rejectModalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalBox}>
              <h3>반려 사유 입력</h3>
              <table>
                <thead>
                  <tr>
                    <th>지점</th><th>품목명</th><th>분류</th><th>폐기량</th><th>반려사유</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedIds.map(id => {
                    const row = data.find(d => d.id === id);
                    return (
                      <tr key={id}>
                        <td>{row.storeName}</td>
                        <td>{row.ingredientName}</td>
                        <td>{row.categoryName}</td>
                        <td>{row.discardQty || row.quantity || ""}</td>
                        <td>
                          <input value={rejectReasons[id] || ""} onChange={e => setRejectReasons(r => ({ ...r, [id]: e.target.value }))} />
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
              <button onClick={confirmReject}>확인</button>
              <button onClick={() => setRejectModalOpen(false)}>취소</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
