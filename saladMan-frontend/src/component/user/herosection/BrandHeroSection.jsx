import React, { useState, useEffect } from "react";
import styles from "./HeroSection.module.css";
import { myAxios } from "../../../config";

const BrandHeroSection = () => {
  const [banner, setBanner] = useState({
    line1: "",
    line2: "",
    line3: "",
    image: "",
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [newLine1, setNewLine1] = useState("");
  const [newLine2, setNewLine2] = useState("");
  const [newImage, setNewImage] = useState("");

  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const instance = myAxios();
        const res = await instance.get("/user/banner/2");
        setBanner(res.data);
      } catch (err) {
        console.error("브랜드 배너 불러오기 실패:", err);
      }
    };

    fetchBanner();

    try {
      const storeStr = sessionStorage.getItem("store");
      if (storeStr) {
        const storeData = JSON.parse(storeStr);
        if ((storeData.role || "").trim() === "ROLE_HQ") {
          setIsAdmin(true);
        }
      }
    } catch (err) {
      console.error("store 파싱 실패:", err);
    }
  }, []);

  const handleRightClick = (e) => {
    if (!isAdmin) return;
    e.preventDefault();
    setNewLine1("");
    setNewLine2("");
    setNewImage("");
    setShowModal(true);
  };

  const handleFile = async (file) => {
    try {
      const formData = new FormData();
      formData.append("file", file);
      const instance = myAxios();
      const res = await instance.post("/user/banner/upload", formData);
      setNewImage(res.data.url);
    } catch (err) {
      console.error("업로드 실패:", err);
      alert("이미지 업로드 실패");
    }
  };

  const handleSave = async () => {
    try {
      const instance = myAxios();
      await instance.patch("/user/banner/2", {
        line1: newLine1 || banner.line1,
        line2: newLine2 || banner.line2,
        line3: banner.line3,
        image: newImage || banner.image,
      });
      setBanner({
        line1: newLine1 || banner.line1,
        line2: newLine2 || banner.line2,
        line3: banner.line3,
        image: newImage || banner.image,
      });
      setShowModal(false);
      alert("저장되었습니다.");
    } catch (err) {
      console.error("저장 실패:", err);
      alert("저장 실패!");
    }
  };

  return (
    <>
      <div className={styles.heroSection} onContextMenu={handleRightClick}>
        <h1 className={styles.title}><b>{banner.line1}</b></h1>
        <br />
        <p className={styles.subtitle}>
          <a href="/brandIntro" className={styles.atag}>스토리</a>
          <span className={styles.divider}>ㅣ</span>
          <a href="/sloganIntro" className={styles.atag}>슬로건</a>
        </p>
        <div className={styles.imageBanner}>
          <img src={banner.image} alt="브랜드" />
          <span className={styles.overlay}>{banner.line2}</span>
        </div>
      </div>

      {showModal && (
        <div className={styles.myModalContainer}>
          <div className={styles.myModal}>
            <div className={styles.modalHeader}>
              브랜드 배너 수정
            </div>
            <div className={styles.modalBody}>
              <input
                value={newLine1}
                onChange={(e) => setNewLine1(e.target.value)}
                placeholder="타이틀"
              />
              <input
                value={newLine2}
                onChange={(e) => setNewLine2(e.target.value)}
                placeholder="서브타이틀"
              />
              <div
                className={`${styles.dropContainer} ${isDragging ? styles.dragover : ""}`}
                onDragOver={(e) => {
                  e.preventDefault();
                  setIsDragging(true);
                }}
                onDragLeave={() => setIsDragging(false)}
                onDrop={(e) => {
                  e.preventDefault();
                  setIsDragging(false);
                  const file = e.dataTransfer.files[0];
                  if (file) handleFile(file);
                }}
              >
                <div className={styles.dropContent}>
                  <p>최대 10mb 이하 jpeg, png 첨부 가능</p>
                  <p>이미지를 드래그 앤 드롭하거나</p>
                  <p>아래 버튼을 클릭하여 업로드하세요.</p>
                  <label className={styles.uploadButton}>
                    이미지 가져오기
                    <input
                      type="file"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) handleFile(file);
                      }}
                    />
                  </label>
                </div>
              </div>

              {newImage && (
                <div className={styles.preview}>
                  <img src={newImage} alt="preview" />
                </div>
              )}

              <div className={styles.modalButtons}>
                <button
                  className={styles.button}
                  onClick={handleSave}
                  disabled={!newLine1 && !newLine2 && !newImage}
                >
                  저장
                </button>
                <button
                  className={styles.button}
                  onClick={() => setShowModal(false)}
                >
                  취소
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default BrandHeroSection;
