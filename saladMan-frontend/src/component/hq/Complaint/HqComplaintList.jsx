import React, { useState } from "react";
import "./HqComplaintList.css";

const initialComplaints = [
  { id: 1, title: "[불편사항] 강남점 매장이 더러워요.", author: "관리자", date: "2025-05-21", store: "강남점", status: "미열람" },
  { id: 2, title: "[전달사항] 고객 불편사항 공유 및 개선 요청", author: "관리자", date: "2025-05-21", store: "강남점", status: "미열람" },
  { id: 3, title: "[전달사항] 고객 불편사항 공유 및 개선 요청", author: "관리자", date: "2025-05-21", store: "강남점", status: "미열람" },
  { id: 4, title: "[전달사항] 고객 불편사항 공유 및 개선 요청", author: "관리자", date: "2025-05-21", store: "강남점", status: "미열람" },
  { id: 5, title: "[전달사항] 고객 불편사항 공유 및 개선 요청", author: "관리자", date: "2025-05-21", store: "강남점", status: "미열람" },
  { id: 6, title: "[전달사항] 고객 불편사항 공유 및 개선 요청", author: "관리자", date: "2025-05-21", store: "강남점", status: "미열람" },
  { id: 7, title: "[전달사항] 고객 불편사항 공유 및 개선 요청", author: "관리자", date: "2025-05-21", store: "강남점", status: "미열람" },
  { id: 8, title: "[전달사항] 고객 불편사항 공유 및 개선 요청", author: "관리자", date: "2025-05-21", store: "강남점", status: "미열람" },
  { id: 9, title: "[전달사항] 고객 불편사항 공유 및 개선 요청", author: "관리자", date: "2025-05-21", store: "강남점", status: "미열람" },
  { id: 10, title: "[전달사항] 고객 불편사항 공유 및 개선 요청", author: "관리자", date: "2025-05-21", store: "강남점", status: "미열람" },
];

export default function ComplaintList() {
  const [complaints, setComplaints] = useState(initialComplaints);

  // 내가 본 항목 클릭 시 '열람' 처리 (여기선 제목 클릭으로 간단 처리)
  const handleView = (id) => {
    setComplaints((prev) =>
      prev.map((item) =>
        item.id === id && item.status === "미열람"
          ? { ...item, status: "열람" }
          : item
      )
    );
  };

  // 전달 버튼 클릭 시 '전달완료' 처리
  const handleForward = (id) => {
    setComplaints((prev) =>
      prev.map((item) =>
        item.id === id ? { ...item, status: "전달완료" } : item
      )
    );
  };

  return (
    <div className="complaint-container">
      <h2 className="complaint-title">불편사항</h2>

      <table className="complaint-table">
        <thead>
          <tr>
            <th></th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>점포명</th>
            <th>비고</th>
            <th>전달</th>
          </tr>
        </thead>
        <tbody>
          {complaints.map(({ id, title, author, date, store, status }) => (
            <tr key={id} className={status === "미열람" ? "unread" : ""}>
              <td>
                <input type="checkbox" />
              </td>
              <td
                className="clickable"
                onClick={() => handleView(id)}
                title="상세보기(열람처리)"
              >
                {title}
              </td>
              <td>{author}</td>
              <td>{date}</td>
              <td>{store}</td>
              <td className={`status-cell ${status.replace(" ", "").toLowerCase()}`}>
                {status}
              </td>
              <td>
                {status !== "전달완료" && (
                  <button className="btn-forward" onClick={() => handleForward(id)}>
                    전달
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
