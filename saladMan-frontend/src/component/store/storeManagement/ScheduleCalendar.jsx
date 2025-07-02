import React, { useState, useEffect } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import interactionPlugin from "@fullcalendar/interaction";
import { myAxios } from "/src/config";
import { useAtomValue } from "jotai";
import { userAtom, accessTokenAtom } from "/src/atoms";
import styles from "./ScheduleCalendar.module.css";
import EmpScheduleTable from "./EmpScheduleTable";

const shiftOptions = [
    { type: "오픈", time: "06:00~12:00", color: "#1c9cff" },
    { type: "미들", time: "10:00~16:00", color: "#81d31e" },
    { type: "마감", time: "16:00~22:00", color: "#f58f3a" },
    { type: "휴무", time: "-", color: "#bbb" }
];

export default function ScheduleCalendar() {
    const token = useAtomValue(accessTokenAtom);
    const user = useAtomValue(userAtom);
    const storeId = user?.storeId ?? user?.id;

    const today = new Date();
    const [viewType, setViewType] = useState("calendar");
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);

    const [employees, setEmployees] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [events, setEvents] = useState([]);
    const [shiftSummary, setShiftSummary] = useState([]);

    // 직원목록
    useEffect(() => {
        if (!token || !storeId) return;
        myAxios(token).post("/store/emp/list", { storeId, page: 1 })
            .then(res => setEmployees(res.data.employees || []));
    }, [token, storeId]);

    // 월별 스케줄
    useEffect(() => {
        if (!token || !storeId) return;
        myAxios(token).get("/store/schedule/month", {
            params: { storeId, year, month }
        }).then(res => setSchedules(res.data || []));
    }, [token, storeId, year, month]);

    // 캘린더 이벤트
    useEffect(() => {
        if (!employees.length || !schedules.length) {
            setEvents([]);
            return;
        }
        const evts = schedules.map(sch => {
            const emp = employees.find(e => e.id === sch.employeeId);
            const shiftConf = shiftOptions.find(opt => opt.type === sch.shiftType);
            return {
                title: `${emp ? emp.name : "직원"} (${sch.shiftType})`,
                start: sch.workDate,
                end: sch.workDate,
                allDay: true,
                backgroundColor: shiftConf?.color || "#aaa",
                borderColor: shiftConf?.color || "#aaa"
            };
        });
        setEvents(evts);
    }, [schedules, employees]);

    // 월간 근무유형 합계
    useEffect(() => {
        if (!employees.length) {
            setShiftSummary([]);
            return;
        }
        const summary = employees.map(emp => {
            const my = schedules.filter(s => s.employeeId === emp.id);
            return {
                empName: emp.name,
                오픈: my.filter(s => s.shiftType === "오픈").length,
                미들: my.filter(s => s.shiftType === "미들").length,
                마감: my.filter(s => s.shiftType === "마감").length,
                휴무: my.filter(s => s.shiftType === "휴무").length,
            };
        });
        setShiftSummary(summary);
    }, [employees, schedules]);

    // 월 변경
    const handleMonthChange = dir => {
        if (dir === "prev") {
            if (month === 1) {
                setYear(y => y - 1);
                setMonth(12);
            } else {
                setMonth(m => m - 1);
            }
        } else if (dir === "next") {
            if (month === 12) {
                setYear(y => y + 1);
                setMonth(1);
            } else {
                setMonth(m => m + 1);
            }
        }
    };

    return (
        <div className={styles.calendarPageWrap}>
            <div className={styles.headerBar}>
                {/* 예쁜 드롭다운 (custom style) */}
                <label className={styles.dropdownLabel}>
                    <select
                        value={viewType}
                        onChange={e => setViewType(e.target.value)}
                        className={styles.dropdownSelect}
                    >
                        <option value="calendar">캘린더형</option>
                        <option value="table">테이블형</option>
                    </select>
                </label>
                <button className={styles.arrowBtn} onClick={() => handleMonthChange("prev")}>{"<"}</button>
                <span className={styles.monthTitle}>{year}년 {month}월</span>
                <button className={styles.arrowBtn} onClick={() => handleMonthChange("next")}>{">"}</button>
            </div>
            {viewType === "calendar" ? (
                <>
                    <div className={styles.legendRow}>
                        <span style={{background:"#1c9cff"}} className={styles.legendBadge}>오픈 <small>(06~12)</small></span>
                        <span style={{background:"#81d31e"}} className={styles.legendBadge}>미들 <small>(10~16)</small></span>
                        <span style={{background:"#f58f3a"}} className={styles.legendBadge}>마감 <small>(16~22)</small></span>
                        <span style={{background:"#bbb"}} className={styles.legendBadge}>휴무</span>
                    </div>
                    <div className={styles.calendarWrap}>
                        <FullCalendar
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            events={events}
                            height={480}
                            headerToolbar={false}
                            locale="ko"
                            dayMaxEvents={3}
                            editable={false}
                        />
                    </div>
                    {/* 합계표: 캘린더 width에 맞춤 */}
                    <div className={styles.summaryTableBox}>
                        <h4>월간 근무 유형 합계</h4>
                        <div className={styles.summaryTableScroll}>
                            <table className={styles.summaryTable}>
                                <thead>
                                    <tr>
                                        <th>직원명</th>
                                        <th>오픈</th>
                                        <th>미들</th>
                                        <th>마감</th>
                                        <th>휴무</th>
                                        <th>합계</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {shiftSummary.map(row =>
                                        <tr key={row.empName}>
                                            <td>{row.empName}</td>
                                            <td>{row.오픈}</td>
                                            <td>{row.미들}</td>
                                            <td>{row.마감}</td>
                                            <td>{row.휴무}</td>
                                            <td style={{fontWeight:600}}>{row.오픈 + row.미들 + row.마감}</td>
                                        </tr>
                                    )}
                                    {/* 총계 row */}
                                    <tr style={{fontWeight:"bold", background:"#f6faf7"}}>
                                        <td>총계</td>
                                        <td>{shiftSummary.reduce((s,v)=>s+v.오픈,0)}</td>
                                        <td>{shiftSummary.reduce((s,v)=>s+v.미들,0)}</td>
                                        <td>{shiftSummary.reduce((s,v)=>s+v.마감,0)}</td>
                                        <td>{shiftSummary.reduce((s,v)=>s+v.휴무,0)}</td>
                                        <td>
                                            {shiftSummary.reduce((s,v)=>s+v.오픈+v.미들+v.마감,0)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                // 테이블형: year, month, employees 전달(여기서 월동기화)
                <EmpScheduleTable year={year} month={month} employees={employees}/>
            )}
        </div>
    );
}
