import React, { useState } from "react";
import NoticeSidebar from "../notice/NoticeSidebar";
import styles from "./HqComplaintList.module.css";

const initialComplaints = [
  { id: 1, title: "[불편사항] 강남점 매장이 더러워요.", author: "관리자", date: "2025-05-21", store: "강남점", status: "미열람" },
  { id: 2, title: "[전달사항] 고객 불편사항 공유 및 개선 요청", author: "관리자", date: "2025-05-21", store: "강남점", status: "미열람" },
  { id: 3, title: "[전달사항] 고객 불편사항 공유 및 개선 요청", author: "관리자", date: "2025-05-21", store: "강남점", status: "미열람" },
  // ... 추가 데이터 생략
];

export default function HqComplaintList() {
  const [complaints, setComplaints] = useState(initialComplaints);
  const [selectedIds, setSelectedIds] = useState([]);

  const handleView = (id) => {
    setComplaints((prev) =>
      prev.map((item) =>
        item.id === id && item.status === "미열람"
          ? { ...item, status: "열람" }
          : item
      )
    );
  };

  // 체크박스 토글
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === complaints.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(complaints.map((c) => c.id));
    }
  };

  // 선택한 항목 한꺼번에 전달 처리
  const handleForwardSelected = () => {
    if (selectedIds.length === 0) {
      alert("전달할 항목을 선택하세요.");
      return;
    }
    setComplaints((prev) =>
      prev.map((item) =>
        selectedIds.includes(item.id) ? { ...item, status: "전달완료" } : item
      )
    );
    setSelectedIds([]);
  };

  return (
    <div className={styles.container}>
      <NoticeSidebar />
      <main className={styles.content}>
        <h2 className={styles.title}>불편사항 목록</h2>

        {/* 선택 전달 버튼 */}
        <div className={styles.actions}>
          <button
            className={styles.forwardSelectedBtn}
            onClick={handleForwardSelected}
            disabled={selectedIds.length === 0}
          >
            선택 전달
          </button>
        </div>

        <table className={styles.detailTable}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selectedIds.length === complaints.length && complaints.length > 0}
                  onChange={toggleSelectAll}
                  aria-label="전체 선택"
                />
              </th>
              <th>제목</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>점포명</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            {complaints.map(({ id, title, author, date, store, status }) => (
              <tr key={id} className={status === "미열람" ? styles.unread : ""}>
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(id)}
                    onChange={() => toggleSelect(id)}
                    aria-label={`선택 ${title}`}
                  />
                </td>
                <td
                  className={styles.clickable}
                  onClick={() => handleView(id)}
                  title="상세보기(열람처리)"
                >
                  {title}
                </td>
                <td>{author}</td>
                <td>{date}</td>
                <td>{store}</td>
                <td className={`${styles.statusCell} ${styles[status.replace(" ", "").toLowerCase()]}`}>
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
