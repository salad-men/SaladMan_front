import React, { useEffect, useState } from "react";
import { myAxios } from "/src/config";
import styles from "./News.module.css";

const News = () => {
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  useEffect(() => {
    myAxios()
      .get(`/user/announce?type=공지&page=${page}&size=10`)
      .then((res) => {
        setNotices(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error(err));
  }, [page]);

  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회</th>
          </tr>
        </thead>
        <tbody>
          {notices.map((notice) => (
            <tr key={notice.id}>
              <td>{notice.id}</td>
              <td>
                <a href={`/NewsDetail/${notice.id}`}>{notice.title}</a>
              </td>
              <td>관리자</td>
              <td>{notice.postedAt}</td>
              <td>{(notice.viewCnt ?? 0).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className={styles.pagination}>
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i}
            onClick={() => setPage(i)}
            className={`${styles.pageButton} ${page === i ? styles.activePage : ''}`}
          >
            {i + 1}
          </button>
        ))}
        {totalPages > 0 && page < totalPages - 1 && (
          <button
            onClick={() => setPage(page + 1)}
            className={styles.pageButton}
          >
            &gt;&gt;
          </button>
        )}
      </div>
    </div>
  );
};

export default News;
