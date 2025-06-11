import React, { useState } from "react";
import "./ComplaintDetail.css";

export default function ComplaintDetail({ initialComplaint, onBack }) {
  // 초기 불편사항 데이터 전달 props로 받음
  // initialComplaint 예:
  // {
  //   id: 1,
  //   title: "[불편사항] 강남점 매장이 더러워요.",
  //   author: "관리자",
  //   date: "2025-05-21",
  //   store: "강남점",
  //   content: `불편 매장 : 강남점

  // 강남점 매장이 더러운것 같아요. 의자에 음식물이 묻어있고 화장실도 냄새나요 매장 청소하는것 맞나요? 다시 안가고싶네요`
  // }

  const [status, setStatus] = useState("전달 전"); // 상태 관리

  const handleForward = () => {
    setStatus("전달완료");
  };

  return (
    <div className="detail-container">
      <h2 className="detail-title">불편사항</h2>

      <table className="detail-table">
        <tbody>
          <tr>
            <th>제목</th>
            <td>{initialComplaint.title}</td>
            <th>작성자</th>
            <td>{initialComplaint.author}</td>
            <th>작성일</th>
            <td>{initialComplaint.date}</td>
            <th>점포명</th>
            <td>{initialComplaint.store}</td>
          </tr>
          <tr>
            <th colSpan={1}>내용</th>
            <td colSpan={7} className="content-cell">
              {initialComplaint.content.split("\n").map((line, idx) => (
                <p key={idx}>{line}</p>
              ))}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="button-group">
        <button className="btn cancel" onClick={onBack}>
          목록으로
        </button>
        {status !== "전달완료" && (
          <button className="btn submit" onClick={handleForward}>
            {initialComplaint.store}로 전달
          </button>
        )}
        {status === "전달완료" && (
          <span className="forwarded-text">전달완료</span>
        )}
      </div>
    </div>
  );
}
