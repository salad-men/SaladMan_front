import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import NoticeSidebar from "../notice/NoticeSidebar";
import styles from "./StoreNoticeList.module.css";
import { myAxios } from "../../../config";
import { accessTokenAtom } from "/src/atoms";

export default function StoreNoticeList() {
  const token = useAtomValue(accessTokenAtom);
  const [notices, setNotices] = useState([]);
  const [filters, setFilters] = useState({ keyword: "", field: "title" });
  const [pageInfo, setPageInfo] = useState({
    curPage: 1,
    allPage: 1,
    startPage: 1,
    endPage: 1,
  });
  const [pageNums, setPageNums] = useState([]);
  const size = 10;
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    fetchNoticeList(1);
    // eslint-disable-next-line
  }, [token]);

  const fetchNoticeList = (pageParam = 1) => {
    myAxios(token)
      .post("/store/notice/list", {
        page: pageParam - 1, // 서버는 0-based
        size,
        field: filters.field,
        keyword: filters.keyword,
      })
      .then((res) => {
        setNotices(res.data.noticeList || []);

        // 페이지 정보
        const pi = {
          curPage: (res.data.page ?? pageParam - 1) + 1,
          allPage: res.data.totalPages || 1,
          startPage: res.data.startPage || 1,
          endPage: res.data.endPage || res.data.totalPages || 1,
        };
        setPageInfo(pi);

        // 페이지 번호 배열
        const pages = [];
        for (let i = pi.startPage; i <= pi.endPage; i++) {
          pages.push(i);
        }
        setPageNums(pages);
      })
      .catch((err) => console.error(err));
  };

  const onFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((f) => ({ ...f, [name]: value }));
  };

  const onSearch = () => fetchNoticeList(1);

  const gotoPage = (p) => {
    if (p < 1 || p > pageInfo.allPage) return;
    fetchNoticeList(p);
  };

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
            onKeyDown={(e) => e.key === "Enter" && onSearch()}
          />
          <button className={styles.search} onClick={onSearch}>
            검색
          </button>
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
            {notices.length > 0 ? (
              notices.map((notice) => (
                <tr
                  key={notice.id}
                  className={styles.row}
                  style={{ cursor: "pointer" }}
                  onClick={() =>
                    navigate(`/store/StoreNoticeDetail/${notice.id}`)
                  }
                >
                  <td className={`${styles.cell} ${styles.center}`}>
                    {notice.id}
                  </td>
                  <td className={styles.cell}>{notice.title}</td>
                  <td className={`${styles.cell} ${styles.center}`}>
                    {notice.postedAt}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={3} className={styles.noData}>
                  데이터가 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.paging}>
          <button onClick={() => gotoPage(1)} disabled={pageInfo.curPage === 1}>
            {"<<"}
          </button>
          <button
            onClick={() => gotoPage(pageInfo.curPage - 1)}
            disabled={pageInfo.curPage === 1}
          >
            {"<"}
          </button>

          {pageNums.map((p) => (
            <button
              key={p}
              onClick={() => gotoPage(p)}
              className={p === pageInfo.curPage ? styles.active : ""}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => gotoPage(pageInfo.curPage + 1)}
            disabled={pageInfo.curPage === pageInfo.allPage}
          >
            {">"}
          </button>
          <button
            onClick={() => gotoPage(pageInfo.allPage)}
            disabled={pageInfo.curPage === pageInfo.allPage}
          >
            {">>"}
          </button>
        </div>
      </main>
    </div>
  );
}
