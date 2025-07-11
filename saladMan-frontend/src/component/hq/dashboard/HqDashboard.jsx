import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "/src/atoms";
import { myAxios } from "/src/config";
import styles from "./HqDashboard.module.css";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";

const COLORS = [
  "#70d6ff", // 하늘색 
  "#ff70a6", // 핑크 
  "#ffd670", // 노랑 
  "#ff9770", // 오렌지 
  "#6eeb83", // 연두
];
// 날짜 관련 유틸
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

// X축 라벨 변환 (주/월 구분)
function formatXAxisLabel(date, groupType) {
  if (groupType === "week") {
    if (!date) return "";
    const parts = date.split("-");
    // 예: "2024-27" → "27주차"
    return parts.length === 2 ? `${Number(parts[1])}주차` : date;
  }
  if (groupType === "month") {
    if (!date) return "";
    const parts = date.split("-");
    // 예: "2024-07" → "7월"
    return parts.length === 2 ? `${Number(parts[1])}월` : date;
  }
  return date;
}

export default function HqDashboard() {
  const token = useAtomValue(accessTokenAtom);
  const [dateRange, setDateRange] = useState({ start: getWeekAgo(), end: getToday() });
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [groupType, setGroupType] = useState("day"); // day, week, month

  // 데이터 요청
  useEffect(() => {
    if (!token) return;
    setLoading(true);
    setError("");
    myAxios(token)
      .get("/hq/dashboard/summary", {
        params: {
          startDate: dateRange.start,
          endDate: dateRange.end,
          groupType,
        }
      })
      .then(res => {
        setSummary(res.data);
              console.log("백엔드 응답 summary:", res.data);

        setLoading(false);
      })
      .catch(err => {
        setSummary(null);
        setLoading(false);
        setError("요약 데이터를 불러올 수 없습니다.");
        console.error(err);
      });
  }, [token, dateRange.start, dateRange.end, groupType]);

  // 매출 차트 데이터
  const groupTypeMap = { day: "daily", week: "weekly", month: "monthly" };
  const salesKey = groupTypeMap[groupType] || "daily";
  const salesArr = summary?.sales?.[salesKey] ?? [];
  const salesData = salesArr.map(d => ({
    date: d.date,
    판매량: d.quantity,
    매출: d.revenue,
  }));
  const displaySalesData = [...salesData].reverse();


  // 인기 메뉴 Pie 데이터
  const topMenus = summary?.topMenus?.length ? summary.topMenus.slice(0, 5) : [];
  const pieData = topMenus.map(m => ({
    name: m.menuName,
    value: m.quantity,
  }));

  // 하단 요약
  const expireSummary = summary?.expireSummary || {};
  const expireTotalCount = expireSummary.totalCount ?? 0;
  const d1Count = expireSummary.d1Count ?? 0;
  const todayCount = expireSummary.todayCount ?? 0;
  const lowStockCount = summary?.lowStockCount ?? 0;
  const orderSummary = summary?.orderSummary || {};
  const orderTotalCount = orderSummary.totalCount ?? 0;
  const orderTop3 = orderSummary.top3 || [];
  const disposalSummary = summary?.disposalSummary || {};
  const disposalTotalCount = disposalSummary.totalCount ?? 0;
  const disposalTop3 = disposalSummary.top3 || [];
  const notices = summary?.notices?.slice(0, 4) || [];

  // 불편 접수 건수
  const [unreadComplaintCount, setUnreadComplaintCount] = useState(0);
  useEffect(() => {
    if (!token) return;
    myAxios(token)
      .post("/hq/complaint/list", { page: 1, size: 1, keyword: "" })
      .then(res => {
        const unread = (res.data.complaintList || []).filter(c => !c.isHqRead).length;
        setUnreadComplaintCount(unread);
      });
  }, [token]);

  // 기간 프리셋
  const setPeriod = (type) => {
    if (type === "today") setDateRange({ start: getToday(), end: getToday() });
    if (type === "week") setDateRange({ start: getWeekAgo(), end: getToday() });
    if (type === "month") setDateRange({ start: getMonthAgo(), end: getToday() });
  };

  // 단위 버튼
  const renderGroupTypeBtns = () => (
    <div className={styles.groupTypeBtns}>
      <button className={groupType === "day" ? styles.active : ""} onClick={() => setGroupType("day")}>일별</button>
      <button className={groupType === "week" ? styles.active : ""} onClick={() => setGroupType("week")}>주별</button>
      <button className={groupType === "month" ? styles.active : ""} onClick={() => setGroupType("month")}>월별</button>
    </div>
  );

  // === 화면 ===
  return (
    <div className={styles.dashboardWrap}>
      <div className={styles.header}>
        <div className={styles.title}>대시보드</div>
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
      <div className={styles.grid}>
        {/* 1열: 매출 요약/차트 */}
        <div className={styles.gridCol2}>
          <div className={styles.sectionTitle}>전국 매출 요약</div>
          <div className={styles.rowStats}>
            <div>
              <div className={styles.statsLabel}>총 매출</div>
              <div className={styles.statsValue}>
                ₩{(summary?.sales?.summary?.totalRevenue ?? 0).toLocaleString()}
              </div>
            </div>
            <div>
              <div className={styles.statsLabel}>총 판매 수량</div>
              <div className={styles.statsValue}>
                {(summary?.sales?.summary?.totalQuantity ?? 0).toLocaleString()}건
              </div>
            </div>
          </div>
          <div className={styles.salesCharts}>
            {loading ? <div className={styles.loading}>로딩중...</div>
              : error ? <div className={styles.error}>{error}</div>
                : (
                <ResponsiveContainer width="100%" height={290}>
                  <ComposedChart
                    data={displaySalesData}
                    margin={{ top: 32, right: 32, left: 16, bottom: 0 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis
                      dataKey="date"
                      tickFormatter={d => formatXAxisLabel(d, groupType)}
                    />
                    <YAxis yAxisId="left" label={{ value: "판매량", position: "top", offset: 8 }} />
                    <YAxis yAxisId="right" orientation="right"
                      label={{ value: "매출(₩)", angle: 0, position: "top", offset: 16 }} />
                    <Tooltip formatter={v => v?.toLocaleString()} />
                    <Legend />
                    {/* 막대그래프: 판매량 */}
                    <Bar yAxisId="left" dataKey="판매량" fill="#74c69d" barSize={24} />
                    {/* 선그래프: 매출 */}
                    <Line yAxisId="right" type="monotone" dataKey="매출" stroke="#2196f3" strokeWidth={3} dot={true} />
                  </ComposedChart>
                </ResponsiveContainer>
              )}
          </div>
        </div>
        {/* 2열: 인기메뉴 */}
        <div className={styles.gridCol1}>
          <div className={styles.sectionTitle}>인기 메뉴 TOP5</div>
          <ResponsiveContainer width="100%" height={290}>
            <PieChart>
              <Pie
                data={pieData}
                cx="50%" cy="50%"
                labelLine={false}
                outerRadius={92}
                dataKey="value"
                isAnimationActive={false}
                label={({ name }) => name}
              >
                {pieData.map((entry, idx) => (
                  <Cell key={`cell-${idx}`} fill={COLORS[idx % COLORS.length]} />
                ))}
              </Pie>
              <Legend />
              <Tooltip formatter={value => value?.toLocaleString() + "건"} />
            </PieChart>
          </ResponsiveContainer>
          <ul className={styles.pieLegendList}>
            {pieData.map((d, idx) => (
              <li key={d.name}>
                <span className={styles.pieColor} style={{ background: COLORS[idx % COLORS.length] }} />
                {d.name}
                <span className={styles.pieValue}>{d.value?.toLocaleString()}건</span>
              </li>
            ))}
          </ul>
        </div>
        {/* 하단 카드 */}
        <div className={styles.rowCards}>
          {/* 재고/임박 */}
          <div className={styles.infoCard}>
            <div className={styles.infoTitle}>유통기한 임박/재고 부족 관리</div>
            <ul>
              <li>전체 임박 품목 수: <b>{expireTotalCount}</b>건</li>
              <li>D-1(내일) 임박: <b>{d1Count}</b>건</li>
              <li>D-DAY(오늘) 임박: <b>{todayCount}</b>건</li>
              <li>재고 부족 품목: <b>{lowStockCount}</b>건</li>
            </ul>
          </div>
          {/* 공지/고객문의 */}
          <div className={styles.infoCard}>
            <div className={styles.infoTitle}>공지 및 고객 문의</div>
            <ul>
              <li className={styles.blockLine}>최근 공지사항:</li>
              <ul className={styles.top3List}>
                {notices.slice(0, 5).map((n, idx) => (
                  <li
                    key={n.id}
                    className={idx === Math.min(4, notices.length - 1) ? styles.bottomLine : ""}
                  >
                    <b className={styles.noticeTitle}>{n.title}</b>
                    <span className={styles.noticeDate}>{n.regDate?.slice(0, 10)}</span>
                  </li>
                ))}
              </ul>
              <li className={styles.blockLine}>불편 접수사항: <b>{unreadComplaintCount}</b>건 접수됨</li>
            </ul>
          </div>
          {/* 발주/폐기 */}
          <div className={styles.infoCard}>
            <div className={styles.infoTitle}>발주 및 폐기 현황</div>
            <ul>
              <li className={styles.blockLine}>
                발주 전체 건수: <b>{orderTotalCount}</b>건
              </li>
              <ul className={styles.top3List}>
                {orderTop3.map((item, idx) => (
                  <li
                    key={idx}
                    className={idx === orderTop3.length - 1 && orderTop3.length > 0 ? styles.bottomLine : ""}
                  >
                    <span className={styles.top3name}>{item.ingredientName}</span>
                    <span className={styles.graySmall}>({item.orderCount ?? "-"} {item.unit ?? ""})</span>
                  </li>
                ))}
              </ul>
              <li className={styles.blockLine}>
                금일 신규 발주 품목: <b>0</b>건 | 자동발주 예정 품목: <b>0</b>건
              </li>
              <li className={styles.blockLine}>
                폐기 전체 건수: <b>{disposalTotalCount}</b>건
              </li>
              <ul className={styles.top3List}>
                {disposalTop3.map((item, idx) => (
                  <li
                    key={idx}
                    className={idx === disposalTop3.length - 1 && disposalTop3.length > 0 ? styles.bottomLine : ""}
                  >
                    <span className={styles.top3name}>{item.ingredientName}</span>
                    <span className={styles.graySmall}>({item.quantity ?? "-"} {item.unit ?? ""})</span>
                  </li>
                ))}
              </ul>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
