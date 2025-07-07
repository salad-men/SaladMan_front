import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import NoticeSidebar from "../Notice/NoticeSidebar";
import styles from "./HqComplaintList.module.css";
import { myAxios } from "../../../config";
import { accessTokenAtom } from "/src/atoms";

export default function HqComplaintList() {
  const token = useAtomValue(accessTokenAtom);
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [stores, setStores] = useState([]);

  const [selectedIds, setSelectedIds] = useState([]);

  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const size = 10;

  // 필터 상태
  const [storeFilter, setStoreFilter] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState("");
  const [statusFilter, setStatusFilter] = useState("all"); // all, 미열람, 열람, 전달완료

  const mapStatus = (isRead, isRelay) => {
    if (isRelay) return "전달완료";
    if (isRead) return "열람";
    return "미열람";
  };

  // 점포 리스트 API 호출
  useEffect(() => {
    if (!token) return;
    myAxios(token)
      .get("/hq/store/list")
      .then(res => {
        setStores(res.data.storeList);
      })
      .catch(err => console.error("점포목록 조회 실패:", err));
  }, [token]);

  // 불편사항 리스트 API 호출
  const fetchComplaintList = (pageParam = 0) => {
    if (!token) return;
    myAxios(token)
      .post("/hq/complaint/list", {
        page: pageParam,
        size,
        storeId: storeFilter === "all" ? null : Number(storeFilter),
        keyword: searchKeyword,
        status: statusFilter === "all" ? null : statusFilter,
      })
      .then(res => {
        const list = (res.data.complaintList || []).map(c => ({
          ...c,
          status: mapStatus(c.isRead, c.isRelay),
        }));

        const order = { "미열람": 0, "열람": 1, "전달완료": 2 };
        list.sort((a, b) => order[a.status] - order[b.status]);

        setComplaints(list);
        setPage(res.data.page ?? pageParam);
        setTotalPages(res.data.totalPages ?? 1);
        setSelectedIds([]);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (!token) return;
    fetchComplaintList(0);
  }, [token, storeFilter, searchKeyword, statusFilter]);

  const handleView = (id) => {
    setComplaints(prev =>
      prev.map(item =>
        item.id === id && item.status === "미열람"
          ? { ...item, status: "열람" }
          : item
      )
    );
    navigate(`/hq/HqComplaintDetail/${id}`);
  };

  const toggleSelect = (id) => {
    setSelectedIds(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    // "전달완료"가 아닌 것만 체크할 수 있도록
    const selectable = complaints.filter(c => c.status !== "전달완료").map(c => c.id);
    if (selectedIds.length === selectable.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(selectable);
    }
  };

  const handleForwardSelected = () => {
    if (selectedIds.length === 0) {
      alert("전달할 항목을 선택하세요.");
      return;
    }
    setComplaints(prev =>
      prev.map(item =>
        selectedIds.includes(item.id) ? { ...item, status: "전달완료" } : item
      )
    );
    setSelectedIds([]);
  };

  const renderPageButtons = () => {
    const buttons = [];
    for (let i = 0; i < totalPages; i++) {
      buttons.push(
        <button
          key={i}
          className={page === i ? styles.activePageButton : ""}
          onClick={() => fetchComplaintList(i)}
          aria-current={page === i ? "page" : undefined}
        >
          {i + 1}
        </button>
      );
    }
    return buttons;
  };

  return (
    <div className={styles.container}>
      <NoticeSidebar />
      <main className={styles.content}>
        <h2 className={styles.title}>불편사항 목록</h2>

        <div className={styles.filters}>
          <select value={storeFilter} onChange={e => setStoreFilter(e.target.value)}>
            <option value="all">전체 점포</option>
            {stores.map(store => (
              <option key={store.id} value={store.id}>
                {store.name}
              </option>
            ))}
          </select>

          <select value={statusFilter} onChange={e => setStatusFilter(e.target.value)}>
            <option value="all">전체 상태</option>
            <option value="미열람">미열람</option>
            <option value="열람">열람</option>
            <option value="전달완료">전달완료</option>
          </select>

          <input
            type="text"
            placeholder="제목 검색"
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && fetchComplaintList(0)}
          />

          <button onClick={() => fetchComplaintList(0)}>검색</button>

          <button
            className={styles.forwardSelectedBtn}
            onClick={handleForwardSelected}
            disabled={selectedIds.length === 0}
          >
            선택 전달
          </button>
        </div>

        <table className={styles.detailTable}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={
                    complaints.filter(c => c.status !== "전달완료").length > 0 &&
                    selectedIds.length === complaints.filter(c => c.status !== "전달완료").map(c => c.id).length
                  }
                  onChange={toggleSelectAll}
                  aria-label="전체 선택"
                  // 전달완료 아닌게 없으면 전체선택도 비활성화
                  disabled={complaints.filter(c => c.status !== "전달완료").length === 0}
                />
              </th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>점포명</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.noData}>데이터가 없습니다.</td>
              </tr>
            ) : (
              complaints.map(({ id, title, writerNickname, writerDate, storeName, status }) => (
                <tr key={id} className={status === "미열람" ? styles.unread : ""}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedIds.includes(id)}
                      onChange={() => toggleSelect(id)}
                      aria-label={`선택 ${title}`}
                      disabled={status === "전달완료"}
                      className={status === "전달완료" ? styles.checkboxDisabled : ""}
                    />
                  </td>
                  <td className={styles.clickable} onClick={() => handleView(id)}>{title}</td>
                  <td>{writerNickname ?? "관리자"}</td>
                  <td>{writerDate}</td>
                  <td>{storeName ?? "알 수 없음"}</td>
                  <td className={`${styles.statusCell} ${status ? styles[status.replace(" ", "").toLowerCase()] : ""}`}>
                    {status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        <div className={styles.paging}>
          <button
            disabled={page === 0}
            onClick={() => fetchComplaintList(0)}
            aria-label="처음 페이지"
          >
            {'<<'}
          </button>
          <button
            disabled={page === 0}
            onClick={() => fetchComplaintList(page - 1)}
            aria-label="이전 페이지"
          >
            {'<'}
          </button>
          {renderPageButtons()}
          <button
            disabled={page === totalPages - 1}
            onClick={() => fetchComplaintList(page + 1)}
            aria-label="다음 페이지"
          >
            {'>'}
          </button>
          <button
            disabled={page === totalPages - 1}
            onClick={() => fetchComplaintList(totalPages - 1)}
            aria-label="마지막 페이지"
          >
            {'>>'}
          </button>
        </div>

      </main>
    </div>
  );
}
