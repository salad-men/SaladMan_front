import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { myAxios } from "/src/config";
import styles from "./NewsDetail.module.css";

const PraiseDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [store, setStore] = useState(null);

  useEffect(() => {
    myAxios()
      .get(`/user/announce/${id}`)
      .then(res => setStore(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!store) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>칭찬매장</h1>

      <div className={styles.header}>
        <div className={styles.subject}>{store.title}</div>
        <div className={styles.meta}>
          <span>작성일: {store.postedAt}</span>
          <span>조회수: {store.viewCnt.toLocaleString()}</span>
        </div>
      </div>

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: store.content.replace(/\n/g, "<br/>") }}
      ></div>

      {store.img && (
        <div className={styles.imageWrapper} style={{ textAlign: "center", marginTop: "20px" }}>
          <img
            src={store.img}
            alt="첨부 이미지"
            style={{ maxWidth: "100%", borderRadius: "8px"}}
          />
        </div>
      )}

      <div className={styles.buttons}>
        <button className={styles.buttonGreen} onClick={() => navigate(-1)}>목록</button>
      </div>
    </div>
  );
};

export default PraiseDetail;
