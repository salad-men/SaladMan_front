import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "/src/atoms";
import { myAxios } from "/src/config";
import styles from "./HqDashboard.module.css";
import {
  ComposedChart, Bar, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell
} from "recharts";
import { Link } from "react-router-dom"; 

const COLORS = [
  "#70d6ff", "#ff70a6", "#ffd670", "#ff9770", "#6eeb83",
];

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

function formatXAxisLabel(date, groupType) {
  if (groupType === "week") {
    if (!date) return "";
    const parts = date.split("-");
    return parts.length === 2 ? `${Number(parts[1])}주차` : date;
  }
  if (groupType === "month") {
    if (!date) return "";
    const parts = date.split("-");
    return parts.length === 2 ? `${Number(parts[1])}월` : date;
  }
  return date;
}

export default function HqDashboard() {
  const token = useAtomValue(accessTokenAtom);
  // 전국/지점용 요약
  const [dateRange, setDateRange] = useState({ start: getWeekAgo(), end: getToday() });
  const [loading, setLoading] = useState(true);
  const [summary, setSummary] = useState(null);
  const [error, setError] = useState("");
  const [groupType, setGroupType] = useState("day");
  const [lowStockList, setLowStockList] = useState([]);
  const [storeList, setStoreList] = useState([]);

  // 지역/지점 선택 관련
  const [stores, setStores] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [storeOptions, setStoreOptions] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState("ALL");

  // 전국(hq) 데이터(아래 카드용)
  const [hqSummary, setHqSummary] = useState(null);

  // 1) 지점/지역 목록 가져오기
  useEffect(() => {
    if (!token) return;
    myAxios(token).get('/hq/storeSales/filter')
      .then(res => {
        const filtered = res.data.filter(store => store.id !== 1);
        setStores(filtered);
        setLocations([...new Set(filtered.map(s => s.location))]);
      });
  }, [token]);

  // 2) 지역 변경시 지점옵션
  useEffect(() => {
    if (selectedLocation)
      setStoreOptions(stores.filter(s => s.location === selectedLocation));
    else setStoreOptions([]);
    setSelectedStoreId("ALL");
  }, [selectedLocation, stores]);

  // 3) 전국/지점 매출 요약/인기메뉴만 가져오기
  useEffect(() => {
    if (!token) return;
    setLoading(true); setError("");

    // 전국
    if (selectedStoreId === "ALL") {
      myAxios(token).get("/hq/dashboard/summary", {
        params: {
          startDate: dateRange.start,
          endDate: dateRange.end,
          groupType,
        }
      })
      .then(res => { setSummary(res.data); setLoading(false); })
      .catch(() => { setSummary(null); setLoading(false); setError("요약 데이터를 불러올 수 없습니다."); });
    }
    // 지점
    else {
      myAxios(token).get("/hq/dashboard/summary/store", {
        params: {
          storeId: selectedStoreId,
          startDate: dateRange.start,
          endDate: dateRange.end,
          groupType,
        }
      })
      .then(res => { setSummary(res.data); setLoading(false); })
      .catch(() => { setSummary(null); setLoading(false); setError("요약 데이터를 불러올 수 없습니다."); });
    }
  }, [token, dateRange.start, dateRange.end, groupType, selectedStoreId]);

  // 4) 무조건 전국(hq) 요약 정보도 별도 fetch(카드용)
  useEffect(() => {
    if (!token) return;
    myAxios(token).get("/hq/dashboard/summary", {
      params: {
        startDate: dateRange.start,
        endDate: dateRange.end,
        groupType,
      }
    })
    .then(res => setHqSummary(res.data))
    .catch(() => setHqSummary(null));
  }, [token, dateRange.start, dateRange.end, groupType]);



  const groupTypeMap = { day: "daily", week: "weekly", month: "monthly" };
  const salesKey = groupTypeMap[groupType] || "daily";
  const salesArr = summary?.sales?.[salesKey] ?? [];
  const salesData = salesArr.map(d => ({
    date: d.date,
    판매량: d.quantity,
    매출: d.revenue,
  }));
  const displaySalesData = [...salesData].reverse();
  const topMenus = summary?.topMenus?.length ? summary.topMenus.slice(0, 5) : [];
  const pieData = topMenus.map(m => ({ name: m.menuName, value: m.quantity }));

  const expireSummary = hqSummary?.expireSummary || {};
  const d1Count = expireSummary.d1Count ?? 0;
  const todayCount = expireSummary.todayCount ?? 0;
  const lowStockCount = hqSummary?.lowStockCount ?? 0;
  const orderSummary = hqSummary?.orderSummary || {};
  const orderTotalCount = orderSummary.totalCount ?? 0;
  const orderTop3 = orderSummary.top3 || [];
  const disposalSummary = hqSummary?.disposalSummary || {};
  const disposalTotalCount = disposalSummary.totalCount ?? 0;
  const disposalTop3 = disposalSummary.top3 || [];
  const notices = hqSummary?.notices?.slice(0, 4) || [];

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

  const setPeriod = (type) => {
    if (type === "today") setDateRange({ start: getToday(), end: getToday() });
    if (type === "week") setDateRange({ start: getWeekAgo(), end: getToday() });
    if (type === "month") setDateRange({ start: getMonthAgo(), end: getToday() });
  };

  const renderGroupTypeBtns = () => (
    <div className={styles.groupTypeBtns}>
      <button className={groupType === "day" ? styles.active : ""} onClick={() => setGroupType("day")}>일별</button>
      <button className={groupType === "week" ? styles.active : ""} onClick={() => setGroupType("week")}>주별</button>
      <button className={groupType === "month" ? styles.active : ""} onClick={() => setGroupType("month")}>월별</button>
    </div>
  );

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
          <button onClick={() => setPeriod("week")} className={styles.periodBtn}>한 주</button>
          <button onClick={() => setPeriod("month")} className={styles.periodBtn}>한 달</button>
        </div>
        {renderGroupTypeBtns()}

<div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
  {/* 지역 셀렉트 */}
  <select
    value={selectedLocation}
    onChange={e => setSelectedLocation(e.target.value)}
    className={styles.selectStore}
    style={{ minWidth: 100 }}
  >
    <option value="">지역</option>
    {locations.map(loc => (
      <option key={loc} value={loc}>{loc}</option>
    ))}
  </select>

  {/* 지점 셀렉트 */}
  <select
    value={selectedStoreId}
    onChange={e => setSelectedStoreId(e.target.value)}
    className={styles.selectStore}
    style={{ minWidth: 140 }}
    disabled={!selectedLocation}
  >
    <option value="ALL">전국</option>
    {storeOptions.map(store => (
      <option key={store.id} value={store.id}>{store.name}</option>
    ))}
  </select>
</div>



      </div>

      <div className={styles.grid}>
        {/* 1열: 매출 요약/차트 */}
        <div className={styles.gridCol2}>
          {/* 매출조회(전사)로 이동 */}



          <div className={styles.sectionTitleRow}>
            <Link to="/hq/totalSales" style={{ textDecoration: "none", color: "inherit", flex: 1 }}>
              <div className={styles.sectionTitle} style={{ cursor: "pointer" }}>
                전국 매출 요약
              </div>
            </Link>
            <div className={styles.storeSelectorWrap}>
              <select value={selectedLocation} onChange={e => setSelectedLocation(e.target.value)}
                className={styles.selectStore}>
                <option value="">지역</option>
                {locations.map(loc => (
                  <option key={loc} value={loc}>{loc}</option>
                ))}
              </select>
              <select value={selectedStoreId} onChange={e => setSelectedStoreId(e.target.value)}
                className={styles.selectStore} disabled={!selectedLocation}>
                <option value="ALL">전국</option>
                {storeOptions.map(store => (
                  <option key={store.id} value={store.id}>{store.name}</option>
                ))}
              </select>
            </div>
          </div>

          
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

          {/* 매출 차트도 전사 매출조회로 이동 */}
          <Link to="/hq/totalSales" style={{ textDecoration: "none" }}>
            <div className={styles.salesCharts} style={{ cursor: "pointer" }}>
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
                      <Bar yAxisId="left" dataKey="판매량" fill="#74c69d" barSize={24} />
                      <Line yAxisId="right" type="monotone" dataKey="매출" stroke="#2196f3" strokeWidth={3} dot={true} />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
            </div>
          </Link>
        </div>
        {/* 2열: 인기메뉴 */}
        <div className={styles.gridCol1}>
          {/* 인기메뉴도 전사 매출조회로 이동 */}
          <Link to="/hq/totalSales" style={{ textDecoration: "none", color: "inherit" }}>
            <div className={styles.sectionTitle} style={{ cursor: "pointer" }}>
              인기 메뉴 TOP5 {/* <-- 클릭시 전사 매출조회로 */}
            </div>
          </Link>
          <Link to="/hq/totalSales" style={{ textDecoration: "none" }}>
            <ResponsiveContainer width="100%" height={290} style={{ cursor: "pointer" }}>
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
          </Link>
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
              {/* D-1 임박: 유통기한 목록으로 */}
              <li>
                <Link to="/hq/HqInventoryExpiration" style={{ color: "#137c9d", fontWeight: 600, textDecoration: "underline" }}>
                  유통기한 D-1(내일) 임박: <b>{d1Count}</b>건
                </Link>
                {/* // D-1 클릭시 유통기한 관리로 이동 */}
              </li>
              {/* D-DAY 임박: 유통기한 목록으로 */}
              <li>
                <Link to="/hq/HqInventoryExpiration" style={{ color: "#137c9d", fontWeight: 600, textDecoration: "underline" }}>
                  유통기한 D-DAY(오늘) 임박: <b>{todayCount}</b>건
                </Link>
                {/* // D-DAY 클릭시 유통기한 관리로 이동 */}
              </li>
              {/* 재고 부족: 재고 관리로 */}
              <li>
                <Link to="/hq/HqInventoryList" style={{ color: "#e67316", fontWeight: 600, textDecoration: "underline" }}>
                  재고 부족 재료: <b>{lowStockCount}</b>건
                </Link>
                {/* // 재고 부족 클릭시 재고관리로 이동 */}
              </li>
            </ul>
             {/* [재고 부족 품목 리스트 보여주기] */}
              <ul style={{ paddingLeft: 12, marginTop: 4 }}>
                {lowStockList.length === 0
                  ? <li style={{ color: "#aaa" }}>부족한 품목이 없습니다.</li>
                  : lowStockList.map(item => (
                    <li key={item.id} style={{ fontSize: 15, lineHeight: 1.6 }}>
                      {item.categoryName ? `[${item.categoryName}] ` : ""}
                      {item.ingredientName} ({item.quantity}{item.unit})
                      {/* 필요시: <span style={{ color: "#c22" }}>/{item.minquantity}</span> */}
                    </li>
                  ))}
              </ul>

          </div>
          {/* 공지/고객문의 */}
          <div className={styles.infoCard}>
            <div className={styles.infoTitle}>공지 및 고객 문의</div>
            <ul>
              <li className={styles.blockLine}>최근 공지사항:</li>
              <ul className={styles.top3List}>
                {/* 공지사항 제목 클릭시 해당 공지 상세(혹은 리스트)로 이동 */}
                {notices.slice(0, 5).map((n, idx) => (
                  <li
                    key={n.id}
                    className={idx === Math.min(4, notices.length - 1) ? styles.bottomLine : ""}
                  >
                    <Link to="/hq/HqNoticeList" style={{ color: "#226abc", fontWeight: 600, textDecoration: "underline" }}>
                      <b className={styles.noticeTitle}>{n.title}</b>
                    </Link>
                    <span className={styles.noticeDate}>{n.regDate?.slice(0, 10)}</span>
                  </li>
                ))}
                {/* // 공지 클릭시 공지사항 목록으로 이동 */}
              </ul>
              <li className={styles.blockLine}>
                {/* 불편 접수사항: 불만사항 목록으로 */}
                <Link to="/hq/HqComplaintList" style={{ color: "#de3545", fontWeight: 600, textDecoration: "underline" }}>
                  불편 접수사항: <b>{unreadComplaintCount}</b>건
                </Link>
                {/* // 불편 클릭시 불만사항으로 이동 */}
              </li>
            </ul>
          </div>
          {/* 발주/폐기 */}
          <div className={styles.infoCard}>
            <div className={styles.infoTitle}>수주 및 폐기요청 현황</div>
            <ul>
              <li className={styles.blockLine}>
                {/* 수주 전체 건수: 수주목록으로 이동 */}
                <Link to="/hq/orderRequest" style={{ color: "#226abc", fontWeight: 600, textDecoration: "underline" }}>
                  수주 전체 건수: <b>{orderTotalCount}</b>건
                </Link>
                {/* // 수주 클릭시 수주목록으로 이동 */}
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
                {/* 폐기 요청 건수: 폐기요청 목록으로 이동 */}
                <Link to="/hq/HqDisposalRequestList" style={{ color: "#de3545", fontWeight: 600, textDecoration: "underline" }}>
                  폐기 요청 건수: <b>{disposalTotalCount}</b>건
                </Link>
                {/*  폐기 클릭시 폐기요청 재료로 이동 */}
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
              <li className={styles.blockLine}>
                금일 신규 발주 품목: <b>0</b>건
              </li>
              <li className={styles.blockLine}>
                자동발주 예정 품목: <b>0</b>건
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
