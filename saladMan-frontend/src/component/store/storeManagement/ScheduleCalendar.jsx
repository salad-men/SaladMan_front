import React, { useEffect, useState, useCallback } from "react";
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
    const storeId = user?.id;
    const today = new Date();

    // 월/연도, 뷰타입
    const [viewType, setViewType] = useState("calendar");
    const [year, setYear] = useState(today.getFullYear());
    const [month, setMonth] = useState(today.getMonth() + 1);

    // 데이터
    const [employees, setEmployees] = useState([]);
    const [schedules, setSchedules] = useState([]);
    const [modal, setModal] = useState(null);

    // 직원 리스트 로딩
    useEffect(() => {
        if (!token || !storeId) return;
        myAxios(token).post("/store/emp/list", { storeId, page: 1 })
            .then(res => setEmployees(res.data.employees || []));
    }, [token, storeId]);

    // 근무표 로딩(모든 뷰 공통)
    const fetchSchedules = useCallback(() => {
        if (!token || !storeId) return;
        myAxios(token).get("/store/schedule/month", {
            params: { storeId, year, month }
        }).then(res => setSchedules(res.data || []));
    }, [token, storeId, year, month]);
    useEffect(() => { fetchSchedules(); }, [fetchSchedules]);

    // 등록/수정
    const upsertSchedule = async (dtos) => {
        if (!Array.isArray(dtos)) dtos = [dtos];
        await myAxios(token).post("/store/schedule/register", dtos);
        await fetchSchedules();
    };
    // 삭제
    const deleteSchedule = async (employeeId, workDate) => {
        await myAxios(token).delete("/store/schedule", {
            params: { employeeId, workDate }
        });
        await fetchSchedules();
    };

    // 월 변경
    const handleMonthChange = dir => {
        if (dir === "prev") {
            if (month === 1) { setYear(y => y - 1); setMonth(12); }
            else setMonth(m => m - 1);
        } else if (dir === "next") {
            if (month === 12) { setYear(y => y + 1); setMonth(1); }
            else setMonth(m => m + 1);
        }
    };

    // 합계표(동일로직: 테이블/캘린더 모두 연동)
    const shiftSummary = employees.map(emp => {
        const my = schedules.filter(s => s.employeeId === emp.id);
        return {
            empName: emp.name,
            오픈: my.filter(s => s.shiftType === "오픈").length,
            미들: my.filter(s => s.shiftType === "미들").length,
            마감: my.filter(s => s.shiftType === "마감").length,
            휴무: my.filter(s => s.shiftType === "휴무").length,
        };
    });

    // 캘린더 이벤트 생성
    const events = schedules.map(sch => {
        const emp = employees.find(e => e.id === sch.employeeId);
        const conf = shiftOptions.find(opt => opt.type === sch.shiftType);
        return {
            id: `${sch.employeeId}_${sch.workDate}`,
            title: `${emp ? emp.name : "직원"} (${sch.shiftType})`,
            start: sch.workDate,
            allDay: true,
            backgroundColor: conf?.color || "#aaa",
            borderColor: conf?.color || "#aaa",
            extendedProps: {
                employeeId: sch.employeeId,
                shiftType: sch.shiftType,
                workDate: sch.workDate
            }
        };
    });

    // 셀 +버튼 (멀티 등록)
    function dayCellContent(arg) {
    if (!arg.date || arg.dayNumberText === "") return arg.dayNumberText;

    // 로컬 타임존 날짜 추출
    function getLocalDateString(date) {
        const yyyy = date.getFullYear();
        const mm = String(date.getMonth() + 1).padStart(2, "0");
        const dd = String(date.getDate()).padStart(2, "0");
        return `${yyyy}-${mm}-${dd}`;
    }

    return (
        <div style={{ position: "relative", width: "100%" }}>
            <span>{arg.dayNumberText}</span>
            <button
                className={styles.cellAddBtn}
                tabIndex={-1}
                type="button"
                onClick={e => {
                    e.preventDefault();
                    e.stopPropagation();
                    setModal({
                        mode: "multi-add",
                        // 수정된 부분!
                        date: getLocalDateString(arg.date),
                        shiftType: shiftOptions[0].type,
                        employeeIds: []
                    });
                }}
                title="스케줄 추가"
            >＋</button>
        </div>
    );
}


    // 이벤트 클릭 (수정/삭제)
    const handleEventClick = (info) => {
        const { employeeId, shiftType, workDate } = info.event.extendedProps;
        setModal({
            mode: "edit",
            date: workDate,
            employeeId,
            shiftType
        });
    };

    // 모달 저장
    const handleModalSave = async () => {
        if (!modal.employeeId || !modal.shiftType) return;
        await upsertSchedule({
            employeeId: modal.employeeId,
            workDate: modal.date,
            shiftType: modal.shiftType
        });
        setModal(null);
    };

    // 모달 삭제
    const handleModalDelete = async () => {
        await deleteSchedule(modal.employeeId, modal.date);
        setModal(null);
    };

    // 다중등록 실제 저장 함수
