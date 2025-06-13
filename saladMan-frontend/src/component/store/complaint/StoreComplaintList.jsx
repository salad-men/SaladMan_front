import React, { useState } from "react";
import NoticeSidebar from "../notice/NoticeSidebar";
import styles from "./StoreComplaintList.module.css";

const initialComplaints = [
  { id: 1, title: "[불편사항] 강남점 매장이 더러워요.", author: "관리자", date: "2025-05-21", status: "미열람" },
  { id: 2, title: "[전달사항] 고객 불편사항 공유 및 개선 요청", author: "관리자", date: "2025-05-21", status: "미열람" },
  { id: 3, title: "[전달사항] 고객 불편사항 공유 및 개선 요청", author: "관리자", date: "2025-05-21", status: "열람" },
  // 추가 데이터...
];

export default function StoreComplaintList() {
  const [complaints, setComplaints] = useState(initialComplaints);

  // 제목 클릭 시 '열람' 처리
  const handleView = (id) => {
    setComplaints((prev) =>
      prev.map((item) =>
        item.id === id && item.status === "미열람"
          ? { ...item, status: "열람" }
          : item
      )
    );
  };

  return (
    <div className={styles.container}>
      <NoticeSidebar />
      <main className={styles.content}>
        <h2 className={styles.title}>불편사항 목록</h2>

        <table className={styles.detailTable}>
          <thead>
            <tr>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>상태</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(({ id, title, author, date, status }) => (
              <tr key={id} className={status === "미열람" ? styles.unread : ""}>
                <td
                  className={styles.clickable}
                  onClick={() => handleView(id)}
                  title="상세보기(열람처리)"
                >
                  {title}
                </td>
                <td>{author}</td>
                <td>{date}</td>
                <td className={styles.statusCell + " " + styles[status.replace(" ", "").toLowerCase()]}>
                  {status}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </div>
  );
}
