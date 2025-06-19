import React from "react";
import { useNavigate } from "react-router-dom";
import NoticeSidebar from "../notice/NoticeSidebar";
import styles from "./HqComplaintDetail.module.css";

export default function HqComplaintDetail() {
  const navigate = useNavigate();

  const complaint = {
    title: "[문의사항] 전 매장에 식수가 없는 이유가 궁금해요",
    branch: "강남점",
    nickname: "○○○",
    email: "asdsad@naver.com",
    phone: "010-1234-5678",
    createdAt: "2025-05-21",
    content:
      "전 매장에 물이 없던데 왜 물이 없는거죠 ???? 물 마시고 싶어요 물좀 비치 해주세요!! 물 얼마 안하잖아요?",
  };

  const handleListClick = () => {
    navigate(-1);
  };

  const handleSendClick = () => {
    alert(`${complaint.branch} 지점으로 전달되었습니다.`);
  };

  return (
    <div className={styles.container}>
      <NoticeSidebar />
      <main className={styles.mainContent}>
        <h2 className={styles.pageTitle}>불편사항</h2>
        <div className={styles.writeDate}>작성일 {complaint.createdAt}</div>

        <table className={styles.detailTable}>
          <tbody>
            <tr>
              <th className={styles.tableHeader}>제목</th>
              <td className={styles.tableData}>{complaint.title}</td>
            </tr>
            <tr>
              <th className={styles.tableHeader}>지점명</th>
              <td className={styles.tableData}>{complaint.branch}</td>
            </tr>
            <tr>
              <th className={styles.tableHeader}>고객 닉네임</th>
              <td className={`${styles.tableData} ${styles.writer}`}>{complaint.nickname}</td>
            </tr>
            <tr>
              <th className={styles.tableHeader}>내용</th>
              <td className={styles.tableData}>
                이메일: {complaint.email}
                <br />
                {complaint.phone && (
                  <>
                    고객번호: {complaint.phone}
                    <br />
                  </>
                )}
                <br />
                {complaint.content}
              </td>
            </tr>
          </tbody>
        </table>

        <div className={styles.buttonGroup}>
          <button className={styles.listButton} onClick={handleListClick}>
            목록
          </button>
          <button className={styles.sendButton} onClick={handleSendClick}>
            전달
          </button>
        </div>
      </main>
    </div>
  );
}