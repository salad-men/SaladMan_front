import React, { useRef, useEffect, useState } from "react";
import "./IntroSection2.css";
import { myAxios } from "../../../config";

const WorkingSolutionSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const [banner, setBanner] = useState({
    line1: "",
    line2: "",
    image: "",
  });

  const [isAdmin, setIsAdmin] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [newLine1, setNewLine1] = useState("");
  const [newLine2, setNewLine2] = useState("");
  const [newImage, setNewImage] = useState("");

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) observer.observe(sectionRef.current);

    return () => {
      if (sectionRef.current) observer.unobserve(sectionRef.current);
    };
  }, []);

  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const instance = myAxios();
        const res = await instance.get("/user/banner/8");
        setBanner(res.data);
      } catch (err) {
        console.error("워킹솔루션 배너 불러오기 실패:", err);
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
    // 🔥 값 비우고 placeholder로만 사용
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
    const file = e.dataTransfer.files[0];
    if (!file) return;
    await uploadImage(file);
    e.currentTarget.classList.remove("drag-over");
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.currentTarget.classList.add("drag-over");
  };

  const handleDragLeave = (e) => {
    e.currentTarget.classList.remove("drag-over");
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
      await instance.patch("/user/banner/8", {
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
        ref={sectionRef}
        className={`working-section ${isVisible ? "slide-in" : ""}`}
        onContextMenu={handleRightClick}
      >
        <div className="textBox">
          <h2>{banner.line1}</h2>
          <p>{banner.line2}</p>
          <a href="/menuPage" className="button">
            자세히 보기
          </a>
        </div>
        <div className="imageBox">
          <img src={banner.image} alt="매장 사진" />
        </div>
      </section>

      {showModal && (
        <div className="modal">
          <div className="modal-header">인트로2 배너 수정</div>
          <div className="modal-body">
            <input
              value={newLine1}
              onChange={(e) => setNewLine1(e.target.value)}
              placeholder={"제목 (line1)"}
            />
            <textarea
              value={newLine2}
              onChange={(e) => setNewLine2(e.target.value)}
              placeholder={"설명 (line2, 줄바꿈 가능)"}
              rows={3}
            />
            <div
              className="drop-area"
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
                  style={{ width: "120px", borderRadius: "6px" }}
                />
              </div>
            )}
            <div className="modal-buttons">
              <button onClick={handleSave}>저장</button>
              <button onClick={() => setShowModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default WorkingSolutionSection;
