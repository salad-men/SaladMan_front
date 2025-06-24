import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import NoticeSidebar from "./NoticeSidebar";
import styles from "./StoreNoticeList.module.css";
import { myAxios } from "../../../config";
import { accessTokenAtom } from "/src/atoms";

export default function StoreNoticeList() {
  const token = useAtomValue(accessTokenAtom);
  const [notices, setNotices] = useState([]);
  const [filters, setFilters] = useState({ keyword: "", field: "title" });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const size = 10;
  const navigate = useNavigate();

  useEffect(() => {
    fetchNoticeList(0);
    // eslint-disable-next-line
  }, [token]);

  const fetchNoticeList = (pageParam = 0) => {
    myAxios(token)
      .post("/store/notice/list", {
        page: pageParam,
        size,
        field: filters.field,
        keyword: filters.keyword,
      })
      .then(res => {
        setNotices(res.data.noticeList || []);
        setPage(res.data.page ?? pageParam);
        setTotalPages(res.data.totalPages || 1);
      })
      .catch(err => console.error(err));
  };

  const onFilterChange = e => {
    const { name, value } = e.target;
    setFilters(f => ({ ...f, [name]: value }));
  };

  const onSearch = () => fetchNoticeList(0);

  return (
    <div className={styles.container}>
      <NoticeSidebar />
      <main className={styles.content}>
        <h2 className={styles.title}>공지사항</h2>
        <div className={styles.filters}>
          <select name="field" value={filters.field} onChange={onFilterChange}>
            <option value="title">제목</option>
          </select>
          <input
            type="text"
            name="keyword"
            placeholder="검색어 입력"
            value={filters.keyword}
            onChange={onFilterChange}
            onKeyDown={e => e.key === "Enter" && onSearch()}
          />
          <button className={styles.search} onClick={onSearch}>검색</button>
        </div>

        <table className={styles.table}>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>작성일</th>
            </tr>
          </thead>
          <tbody>
            {notices.length > 0 ? notices.map(notice => (
              <tr
                key={notice.id}
                className={styles.row}
                style={{ cursor: "pointer" }}
                onClick={() => navigate(`/store/StoreNoticeDetail/${notice.id}`)}
              >
                <td className={`${styles.cell} ${styles.center}`}>{notice.id}</td>
                <td className={styles.cell}>{notice.title}</td>
                <td className={`${styles.cell} ${styles.center}`}>{notice.postedAt}</td>
              </tr>
            )) : (
              <tr>
                <td colSpan={3} className={styles.noData}>데이터가 없습니다.</td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.paging}>
          <button disabled={page === 0} onClick={() => fetchNoticeList(page - 1)}>이전</button>
          <span>{page + 1} / {totalPages}</span>
          <button disabled={page === totalPages - 1} onClick={() => fetchNoticeList(page + 1)}>다음</button>
        </div>
      </main>
    </div>
  );
}
