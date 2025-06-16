import styles from "./EmployeeList.module.css";
import { useState } from "react";
import EmpSidebar from "./EmpSidebar";

export default function EmployeeList() {
    const [searchKeyword, setSearchKeyword] = useState("");

    const employees = [
        {
            empNo: "1001",
            name: "정영수",
            position: "점장",
            store: "강남점",
            phone: "010-1111-1111",
            email: "dogkim@saladman.co.kr",
            joinDate: "2022-01-01",
            schedule: "월~금 09:00~18:00"
        },
        {
            empNo: "1002",
            name: "박영운",
            position: "매니저",
            store: "강남점",
            phone: "010-2222-2222",
            email: "catpark@saladman.co.kr",
            joinDate: "2023-03-15",
            schedule: "주~금 14:00~19:00"
        }
    ];

    return (
        <>
            <div className={styles.employeeListContainer}>
                            <EmpSidebar />

                <div className={styles.employeeListContent}>
                    <h2>직원 목록</h2>

                    <div className={styles.topBar}>
                        <button className={styles.registerButton}>직원 등록</button>
                        <div className={styles.searchGroup}>
                            <input
                                type="text"
                                placeholder="이름 또는 직책명 검색"
                                value={searchKeyword}
                                onChange={(e) => setSearchKeyword(e.target.value)}
                            />
                            <button className={styles.searchButton}>검색</button>
                        </div>
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
                                <th>계정일</th>
                                <th>주간 스케줄</th>
                            </tr>
                        </thead>
                        <tbody>
                            {employees.map((emp) => (
                                <tr key={emp.empNo}>
                                    <td>{emp.empNo}</td>
                                    <td>
                                        <img
                                            src="/images/profile-placeholder.png"
                                            alt="profile"
                                            className={styles.tableProfile}
                                        />
                                    </td>
                                    <td>{emp.name}</td>
                                    <td>{emp.position}</td>
                                    <td>{emp.store}</td>
                                    <td>{emp.phone}</td>
                                    <td>{emp.email}</td>
                                    <td>{emp.joinDate}</td>
                                    <td>{emp.schedule}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
