import React from "react";
import NoticeSidebar from "./NoticeSidebar";
import styles from "./HqNoticeList.module.css";

const notices = [
  { id: 1, title: "[공지] 샐러드 배송 지역 확대 안내", author: "관리자", date: "2025-05-21" },
  { id: 2, title: "[공지] 고객센터 운영시간 변경 안내", author: "관리자", date: "2025-05-21" },
  { id: 3, title: "[공지] 일시적인 시스템 점검 안내", author: "관리자", date: "2025-05-21" },
  { id: 4, title: "[신제품 출시] 환경 '아보카도 처럼 샐러드' 출시!", author: "관리자", date: "2025-05-21" },
  { id: 5, title: "[신제품 안내] 샐러드 드레싱 3종 출시", author: "관리자", date: "2025-05-21" },
  { id: 6, title: "[인터뷰] 인기 메뉴 리뉴얼 안내", author: "관리자", date: "2025-05-21" },
  { id: 7, title: "[이벤트] 5월 가정의 달 특별 이벤트", author: "관리자", date: "2025-05-21" },
  { id: 8, title: "[프로모션] 첫 주문 고객 전원 혜택 안내", author: "관리자", date: "2025-05-21" },
  { id: 9, title: "[이벤트] 인스타그램 후기 이벤트 안내", author: "관리자", date: "2025-05-21" },
  { id: 10, title: "[공지] 향후 거래 내역 저장 안내", author: "관리자", date: "2025-05-21" },
];

export default function HqNoticeList() {
  return (
    <div className={styles.container}>
      <NoticeSidebar />
      <main className={styles.content}>
        <h2 className={styles.title}>공지사항</h2>
        <table className={styles.table}>
          <thead>
            <tr>
              <th style={{ width: "5%" }}>번호</th>
              <th style={{ width: "65%" }}>제목</th>
              <th style={{ width: "15%" }}>작성자</th>
              <th style={{ width: "15%" }}>작성일</th>
            </tr>
          </thead>
          <tbody>
            {notices.map((notice) => (
              <tr key={notice.id} className={styles.row}>
                <td className={`${styles.cell} ${styles.center}`}>{notice.id}</td>
                <td className={styles.cell}>{notice.title}</td>
                <td className={`${styles.cell} ${styles.center}`}>{notice.author}</td>
                <td className={`${styles.cell} ${styles.center}`}>{notice.date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
