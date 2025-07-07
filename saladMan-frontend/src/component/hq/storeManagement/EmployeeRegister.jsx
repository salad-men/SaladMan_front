import EmpSidebar from "./EmpSidebar";
import styles from "./EmployeeRegister.module.css";
import { useRef, useState } from "react";

export default function EmployeeRegister() {
  const [profileUrl, setProfileUrl] = useState("");
  const [selectedFileName, setSelectedFileName] = useState("");
  const fileInputRef = useRef();

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFileName(file.name);
    const reader = new FileReader();
    reader.onload = () => setProfileUrl(reader.result);
    reader.readAsDataURL(file);
  }

  return (
    <div className={styles.pageWrapper}>
      <EmpSidebar />
      <div className={styles.pageContent}>
        <h2 className={styles.pageTitle}>직원 등록</h2>
        <div className={styles.formCard}>
          <form className={styles.formSection}>
            {/* 왼쪽: 프로필 (사진 업로드) */}
            <div className={styles.formLeft}>
              <div className={styles.avatarWrap}>
                <div className={styles.avatarImageWrap}>
                  {profileUrl ? (
                    <img src={profileUrl} className={styles.avatarImage} alt="profile" />
                  ) : (
                    <svg className={styles.avatarImage} viewBox="0 0 100 100">
                      <circle cx="50" cy="38" r="22" fill="#bbb" />
                      <ellipse cx="50" cy="78" rx="30" ry="18" fill="#bbb" />
                    </svg>
                  )}
                </div>
                <button
                  className={styles.uploadBtn} onClick={(e) => { e.preventDefault(); fileInputRef.current?.click(); }}
                  type="button">
                  파일 선택
                </button>
                <input type="file" ref={fileInputRef} style={{ display: "none" }} accept="image/*"
                  onChange={handleFileChange} />
                {/* <div className={styles.fileName}>{selectedFileName || "선택된 파일 없음"}</div> */}
              </div>
            </div>
            {/* 오른쪽: 입력 폼 */}
            <div className={styles.formRight}>
              <div className={styles.formRow}>
                <label>이름</label>
                <input type="text" placeholder="이름" />
                <label>직급</label>
                <input type="text" placeholder="직급" />
              </div>
              <div className={styles.formRow}>
                <label>매장</label>
                <select>
                  <option>매장 선택</option>
                  <option>본사</option>
                  <option>강남점</option>
                </select>
                <label>입사일</label>
                <input type="date" />
              </div>
              <div className={styles.formRow}>
                <label>연락처</label>
                <input type="text" placeholder="010-0000-0000" />
                <label>이메일</label>
                <input type="email" placeholder="user@domain.com" />
              </div>
              <div className={styles.formRow}>
                <label>성별</label>
                <select>
                  <option>선택</option>
                  <option>남</option>
                  <option>여</option>
                </select>
                <label>생년월일</label>
                <input type="date" />
              </div>
              <div className={styles.formRow}>
                <label>주소</label>
                <input type="text" className={styles.longInput} placeholder="주소 입력" />
              </div>
            </div>
          </form>
          <div className={styles.buttonGroup}>
            <button className={styles.backButton}>목록</button>
            <button className={styles.submitButton}>저장</button>
          </div>
        </div>
      </div>
    </div>
  );
}
