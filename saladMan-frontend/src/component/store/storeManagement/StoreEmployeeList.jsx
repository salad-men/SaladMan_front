import styles from "./EmployeeList.module.css";
import { useState, useEffect } from "react";
import EmpSidebar from "./StoreEmpSidebar";
import { myAxios } from "/src/config";
import { accessTokenAtom, userAtom } from "/src/atoms";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";

export default function StoreEmployeeList() {
  const token = useAtomValue(accessTokenAtom);
  const user = useAtomValue(userAtom); 
  const navigate = useNavigate();

  const [searchKeyword, setSearchKeyword] = useState("");
  const [grade, setGrade] = useState("all");
  const [employees, setEmployees] = useState([]);
  const [pageInfo, setPageInfo] = useState({ curPage: 1, allPage: 1, startPage: 1, endPage: 1 });
  const [pageNums, setPageNums] = useState([]);

  const [selected, setSelected] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editForm, setEditForm] = useState({});
  const [editImgFile, setEditImgFile] = useState(null);
  const [editImgPreview, setEditImgPreview] = useState("");
  const [editError, setEditError] = useState("");

  const fetchEmployees = (page = 1) => {
    if (!token || !user?.id) return;
    myAxios(token).post("/store/emp/list", {
      storeId: user.id, 
      keyword: searchKeyword,
      grade: grade === "all" ? null : grade,
      page,
    }).then(res => {
      setEmployees(res.data.employees || []);
      const pi = res.data.pageInfo || {curPage:1,allPage:1,startPage:1,endPage:1};
      setPageInfo(pi);
      setPageNums(Array.from({length: pi.endPage - pi.startPage + 1}, (_,i) => pi.startPage + i));
    });
  };
  useEffect(() => { fetchEmployees(1); }, [token, user]);

  const handleSearch = (e) => { e.preventDefault(); fetchEmployees(1); };
  const gotoPage = (p) => fetchEmployees(p);

  const handleRowClick = (emp) => {
    setSelected(emp);
    setEditMode(false);
    setEditForm(emp);
    setEditImgFile(null);
    setEditImgPreview(emp.imgUrl || "/images/profile-placeholder.png");
    setEditError("");
  };
  const closeModal = () => {
    setSelected(null); setEditMode(false); setEditImgFile(null); setEditImgPreview(""); setEditError("");
  };
  const startEdit = () => setEditMode(true);

  const handleEditChange = e => {
    const { name, value } = e.target;
    setEditForm(f => ({ ...f, [name]: value }));
  };

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

  const handleEditSave = async () => {
    setEditError("");
    if (!editForm.id) return;
    if (!editForm.name || !editForm.grade || !editForm.phone || !editForm.hireDate) {
      setEditError("필수값을 모두 입력하세요.");
      return;
    }
    try {
      const formData = new FormData();
      formData.append("id", editForm.id);
      formData.append("name", editForm.name || "");
      formData.append("grade", editForm.grade || "");
      formData.append("phone", editForm.phone || "");
      formData.append("hireDate", editForm.hireDate || "");
      formData.append("address", editForm.address || "");
      formData.append("gender", editForm.gender || "");
      formData.append("birthday", editForm.birthday || "");
      formData.append("empStatus", editForm.empStatus || "");
      if (editImgFile) formData.append("img", editImgFile);

      await myAxios(token).post("/store/emp/update", formData);
      setEditMode(false); setSelected(null); fetchEmployees(pageInfo.curPage);
    } catch {
      setEditError("수정에 실패했습니다.");
    }
  };

  return (
    <div className={styles.employeeListContainer}>
      <EmpSidebar />
      <div className={styles.employeeListContent}>
        <h2>직원 목록</h2>
        <div className={styles.topBar}>
          <form className={styles.searchGroup} onSubmit={handleSearch}>
            <select value={grade} onChange={e => setGrade(e.target.value)}>
              <option value="all">전체 직급</option>
              <option value="점장">점장</option>
              <option value="매니저">매니저</option>
              <option value="직원">직원</option>
              <option value="파트타이머">파트타이머</option>
            </select>
            <input
              type="text"
              placeholder="이름/직책명 검색"
              value={searchKeyword}
              onChange={e => setSearchKeyword(e.target.value)}
            />
            <button type="submit" className={styles.searchButton}>검색</button>
          </form>
        </div>
        <table className={styles.employeeTable}>
          <thead>
            <tr>
              <th>사원번호</th>
              <th>프로필</th>
              <th>이름</th>
              <th>직급</th>
              <th>연락처</th>
              <th>이메일</th>
              <th>입사일</th>
            </tr>
          </thead>
          <tbody>
            {employees.length === 0 ? (
              <tr><td colSpan={7} style={{textAlign:"center"}}>데이터가 없습니다.</td></tr>
            ) : employees.map(emp => (
              <tr key={emp.id} onClick={()=>handleRowClick(emp)} style={{cursor:'pointer'}}>
                <td>{emp.id}</td>
                <td>
                  <img
                    src={emp.imgUrl || "/images/profile-placeholder.png"}
                    alt="profile"
                    className={styles.tableProfile}
                  />
                </td>
                <td>{emp.name}</td>
                <td>{emp.grade}</td>
                <td>{emp.phone}</td>
                <td>{emp.email}</td>
                <td>{emp.hireDate}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className={styles.pagination}>
          <button onClick={()=>gotoPage(pageInfo.curPage-1)} disabled={pageInfo.curPage<=1}>&lt;</button>
          {pageNums.map(p=>(
            <button key={p} onClick={()=>gotoPage(p)} className={p===pageInfo.curPage?styles.active:""}>
              {p}
            </button>
          ))}
          <button onClick={()=>gotoPage(pageInfo.curPage+1)} disabled={pageInfo.curPage>=pageInfo.allPage}>&gt;</button>
        </div>

        {selected && (
          <div className={styles.modalOverlay}>
            <div className={styles.modalBox}>
              <h3>직원 상세정보</h3>
              <div className={styles.detailGrid}>
                <div><label>사원번호</label><span>{selected.id}</span></div>
                <div><label>이름</label>{editMode ? <input name="name" value={editForm.name||""} onChange={handleEditChange}/> : <span>{selected.name}</span>}</div>
                <div><label>직급</label>{editMode ? <select name="grade" value={editForm.grade||""} onChange={handleEditChange}>
                  <option value="">선택</option>
                  <option value="점장">점장</option>
                  <option value="매니저">매니저</option>
                  <option value="직원">직원</option>
                  <option value="파트타이머">파트타이머</option>
                </select> : <span>{selected.grade}</span>}</div>
                <div><label>연락처</label>{editMode ? <input name="phone" value={editForm.phone||""} onChange={handleEditChange}/> : <span>{selected.phone}</span>}</div>
                <div><label>이메일</label><span>{selected.email}</span></div>
                <div><label>입사일</label>{editMode ? <input name="hireDate" type="date" value={editForm.hireDate||""} onChange={handleEditChange}/> : <span>{selected.hireDate}</span>}</div>
                <div><label>주소</label>{editMode ? <input name="address" value={editForm.address||""} onChange={handleEditChange}/> : <span>{selected.address}</span>}</div>
                <div><label>성별</label>{editMode ? <select name="gender" value={editForm.gender||""} onChange={handleEditChange}>
                  <option value="">선택</option>
                  <option value="남">남</option>
                  <option value="여">여</option>
                </select> : <span>{selected.gender}</span>}</div>
                <div><label>생년월일</label>{editMode ? <input name="birthday" type="date" value={editForm.birthday||""} onChange={handleEditChange}/> : <span>{selected.birthday}</span>}</div>
                <div><label>프로필</label>{editMode ? (
                  <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
                    <img src={editImgPreview || "/images/profile-placeholder.png"} alt="profile" className={styles.tableProfile} />
                    <input type="file" accept="image/*" onChange={handleEditImgChange} />
                    {(editImgFile || editForm.imgUrl) && (
                      <button type="button" className={styles.cancelButton} style={{ marginLeft: 2 }} onClick={handleEditImgDelete}>이미지 삭제</button>
                    )}
                  </div>
                ) : (
                  <img src={selected.imgUrl || "/images/profile-placeholder.png"} alt="profile" className={styles.tableProfile} />
                )}</div>
                <div><label>상태</label>{editMode ? <input name="empStatus" value={editForm.empStatus||""} onChange={handleEditChange}/> : <span>{selected.empStatus}</span>}</div>
              </div>
              {editError && <div className={styles.errorMsg}>{editError}</div>}
              <div className={styles.detailModalBtnRow}>
                {!editMode ? (
                  <>
                    <button className={styles.editButton} onClick={startEdit}>수정</button>
                    <button className={styles.cancelButton} onClick={closeModal}>닫기</button>
                  </>
                ) : (
                  <>
                    <button className={styles.saveButton} onClick={handleEditSave}>저장</button>
                    <button className={styles.cancelButton} onClick={closeModal}>취소</button>
                  </>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