const handleMultiAdd = async () => {
    // 1. 이미 등록된 (이 날짜의) 스케줄 모두 수집
    const already = schedules
      .filter(s => s.workDate === modal.date)
      .map(s => ({
        employeeId: s.employeeId,
        workDate: s.workDate,
        shiftType: s.shiftType
      }));

    // 2. 신규 등록할 직원만 추림
    const newOnes = modal.employeeIds
      .filter(id => !already.some(a => a.employeeId === id))
      .map(empId => ({
        employeeId: empId,
        workDate: modal.date,
        shiftType: modal.shiftType
      }));

    // 3. 기존 + 신규 모두 합쳐서 한 번에 upsert
    await upsertSchedule([...already, ...newOnes]);
    setModal(null);
    };


    return (
        <div className={styles.calendarPageWrap}>
            <div className={styles.headerBar}>
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
                        <span style={{ background: "#1c9cff" }} className={styles.legendBadge}>오픈 <small>(06~12)</small></span>
                        <span style={{ background: "#81d31e" }} className={styles.legendBadge}>미들 <small>(10~16)</small></span>
                        <span style={{ background: "#f58f3a" }} className={styles.legendBadge}>마감 <small>(16~22)</small></span>
                        <span style={{ background: "#bbb" }} className={styles.legendBadge}>휴무</span>
                    </div>

                    <div className={styles.calendarWrap}>
                        <FullCalendar
                            key={`${year}-${month}`}
                            plugins={[dayGridPlugin, interactionPlugin]}
                            initialView="dayGridMonth"
                            initialDate={`${year}-${String(month).padStart(2, '0')}-01`}
                            events={events}
                            height={480}
                            headerToolbar={false}
                            locale="ko"
                            dayMaxEvents={3}
                            editable={false}
                            eventClick={handleEventClick}
                            dayCellContent={dayCellContent}
                        />
                    </div>

                    {/* 멀티등록 모달 */}
                    {modal && modal.mode === "multi-add" &&
                        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
                            <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
                                <h3>스케줄 다중 등록</h3>
                                <div className={styles.modalRow}>
                                    <label>날짜</label>
                                    <span>{modal.date}</span>
                                </div>
                                <div className={styles.modalRow}>
                                    <label>직원</label>
                                    <div style={{ maxHeight: 180, overflowY: "auto", display: "flex", flexDirection: "column", gap: 5 }}>
                                        {employees.map(e => {
                                            const already = schedules.some(s =>
                                                s.employeeId === e.id && s.workDate === modal.date
                                            );
                                            return (
                                                <label key={e.id} style={{ opacity: already ? 0.4 : 1 }}>
                                                    <input
                                                        type="checkbox"
                                                        disabled={already}
                                                        checked={modal.employeeIds.includes(e.id)}
                                                        onChange={ev => {
                                                            setModal(m => ({
                                                                ...m,
                                                                employeeIds: ev.target.checked
                                                                    ? [...m.employeeIds, e.id]
                                                                    : m.employeeIds.filter(id => id !== e.id)
                                                            }));
                                                        }}
                                                    />
                                                    {e.name} {already && "(이미 등록됨)"}
                                                </label>
                                            );
                                        })}
                                    </div>
                                </div>
                                <div className={styles.modalRow}>
                                    <label>근무유형</label>
                                    <select
                                        value={modal.shiftType}
                                        onChange={e => setModal(m => ({ ...m, shiftType: e.target.value }))}
                                    >
                                        {shiftOptions.map(opt =>
                                            <option key={opt.type} value={opt.type}>{opt.type}</option>
                                        )}
                                    </select>
                                </div>
                                <div className={styles.modalActions}>
                                    <button className={styles.saveBtn}
                                        disabled={modal.employeeIds.length === 0}
                                        onClick={handleMultiAdd}
                                    >
                                        추가
                                    </button>

                                    <button className={styles.cancelBtn} onClick={() => setModal(null)}>취소</button>
                                </div>
                            </div>
                        </div>
                    }
                    {/* 수정/삭제 모달 */}
                    {modal && modal.mode === "edit" &&
                        <div className={styles.modalOverlay} onClick={() => setModal(null)}>
                            <div className={styles.modalBox} onClick={e => e.stopPropagation()}>
                                <h3>스케줄 수정/삭제</h3>
                                <div className={styles.modalRow}>
                                    <label>날짜</label>
                                    <span>{modal.date}</span>
                                </div>
                                <div className={styles.modalRow}>
                                    <label>직원</label>
                                    <select
                                        value={modal.employeeId}
                                        onChange={e => setModal(m => ({ ...m, employeeId: e.target.value }))}
                                    >
                                        {employees.map(e =>
                                            <option key={e.id} value={e.id}>{e.name}</option>
                                        )}
                                    </select>
                                </div>
                                <div className={styles.modalRow}>
                                    <label>근무유형</label>
                                    <select
                                        value={modal.shiftType}
                                        onChange={e => setModal(m => ({ ...m, shiftType: e.target.value }))}
                                    >
                                        {shiftOptions.map(opt =>
                                            <option key={opt.type} value={opt.type}>{opt.type}</option>
                                        )}
                                    </select>
                                </div>
                                <div className={styles.modalActions}>
                                    <button className={styles.saveBtn} onClick={handleModalSave}>수정</button>
                                    <button className={styles.deleteBtn} onClick={handleModalDelete}>삭제</button>
                                    <button className={styles.cancelBtn} onClick={() => setModal(null)}>취소</button>
                                </div>
                            </div>
                        </div>
                    }
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
                                            <td style={{ fontWeight: 600 }}>{row.오픈 + row.미들 + row.마감}</td>
                                        </tr>
                                    )}
                                    <tr style={{ fontWeight: "bold", background: "#f6faf7" }}>
                                        <td>총계</td>
                                        <td>{shiftSummary.reduce((s, v) => s + v.오픈, 0)}</td>
                                        <td>{shiftSummary.reduce((s, v) => s + v.미들, 0)}</td>
                                        <td>{shiftSummary.reduce((s, v) => s + v.마감, 0)}</td>
                                        <td>{shiftSummary.reduce((s, v) => s + v.휴무, 0)}</td>
                                        <td>
                                            {shiftSummary.reduce((s, v) => s + v.오픈 + v.미들 + v.마감, 0)}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </>
            ) : (
                <EmpScheduleTable
                    year={year}
                    month={month}
                    employees={employees}
                    schedules={schedules}
                    onRefresh={fetchSchedules}
                />
            )}
        </div>
    );
}
