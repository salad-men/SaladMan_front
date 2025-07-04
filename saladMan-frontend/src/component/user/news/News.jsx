import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { myAxios } from "/src/config";
import styles from "./News.module.css";

const News = () => {
  const [notices, setNotices] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = () => {
    myAxios()
      .get(`/user/announce?type=공지사항&page=${page}&size=10`)
      .then((res) => {
        setNotices(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch((err) => console.error(err));
  };

  useEffect(() => {
    try {
      const storeStr = sessionStorage.getItem("store");
      if (storeStr) {
        const storeData = JSON.parse(storeStr);
        if ((storeData.role || "").trim() === "ROLE_HQ") {
          setIsAdmin(true);
        }
      }
    } catch (err) {
      console.error("store 파싱 실패:", err);
    }
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
    try {
      await myAxios().delete(`/user/announce/${id}`);
      alert("삭제되었습니다.");
      fetchData(); // 삭제 후 목록 다시 불러오기
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className={styles.container}>
      {isAdmin && (
        <div className={styles.writeButtonContainer}>
          <button
            className={styles.writeButton}
            onClick={() => navigate("/NewsWrite?type=공지사항")}
          >
            작성하기 ＋
          </button>
        </div>
      )}

      <table className={styles.table}>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회</th>
            {isAdmin && <th>관리</th>}
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
              {isAdmin && (
                <td>
                  <button
                    style={{
                      background: "#4D774E",
                      color: "#fff",
                      border: "none",
                      padding: "4px 8px",
                      marginRight: "4px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                    onClick={() => navigate(`/NewsWrite?type=공지사항&id=${notice.id}`)}
                  >
                    수정
                  </button>
                  <button
                    style={{
                      background: "#b05757",
                      color: "#fff",
                      border: "none",
                      padding: "4px 8px",
                      borderRadius: "4px",
                      cursor: "pointer"
                    }}
                    onClick={() => handleDelete(notice.id)}
                  >
                    삭제
                  </button>
                </td>
              )}
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
