import React, { useEffect, useState } from "react";
import { useAtomValue  } from "jotai";
import { useNavigate,useParams } from "react-router-dom";
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
    storeName: "",
    writerNickname: "",
    writerEmail: "",
    phone: "",
    writerDate: "",
    content: "",
  });

  useEffect(() => {
    if (!token || !id) return;
    myAxios(token)
      .get("/hq/complaint/detail", { params: { id } })
      .then(res => {
        if (res.data.complaint) setComplaint(res.data.complaint);
      });
  }, [id, token]);

  const handleListClick = () => navigate(-1);

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
      <main className={styles.content}>
        <h2 className={styles.title}>불편사항 상세</h2>
        <div className={styles.detail}>
          <div className={styles.detailRow}>
            <label className={styles.label}>제목</label>
            <div className={styles.value}>
              <input
                type="text"
                readOnly
                value={complaint.title}
                placeholder="제목"
                className={styles.inputLike}
              />
            </div>
          </div>
          <div className={styles.detailRow}>
            <label className={styles.label}>지점명</label>
            <div className={styles.value}>
              <input
                type="text"
                readOnly
                value={complaint.storeName}
                placeholder="지점명"
                className={styles.inputLike}
              />
            </div>
          </div>
          <div className={styles.detailRow}>
            <label className={styles.label}>고객 닉네임</label>
            <div className={styles.value}>
              <input
                type="text"
                readOnly
                value={complaint.writerNickname}
                placeholder="닉네임"
                className={styles.inputLike}
              />
            </div>
          </div>
          <div className={styles.detailRow}>
            <label className={styles.label}>이메일/전화</label>
            <div className={styles.value}>
              <input
                type="text"
                readOnly
                value={
                  (complaint.writerEmail || "-") +
                  (complaint.phone ? ` / ${complaint.phone}` : "")
                }
                placeholder="이메일/전화"
                className={styles.inputLike}
              />
            </div>
          </div>
          <div className={styles.detailRow}>
            <label className={styles.label}>내용</label>
            <div className={styles.value}>
              <textarea
                readOnly
                value={complaint.content}
                placeholder="내용"
                className={styles.inputLike}
              />
            </div>
          </div>
          <div className={styles.detailRow}>
            <label className={styles.label}>작성일</label>
            <div className={styles.value}>
              <input
                type="text"
                readOnly
                value={complaint.writerDate}
                placeholder="작성일"
                className={styles.inputLike}
              />
            </div>
          </div>
          <div className={styles.btnBox}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSubmit}`}
              onClick={handleListClick}
            >
              목록
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnCancel}`}
              onClick={handleSendClick}
            >
              전달
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
