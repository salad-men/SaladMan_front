import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { myAxios } from "/src/config";
import styles from "./NewsWrite.module.css";

const NewsWrite = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [img, setImg] = useState("");
  const [isAdmin, setIsAdmin] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [today, setToday] = useState("");
  const [isEditMode, setIsEditMode] = useState(false);

  const query = new URLSearchParams(location.search);
  const type = query.get("type") || "공지사항";
  const id = query.get("id"); // 🔥 추가

  useEffect(() => {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, "0");
    const day = String(now.getDate()).padStart(2, "0");
    setToday(`${year}-${month}-${day}`);
  }, []);

  useEffect(() => {
    try {
      const storeStr = localStorage.getItem("store");
      if (storeStr) {
        const storeData = JSON.parse(storeStr);
        if ((storeData.role || "").trim() === "ROLE_HQ") {
          setIsAdmin(true);
        } else {
          setIsAdmin(false);
        }
      } else {
        setIsAdmin(false);
      }
    } catch (err) {
      console.error("store 파싱 실패:", err);
      setIsAdmin(false);
    }
  }, []);

  useEffect(() => {
    if (isAdmin === false) {
      alert("접근 권한이 없습니다.");
      navigate("/News");
    }
  }, [isAdmin, navigate]);

  // 🔥 id 있으면 수정모드
  useEffect(() => {
    if (id) {
      setIsEditMode(true);
      myAxios()
        .get(`/user/announce/${id}`)
        .then((res) => {
          setTitle(res.data.title);
          setContent(res.data.content);
          setImg(res.data.img);
        })
        .catch((err) => {
          console.error("기존 게시글 불러오기 실패:", err);
          alert("존재하지 않는 게시글입니다.");
          navigate("/News");
        });
    }
  }, [id, navigate]);

  const handleFileUpload = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const instance = myAxios();
      const res = await instance.post("/user/banner/upload", formData);
      setImg(res.data.url);
    } catch (err) {
      console.error("이미지 업로드 실패:", err);
      alert("이미지 업로드에 실패했습니다.");
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFileUpload(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) handleFileUpload(file);
  };

  const handleSubmit = async () => {
    if (!title.trim() || !content.trim()) {
      alert("제목과 내용을 모두 입력해주세요.");
      return;
    }

    if ((type === "이벤트" || type === "칭찬매장") && !img) {
      alert("이미지를 업로드해주세요.");
      return;
    }

    try {
      const instance = myAxios();
      if (isEditMode) {
        await instance.put(`/user/announce/${id}`, {
          title,
          content,
          type,
          img: type === "이벤트" || type === "칭찬매장" ? img : null,
        });
        alert(`${type} 게시물이 수정되었습니다.`);
      } else {
        await instance.post("/user/announce", {
          title,
          content,
          type,
          img: type === "이벤트" || type === "칭찬매장" ? img : null,
        });
        alert(`${type} 게시물이 등록되었습니다.`);
      }
      if (type === "이벤트") {
        navigate("/Event");
      } else if (type === "칭찬매장") {
        navigate("/PraiseStore");
      } else {
        navigate("/News");
      }
    } catch (err) {
      console.error("저장 실패:", err);
      alert(`${type} 게시물 저장에 실패했습니다.`);
    }
  };

  if (isAdmin === null) return <div>로딩중...</div>;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>
        {type} {isEditMode ? "수정" : "작성"}
      </h1>
      <div className={styles.meta}>작성일: {today}</div>
      <div className={styles.divider}></div>
      <div className={styles.form}>
        <input
          className={styles.input}
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />

        <textarea
          className={styles.textarea}
          placeholder="내용을 입력하세요"
          rows={10}
          value={content}
          onChange={(e) => setContent(e.target.value)}
        ></textarea>

        {img && (
          <div className={styles.preview}>
            <img src={img} alt="preview" />
            <button
              type="button"
              className={styles.cancelButton}
              onClick={() => setImg("")}
            >
              이미지 업로드 취소
            </button>
          </div>
        )}

        {(type === "이벤트" || type === "칭찬매장") && (
          <div
            className={`${styles.dropZone} ${
              isDragging ? styles.dragOver : ""
            }`}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onClick={() => document.getElementById("fileInput").click()}
          >
            <p>이미지를 드래그하거나 클릭해서 업로드</p>
            <p>이미지 등록은 필수입니다.</p>
            <input
              id="fileInput"
              type="file"
              accept="image/*"
              style={{ display: "none" }}
              onChange={handleFileChange}
            />
          </div>
        )}

        <div className={styles.buttons}>
          <button className={styles.buttonGreen} onClick={handleSubmit}>
            {isEditMode ? "수정" : "등록"}
          </button>
          <button className={styles.buttonGray} onClick={() => navigate(-1)}>
            취소
          </button>
        </div>
      </div>
    </div>
  );
};

export default NewsWrite;
