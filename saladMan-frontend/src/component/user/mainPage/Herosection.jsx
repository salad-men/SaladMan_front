import React, { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import { userAtom } from "/src/atoms";
import { myAxios } from "../../../config";
import "./HeroSection.css";

const HeroSection = () => {
  const store = useAtomValue(userAtom); // jotai에서 현재 로그인된 사용자 정보 가져오기
  const [isAdmin, setIsAdmin] = useState(false);
  const [banner, setBanner] = useState({
    line1: "",
    line2: "",
    line3: "",
    image: "",
  });
  const [showModal, setShowModal] = useState(false);

  const [newLine1, setNewLine1] = useState("");
  const [newLine2, setNewLine2] = useState("");
  const [newLine3, setNewLine3] = useState("");
  const [newImage, setNewImage] = useState("");

  // 배너 가져오기
  useEffect(() => {
    const fetchBanner = async () => {
      try {
        const instance = myAxios();
        const res = await instance.get("/user/banner/1");
        setBanner(res.data);
      } catch (err) {
        console.error("배너 불러오기 실패:", err);
      }
    };
    fetchBanner();
  }, []);

  // Jotai atom에서 store(유저정보) 보고 HQ 권한이면 isAdmin true
  useEffect(() => {
    if (store && store.role && store.role.trim() === "ROLE_HQ") {
      setIsAdmin(true);
    }
  }, [store]);

  // 마우스 우클릭 -> 수정창
  const handleRightClick = (e) => {
    if (!isAdmin) return;
    e.preventDefault();
    setNewLine1(banner.line1);
    setNewLine2(banner.line2);
    setNewLine3(banner.line3);
    setNewImage(banner.image);
    setShowModal(true);
  };

  // 파일 업로드 (드래그 & 드롭 / 파일 선택)
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

  // 저장
  const handleSave = async () => {
    try {
      const instance = myAxios();
      await instance.patch("/user/banner/1", {
        line1: newLine1,
        line2: newLine2,
        line3: newLine3,
        image: newImage,
      });
      setBanner({
        line1: newLine1,
        line2: newLine2,
        line3: newLine3,
        image: newImage,
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
      <div
        className="hero"
        onContextMenu={handleRightClick}
        style={{ background: `url(${banner.image}) center/cover no-repeat` }}
      >
        <div className="hero-content">
          {banner.line1 && <p>{banner.line1}</p>}
          {banner.line2 && <h1>{banner.line2}</h1>}
          {banner.line3 && <p>{banner.line3}</p>}
        </div>
      </div>

      {showModal && (
        <div
          className="modal"
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <h3>메인 배너 수정</h3>
          <input
            value={newLine1}
            onChange={(e) => setNewLine1(e.target.value)}
            placeholder="첫 줄"
          />
          <input
            value={newLine2}
            onChange={(e) => setNewLine2(e.target.value)}
            placeholder="중간 줄"
          />
          <input
            value={newLine3}
            onChange={(e) => setNewLine3(e.target.value)}
            placeholder="마지막 줄"
          />
          <input
            type="text"
            value={newImage}
            onChange={(e) => setNewImage(e.target.value)}
            placeholder="이미지 URL"
          />
          <input type="file" onChange={handleFileChange} />
          {newImage && (
            <img
              src={newImage}
              alt="preview"
              style={{ width: "100px", marginTop: "10px" }}
            />
          )}
          <div className="modal-buttons">
            <button
              onClick={handleSave}
              disabled={!newLine1 || !newLine2 || !newImage}
            >
              저장
            </button>
            <button onClick={() => setShowModal(false)}>취소</button>
          </div>
        </div>
      )}
    </>
  );
};

export default HeroSection;
