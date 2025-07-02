import React, { useState, useEffect } from "react";
import { myAxios } from "/src/config";
import { accessTokenAtom } from "/src/atoms";
import { useAtomValue } from "jotai";
import styles from "./EmpScheduleTable.module.css";

const shiftOptions = [
    { type: "오픈", time: "06:00~12:00", color: "#1c9cff" },
    { type: "미들", time: "10:00~16:00", color: "#81d31e" },
    { type: "마감", time: "16:00~22:00", color: "#f58f3a" },
    { type: "휴무", time: "-", color: "#bbb" }
];

export default function EmpScheduleTable({ year, month, employees }) {
    const token = useAtomValue(accessTokenAtom);
    const [days, setDays] = useState([]);
    const [schedules, setSchedules] = useState({});
    const [totalByEmployee, setTotalByEmployee] = useState({});
    const [totalByDay, setTotalByDay] = useState({});

    useEffect(() => {
        const last = new Date(year, month, 0).getDate();
        setDays(Array.from({ length: last }, (_, i) => i + 1));
    }, [year, month]);

    useEffect(() => {
        if (!token || !employees.length) return;
        const storeId = employees[0]?.storeId;
        myAxios(token).get("/store/schedule/month", {
            params: { storeId, year, month }
        }).then(res => {
            const map = {};
            for (const sch of res.data || []) {
                if (!map[sch.employeeId]) map[sch.employeeId] = {};
                const d = new Date(sch.workDate).getDate();
                map[sch.employeeId][d] = sch.shiftType;
            }
            setSchedules(map);
        });
    }, [token, year, month, employees]);

    useEffect(() => {
        const empTotal = {};
        for (const emp of employees) {
            empTotal[emp.id] = days.reduce(
                (sum, day) =>
                    (schedules[emp.id]?.[day] && schedules[emp.id][day] !== "휴무" ? sum + 1 : sum),
                0
            );
        }
        setTotalByEmployee(empTotal);

        const dayTotal = {};
        for (const day of days) {
            let cnt = 0;
            for (const emp of employees) {
                if (schedules[emp.id]?.[day] && schedules[emp.id][day] !== "휴무") cnt++;
            }
            dayTotal[day] = cnt;
        }
        setTotalByDay(dayTotal);
    }, [schedules, employees, days]);

    const handleChange = (empId, day, value) => {
        setSchedules(prev => ({
            ...prev,
            [empId]: { ...(prev[empId] || {}), [day]: value }
        }));
    };

    const handleSave = async () => {
        if (!token || !employees.length) return;
        const dtos = [];
        for (const emp of employees) {
            for (const day of days) {
                const value = schedules[emp.id]?.[day] || "";
                if (!value) continue;
                dtos.push({
                    employeeId: emp.id,
                    workDate: `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`,
                    shiftType: value
                });
            }
        }
        await myAxios(token).post("/store/schedule/register", dtos);
        alert("저장 완료!");
    };

    return (
        <div className={styles.wrapper}>
            <div style={{ overflowX: "auto" }}>
                <table className={styles.scheduleTable}>
                    <thead>
                        <tr>
                            <th style={{ background: "#f5f5f5" }}>직원명</th>
                            <th style={{ background: "#fcf1bc" }}>합계</th>
                            {days.map(day =>
                                <th key={day}>{day}</th>
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {employees.map(emp => (
                            <tr key={emp.id}>
                                <td style={{ background: "#f5f5f5", fontWeight: 600 }}>{emp.name}</td>
                                {/* 왼쪽 합계 */}
                                <td style={{ background: "#fcf1bc", fontWeight: 600, color: "#795a00" }}>{totalByEmployee[emp.id]}</td>
                                {days.map(day => (
                                    <td key={day}>
                                        <select
                                            value={schedules[emp.id]?.[day] || ""}
                                            onChange={e => handleChange(emp.id, day, e.target.value)}
                                            style={{ minWidth: 70, background: shiftOptions.find(opt => opt.type === (schedules[emp.id]?.[day] || ""))?.color || "#fff" }}
                                        >
                                            <option value="">-</option>
                                            {shiftOptions.map(opt =>
                                                <option key={opt.type} value={opt.type}>{opt.type}</option>
                                            )}
                                        </select>
                                    </td>
                                ))}
                            </tr>
                        ))}
                        {/* 하단 합계 (각 날짜별 근무자수) */}
                        <tr>
                            <td style={{ background: "#edf2fa", fontWeight: 700 }}>일근무자</td>
                            <td style={{ background: "#edf2fa" }}>총계</td>
                            {days.map(day =>
                                <td key={day} style={{ background: "#edf2fa", fontWeight: 700 }}>
                                    {totalByDay[day]}
                                </td>
                            )}
                            {/* <td style={{ background: "#edf2fa" }}></td> */}
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className={styles.saveBar}>
                <button className={styles.saveBtn} onClick={handleSave}>저장</button>
            </div>
        </div>
    );
}
