import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { accessTokenAtom, userAtom } from "/src/atoms";
import { myAxios } from "/src/config";
import styles from "./storeDashboard.module.css";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const COLORS = [
  "#70d6ff", "#ff70a6", "#ffd670", "#ff9770", "#6eeb83",
];

// 날짜 관련 함수
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
  const [groupType, setGroupType] = useState("day");
  const [dateRange, setDateRange] = useState({ start: getWeekAgo(), end: getToday() });

  const today = new Date();
  const [curYear, setCurYear] = useState(today.getFullYear());
  const [curWeek, setCurWeek] = useState(getISOWeek(today));
  const [weekSchedule, setWeekSchedule] = useState([]);
  const [weekEmpNames, setWeekEmpNames] = useState([]);
  const [weekError, setWeekError] = useState("");

  // 하단 카드 데이터들
  const topMenus = summary?.topMenus || [];
  const expireSummary = summary?.expireSummary || {};
  const autoOrderExpectedCount = summary?.autoOrderExpectedCount ?? 0;
  const mainStocks = summary?.mainStocks || [];
  const notices = summary?.notices || [];
  const unreadComplaintCount = summary?.unreadComplaintCount ?? 0;
  const lowStockCount = summary?.lowStockCount ?? 0;
  const disposalSummary = summary?.disposalSummary || { 대기: 0, 완료: 0, 반려: 0 };
  const orderSummary = summary?.orderSummary || { 대기중: 0, 반려: 0, 입고완료: 0, 승인: 0 };

  // 차트 데이터
  const sales = summary?.sales || {};
