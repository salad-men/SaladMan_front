import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { useNavigate, useParams } from "react-router-dom";
import { myAxios } from "../../../config";
import { accessTokenAtom } from "/src/atoms";
import styles from "./HqNoticeDetail.module.css";
import NoticeSidebar from "./NoticeSidebar";

export default function HqNoticeDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useAtomValue(accessTokenAtom);

  const [notice, setNotice] = useState({
    title: "",
    content: "",
    imgFileName: "",
    fileName: "",
    fileOriginName: ""
  });

  useEffect(() => {
    if (!token || !id) return;
    myAxios(token)
      .get("/hq/notice/detail", { params: { id } })
      .then(res => setNotice(res.data.notice))
      .catch(err => console.error("공지 불러오기 실패:", err));
  }, [id, token]);

  const imageList = Array.isArray(notice.imgFileName)
    ? notice.imgFileName
    : notice.imgFileName
      ? [notice.imgFileName]
      : [];

  const getFileNameFromUrl = url =>
    url.substring(url.lastIndexOf("/") + 1);

  const handleDelete = async () => {
    if (!window.confirm("정말 이 공지를 삭제하시겠습니까?")) return;
    try {
      await myAxios(token).delete("/hq/notice/delete", { params: { id } });
      alert("공지 삭제 완료!");
      navigate("/hq/HqNoticeList");
    } catch (err) {
      alert("공지 삭제 실패!");
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <NoticeSidebar />
      <main className={styles.content}>
        <h2 className={styles.title}>공지 상세</h2>
        <div className={styles.detail}>
          <div className={styles.detailRow}>
            <label className={styles.label}>제목</label>
            <div className={styles.value}>
              <input
                type="text"
                readOnly
                value={notice.title}
                placeholder="제목을 입력하세요"
                className={`${styles.inputLike} ${styles.inputTitle}`}
              />
            </div>
          </div>
          <div className={styles.detailRow}>
            <label className={styles.label}>내용</label>
            <div className={styles.value}>
              <textarea
                readOnly
                value={notice.content}
                placeholder="내용을 입력하세요"
                className={`${styles.inputLike} ${styles.inputContent}`}
              />
            </div>
          </div>
          <div className={styles.detailRow}>
            <label className={styles.label}>이미지</label>
            <div className={styles.value}>
              {imageList.length > 0 ? (
                <div className={styles.imagesContainer}>
                  {imageList.map((img, idx) => (
                    <div className={styles.imageBox} key={idx}>
                      <img src={img} alt={`notice-${idx}`} className={styles.imagePreview} />
                    </div>
                  ))}
                </div>
              ) : (
                <div className={styles.imageBox} />
              )}
            </div>
          </div>
          <div className={styles.detailRow}>
            <label className={styles.label}>첨부파일</label>
            <div className={styles.value}>
              <div className={styles.fileAttachBox}>
                {notice.fileName ? (
                  <a
                    href={notice.fileName}
                    download
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.fileName}
                  >
                    {notice.fileOriginName || getFileNameFromUrl(notice.fileName)}
                  </a>
                ) : (
                  <span className={styles.fileName}>선택된 파일 없음</span>
                )}
              </div>
            </div>
          </div>
          <div className={styles.btnBox}>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnSubmit}`}
              onClick={() => navigate("/hq/HqNoticeList")}
            >
              목록
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnCancel}`}
              onClick={() => navigate(`/hq/HqNoticeModify/${id}`)}
            >
              수정
            </button>
            <button
              type="button"
              className={`${styles.btn} ${styles.btnCancel}`}
              onClick={handleDelete}
            >
              삭제
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}