import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { myAxios } from "/src/config";
import styles from "./PraiseStore.module.css";

function stripHtmlTags(html) {
  const tmp = document.createElement("div");
  tmp.innerHTML = html;
  return tmp.textContent || tmp.innerText || "";
}

export default function PraiseStore() {
  const [stores, setStores] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isAdmin, setIsAdmin] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    fetchData();
  }, [page]);

  const fetchData = () => {
    myAxios()
      .get(`/user/announce?type=칭찬매장&page=${page}&size=5`)
      .then(res => {
        setStores(res.data.content);
        setTotalPages(res.data.totalPages);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    try {
      const storeStr = localStorage.getItem("store");
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
      alert("게시물이 삭제되었습니다.");
      fetchData();
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
            onClick={() => navigate("/NewsWrite?type=칭찬매장")}
          >
            작성하기 ＋
          </button>
        </div>
      )}

      {stores.map((store) => (
        <div
          key={store.id}
          className={styles.card}
          style={{ cursor: "pointer", position: "relative" }}
          onClick={(e) => {
            if (e.target.tagName === "BUTTON") return;
            navigate(`/praiseDetail/${store.id}`);
          }}
        >
          <img src={store.img} alt={store.title} className={styles.image} />
          <div className={styles.info}>
            <h3 className={styles.title}>{store.title}</h3>
            <p className={styles.period}>
              {stripHtmlTags(store.content).slice(0, 15)}...
            </p>
          </div>
          <div className={styles.status}>{store.type}</div>

          {isAdmin && (
            <div style={{ position: "absolute", top: "10px", right: "10px", display: "flex", gap: "8px" }}>
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
                  handleDelete(store.id);
                }}
              >
                삭제
              </button>
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
                  navigate(`/NewsWrite?type=칭찬매장&id=${store.id}`);
                }}
              >
                수정
              </button>
            </div>
          )}
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
