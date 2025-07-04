import React, { useRef, useEffect, useState } from "react";
import "./IntroSection1.css";
import { myAxios } from "../../../config";

const IntroSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const [banner, setBanner] = useState({
    line1: "",
    line2:
      "",
    image: "",
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newLine1, setNewLine1] = useState("");
  const [newLine2, setNewLine2] = useState("");
  const [newImage, setNewImage] = useState("");
  const [isDragging, setIsDragging] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const instance = myAxios();
        const res = await instance.get("/user/banner/7");
        setBanner(res.data);
      } catch (err) {
        console.error("인트로 배너 불러오기 실패:", err);
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

  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    await uploadImage(file);
  };

  const handleDrop = async (e) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (!file) return;
    await uploadImage(file);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const uploadImage = async (file) => {
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
      await instance.patch("/user/banner/7", {
        line1: newLine1 || banner.line1,
        line2: newLine2 || banner.line2,
        line3: "",
        image: newImage || banner.image,
      });
      setBanner({
        line1: newLine1 || banner.line1,
        line2: newLine2 || banner.line2,
        line3: "",
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
      <section
        className={`section ${isVisible ? "slide-in" : "slide-out"}`}
        ref={sectionRef}
        onContextMenu={handleRightClick}
      >
        <div className="imageBox">
          <img src={banner.image} alt="샐러드" />
        </div>
        <div className="textBox">
          <h2>{banner.line1}</h2>
          <p>
            {banner.line2.split("\n").map((line, idx) => (
              <React.Fragment key={idx}>
                {line}
                <br />
              </React.Fragment>
            ))}
          </p>
          <a href="/brandIntro" className="button">
            자세히 보기
          </a>
        </div>
      </section>

      {showModal && (
        <div className="modal">
          <div className="modal-header">인트로 배너 수정</div>
          <div className="modal-body">
            <input
              value={newLine1}
              onChange={(e) => setNewLine1(e.target.value)}
              placeholder="제목 (line1)"
            />
            <textarea
              value={newLine2}
              onChange={(e) => setNewLine2(e.target.value)}
              placeholder="설명 (line2, 줄바꿈 가능)"
              rows={4}
              style={{ width: "100%", margin: "8px 0", padding: "8px", borderRadius: "4px" }}
            />
            <div
              className={`drop-area ${isDragging ? "drag-over" : ""}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
            >
              <p>이미지를 드래그하거나 클릭해서 업로드하세요</p>
              <label className="upload-button">
                파일 선택
                <input
                  type="file"
                  style={{ display: "none" }}
                  onChange={handleFileChange}
                />
              </label>
            </div>
            {newImage && (
              <div style={{ textAlign: "center", marginTop: "10px" }}>
                <img
                  src={newImage}
                  alt="preview"
                  style={{ width: "150px", borderRadius: "8px", border: "1px solid #ddd" }}
                />
              </div>
            )}
            <div className="modal-buttons">
              <button
                onClick={handleSave}
                disabled={!newLine1 && !newLine2 && !newImage}
              >
                저장
              </button>
              <button onClick={() => setShowModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default IntroSection;
