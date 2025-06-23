import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { useNavigate, useParams } from "react-router-dom";
import NoticeSidebar from "../Notice/NoticeSidebar";
import styles from "./HqComplaintDetail.module.css";
import { myAxios } from "../../../config";
import { accessTokenAtom } from "/src/atoms";

export default function HqComplaintDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useAtomValue(accessTokenAtom);

  const [complaint, setComplaint] = useState({
    title: "",
    storeName: "",      // branch → storeName 으로 변경
    writerNickname: "", // nickname → writerNickname
    writerEmail: "",    // email → writerEmail
    phone: "",
    writerDate: "",     // createdAt → writerDate
    content: "",
  });

  useEffect(() => {
    if (id) {
      myAxios(token)
        .get("/hq/complaint/detail", { params: { id } })
        .then(res => {
          if (res.data.complaint) {
            setComplaint(res.data.complaint);
          }
        })
        .catch(err => console.error("불편사항 불러오기 실패:", err));
    }
  }, [id, token]);

  const handleListClick = () => {
    navigate(-1);
  };

  const handleSendClick = () => {
    if (!complaint.storeName) {
      alert("지점 정보가 없습니다.");
      return;
    }
    myAxios(token)
      .post("/hq/complaint/forward", { id })
      .then(() => alert(`${complaint.storeName} 지점으로 전달되었습니다.`))
      .catch(() => alert("전달에 실패했습니다."));
  };

  return (
    <div className={styles.container}>
      <NoticeSidebar />
      <main className={styles.mainContent}>
        <h2 className={styles.pageTitle}>불편사항</h2>
        <div className={styles.writeDate}>작성일 {complaint.writerDate}</div>

        <table className={styles.detailTable}>
          <tbody>
            <tr>
              <th className={styles.tableHeader}>제목</th>
              <td className={styles.tableData}>{complaint.title}</td>
            </tr>
            <tr>
              <th className={styles.tableHeader}>지점명</th>
              <td className={styles.tableData}>{complaint.storeName}</td>
            </tr>
            <tr>
              <th className={styles.tableHeader}>고객 닉네임</th>
              <td className={`${styles.tableData} ${styles.writer}`}>
                {complaint.writerNickname}
              </td>
            </tr>
            <tr>
              <th className={styles.tableHeader}>내용</th>
              <td className={styles.tableData}>
                이메일: {complaint.writerEmail}
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
