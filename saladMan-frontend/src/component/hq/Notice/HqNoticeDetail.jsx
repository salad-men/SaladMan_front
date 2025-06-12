import React, { useState } from "react";
import "./HqNoticeDetail.module.css";

export default function HqNoticeDetail() {
  // 공지사항 초기 데이터
  const initialNotice = {
    title: "[공지] 샐러드 배송 지역 확대 안내",
    author: "관리자",
    date: "2025-05-21",
    content: `고객 여러분의 많은 관심과 사랑에 힘입어 샐러드 배송 가능 지역이 확대되었습니다.

기존 지역에 더해 ○○지역에서도 신선한 샐러드를 빠르게 받아보실 수 있게 되었습니다.

앞으로도 더 많은 지역에서 만날 수 있도록 최선을 다하겠습니다. 감사합니다.`,
  };

  // 상태 관리: 수정 모드 여부, 공지 데이터
  const [notice, setNotice] = useState(initialNotice);
  const [isEditing, setIsEditing] = useState(false);

  // 수정폼 입력값 상태
  const [editTitle, setEditTitle] = useState(notice.title);
  const [editAuthor, setEditAuthor] = useState(notice.author);
  const [editContent, setEditContent] = useState(notice.content);

  // 수정 버튼 클릭
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // 등록 버튼 클릭 (수정 완료)
  const handleSubmitClick = () => {
    setNotice({
      ...notice,
      title: editTitle,
      author: editAuthor,
      content: editContent,
    });
    setIsEditing(false);
  };

  // 취소 버튼 클릭 (수정 취소)
  const handleCancelClick = () => {
    // 입력폼 값 초기화 후 편집 모드 종료
    setEditTitle(notice.title);
    setEditAuthor(notice.author);
    setEditContent(notice.content);
    setIsEditing(false);
  };

  return (
    <div className="detail-container">
      <h2 className="detail-title">공지사항</h2>

      <div className="detail-meta">
        <span className="detail-date">작성일 {notice.date}</span>
      </div>

      <table className="detail-table">
        <tbody>
          <tr>
            <th>제목</th>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  value={editTitle}
                  onChange={(e) => setEditTitle(e.target.value)}
                  className="input-text"
                />
              ) : (
                notice.title
              )}
            </td>
          </tr>
          <tr>
            <th>작성자</th>
            <td>
              {isEditing ? (
                <input
                  type="text"
                  value={editAuthor}
                  onChange={(e) => setEditAuthor(e.target.value)}
                  className="input-text"
                />
              ) : (
                notice.author
              )}
            </td>
          </tr>
          <tr>
            <th>내용</th>
            <td className="content-cell">
              {isEditing ? (
                <textarea
                  value={editContent}
                  onChange={(e) => setEditContent(e.target.value)}
                  className="input-textarea"
                  rows={12}
                />
              ) : (
                notice.content.split("\n").map((line, idx) => <p key={idx}>{line}</p>)
              )}
            </td>
          </tr>
        </tbody>
      </table>

      <div className="button-group">
        <button className="btn cancel" onClick={handleCancelClick}>
          취소
        </button>
        {isEditing ? (
          <button className="btn submit" onClick={handleSubmitClick}>
            등록
          </button>
        ) : (
          <button className="btn submit" onClick={handleEditClick}>
            수정
          </button>
        )}
      </div>
    </div>
  );
}
