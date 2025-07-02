import React, { useState, useEffect } from "react";
import styles from './HeroSection.module.css';
import { myAxios } from "../../../config";

const NutritionHeroSection = () => {
  const [banner, setBanner] = useState({
    line1: "",
    line2: "",
    image: ""
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newLine1, setNewLine1] = useState("");
  const [newLine2, setNewLine2] = useState("");
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const instance = myAxios();
        const res = await instance.get("/user/banner/5"); // ID 5 - 영양표 배너
        setBanner(res.data);
      } catch (err) {
        console.error("영양표 배너 불러오기 실패:", err);
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
    setNewLine1(banner.line1);
    setNewLine2(banner.line2);
    setNewImage(banner.image);
    setShowModal(true);
  };

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
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
      await instance.patch("/user/banner/5", {
        line1: newLine1,
        line2: newLine2,
        line3: "", 
        image: newImage
      });
      setBanner({
        line1: newLine1,
        line2: newLine2,
        line3: "",
        image: newImage
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
        <div className={styles.imageBanner}>
          <img src={banner.image} alt="영양표" />
          <span className={styles.Overlay}>{banner.line2}</span>
        </div>
      </div>

      {showModal && (
        <div className="modal">
          <h3>영양표 배너 수정</h3>
          <input
            value={newLine1}
            onChange={(e) => setNewLine1(e.target.value)}
            placeholder="타이틀 (line1)"
          />
          <input
            value={newLine2}
            onChange={(e) => setNewLine2(e.target.value)}
            placeholder="서브타이틀 (line2)"
          />
          <input
            type="text"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            placeholder="이미지 URL"
          />
          <input type="file" onChange={handleFileChange} />
          {newImage && (
            <img src={newImage} alt="preview" style={{ width: "100px", marginTop: "10px" }} />
          )}
          <div className="modal-buttons">
            <button  className={styles.button} onClick={handleSave} disabled={!newLine1 || !newLine2 || !newImage}>저장</button>
            <button  className={styles.button} onClick={() => setShowModal(false)}>취소</button>
          </div>
        </div>
      )}
    </>
  );
};

export default NutritionHeroSection;
