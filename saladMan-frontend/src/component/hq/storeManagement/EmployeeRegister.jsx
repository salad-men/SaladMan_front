import { useRef, useState, useEffect } from "react";
import EmpSidebar from "./EmpSidebar";
import styles from "./EmployeeRegister.module.css";
import { myAxios } from "/src/config";
import { accessTokenAtom } from "/src/atoms";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";

const HQ_GRADES = ["사원", "대리", "과장", "부장", "이사", "사장"];
const STORE_GRADES = ["파트타이머", "직원", "매니저"];

export default function EmployeeRegister() {

  const token = useAtomValue(accessTokenAtom);
  const navigate = useNavigate();
  const [profileUrl, setProfileUrl] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const fileInputRef = useRef();

  // 매장 목록 불러오기
  const [stores, setStores] = useState([]);
  useEffect(() => {
    if (!token) return;
    myAxios(token).get("/hq/emp/stores").then(res => setStores(res.data.stores || []));
  }, [token]);

  // 입력값
  const [form, setForm] = useState({
    name: "",
    grade: "",
    storeId: "",
    hireDate: "",
    phone: "",
    email: "",
    gender: "",
    birthday: "",
    address: "",
    empStatus: "",
  });

  // 매장 선택 시 직급 초기화
  function handleChange(e) {
    const { name, value } = e.target;

    // 전화번호: 숫자 + 하이픈만 허용 + 13자 제한
    if (name === "phone") {
      const formatted = formatPhoneNumber(value);
      if (formatted.length <= 13) {
        setForm(prev => ({ ...prev, phone: formatted }));
      }
      return;
    }

    // 이름: 10자 제한
    if (name === "name" && value.length > 10) return;

    // 주소: 50자 제한
    if (name === "address" && value.length > 50) return;

    if (name === "storeId") {
      setForm(prev => ({
        ...prev,
        storeId: value,
        grade: "" // 매장 바꾸면 grade 초기화
      }));
    } else {
      setForm(prev => ({ ...prev, [name]: value }));
    }
  }

  function handleFileChange(e) {
    const file = e.target.files[0];
    if (!file) return;
    setSelectedFile(file);
    const reader = new FileReader();
    reader.onload = () => setProfileUrl(reader.result);
    reader.readAsDataURL(file);
  }

  function formatPhoneNumber(value) {
    // 숫자만 남기기
    const digits = value.replace(/\D/g, '');

    // 형식에 맞게 하이픈 추가
    if (digits.length <= 3) return digits;
    if (digits.length <= 7) return digits.replace(/(\d{3})(\d+)/, '$1-$2');
    return digits.replace(/(\d{3})(\d{4})(\d+)/, '$1-$2-$3');
  }



  // 매장명 찾아서 직급 옵션 결정
  const selectedStore = stores.find(s => String(s.id) === String(form.storeId));
  const isHq = selectedStore && selectedStore.name.includes("본사");
  const gradeOptions = isHq ? HQ_GRADES : STORE_GRADES;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!form.name || !form.grade || !form.phone || !form.hireDate || !form.storeId || !form.email) {
      alert("필수값을 모두 입력하세요.");
      return;
    }
    const formData = new FormData();
    ["name", "grade", "phone", "hireDate", "address", "gender", "birthday", "empStatus", "storeId", "email"].forEach(k =>
      formData.append(k, form[k] || "")
    );
    if (selectedFile) formData.append("img", selectedFile);

    try {
      await myAxios(token).post("/hq/emp/add", formData);
      alert("직원 등록이 완료되었습니다.");
      navigate("/hq/empList");
    } catch (err) {
      alert("등록 실패: " + (err.response?.data?.message || err.message));
    }
  }

  function handleBack() {
    navigate("/hq/empList");
  }

  return (
    <div className={styles.pageWrapper}>
      <EmpSidebar />
      <div className={styles.pageContent}>
        <h2 className={styles.pageTitle}>직원 등록</h2>
        <div className={styles.formCard}>
          <form className={styles.formSection} onSubmit={handleSubmit}>
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
                  className={styles.uploadBtn}
                  onClick={e => {
                    e.preventDefault();
                    fileInputRef.current?.click();
                  }}
                  type="button"
                >
                  파일 선택
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  style={{ display: "none" }}
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>
            <div className={styles.formRight}>
              <div className={styles.formRow}>
                <label>이름</label>
                <input name="name" type="text" maxLength={10} placeholder="이름" value={form.name} onChange={handleChange} />
                <label>매장</label>
                <select name="storeId" value={form.storeId} onChange={handleChange}>
                  <option value="">매장 선택</option>
                  {stores.map(store => (
                    <option key={store.id} value={store.id}>
                      {store.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className={styles.formRow}>
                <label>직급</label>
                <select
                  name="grade"
                  value={form.grade}
                  onChange={handleChange}
                  disabled={!form.storeId}
                >
                  <option value="">직급 선택</option>
                  {gradeOptions.map((g, i) => (
                    <option key={i} value={g}>
                      {g}
                    </option>
                  ))}
                </select>
                <label>입사일</label>
                <input name="hireDate" type="date" value={form.hireDate} onChange={handleChange} />
              </div>
              <div className={styles.formRow}>
                <label>연락처</label>
                <input name="phone" type="text" inputMode="numeric" placeholder="010-0000-0000" value={form.phone} onChange={handleChange} />
                <label>이메일</label>
                <input name="email" type="email" placeholder="user@domain.com" value={form.email} onChange={handleChange} />
              </div>
              <div className={styles.formRow}>
                <label>성별</label>
                <select name="gender" value={form.gender} onChange={handleChange}>
                  <option value="">선택</option>
                  <option value="남">남</option>
                  <option value="여">여</option>
                </select>
                <label>생년월일</label>
                <input name="birthday" type="date" value={form.birthday} onChange={handleChange} />
              </div>
              <div className={styles.formRow}>
                <label>주소</label>
                <input
                  name="address"
                  type="text"
                  maxLength={45}
                  className={styles.longInput}
                  placeholder="주소 입력"
                  value={form.address}
                  onChange={handleChange}
                />
              </div>
              <div className={styles.buttonGroup}>
                <button type="button" className={styles.backButton} onClick={handleBack}>
                  목록
                </button>
                <button type="submit" className={styles.submitButton}>
                  저장
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
