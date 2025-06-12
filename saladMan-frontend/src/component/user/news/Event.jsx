import React from "react";
import styles from "./Event.module.css";

const events = [
  {
    id: 1,
    title: "샐러드맨 X 오트몬드 전 메뉴 주문 시, 오트몬드 3종 중 1팩 증정",
    image: "event1.png",
    status: "진행",
  },
  {
    id: 2,
    title: "샐러드맨 x 오트몬드의 두 번째 맛✨",
    image: "event2.png",
    status: "진행",
  },
  {
    id: 3,
    title: "NEW 육류 토핑들의 식감 대결 이벤트 시작!",
    image: "event2.png",
    status: "진행",
  },
  {
    id: 4,
    title: "신메뉴 사서하고 특별혜택 받아가세요 🍜샐러드맨 Eat 3기 모집",
    image: "event1.png",
    status: "종료",
  },
  {
    id: 5,
    title: "샐러드맨  첫 창업박람회 참가!",
    image: "event2.png",
    status: "종료",
  },
  {
    id: 6,
    title: "4월 5일 식목일맞이 🌳댓글 하나당 4500원 기부!",
    image: "event1.png",
    status: "종료",
  },
  {
    id: 7,
    title: "#EVENT 포케 3종 먹고 저당 크래커 아이비 받자!",
    image: "event2.png",
    status: "종료",
  },
  {
    id: 8,
    title: "EVENT📚 오늘 나를 더 사랑하는 달콤한 방법!",
    image: "event2.png",
    status: "종료",
  },
  {
    id: 9,
    title: "📣한정수량! 샐러드맨 20% 할인 이벤트📣",
    image: "event1.png",
    status: "종료",
  },
];

export default function Event() {
  return (
    <div className={styles.gridContainer}>
      {events.map((event) => (
        <div key={event.id} className={styles.card}>
          <div className={styles.badge + " " + (event.status === "진행" ? styles.active : styles.closed)}>
            {event.status}
          </div>
          <img src={event.image} alt={event.title} className={styles.image} />
          <div className={styles.title}>{event.title}</div>
        </div>
      ))}
    </div>
  );
}
