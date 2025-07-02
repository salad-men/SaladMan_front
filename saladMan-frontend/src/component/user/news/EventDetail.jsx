import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { myAxios } from "/src/config";
import styles from "./NewsDetail.module.css";

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);

  useEffect(() => {
    myAxios()
      .get(`/user/announce/${id}`)
      .then(res => setEvent(res.data))
      .catch(err => console.error(err));
  }, [id]);

  if (!event) return <div>Loading...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>이벤트</h1>

      <div className={styles.header}>
        <div className={styles.subject}>{event.title}</div>
        <div className={styles.meta}>
          <span>작성일: {event.postedAt}</span>
          <span>조회수: {event.viewCnt.toLocaleString()}</span>
        </div>
      </div>

      <div
        className={styles.content}
        dangerouslySetInnerHTML={{ __html: event.content }}
      ></div>

      <div className={styles.buttons}>
        <button className={styles.buttonGreen} onClick={() => navigate(-1)}>목록</button>
      </div>
    </div>
  );
};

export default EventDetail;
