import React, { useRef, useEffect, useState } from 'react';
import './IntroSection2.css';
import { myAxios } from '../../../config';

const WorkingSolutionSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  const [banner, setBanner] = useState({
    line1: "Salad Solution for Working You",
    line2: "당신의 바쁜 하루에 작은 위로가 되는 한 끼를 준비했어요",
    image: "/store.jpg"
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
        const res = await instance.get("/user/banner/8"); // ID=8 WorkingSolutionSection
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
      await instance.patch("/user/banner/8", {
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
      <section
        ref={sectionRef}
        className={`working-section ${isVisible ? 'slide-in' : ''}`}
        onContextMenu={handleRightClick}
      >
        <div className="textBox">
          <h2>{banner.line1}</h2>
          <p>{banner.line2}</p>
          <a href="/menuPage" className="button">자세히 보기</a>
        </div>
        <div className="imageBox">
          <img src={banner.image} alt="매장 사진" />
        </div>
      </section>

      {showModal && (
        <div className="modal">
          <h3>인트로2 배너 수정</h3>
          <input
            value={newLine1}
            onChange={(e) => setNewLine1(e.target.value)}
            placeholder="제목 (line1)"
          />
          <textarea
            value={newLine2}
            onChange={(e) => setNewLine2(e.target.value)}
            placeholder="설명 (line2)"
            rows={3}
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
            <button onClick={handleSave} disabled={!newLine1 || !newLine2 || !newImage}>저장</button>
            <button onClick={() => setShowModal(false)}>취소</button>
          </div>  
        </div>
      )}
    </>
  );
};

export default WorkingSolutionSection;
