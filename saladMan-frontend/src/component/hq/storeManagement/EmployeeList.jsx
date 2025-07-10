import styles from "./EmployeeList.module.css";
import { useState,useRef, useEffect } from "react";
import EmpSidebar from "./EmpSidebar";
import { myAxios } from "/src/config";
import { accessTokenAtom } from "/src/atoms";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";

export default function EmployeeList() {
  const token = useAtomValue(accessTokenAtom);
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState("");
  const [grade, setGrade] = useState("all");
  const [storeId, setStoreId] = useState("all");
  const [employees, setEmployees] = useState([]);
  const [stores, setStores] = useState([]);
  const [pageInfo, setPageInfo] = useState({ curPage: 1, allPage: 1, startPage: 1, endPage: 1 });
  const [pageNums, setPageNums] = useState([]);
  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editImgFile, setEditImgFile] = useState(null);
  const [editImgPreview, setEditImgPreview] = useState("");
  const [editError, setEditError] = useState("");
  const [isSaving, setIsSaving] = useState(false); 
  const [isBtnDisabled, setIsBtnDisabled] = useState(false);
  const timerRef = useRef(null);
  const HQ_GRADES = ["사원", "대리", "과장", "부장", "이사", "사장"];
  const STORE_GRADES = ["파트타이머", "직원", "매니저"];
  useEffect(() => {
    if (!token) return;
    myAxios(token).get("/hq/emp/stores").then(res => setStores(res.data.stores || []));
  }, [token]);

  const fetchEmployees = (page = 1) => {
    if (!token) return;
    myAxios(token)
      .post("/hq/emp/list", {
        keyword: searchKeyword,
        grade: grade === "all" ? null : grade,
        storeId: storeId === "all" ? null : Number(storeId),
        page,
      })
      .then(res => {
        setEmployees(res.data.employees || []);
        const pi = res.data.pageInfo || { curPage: 1, allPage: 1, startPage: 1, endPage: 1 };
        setPageInfo(pi);
        setPageNums(Array.from({ length: pi.endPage - pi.startPage + 1 }, (_, i) => pi.startPage + i));
      });
  };
  useEffect(() => { fetchEmployees(1); }, [token]);
  const handleSearch = e => { e.preventDefault(); fetchEmployees(1); };
  const gotoPage = p => fetchEmployees(p);

  // 상세/수정 모달
  const handleRowClick = emp => {
    setSelected(emp);
    setEditMode(false);
    setEditForm(emp);
    setEditImgFile(null);
    setEditImgPreview(emp.imgUrl || "/images/profile-placeholder.png");
    setEditError("");
  };
  const closeModal = () => {
    setSelected(null);
    setEditMode(false);
    setEditImgFile(null);
    setEditImgPreview("");
    setEditError("");
    setIsSaving(false);
        setIsBtnDisabled(false);
    clearTimeout(timerRef.current);
  };
