import React, { useEffect, useState, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useAtomValue } from "jotai";
import { myAxios } from "../../../config";
import { accessTokenAtom } from "/src/atoms";
import NoticeSidebar from "./NoticeSidebar";
import styles from "./HqNoticeWrite.module.css";

export default function HqNoticeModify() {
  const { id } = useParams();
  const navigate = useNavigate();
  const token = useAtomValue(accessTokenAtom);

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imgFiles, setImgFiles] = useState([]); // [{file, preview}]
  const [fileFile, setFileFile] = useState(null);

  const imgInputRef = useRef(null);
  const fileInputRef = useRef(null);

  // 상세 데이터 로딩
  useEffect(() => {
    if (!token) return;
    myAxios(token)
      .get("/hq/notice/detail", { params: { id } })
      .then(res => {
        const data = res.data.notice;
        setTitle(data.title || "");
        setContent(data.content || "");
        // 기존 이미지 URL → preview로 저장(여러 장 지원)
        const urls = Array.isArray(data.imgFileName)
          ? data.imgFileName
          : data.imgFileName ? [data.imgFileName] : [];
        setImgFiles(urls.map(url => ({ file: null, preview: url })));
        // 파일 표시
        setFileFile(data.fileName ? { name: data.fileOriginName || data.fileName } : null);
      })
      .catch(() => alert("공지 불러오기 실패!"));
  }, [id, token]);

  // 이미지 업로드 (여러 장, 최대 5개)
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (imgFiles.length + files.length > 5) {
      alert("이미지는 최대 5개까지 첨부할 수 있습니다.");
      return;
    }
    const fileReaders = files.map(
      (file) =>
        new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (ev) => resolve({ file, preview: ev.target.result });
          reader.readAsDataURL(file);
        })
    );
    Promise.all(fileReaders).then((fileObjs) => {
      setImgFiles((prev) => [...prev, ...fileObjs].slice(0, 5));
    });
    e.target.value = ""; // 동일 파일 연속 첨부 대비
  };

  // 이미지 X버튼 삭제
  const handleRemoveImg = (idx) => {
    setImgFiles((prev) => prev.filter((_, i) => i !== idx));
  };

  // 파일 선택
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) setFileFile(file);
  };

  // 제출
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!token) return;
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 입력하세요.");
      return;
    }
    const formData = new FormData();
    formData.append("id", id);
    formData.append("title", title);
    formData.append("content", content);
    imgFiles.forEach(({ file }) => file && formData.append("img", file));
    if (fileFile && fileFile instanceof File) formData.append("file", fileFile);

    try {
      await myAxios(token).post("/hq/notice/modify", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("수정 완료!");
      navigate(`/hq/HqNoticeDetail/${id}`);
    } catch {
      alert("수정 실패!");
    }
  };

  return (
    <div className={styles.container}>
      <NoticeSidebar />
      <main className={styles.content}>
        <h2 className={styles.title}>공지 수정</h2>
        <form onSubmit={handleSubmit} className={styles.form} encType="multipart/form-data">
          <div className={styles.formRow}>
            <label className={styles.label}>제목</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={styles.input}
              required
              placeholder="제목을 입력하세요"
            />
          </div>
          <div className={styles.formRow}>
            <label className={styles.label}>내용</label>
            <textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className={styles.input}
              required
              placeholder="내용을 입력하세요"
            />
          </div>
          <div className={styles.charCount}>{content.length} / 1000</div>
          <div className={styles.formRow}>
            <label className={styles.label}>이미지</label>
            <div className={styles.imagesContainer}>
              {/* 플러스(+) 추가 버튼 항상 맨 앞 */}
              {imgFiles.length < 5 && (
                <div
                  className={`${styles.imageBox} ${styles.addBox}`}
                  onClick={() => imgInputRef.current.click()}
                  tabIndex={0}
                  role="button"
                  title="이미지 추가"
                >
                  <img src="/plus.png" alt="이미지 추가" className={styles.plusIcon} />
                  <input
                    type="file"
                    accept="image/*"
                    style={{ display: "none" }}
                    ref={imgInputRef}
                    multiple
                    onChange={handleImageChange}
                  />
                </div>
              )}
              {/* 미리보기는 오른쪽에 나란히 */}
              {imgFiles.map((img, idx) => (
                <div className={styles.imageBox} key={idx}>
                  <img
                    src={img.preview}
                    alt={`img-${idx}`}
                    className={styles.imagePreview}
                  />
                  <button
                    type="button"
                    className={styles.imgRemoveBtn}
                    title="삭제"
                    onClick={() => handleRemoveImg(idx)}
                  >
                    ×
                  </button>
                </div>
              ))}
            </div>
          </div>
          <div className={styles.formRow}>
            <label className={styles.label}>첨부파일</label>
            <div className={styles.fileAttachBox}>
              <button
                type="button"
                className={styles.fileBtn}
                onClick={() => fileInputRef.current.click()}
              >
                파일 선택
              </button>
              <span className={styles.fileName}>
                {fileFile ? fileFile.name : "선택된 파일 없음"}
              </span>
              <input
                type="file"
                ref={fileInputRef}
                style={{ display: "none" }}
                onChange={handleFileChange}
              />
            </div>
          </div>
          <div className={styles.btnBox}>
            <button type="submit" className={styles.btnSubmit}>수정 완료</button>
            <button
              type="button"
              className={styles.btnCancel}
              onClick={() => navigate(`/hq/HqNoticeDetail/${id}`)}
            >
              취소
            </button>
          </div>
        </form>
      </main>
    </div>
  );
}
