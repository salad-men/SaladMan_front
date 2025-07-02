import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { myAxios } from "/src/config";
import styles from "./PraiseStore.module.css";

// html 태그 제거 유틸
function stripHtmlTags(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

export default function PraiseStore() {
  const [stores, setStores] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  useEffect(() => {
    myAxios()
      .get(`/user/announce?type=칭찬매장&page=${page}&size=5`)
      .then(res => {
        setStores(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => console.error(err));
  }, [page]);

  return (
    <div className={styles.container}>
      {stores.map((store) => (
        <div
          key={store.id}
          className={styles.card}
          onClick={() => navigate(`/praiseDetail/${store.id}`)}
          style={{ cursor: "pointer" }}
        >
          <img src={store.img} alt={store.title} className={styles.image} />
          <div className={styles.info}>
            <h3 className={styles.title}>{store.title}</h3>
            <p className={styles.period}>
              {stripHtmlTags(store.content).slice(0, 15)}...
            </p>
          </div>
          <div className={styles.status}>{store.type}</div>
        </div>
      ))}

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
