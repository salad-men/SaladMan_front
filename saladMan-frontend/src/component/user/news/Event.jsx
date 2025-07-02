import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { myAxios } from "/src/config";
import styles from "./Event.module.css";

export default function Event() {
  const [events, setEvents] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    myAxios()
      .get(`/user/announce?type=이벤트&page=${page}&size=9`)
      .then(res => {
        setEvents(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => console.error(err));
  }, [page]);

  return (
    <div className={styles.wrapper}>
      <div className={styles.gridContainer}>
        {events.map((event) => (
          <div
            key={event.id}
            className={styles.card}
            onClick={() => navigate(`/eventDetail/${event.id}`)}
            style={{ cursor: "pointer" }}
          >
            <img src={event.img} alt={event.title} className={styles.image} />
            <div className={styles.title}>{event.title}</div>
            <div className={styles.date}>{event.postedAt}</div>
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
