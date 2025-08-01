import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { myAxios } from "/src/config";
import styles from "./NewsDetail.module.css";

const NewsDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [notice, setNotice] = useState(null);

  useEffect(() => {
    myAxios()
      .get(`/user/announce/${id}`)
      .then(res => setNotice(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!notice) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>공지사항</h1>

      <div className={styles.header}>
        <div className={styles.subject}>📢 {notice.title}</div>
        <div className={styles.meta}>
          <span>작성일: {notice.postedAt}</span>
          <span>조회수: {notice.viewCnt.toLocaleString()}</span>
        </div>
      </div>

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: notice.content }}
      ></div>

      <div className={styles.buttons}>
        <button className={styles.buttonGreen} onClick={() => navigate(-1)}>
          목록
        </button>
      </div>
    </div>
  );
};

export default NewsDetail;
