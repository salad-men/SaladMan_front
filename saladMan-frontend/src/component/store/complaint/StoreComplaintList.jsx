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

  // 매장: isRelay=true, storeId
  const fetchComplaintList = (pageParam = 1, keywordParam = searchKeyword) => {
    if (!token || !user?.id) return;
    myAxios(token)
      .post("/store/complaint/list", {
        page: pageParam,
        size,
        storeId: user.id,
        keyword: keywordParam,
      })
      .then(res => {
        const pi = res.data.pageInfo || {};
        setComplaints((res.data.complaintList || []).map(c => ({
          ...c,
          status: c.isStoreRead ? "열람" : "미열람",
        })));
        setPage(pi.curPage || pageParam);
        setTotalPages(pi.allPage || 1);
      });
  };

  useEffect(() => { fetchComplaintList(1, ""); }, [token, user]);

  const handleSearch = () => fetchComplaintList(1, searchKeyword);

  const handlePageChange = (newPage) => fetchComplaintList(newPage, searchKeyword);

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
            onKeyDown={e => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch}>검색</button>
        </div>
        <table className={styles.detailTable}>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>내용</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>지점명</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.noData}>데이터가 없습니다.</td>
              </tr>
            ) : (
              complaints.map((c, idx) => (
                <tr key={c.id} className={!c.isStoreRead ? styles.unread : ""}>
                  <td>{(page - 1) * size + idx + 1}</td>
                  <td className={styles.clickable}
                      onClick={() => navigate(`/store/StoreComplaintDetail/${c.id}`)}>
                    {c.title}
                  </td>
                  <td className={styles.preview}
                      onClick={() => navigate(`/store/StoreComplaintDetail/${c.id}`)}>
                    {c.content?.length > 40 ? c.content.slice(0, 40) + "..." : c.content}
                  </td>
                  <td>{c.writerNickname ?? "고객"}</td>
                  <td>{c.writerDate}</td>
                  <td>{c.storeName ?? "알 수 없음"}</td>
                  <td className={styles.statusCell}>{c.status}</td>
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
