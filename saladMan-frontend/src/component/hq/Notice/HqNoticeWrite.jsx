import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { myAxios } from "../../../config";
import { tokenAtom } from "/src/atoms";
import NoticeSidebar from "./NoticeSidebar";
import styles from "./HqNoticeWrite.module.css";

export default function HqNoticeWrite() {
  const navigate = useNavigate();
  const token = useAtomValue(tokenAtom);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgFile, setImgFile] = useState(null);
  const [fileFile, setFileFile] = useState(null);
  const [imgPreview, setImgPreview] = useState(null);

  // 이미지 미리보기 설정
  const handleImageChange = e => {
    const file = e.target.files[0];
    setImgFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onload = e => setImgPreview(e.target.result);
      reader.readAsDataURL(file);
    }
  };

  const handleFileChange = e => setFileFile(e.target.files[0]);

  // 등록 함수
  const handleSubmit = async e => {
    e.preventDefault();

    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력하세요.");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (imgFile) formData.append("img", imgFile);
    if (fileFile) formData.append("file", fileFile);

    try {
        myAxios(token).post("/hq/notice/write", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("공지 등록 완료!");
      navigate("/hq/HqNoticeList");
    } catch (err) {
      alert("공지 등록 실패!");
      console.error(err);
    }
  };

  return (
    <div className={styles.container}>
      <NoticeSidebar />
      <main className={styles.content}>
        <h2>공지 등록</h2>
        <form onSubmit={handleSubmit} encType="multipart/form-data">
          <table>
            <tbody>
              <tr>
                <th>제목</th>
                <td>
                  <input
                    type="text"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                    className={styles.input}
                    required
                  />
                </td>
              </tr>
              <tr>
                <th>내용</th>
                <td>
                  <textarea
                    value={content}
                    onChange={e => setContent(e.target.value)}
                    rows={10}
                    className={styles.input}
                    required
                  />
                </td>
              </tr>
              <tr>
                <th>이미지</th>
                <td>
                    <div className={styles.fileInputWrapper}>
                    <input type="file" accept="image/*" onChange={handleImageChange} />
                    {(imgPreview || imgUrl) && (
                        <div>
                        <img
                            src={imgPreview || imgUrl}
                            alt="미리보기"
                            className={styles.filePreview}
                        />
                        {imgUrl && (
                            <div className={styles.fileActions}>
                            <button type="button" onClick={handleImgDelete}>
                                이미지 삭제
                            </button>
                            </div>
                        )}
                        </div>
                    )}
                    </div>
                </td>
                </tr>
                <tr>
                <th>첨부파일</th>
                <td>
                    <div className={styles.fileInputWrapper}>
                    <input type="file" onChange={handleFileChange} />
                    {fileUrl && (
                        <div className={styles.fileActions}>
                        <a href={fileUrl} download className={styles.fileLink}>
                            {fileOriginName || getFileNameFromUrl(fileUrl)}
                        </a>
                        <button type="button" onClick={handleFileDelete}>
                            첨부파일 삭제
                        </button>
                        </div>
                    )}
                    </div>
                </td>
                </tr>
            </tbody>
          </table>
          <div>
            <button type="submit">등록</button>
            <button type="button" onClick={() => navigate("/hq/HqNoticeList")}>목록</button>
          </div>
        </form>
      </main>
    </div>
  );
}