const startEdit = () => {
    setEditMode(true);
    setIsBtnDisabled(true);
    // 0.7초 후 버튼 활성화
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => setIsBtnDisabled(false), 700);
  };
  // 수정 input
  const handleEditChange = e => {
    const { name, value } = e.target;
    (f => ({ ...f, [name]: value }));
    if (name === "storeId") {
  setEditForm(f => ({
    ...f,
    storeId: value,
    grade: "" 
  }));
    } else {
      setEditForm(f => ({ ...f, [name]: value }));
    }
  };

  // 프로필 이미지 변경
  const handleEditImgChange = e => {
    const file = e.target.files?.[0];
    if (file) {
      setEditImgFile(file);
      const reader = new FileReader();
      reader.onload = () => setEditImgPreview(reader.result);
      reader.readAsDataURL(file);
    }
  };
  const handleEditImgDelete = () => {
    setEditImgFile(null);
    setEditImgPreview("/images/profile-placeholder.png");
    setEditForm(f => ({ ...f, imgUrl: "" }));
  };

  // 저장
  const handleEditSave = async (e) => {
    e.preventDefault();
    if (isSaving) return; // 중복 저장 방지
    setEditError("");
    if (!editForm.id) return;
    if (!editForm.name || !editForm.grade || !editForm.phone || !editForm.hireDate || !editForm.storeId || !editForm.email) {
      setEditError("필수값을 모두 입력하세요.");
      return;
    }
    try {
      setIsSaving(true);
      const formData = new FormData();
      ["id", "name", "grade", "phone", "hireDate", "address", "gender", "birthday", "empStatus", "storeId", "email"].forEach(k => formData.append(k, editForm[k] || ""));
      if (editImgFile) formData.append("img", editImgFile);
      await myAxios(token).post("/hq/emp/update", formData);
      setEditMode(false);
      setSelected(null);
      fetchEmployees(pageInfo.curPage);
    } catch {
      setEditError("수정에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className={styles.employeeListContainer}>
      <EmpSidebar />
      <div className={styles.employeeListContent}>
        <h2>직원 목록</h2>
        <div className={styles.topBar}>
          <form className={styles.searchGroup} onSubmit={handleSearch}>
            <select value={storeId} onChange={e => setStoreId(e.target.value)}>
              <option value="all">전체 매장</option>
              {stores.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            <select value={grade} onChange={e => setGrade(e.target.value)}>
              <option value="all">전체 직급</option>
              <option value="점장">점장</option>
              <option value="매니저">매니저</option>
              <option value="직원">직원</option>
              <option value="파트타이머">파트타이머</option>
            </select>
            <input type="text" placeholder="이름/직책명 검색" value={searchKeyword} onChange={e => setSearchKeyword(e.target.value)} />
            <button type="submit" className={styles.searchButton}>검색</button>
          </form>
          <button className={styles.registerButton} onClick={() => navigate("/hq/empRegister")}>직원 등록</button>
        </div>
        <table className={styles.employeeTable}>
          <thead>
            <tr>
              <th>사원번호</th>
              <th>프로필</th>
              <th>이름</th>
              <th>직급</th>
              <th>소속</th>
              <th>연락처</th>
              <th>이메일</th>
              <th>입사일</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr><td colSpan={8} style={{ textAlign: "center" }}>데이터가 없습니다.</td></tr>
            ) : employees.map(emp => (
              <tr key={emp.id} onClick={() => handleRowClick(emp)} style={{ cursor: 'pointer' }}>
                <td>{emp.id}</td>
                <td><img src={emp.imgUrl || "/profile-placeholder.png"} alt="profile" className={styles.tableProfile} /></td>
                <td>{emp.name}</td>
                <td>{emp.grade}</td>
                <td>{emp.storeName}</td>
                <td>{emp.phone}</td>
                <td>{emp.email}</td>
                <td>{emp.hireDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <button onClick={() => gotoPage(pageInfo.curPage - 1)} disabled={pageInfo.curPage <= 1}>&lt;</button>
          {pageNums.map(p => (
            <button key={p} onClick={() => gotoPage(p)}
              className={p === pageInfo.curPage ? styles.active : ""}>
              {p}
            </button>
          ))}
          <button onClick={() => gotoPage(pageInfo.curPage + 1)} disabled={pageInfo.curPage >= pageInfo.allPage}>&gt;</button>
        </div>
        {/* 상세/수정 모달 */}
        {selected && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalBoxWide}>
              <h2 className={styles.modalTitle}>직원 {editMode ? "수정" : "상세정보"}</h2>
              <form className={styles.formWideWrap} onSubmit={handleEditSave}>
                <div className={styles.profileSection}>
                  <img src={editImgPreview || "/images/profile-placeholder.png"}
                       alt="profile"
                       className={styles.profileBig2}
                  />
                  {editMode && (
                    <>
                      <input type="file"
                             id="profile-upload"
                             accept="image/*"
                             className={styles.fileInput}
                             onChange={handleEditImgChange}
                      />
                      <label htmlFor="profile-upload" className={styles.fileLabelWide}>파일 선택</label>
                      {(editImgFile || editForm.imgUrl) && (
                        <button type="button"
                                className={styles.deleteBtnWide}
                                onClick={handleEditImgDelete}>삭제</button>
                      )}
                    </>
                  )}
                </div>
                <div className={styles.fieldsSection}>
                  <div className={styles.twoColWide}>
                    <div>
                      <label>사원번호</label>
                      <input className={styles.inputWide} value={selected.id} readOnly tabIndex={-1} />
                    </div>
                    <div>
                      <label>이름</label>
                      <input className={styles.inputWide} name="name" value={editForm.name || ""} onChange={handleEditChange} readOnly={!editMode} />
                    </div>
  <div>
      <label>소속</label>
      {editMode ? (
        <select
          className={styles.inputWide}
          name="storeId"
          value={editForm.storeId || ""}
          onChange={handleEditChange}
        >
          <option value="">선택</option>
          {stores.map(s => (
            <option key={s.id} value={s.id}>{s.name}</option>
          ))}
        </select>
      ) : (
        <input className={styles.inputWide} value={selected.storeName} readOnly tabIndex={-1} />
      )}
    </div>
<div>
      <label>직급</label>
      {editMode ? (
        <select
          className={styles.inputWide}
          name="grade"
          value={editForm.grade || ""}
          onChange={handleEditChange}
          disabled={!editForm.storeId}
        >
          <option value="">직급 선택</option>
          {(() => {
            const selectedStore = stores.find(s => String(s.id) === String(editForm.storeId));
            const isHq = selectedStore && selectedStore.name.includes("본사");
            const options = isHq ? HQ_GRADES : STORE_GRADES;
            return options.map((g, i) => (
              <option key={i} value={g}>{g}</option>
            ));
          })()}
        </select>
      ) : (
        <input
          className={styles.inputWide}
          value={selected.grade}
          readOnly
          tabIndex={-1}
        />
      )}
    </div>




                    <div>
                      <label>연락처</label>
                      <input className={styles.inputWide} name="phone" value={editForm.phone || ""} onChange={handleEditChange} readOnly={!editMode} />
                    </div>
                    <div>
                      <label>이메일</label>
                      <input className={styles.inputWide} name="email" value={editForm.email || ""} onChange={handleEditChange} readOnly={!editMode} />
                    </div>
                    <div>
                      <label>입사일</label>
                      <input className={styles.inputWide} name="hireDate" type="date" value={editForm.hireDate || ""} onChange={handleEditChange} readOnly={!editMode} />
                    </div>
                    <div>
                      <label>주소</label>
                      <input className={styles.inputWide} name="address" value={editForm.address || ""} onChange={handleEditChange} readOnly={!editMode} />
                    </div>
                    <div>
                      <label>성별</label>
                      {editMode ?
                        <select className={styles.inputWide} name="gender" value={editForm.gender || ""} onChange={handleEditChange}>
                          <option value="">선택</option>
                          <option value="남">남</option>
                          <option value="여">여</option>
                        </select>
                        : <input className={styles.inputWide} value={selected.gender} readOnly tabIndex={-1} />}
                    </div>
                    <div>
                      <label>생년월일</label>
                      <input className={styles.inputWide} name="birthday" type="date" value={editForm.birthday || ""} onChange={handleEditChange} readOnly={!editMode} />
                    </div>
                    <div>
                      <label>상태</label>
                      <input className={styles.inputWide} name="empStatus" value={editForm.empStatus || ""} onChange={handleEditChange} readOnly={!editMode} />
                    </div>
                  </div>
                  {editError && <div className={styles.errorMsg}>{editError}</div>}
                  <div className={styles.bottomBtnRowWide}>
                    {!editMode ?
                      <>
                        <button type="button" className={styles.smallBtnWide} onClick={startEdit}>수정</button>
                        <button type="button" className={styles.cancelBtnWide} onClick={closeModal}>닫기</button>
                      </> :
                      <>
                        <button type="submit" className={styles.smallBtnWide} disabled={isSaving || isBtnDisabled}>저장</button>
                        <button type="button" className={styles.cancelBtnWide} onClick={closeModal} disabled={isSaving || isBtnDisabled}>취소</button>
                      </>
                    }
                  </div>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
