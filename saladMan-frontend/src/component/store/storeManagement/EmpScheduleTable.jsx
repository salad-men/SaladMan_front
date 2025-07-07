import React, { useMemo, useState } from "react";
import { myAxios } from "/src/config";
import { accessTokenAtom } from "/src/atoms";
import { useAtomValue } from "jotai";
import styles from "./EmpScheduleTable.module.css";

const shiftOptions = [
    { type: "오픈", color: "#1c9cff" },
    { type: "미들", color: "#81d31e" },
    { type: "마감", color: "#f58f3a" },
    { type: "휴무", color: "#bbb" }
];

export default function EmpScheduleTable({
    year, month, employees, schedules, onRefresh
}) {
    const token = useAtomValue(accessTokenAtom);
    const [edited, setEdited] = useState({});
    const lastDay = new Date(year, month, 0).getDate();
    const days = Array.from({ length: lastDay }, (_, i) => i + 1);

    // 기존+수정 merge
    const cellMap = useMemo(() => {
        const map = {};
        for (const sch of schedules) {
            const d = new Date(sch.workDate).getDate();
            if (!map[sch.employeeId]) map[sch.employeeId] = {};
            map[sch.employeeId][d] = sch.shiftType;
        }
        return map;
    }, [schedules]);

    // select 값 변경 (임시저장)
    const handleChange = (empId, day, val) => {
        setEdited(prev => ({
            ...prev,
            [`${empId}_${day}`]: val
        }));
    };

    // 삭제는 select가 빈 값(-)일 때만 실행
    const handleDelete = async (empId, day) => {
        if (!token) return;
        await myAxios(token).delete("/store/schedule", {
            params: {
                employeeId: empId,
                workDate: `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`
            }
        });
        setEdited(prev => {
            const c = { ...prev };
            delete c[`${empId}_${day}`];
            return c;
        });
        onRefresh();
    };


    // 저장 
    const handleSave = async () => {
    if (!token) return;
    const dtos = [];

        // 1. (기존 데이터) 현재 cellMap을 기반으로 모든 직원-일자 조합 저장
        for (const emp of employees) {
            for (const day of days) {
                const key = `${emp.id}_${day}`;
                // 임시 편집값이 있으면 그 값을, 아니면 기존값(cellMap), 없으면 빈값
                const shiftType = edited[key] !== undefined
                    ? edited[key]
                    : (cellMap[emp.id]?.[day] ?? "");

                // 빈 값은 저장하지 않음
                if (!shiftType) continue;
                dtos.push({
                    employeeId: emp.id,
                    workDate: `${year}-${month.toString().padStart(2, "0")}-${day.toString().padStart(2, "0")}`,
                    shiftType
                });
            }
        }
        if (dtos.length > 0) {
            await myAxios(token).post("/store/schedule/register", dtos);
            setEdited({});
            onRefresh();
        }
    };  

    // 합계 (row, col)
    const totalByEmp = employees.reduce((acc, emp) => {
        acc[emp.id] = days.reduce((s, d) => {
            const v = (edited[`${emp.id}_${d}`] ?? cellMap[emp.id]?.[d]);
            return (v && v !== "휴무") ? s + 1 : s;
        }, 0);
        return acc;
    }, {});
    const totalByDay = days.reduce((acc, d) => {
        acc[d] = employees.reduce((s, emp) => {
            const v = (edited[`${emp.id}_${d}`] ?? cellMap[emp.id]?.[d]);
            return (v && v !== "휴무") ? s + 1 : s;
        }, 0);
        return acc;
    }, {});

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
                                <td style={{ background: "#fcf1bc", fontWeight: 600, color: "#795a00" }}>{totalByEmp[emp.id]}</td>
                                {days.map(day => (
                                    <td key={day}>
                                    <select
                                        value={edited[`${emp.id}_${day}`] ?? cellMap[emp.id]?.[day] ?? ""}
                                        onChange={e => {
                                            const v = e.target.value;
                                            if (!v) {
                                                // 빈값(-)만 삭제
                                                handleDelete(emp.id, day);
                                            } else {
                                                // 휴무도 포함해서 모두 저장
                                                handleChange(emp.id, day, v);
                                            }
                                        }}
                                        style={{
                                            minWidth: 70,
                                            background: shiftOptions.find(opt => opt.type === (edited[`${emp.id}_${day}`] ?? cellMap[emp.id]?.[day]))?.color || "#fff"
                                        }}
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
                        <tr>
                            <td style={{ background: "#edf2fa", fontWeight: 700 }}>일근무자</td>
                            <td style={{ background: "#edf2fa" }}>총계</td>
                            {days.map(day =>
                                <td key={day} style={{ background: "#edf2fa", fontWeight: 700 }}>
                                    {totalByDay[day]}
                                </td>
                            )}
                        </tr>
                    </tbody>
                </table>
            </div>
            <div className={styles.saveBar}>
                <button className={styles.saveBtn} onClick={handleSave} disabled={Object.keys(edited).length===0}>저장</button>
            </div>
        </div>
    );
}
