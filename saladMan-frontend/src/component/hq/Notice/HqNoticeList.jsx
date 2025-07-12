import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import NoticeSidebar from "./NoticeSidebar";
import styles from "./HqNoticeList.module.css";
import { myAxios } from "../../../config";
import { accessTokenAtom } from "/src/atoms";

export default function HqNoticeList() {
  const token = useAtomValue(accessTokenAtom);
  const [notices, setNotices] = useState([]);
  const [filters, setFilters] = useState({ keyword: "", field: "title" });
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const size = 10;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    fetchNoticeList(0);
    // eslint-disable-next-line
  }, [token]);

  const fetchNoticeList = (pageParam = 0) => {
    myAxios(token)
      .post("/hq/notice/list", {
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

  // 페이지 번호 렌더 (1, 2, 3, ...)
  const getPageNumbers = () => {
    let pages = [];
    let start = Math.max(0, page - 2);
    let end = Math.min(totalPages, start + 5);
    if (end - start < 5) start = Math.max(0, end - 5);
    for (let i = start; i < end; i++) pages.push(i);
    return pages;
  };

  return (
    <div className={styles.container}>
      <NoticeSidebar />
      <main className={styles.content}>
        <div className={styles.innerContainer}>
          <div className={styles.title}>공지사항</div>

          <div className={styles.filters}>
            <select name="field" value={filters.field} onChange={onFilterChange}>
              <option value="title">제목</option>
              <option value="content">내용</option>
              <option value="all">제목+내용</option>
            </select>
            <input
              type="text"
              name="keyword"
              className={styles.inputSearch}
              placeholder="검색어 입력"
              value={filters.keyword}
              onChange={onFilterChange}
              onKeyDown={e => e.key === "Enter" && onSearch()}
            />
            <button className={styles.searchBtn} onClick={onSearch}>검색</button>
            <button className={styles.addNoticeBtn} onClick={() => navigate("/hq/HqNoticeWrite")}>
              공지등록
            </button>
          </div>

          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>번호</th>
                  <th>제목</th>
                  <th>내용</th>
                  <th>작성자</th>
                  <th>작성일</th>
                </tr>
              </thead>
              <tbody>
                {notices.length > 0 ? notices.map((notice, idx) => (
                    <tr
                      key={notice.id}
                      onClick={() => navigate(`/hq/HqNoticeDetail/${notice.id}`)}
                      className={styles.row}
                    >
                      <td>{page * size + idx + 1}</td>
                      <td>{notice.title}</td>
                      <td className={styles.preview}>
                        {notice.content?.length > 40
                          ? notice.content.slice(0, 40) + '...'
                          : notice.content}
                      </td>
                      <td>{notice.author ?? "관리자"}</td>
                      <td>{notice.postedAt}</td>
                    </tr>
                  )) : (
                    <tr>
                      <td colSpan={5} className={styles.noData}>데이터가 없습니다.</td>
                    </tr>
                  )}
              </tbody>
            </table>
          </div>

          <div className={styles.pagination}>
            <button
              disabled={page === 0}
              onClick={() => fetchNoticeList(0)}
            >
              &lt;&lt;
            </button>
            <button
              disabled={page === 0}
              onClick={() => fetchNoticeList(page - 1)}
            >
              &lt;
            </button>
            {getPageNumbers().map(idx => (
              <button
                key={idx}
                className={idx === page ? styles.active : ""}
                onClick={() => fetchNoticeList(idx)}
                disabled={idx === page}
              >
                {idx + 1}
              </button>
            ))}
            <button
              disabled={page === totalPages - 1}
              onClick={() => fetchNoticeList(page + 1)}
            >
              &gt;
            </button>
            <button
              disabled={page === totalPages - 1}
              onClick={() => fetchNoticeList(totalPages - 1)}
            >
              &gt;&gt;
            </button>
          </div>


        </div>
      </main>
    </div>
  );
}
