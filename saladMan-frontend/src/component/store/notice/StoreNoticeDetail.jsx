import React from "react";
import NoticeSidebar from "./NoticeSidebar";
import styles from "./StoreNoticeDetail.module.css";

export default function StoreNoticeDetail() {
  const notice = {
    title: "[공지] 샐러드 배송 지역 확대 안내",
    author: "관리자",
    date: "2025-05-21",
    content: `고객 여러분의 많은 관심과 사랑에 힘입어 샐러드 배송 가능 지역이 확대되었습니다.

기존 지역에 더해 ○○지역에서도 신선한 샐러드를 빠르게 받아보실 수 있게 되었습니다.

앞으로도 더 많은 지역에서 만날 수 있도록 최선을 다하겠습니다. 감사합니다.`,
  };

  const handleBackClick = () => {
    window.history.back();
  };

  return (
    <div className={styles.container}>
      <NoticeSidebar />
      <main className={styles.content}>
        <h2 className={styles.title}>공지사항</h2>

        <div className={styles.detailMeta}>
          <span>작성일 {notice.date}</span>
        </div>

        <table className={styles.detailTable}>
          <tbody>
            <tr>
              <th>제목</th>
              <td>{notice.title}</td>
            </tr>
            <tr>
              <th>작성자</th>
              <td className={styles.authorCell}>{notice.author}</td>
            </tr>
            <tr>
              <th>내용</th>
              <td className={styles.contentCell}>
                {notice.content.split("\n").map((line, idx) => (
                  <p key={idx}>{line}</p>
                ))}
              </td>
            </tr>
          </tbody>
        </table>

        <div className={styles.buttonGroup}>
          <button className={styles.back} onClick={handleBackClick} type="button">
            목록
          </button>
        </div>
      </main>
    </div>
  );
}
