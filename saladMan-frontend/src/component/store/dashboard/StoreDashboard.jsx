import React, { useEffect, useRef } from "react";
import styles from "./storeDashboard.module.css";
import Chart from "chart.js/auto";

export default function StoreDashboard() {
  // 하드코딩 데이터
  const salesSummary = {
    total: 1240000,
    count: 276,
    order: 312,
    completed: 298,
    refund: 14,
    labels: ["1주차", "2주차", "3주차", "4주차"],
    chartData: [1020000, 1340000, 1120000, 900000],
  };

  const popularity = {
    labels: ["시그니처 샐러드", "닭가슴살 샐러드", "발사믹 토마토", "아보카도 베이컨", "옥수수 샐러드"],
    data: [112, 72, 55, 42, 38],
  };

  const mainInventory = [
    { name: "🥬 양상추", remain: "잔여 200g" },
    { name: "🥕 당근", remain: "잔여 100g" },
    { name: "📦 포장용기", remain: "잔여 50개" },
    { name: "🥄 숫가락", remain: "잔여 120개" },
    { name: "🥢 젓가락 세트", remain: "잔여 115개" },
  ];

  const schedule = [
    ["김진수", "08:00~16:00", "휴무", "08:00~16:00", "휴무", "08:00~12:00"],
    ["이정훈", "10:00~18:00", "10:00~18:00", "휴무", "10:00~18:00", "휴무"],
    ["박민지", "휴무", "14:00~20:00", "14:00~20:00", "14:00~20:00", "14:00~20:00"],
    ["이하늘", "11:00~17:00", "11:00~17:00", "휴무", "11:00~17:00", "휴무"],
    ["최영수", "휴무", "09:00~15:00", "09:00~15:00", "09:00~15:00", "09:00~15:00"],
  ];

  // 차트 ref
  const salesChartRef = useRef(null);
  const popularityChartRef = useRef(null);

  // Chart.js: 매출
  useEffect(() => {
    if (!salesChartRef.current) return;
    if (salesChartRef.current.chartInstance) salesChartRef.current.chartInstance.destroy();
    const chart = new Chart(salesChartRef.current, {
      type: "bar",
      data: {
        labels: salesSummary.labels,
        datasets: [{
          label: "월간 매출 (₩)",
          data: salesSummary.chartData,
          backgroundColor: "#4D774E"
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          y: {
            beginAtZero: true,
            ticks: { font: { size: 14 } }
          },
          x: {
            ticks: { font: { size: 14 } }
          }
        },
        plugins: {
          legend: {
            display: false,
            labels: { font: { size: 16 } }
          },
          title: {
            display: true,
            text: "월간 매출 현황",
            font: { size: 18 }
          }
        }
      }
    });
    salesChartRef.current.chartInstance = chart;
    return () => chart.destroy();
  }, []); // 최초 1번만

  // Chart.js: 인기메뉴
  useEffect(() => {
    if (!popularityChartRef.current) return;
    if (popularityChartRef.current.chartInstance) popularityChartRef.current.chartInstance.destroy();
    const chart = new Chart(popularityChartRef.current, {
      type: "doughnut",
      data: {
        labels: popularity.labels,
        datasets: [{
          data: popularity.data,
          backgroundColor: [
            "#4D774E", "#6BAF8B", "#A8D5BA", "#CDEBD3", "#e0e0e0"
          ]
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: "bottom",
            labels: { font: { size: 16 } }
          },
          title: {
            display: true,
            text: "TOP 5 인기 메뉴 비율",
            font: { size: 18 }
          }
        }
      }
    });
    popularityChartRef.current.chartInstance = chart;
    return () => chart.destroy();
  }, []); // 최초 1번만

  return (
    <div className={styles.layout}>
      <div className={styles.dashboard}>
        <div className={styles.dashboardHeader}>대시보드</div>
        <div className={styles.dashboardGrid}>
          {/* 매출/주문 현황 */}
          <div className={styles.card}>
            <h3>📊 매출 및 주문 현황</h3>
            <div style={{ width: "100%", height: 280 }}>
              <canvas ref={salesChartRef} />
            </div>
            <ul className={styles.noticeList}>
              <li className={styles.strong}>
                💰 오늘 총 매출: ₩1,240,000
                <span className={styles.subInfo}>(판매 수량: 276개)</span>
              </li>
              <li>📦 주문 건수: 312건</li>
              <li>✅ 완료: 298건 / ❌ 환불: 14건</li>
            </ul>
          </div>
          {/* 인기 현황 */}
          <div className={styles.card}>
            <h3>🔥 판매 인기 현황</h3>
            <div style={{ width: "100%", height: 280 }}>
              <canvas ref={popularityChartRef} />
            </div>
            <div className={styles.chartLabel}>TOP 5 비율 시각화</div>
            <ul className={`${styles.noticeList} ${styles.popularItemsGrid}`}>
              {popularity.labels.map((name, idx) => (
                <li key={name}>{name} - {popularity.data[idx]}개</li>
              ))}
            </ul>
          </div>
          {/* 재고 관리 현황 */}
          <div className={styles.card}>
            <h3>📦 재고 관리 현황</h3>
            <ul className={styles.noticeList}>
              <li className={styles.strong}>⚠️ 폐기 예정 재고: 5종</li>
              <li className={styles.strong}>🔄 자동 발주 예정 품목: 3종</li>
              <li className={styles.highlightTitle}>📋 주요 재고 현황</li>
              {mainInventory.map((item, idx) => (
                <li key={item.name}>{item.name} - {item.remain}</li>
              ))}
            </ul>
          </div>
          {/* 주간 근무표(2칸) */}
          <div className={`${styles.card} ${styles.scheduleCard}`}>
            <h3>👥 전체 직원 주간 근무표</h3>
            <table className={styles.scheduleTable}>
              <thead>
                <tr>
                  <th>이름</th>
                  <th>월</th>
                  <th>화</th>
                  <th>수</th>
                  <th>목</th>
                  <th>금</th>
                </tr>
              </thead>
              <tbody>
                {schedule.map((row, idx) => (
                  <tr key={idx}>
                    {row.map((cell, i) => <td key={i}>{cell}</td>)}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* 공지사항 */}
          <div className={styles.card}>
            <h3>📢 공지사항</h3>
            <ul className={styles.noticeList}>
              <li>⏰ 신메뉴 출시 예정 (6월 1일)</li>
              <li>🔧 시스템 점검 (5월 30일 00시)</li>
              <li>📌 폐기 신청 마감일 (5월 25일)</li>
              <li>📢 여름 한정 메뉴 테스트 시작</li>
              <li>📦 재고 전수조사 일정 안내</li>
              <li>📋 전직원 위생교육 필참</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