let salesData = [];
if (groupType === "week") {
  salesData = (sales.weekly || []).map((d, idx, arr) => ({
    date: `${curYear}년 ${arr.length - idx}주차`,
    판매량: d.quantity,
    매출: d.revenue,
  })).reverse();
} else if (groupType === "month") {
  salesData = (sales.monthly || []).map((d, idx, arr) => ({
    date: `${arr.length - idx}월`,
    판매량: d.quantity,
    매출: d.revenue,
  })).reverse();
} else {
  // 일별은 날짜를 07-07 처럼 표시, 최신일이 맨 위로 (역순)
  salesData = (sales.daily || [])
    .map(d => ({
      date: d.date?.slice(5), // 'YYYY-MM-DD' → 'MM-DD'
      판매량: d.quantity,
      매출: d.revenue,
    }))
    .reverse(); // 역순
}

  const pieData = topMenus?.map(m => ({ name: m.menuName, value: m.quantity })) || [];

  // fetch summary
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
      })
      .catch(() => {
        setError("대시보드 정보를 불러올 수 없습니다.");
        setSummary(null);
      });
  }, [token, user, groupType, dateRange.start, dateRange.end]);

  // fetch week schedule
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
      })
      .catch(() => {
        setWeekSchedule([]);
        setWeekEmpNames([]);
        setWeekError("주간 근무표 정보를 불러올 수 없습니다.");
      });
  }, [token, user, curYear, curWeek]);

  const setPeriod = (type) => {
    if (type === "today") setDateRange({ start: getToday(), end: getToday() });
    if (type === "week") setDateRange({ start: getWeekAgo(), end: getToday() });
    if (type === "month") setDateRange({ start: getMonthAgo(), end: getToday() });
  };

  const handleGroupTypeClick = (type) => setGroupType(type);

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

  // === 화면 ===
  return (
    <div className={styles.dashboardWrap}>
      <div className={styles.header}>
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
          <button onClick={() => setPeriod("week")} className={styles.periodBtn}>한 주</button>
          <button onClick={() => setPeriod("month")} className={styles.periodBtn}>한 달</button>
        </div>
        <div className={styles.groupTypeBtns}>
          <button className={groupType === "day" ? styles.active : ""} onClick={() => handleGroupTypeClick("day")}>일별</button>
          <button className={groupType === "week" ? styles.active : ""} onClick={() => handleGroupTypeClick("week")}>주별</button>
          <button className={groupType === "month" ? styles.active : ""} onClick={() => handleGroupTypeClick("month")}>월별</button>
        </div>
      </div>

      {error && <div className={styles.error}>{error}</div>}

      <div className={styles.grid}>
        <div className={styles.gridCol2}>
          <div className={styles.sectionTitle}>
            <a href="/store/storeSales" style={{color:"#286180", textDecoration:"underline", fontWeight:"bold"}}>매출 및 주문 현황</a>
          </div>
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
        <div className={styles.sectionTitle}>
          <a href="/store/storeSales" style={{color:"#286180", textDecoration:"underline", fontWeight:"bold"}}>인기 메뉴 TOP5</a>
        </div>
        <ResponsiveContainer width="100%" height={250}>
          {pieData.length === 0 ? (
            <div style={{ color: "#bbb", textAlign: "center", padding: "60px 0 30px 0" }}>
              인기 메뉴 데이터가 없습니다.
            </div>
          ) : (
            <PieChart>
              <Pie data={pieData} cx="50%" cy="50%" outerRadius={86} dataKey="value" label={({ name }) => name}>
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              {/* <Legend /> <- 삭제/주석 처리 */}
              <Tooltip formatter={v => v?.toLocaleString() + "건"} />
            </PieChart>
          )}
        </ResponsiveContainer>
        <ul className={styles.pieLegendList}>
          {pieData.length === 0
            ? <li style={{ color: "#bbb" }}>인기 메뉴 없음</li>
            : pieData.map((d, idx) => (
              <li key={d.name}>
                <span className={styles.pieColor} style={{ background: COLORS[idx % COLORS.length] }} />
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
            <a href="/store/empSchedule" style={{color:"#286180", textDecoration:"underline", fontWeight:"bold"}}>주간 근무표</a>
            <span style={{ float: "right" }}>
              <button onClick={goPrevWeek} style={{ marginRight: 6 }}>이전</button>
              <b style={{ margin: "0 6px" }}>{curYear}년 {curWeek}주차</b>
              <button onClick={goNextWeek}>다음</button>
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

        {/* 집계 요약 현황 (인디케이터 적용) */}
        <div className={styles.infoCard}>
          <div className={styles.infoTitle}>집계 요약 현황</div>
          <ul className={styles.indicatorList}>
            <li>
              <span className={`${styles.indicator} ${styles.stock}`}></span>
              <b>
                <a href="/store/StoreInventoryList" style={{color:"#286180", textDecoration:"underline"}}>재고 부족</a>
              </b>: {lowStockCount}종
            </li>
            <li>
              <span className={`${styles.indicator} ${styles.expire1}`}></span>
              <b>
                <a href="/store/StoreInventoryExpiration" style={{color:"#286180", textDecoration:"underline"}}>유통기한 D-1 임박</a>
              </b>: {expireSummary.d1Count ?? 0}종
            </li>
            <li>
              <span className={`${styles.indicator} ${styles.expire0}`}></span>
              <b>
                <a href="/store/StoreInventoryExpiration" style={{color:"#286180", textDecoration:"underline"}}>유통기한 D-day 임박</a>
              </b>: {expireSummary.todayCount ?? 0}종
            </li>
            <li>
              <span className={`${styles.indicator} ${styles.dispose}`}></span>
              <b>
                <a href="/store/StoreDisposalList" style={{color:"#286180", textDecoration:"underline"}}>폐기신청목록</a>
              </b>: {disposalSummary.대기 ?? 0}건 / 완료 : {disposalSummary.완료 ?? 0}건 / 반려 : {disposalSummary.반려 ?? 0}건
            </li>
            <li>
              <span className={`${styles.indicator} ${styles.order}`}></span>
              <b>
                <a href="/store/orderList" style={{color:"#286180", textDecoration:"underline"}}>발주목록</a>
              </b>: {orderSummary.대기중 ?? 0}건 / 완료 : {orderSummary.승인 ?? 0}건 / 반려 : {orderSummary.반려 ?? 0}건
            </li>
            <li>
              <span className={`${styles.indicator} ${styles.auto}`}></span>
              <b>
                <a href="/store/orderSettings" style={{color:"#286180", textDecoration:"underline"}}>자동발주설정</a>
              </b>: {autoOrderExpectedCount}종
            </li>
          </ul>
        </div>

        {/* 공지 및 고객 문의 (인디케이터 적용) */}
        <div className={styles.infoCard}>
          <div className={styles.infoTitle}>공지 및 고객 문의</div>
          <ul className={styles.indicatorList}>
            <li>
              <span className={`${styles.indicator} ${styles.notice}`}></span>
              <a href="/store/StoreNoticeList" style={{color:"#286180", textDecoration:"underline"}}><b>최근 공지사항:</b></a>
            </li>
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
            <li>
              <span className={`${styles.indicator} ${styles.complaint}`}></span>
              <a href="/store/StoreComplaintList" style={{color:"#286180", textDecoration:"underline"}}><b>읽지 않은 고객문의</b></a>: <b>{unreadComplaintCount}</b>건
            </li>
          </ul>
        </div>
      </div>
    </div>
  );
}
