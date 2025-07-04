import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { myAxios } from "/src/config";
import styles from "./Event.module.css";

export default function Event() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = () => {
    myAxios()
      .get(`/user/announce?type=이벤트&page=${page}&size=9`)
      .then(res => {
        setEvents(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => console.error(err));
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
      fetchData(); // 삭제 후 목록 갱신
    } catch (err) {
      console.error("삭제 실패:", err);
      alert("삭제에 실패했습니다.");
    }
  };

  return (
    <div className={styles.wrapper}>
      {isAdmin && (
        <div className={styles.writeButtonContainer}>
          <button
            className={styles.writeButton}
            onClick={() => navigate("/NewsWrite?type=이벤트")}
          >
            작성하기 ＋
          </button>
        </div>
      )}

      <div className={styles.gridContainer}>
        {events.map((event) => (
          <div
            key={event.id}
            className={styles.card}
            style={{ cursor: "pointer", position: "relative" }}
            onClick={(e) => {
              if (e.target.tagName === "BUTTON") return;
              navigate(`/eventDetail/${event.id}`);
            }}
          >
            <img src={event.img} alt={event.title} className={styles.image} />
            <div className={styles.title}>{event.title}</div>
            <div className={styles.date}>{event.postedAt}</div>

            {isAdmin && (
              <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "6px" }}>
                <button
                  style={{
                    background: "#4D774E",
                    color: "#fff",
                    border: "none",
                    padding: "5px 8px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    navigate(`/NewsWrite?type=이벤트&id=${event.id}`);
                  }}
                >
                  수정
                </button>
                <button
                  style={{
                    background: "#b05757",
                    color: "#fff",
                    border: "none",
                    padding: "5px 8px",
                    borderRadius: "4px",
                    cursor: "pointer"
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(event.id);
                  }}
                >
                  삭제
                </button>
              </div>
            )}
          </div>
        ))}
      </div>

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
}
