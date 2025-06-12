import React from "react";
import styles from "./PraiseStore.module.css";

const events = [
  {
    id: 1,
    title: "25년 1분기 칭찬 매장을 소개합니다!",
    period: "2025/04/04~2025/05/04",
    status: "종료",
    image: "칭찬매장.png",
  },
  {
    id: 2,
    title: "24년 4분기 칭찬 매장을 소개합니다!",
    period: "2025/01/03~2025/02/02",
    status: "종료",
    image: "칭찬매장.png",
  },
  {
    id: 3,
    title: "24년 3분기 칭찬 매장을 소개합니다!",
    period: "2024/10/04~2024/11/03",
    status: "종료",
    image: "칭찬매장.png",
  },
  {
    id: 4,
    title: "24년 2분기 칭찬 매장을 소개합니다!",
    period: "2024/07/05~2024/08/04",
    status: "종료",
    image: "칭찬매장.png",
  },
];

export default function PraiseStore() {
  return (
    <div className={styles.container}>
      {events.map((event) => (
        <div key={event.id} className={styles.card}>
          <img src={event.image} alt={event.title} className={styles.image} />
          <div className={styles.info}>
            <h3 className={styles.title}>{event.title}</h3>
            <p className={styles.period}>이벤트 기간: {event.period}</p>
          </div>
          <div className={styles.status}>{event.status}</div>
        </div>
      ))}
    </div>
  );
}
