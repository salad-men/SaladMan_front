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
    if (id) {
      myAxios(token).get("/hq/notice/detail", { params: { id } })
        .then(res => setNotice(res.data.notice))
        .catch((err) =>console.error("공지 불러오기 실패:", err));
    }
  }, [id, token]);

  const getFileNameFromUrl = (url) => {
    if (!url) return "";
    return url.substring(url.lastIndexOf("/") + 1);
  };

  // 공지 삭제 함수
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
        <div className={styles.title}>공지사항 상세</div>
        <table className={styles.table}>
          <tbody>
            <tr>
              <th className={styles.label}>제목</th>
              <td className={styles.value}>{notice.title}</td>
            </tr>
            <tr>
              <th className={styles.label}>내용</th>
              <td className={styles.value} style={{ whiteSpace: "pre-line" }}>{notice.content}</td>
            </tr>
            <tr>
              <th className={styles.label}>이미지</th>
              <td className={styles.value}>
                {notice.imgFileName
                  ? <>
                      <img src={notice.imgFileName} alt="공지이미지" className={styles.image} />
                    </>
                  : "없음"
                }
              </td>
            </tr>
            <tr>
              <th className={styles.label}>첨부파일</th>
              <td className={styles.value}>
                {notice.fileName
                  ? <>
                      <a href={notice.fileName} download style={{ marginRight: 10 }}>
                        {notice.fileOriginName || getFileNameFromUrl(notice.fileName)}
                      </a>
                    </>
                  : "없음"
                }
              </td>
            </tr>
          </tbody>
        </table>

        <div className={styles.buttonGroup}>
          <button className={styles.backBtn} onClick={() => navigate("/hq/HqNoticeList")}>목록</button>
          <button className={styles.modifyBtn} onClick={() => navigate(`/hq/HqNoticeModify/${id}`)}>수정</button>
          <button className={styles.deleteBtn} onClick={handleDelete}>삭제</button>
        </div>
      </main>
    </div>
  );
}
