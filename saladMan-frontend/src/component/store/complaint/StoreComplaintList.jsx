import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import NoticeSidebar from "../Notice/NoticeSidebar";
import styles from "./StoreComplaintList.module.css";
import { myAxios } from "../../../config";
import { accessTokenAtom, userAtom } from "/src/atoms";

export default function StoreComplaintList() {
  const token = useAtomValue(accessTokenAtom);
  const user = useAtomValue(userAtom);
  const navigate = useNavigate();

  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");
  const size = 10;

  // 상태 매핑
  const mapStatus = (isRead) => isRead ? "열람" : "미열람";

  const fetchComplaintList = (pageParam = 1, keywordParam = searchKeyword) => {
    if (!user?.id) return;
    myAxios(token)
      .post("/store/complaint/list", {
        page: pageParam,
        size,
        storeId: user.id,
        keyword: keywordParam,
      })
      .then(res => {
        const list = (res.data.complaintList || []).map(c => ({
          ...c,
          status: mapStatus(c.isRead),
        }));
        setComplaints(list);
        setPage(res.data.pageInfo?.curPage || pageParam);
        setTotalPages(res.data.pageInfo?.allPage || 1);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => { fetchComplaintList(1, ""); }, [token, user]);

  // 검색
  const handleKeyDown = (e) => {
    if (e.key === "Enter") fetchComplaintList(1, searchKeyword);
  };
  const handleSearch = () => fetchComplaintList(1, searchKeyword);

  // 페이지 이동 (1부터 시작)
  const handlePageChange = (newPage) => {
    fetchComplaintList(newPage, searchKeyword);
  };

  // 전체 글 수 (페이지별 번호 역순)
  const getDisplayNumber = (idx) => {
    return (totalPages - (page - 1)) * size - idx;
  };

  return (
    <div className={styles.container}>
      <NoticeSidebar />
      <main className={styles.content}>
        <h2 className={styles.title}>불편사항 목록</h2>
        <div className={styles.filters}>
          <input
            type="text"
            placeholder="제목 검색"
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            onKeyDown={handleKeyDown}
          />
          <button onClick={handleSearch}>검색</button>
        </div>
        <table className={styles.detailTable}>
          <colgroup>
            <col style={{ width: "6%" }} />    {/* 번호 */}
            <col style={{ width: "32%" }} />   {/* 제목 */}
            <col style={{ width: "14%" }} />   {/* 작성자 */}
            <col style={{ width: "18%" }} />   {/* 작성일 */}
            <col style={{ width: "18%" }} />   {/* 지점명 */}
            <col style={{ width: "12%" }} />   {/* 비고 */}
          </colgroup>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>지점명</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={6} className={styles.noData}>데이터가 없습니다.</td>
              </tr>
            ) : (
              complaints.map(({ id, title, writerNickname, writerDate, storeName, status }, idx) => (
                <tr key={id} className={status === "미열람" ? styles.unread : ""}>
                  <td className={styles.numberCell}>{idx + 1}</td>
                  <td
                    className={styles.clickable}
                    onClick={() => navigate(`/store/StoreComplaintDetail/${id}`)}
                  >
                    <span className={styles.titleText}>{title}</span>
                  </td>
                  <td>{writerNickname ?? "고객"}</td>
                  <td>{writerDate}</td>
                  <td>{storeName ?? "알 수 없음"}</td>
                  <td className={`${styles.statusCell} ${status === "미열람" ? styles.miyeollam : styles.yeollam}`}>
                    {status}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        <div className={styles.paging}>
          <button disabled={page <= 1} onClick={() => handlePageChange(page - 1)}>이전</button>
          <span>{page} / {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => handlePageChange(page + 1)}>다음</button>
        </div>
      </main>
    </div>
  );
}
