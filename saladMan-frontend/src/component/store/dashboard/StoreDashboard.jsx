import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { accessTokenAtom, userAtom } from "/src/atoms";
import { myAxios } from "/src/config";
import styles from "./storeDashboard.module.css";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const PIE_COLORS = ["#74c69d", "#82ca9d", "#9ad0ec", "#f6c85f", "#e7717d"];

// ISO week 계산
function getISOWeek(date) {
  const target = new Date(date.valueOf());
  const dayNr = (date.getDay() + 6) % 7;
  target.setDate(target.getDate() - dayNr + 3);
  const jan4 = new Date(target.getFullYear(), 0, 4);
  const dayDiff = (target - jan4) / 86400000;
  return 1 + Math.floor(dayDiff / 7);
}

function getToday() {
  return new Date().toISOString().slice(0, 10);
}

function getWeekAgo() {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  return d.toISOString().slice(0, 10);
}

function getMonthAgo() {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
}

export default function StoreDashboard() {
  const token = useAtomValue(accessTokenAtom);
  const user = useAtomValue(userAtom);

  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [groupType, setGroupType] = useState("day"); // 그래프의 그룹 타입
  const [dateRange, setDateRange] = useState({ start: getWeekAgo(), end: getToday() }); // 기간 필터

  const today = new Date();
  const [curYear, setCurYear] = useState(today.getFullYear());
  const [curWeek, setCurWeek] = useState(getISOWeek(today));
  const [weekSchedule, setWeekSchedule] = useState([]);
  const [weekEmpNames, setWeekEmpNames] = useState([]);
  const [weekError, setWeekError] = useState("");
const topMenus = summary?.topMenus || [];  

  // 대시보드 fetch
  useEffect(() => {
    if (!token) return;
    setError("");
    myAxios(token)
      .get("/store/dashboard/summary", {
        params: {
          storeId: user.id,
          startDate: dateRange.start,
          endDate: dateRange.end,
          groupType
        }
      })
      .then(res => {
        setSummary(res.data);
        console.log("[대시보드 응답 데이터]", res.data);
      })
      .catch(err => {
        setError("대시보드 정보를 불러올 수 없습니다.");
        setSummary(null);
        console.error("[대시보드 fetch error]", err);
      });
  }, [token, user, groupType, dateRange.start, dateRange.end]);

  // 주간 근무표 fetch
  useEffect(() => {
    if (!token) return;
    setWeekError("");
    myAxios(token)
      .get("/store/dashboard/week-schedule", {
        params: { storeId: user.id, weekNo: curWeek }
      })
      .then(res => {
        const { table, empNames } = res.data || {};
        setWeekSchedule(table || []);
        setWeekEmpNames(empNames || []);
        console.log("[주간 근무표 응답]", res.data);
      })
      .catch(err => {
        setWeekSchedule([]);
        setWeekEmpNames([]);
        setWeekError("주간 근무표 정보를 불러올 수 없습니다.");
        console.error("[주간근무표 fetch error]", err);
      });
  }, [token, user, curYear, curWeek]);

  // 매출/주문 차트 데이터
  const sales = summary?.sales || {};
  const salesData =
  (groupType === "week"
    ? sales.weekly?.map((d, idx) => ({
        date: `${curYear}년 ${idx + 1}주`,
        판매량: d.quantity,
        매출: d.revenue,
      }))
    : groupType === "month"
    ? sales.monthly?.map((d, idx) => ({
        date: `${idx + 1}월`,
        판매량: d.quantity,
        매출: d.revenue,
      }))
    : sales.daily?.map((d) => ({
        date: d.date,
        판매량: d.quantity,
        매출: d.revenue,
      }))) || [];

const pieData = topMenus?.map(m => ({ name: m.menuName, value: m.quantity })) || [];


  // 하단 카드 데이터
  const expireSummary = summary?.expireSummary || {};
  const autoOrderExpectedCount = summary?.autoOrderExpectedCount ?? 0;
  const mainStocks = summary?.mainStocks || [];
  const notices = summary?.notices || [];
  const unreadComplaintCount = summary?.unreadComplaintCount ?? 0;

  const setPeriod = (type) => {
    if (type === "today") setDateRange({ start: getToday(), end: getToday() });
    if (type === "week") setDateRange({ start: getWeekAgo(), end: getToday() });
    if (type === "month") setDateRange({ start: getMonthAgo(), end: getToday() });
  };

  const handleGroupTypeClick = (type) => {
    setGroupType(type);
    // 기간을 새로 설정하지 않음, 그래프만 그룹화 방식 변경
  };

  const goPrevWeek = () => {
    if (curWeek === 1) {
      setCurYear(y => y - 1);
      setCurWeek(52);
    } else {
      setCurWeek(w => w - 1);
    }
  };

  const goNextWeek = () => {
    if (curWeek === 52) {
      setCurYear(y => y + 1);
      setCurWeek(1);
    } else {
      setCurWeek(w => w + 1);
    }
  };

  const renderGroupTypeBtns = () => (
    <div className={styles.groupTypeBtns}>
      <button className={groupType === "day" ? styles.active : ""} onClick={() => handleGroupTypeClick("day")}>일별</button>
      <button className={groupType === "week" ? styles.active : ""} onClick={() => handleGroupTypeClick("week")}>주별</button>
      <button className={groupType === "month" ? styles.active : ""} onClick={() => handleGroupTypeClick("month")}>월별</button>
    </div>
  );

  return (
    <div className={styles.dashboardWrap}>
      <div className={styles.header}>
        <div className={styles.title}>매장 대시보드</div>
        <div className={styles.periodFilter}>
          <input
            type="date"
            name="start"
            value={dateRange.start}
            onChange={e => setDateRange(prev => ({ ...prev, start: e.target.value }))} 
            max={dateRange.end}
          />
          <span> ~ </span>
          <input
            type="date"
            name="end"
            value={dateRange.end}
            onChange={e => setDateRange(prev => ({ ...prev, end: e.target.value }))} 
            min={dateRange.start}
          />
          <button onClick={() => setPeriod("today")} className={styles.periodBtn}>오늘</button>
          <button onClick={() => setPeriod("week")} className={styles.periodBtn}>1주</button>
          <button onClick={() => setPeriod("month")} className={styles.periodBtn}>1달</button>
        </div>
        {renderGroupTypeBtns()}
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.grid}>
        <div className={styles.gridCol2}>
          <div className={styles.sectionTitle}>매출 및 주문 현황</div>
          <div className={styles.salesCharts}>
            {salesData.length === 0 ? (
              <div style={{ color: "#bbb", textAlign: "center", padding: "60px 0 30px 0" }}>
                매출 및 주문 데이터가 없습니다.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height={250}>
                <ComposedChart data={salesData} margin={{ top: 24, right: 30, left: 5, bottom: 0 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis yAxisId="left" label={{ value: "판매량", position: "top", offset: 8 }} />
                  <YAxis yAxisId="right" orientation="right" label={{ value: "매출(₩)", angle: 0, position: "top", offset: 12 }} />
                  <Tooltip formatter={v => v?.toLocaleString()} />
                  <Legend />
                  <Bar yAxisId="left" dataKey="판매량" fill="#74c69d" barSize={24} />
                  <Line yAxisId="right" type="monotone" dataKey="매출" stroke="#2196f3" strokeWidth={3} dot={true} />
                </ComposedChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        <div className={styles.gridCol1}>
          <div className={styles.sectionTitle}>인기 메뉴 TOP5</div>
          <ResponsiveContainer width="100%" height={250}>
            {pieData.length === 0 ? (
              <div style={{ color: "#bbb", textAlign: "center", padding: "60px 0 30px 0" }}>
                인기 메뉴 데이터가 없습니다.
              </div>
            ) : (
              <PieChart>
                <Pie data={pieData} cx="50%" cy="50%" outerRadius={86} dataKey="value" label={({ name }) => name}>
                  {pieData.map((entry, idx) => (
                    <Cell key={`cell-${idx}`} fill={PIE_COLORS[idx % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip formatter={v => v?.toLocaleString() + "건"} />
              </PieChart>
            )}
          </ResponsiveContainer>
          <ul className={styles.pieLegendList}>
            {pieData.length === 0
              ? <li style={{ color: "#bbb" }}>인기 메뉴 없음</li>
              : pieData.map((d, idx) => (
                <li key={d.name}>
                  <span className={styles.pieColor} style={{ background: PIE_COLORS[idx % PIE_COLORS.length] }} />
                  {d.name}
                  <span className={styles.pieValue}>{d.value?.toLocaleString()}건</span>
                </li>
              ))}
          </ul>
        </div>
      </div>

      <div className={styles.rowCards}>
        <div className={`${styles.infoCard} ${styles.scheduleCard}`}>
          <div className={styles.infoTitle}>
            주간 근무표
            <span style={{ float: "right" }}>
              <button onClick={goPrevWeek} style={{ marginRight: 6 }}>이전주</button>
              <b style={{ margin: "0 6px" }}>{curYear}년 {curWeek}주차</b>
              <button onClick={goNextWeek}>다음주</button>
            </span>
          </div>
          {weekError ? (
            <div className={styles.scheduleEmptyMsg}>{weekError}</div>
          ) : weekSchedule.length === 0 ? (
            <div className={styles.scheduleEmptyMsg}>등록된 근무표가 없습니다.</div>
          ) : (
            <div style={{ overflowX: "auto" }}>
              <table className={styles.scheduleTable}>
                <thead>
                  <tr>
                    <th>이름</th>
                    <th>월</th>
                    <th>화</th>
                    <th>수</th>
                    <th>목</th>
                    <th>금</th>
                    <th>토</th>
                    <th>일</th>
                  </tr>
                </thead>
                <tbody>
                  {weekSchedule.map((row, i) => (
                    <tr key={i}>
                      <td style={{ fontWeight: 600 }}>{weekEmpNames[i] ?? ''}</td>
                      {row.map((cell, j) => <td key={j}>{cell}</td>)}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <div className={styles.infoCard}>
          <div className={styles.infoTitle}>재고 관리 현황</div>
          <ul>
            <li>⚠️ 임박/폐기 예정 재고: <b>{expireSummary.totalCount ?? 0}</b>종</li>
            <li>🔄 자동 발주 예정 품목: <b>{autoOrderExpectedCount}</b>종</li>
            <li className={styles.blockLine}>📋 주요 재고 현황</li>
            {mainStocks.length === 0
              ? <li style={{ color: "#bbb" }}>주요 재고 없음</li>
              : mainStocks.map(item => (
                <li key={item.ingredientName}>{item.ingredientName} - {item.remainQuantity}{item.unit}</li>
              ))}
          </ul>
        </div>

        <div className={styles.infoCard}>
          <div className={styles.infoTitle}>공지 및 고객 문의</div>
          <ul>
            <li className={styles.blockLine}>최근 공지사항:</li>
            <ul className={styles.top3List}>
              {notices.length === 0
                ? <li style={{ color: "#bbb" }}>공지 없음</li>
                : notices.slice(0, 5).map((n, idx) => (
                  <li key={n.id}>
                    <b>{n.title}</b>
                    <span className={styles.noticeDate}>{n.regDate?.slice(0, 10)}</span>
                  </li>
                ))}
            </ul>
            <li className={styles.blockLine}>
              읽지 않은 고객문의: <b>{unreadComplaintCount}</b>건
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
} 
