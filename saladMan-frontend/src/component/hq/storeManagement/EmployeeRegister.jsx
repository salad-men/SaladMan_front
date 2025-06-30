import styles from "./EmployeeRegister.module.css";
import EmpSidebar from "./EmpSidebar";
import { useState, useEffect } from "react";
import { myAxios } from "/src/config";
import { accessTokenAtom } from "/src/atoms";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";

export default function EmployeeRegister() {
  const token = useAtomValue(accessTokenAtom);
  const navigate = useNavigate();

  const [stores, setStores] = useState([]);
  useEffect(() => {
    if (!token) return;
    myAxios(token).get("/hq/emp/stores")
      .then(res => setStores(res.data.stores || []));
  }, [token]);

  // 입력 상태
  const [form, setForm] = useState({
    name: "", grade: "", storeId: "", phone: "",
    email: "", hireDate: "", gender: "", address: "",
    birthday: ""
  });
  const [err, setErr] = useState("");

  // 파일 업로드 상태
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState("/images/profile-placeholder.png");

  // 입력 핸들러
  const handleChange = e => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  // 프로필 파일 업로드 및 미리보기
  const handleProfileChange = e => {
    const file = e.target.files?.[0];
    if (file) {
      setImgFile(file);
      const reader = new FileReader();
      reader.onload = () => setImgPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  // 등록 제출
  const handleSubmit = async e => {
    e.preventDefault();
    if (!form.name || !form.grade || !form.storeId || !form.phone || !form.hireDate || !form.gender) {
      setErr("필수값을 모두 입력해주세요.");
      return;
    }
    const formData = new FormData();
    
    if (form.hireDate) formData.append("hireDate", form.hireDate);
    if (form.birthday) formData.append("birthday", form.birthday);
    
    formData.append("name", form.name);
    formData.append("grade", form.grade);
    formData.append("storeId", form.storeId);
    formData.append("phone", form.phone || "");
    formData.append("email", form.email || "");
    formData.append("gender", form.gender || "");
    formData.append("address", form.address || "");
    
    if (imgFile) formData.append("img", imgFile);
    console.log(formData.get("img")); 
    for (let [k, v] of formData.entries()) {
     console.log(k, v);
}
    try {
      await myAxios(token)
      .post("/hq/emp/add", formData);
      alert("직원이 등록되었습니다.");
      navigate("/hq/empList");
    } catch {
      setErr("등록에 실패했습니다.");
    }
  };

  return (
    <div className={styles.employeeRegisterContainer}>
      <EmpSidebar />
      <div className={styles.empRegContent}>
        <h2>직원 등록</h2>
        <form className={styles.formSection} onSubmit={handleSubmit} encType="multipart/form-data">
          <div className={styles.profileBox}>
            <img
              src={imgPreview}
              alt="profile"
              className={styles.profileImage}
            />
            <input type="file" className={styles.fileInput} accept="image/*" onChange={handleProfileChange} />
          </div>
          <div className={styles.formBox}>
            <div className={styles.formRow}>
              <label>이름</label>
              <input type="text" name="name" value={form.name} onChange={handleChange} required />
              <label>직급</label>
              <select name="grade" value={form.grade} onChange={handleChange} required>
                <option value="">선택</option>
                <option value="점장">점장</option>
                <option value="매니저">매니저</option>
                <option value="직원">직원</option>
                <option value="파트타이머">파트타이머</option>
              </select>
            </div>
            <div className={styles.formRow}>
              <label>매장</label>
              <select name="storeId" value={form.storeId} onChange={handleChange} required>
                <option value="">매장 선택</option>
                {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
              </select>
              <label>입사일</label>
              <input type="date" name="hireDate" value={form.hireDate} onChange={handleChange} required />
            </div>
            <div className={styles.formRow}>
              <label>연락처</label>
              <input type="text" name="phone" value={form.phone} onChange={handleChange} required placeholder="010-0000-0000" />
              <label>이메일</label>
              <input type="text" name="email" value={form.email} onChange={handleChange} placeholder="user@domain.com" />
            </div>
            <div className={styles.formRow}>
              <label>성별</label>
              <select name="gender" value={form.gender} onChange={handleChange} required>
                <option value="">선택</option>
                <option value="남">남</option>
                <option value="여">여</option>
              </select>
              <label>생년월일</label>
              <input type="date" name="birthday" value={form.birthday} onChange={handleChange} />
            </div>
            <div className={`${styles.formRow} ${styles.fullRow}`}>
              <label>주소</label>
              <input type="text" name="address" value={form.address} onChange={handleChange} />
            </div>
            {err && <div className={styles.errorMsg}>{err}</div>}
            <div className={styles.submitRow}>
              <button type="submit" className={styles.submitButton}>저장</button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
