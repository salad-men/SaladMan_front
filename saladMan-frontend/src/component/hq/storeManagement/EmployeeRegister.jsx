import React, { useState } from "react";
import "./EmployeeRegister.css";
import EmpSidebar from "./EmpSidebar";

export default function EmployeeRegister() {
    const [employee, setEmployee] = useState({
        empNo: "",
        name: "",
        birth: "",
        phone: "",
        position: "",
        gender: "",
        address: "",
        joinDate: ""
    });

    const [search, setSearch] = useState({ store: "", category: "이름", keyword: "" });

    const employees = [
        { empNo: "1027", name: "홍길동", phone: "010-1234-5678", address: "서울 강남구 역삼동", position: "매니저", joinDate: "2024-01-10" },
        { empNo: "2131", name: "이수진", phone: "010-9876-4321", address: "서울 마포구 합정동", position: "직원", joinDate: "2023-08-15" },
        { empNo: "1023", name: "김재민", phone: "010-1111-2222", address: "서울 성동구 성수동", position: "파트타이머", joinDate: "2022-11-01" }
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setEmployee({ ...employee, [name]: value });
    };

    const handleSearchChange = (e) => {
        setSearch({ ...search, [e.target.name]: e.target.value });
    };

    return (
        <>
            <EmpSidebar />

            <div className="employeeRegisterContainer">

                <div className="empRegContent">
                    <h2>매장 직원</h2>
                    <div className="searchBar">
                        <select name="store" value={search.store} onChange={handleSearchChange}>
                            <option>전체</option>
                            <option>강남점</option>
                            <option>홍대점</option>
                        </select>
                        <select name="category" value={search.category} onChange={handleSearchChange}>
                            <option>이름</option>
                            <option>사원번호</option>
                        </select>
                        <input type="text" name="keyword" placeholder="검색어 입력" value={search.keyword} onChange={handleSearchChange} />
                        <button className="searchButton">검색</button>
                    </div>

                    <table className="employeeTable">
                        <thead>
                            <tr>
                                <th>사원번호</th>
                                <th>이름</th>
                                <th>연락처</th>
                                <th>주소</th>
                                <th>직책</th>
                                <th>입사일</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp.empNo}>
                                    <td>{emp.empNo}</td>
                                    <td>{emp.name}</td>
                                    <td>{emp.phone}</td>
                                    <td>{emp.address}</td>
                                    <td>{emp.position}</td>
                                    <td>{emp.joinDate}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <h2>직원 등록</h2>
                    <div className="formSection">

                        <div className="profileBox">
                            <img src="/images/profile-sample.jpg" alt="profile" className="profileImage" />
                            <input type="file" className="fileInput" />
                        </div>

                        <div className="formBox">
                            <div className="formRow">
                                <label>사원번호</label>
                                <input type="text" name="empNo" onChange={handleChange} />
                                <label>이름</label>
                                <input type="text" name="name" onChange={handleChange} />
                            </div>

                            <div className="formRow">
                                <label>생년월일</label>
                                <input type="text" name="birth" placeholder="예: 901010" onChange={handleChange} />
                                <label>연락처</label>
                                <input type="text" name="phone" placeholder="예: 010-0000-0000" onChange={handleChange} />
                            </div>

                            <div className="formRow">
                                <label>직책</label>
                                <select name="position" onChange={handleChange}>
                                    <option value="">선택</option>
                                    <option value="매니저">매니저</option>
                                    <option value="직원">직원</option>
                                    <option value="파트타이머">파트타이머</option>
                                </select>
                                <label>성별</label>
                                <div className="radioGroup">
                                    <label><input type="radio" name="gender" value="남" onChange={handleChange} /> 남</label>
                                    <label><input type="radio" name="gender" value="여" onChange={handleChange} /> 여</label>
                                </div>
                            </div>

                            <div className="formRow fullRow">
                                <label>주소</label>
                                <input type="text" name="address" onChange={handleChange} />
                            </div>

                            <div className="formRow fullRow">
                                <label>입사일</label>
                                <input type="date" name="joinDate" onChange={handleChange} />
                            </div>

                            <div className="submitRow">
                                <button className="submitButton">저장</button>
                            </div>
                        </div>
                    </div>
                </div>

            </div>
        </>
    );
}