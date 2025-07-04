import React, { useEffect, useRef } from "react";
import styles from "./HqDashboard.module.css";
import Chart from "chart.js/auto";

export default function HqDashboard() {
  // 하드코딩 데이터
  const salesSummary = {
    totalSales: 12400000,
    totalCount: 1234,
    totalOrder: 1045,
    labels: ["5/1", "5/8", "5/15", "5/22"],
    chartData: [3200000, 2800000, 3600000, 3400000],
  };

  const popularity = {
    labels: ["시그니처 샐러드", "닭가슴살 샐러드", "발사믹 토마토", "아보카도 베이컨", "옥수수 샐러드"],
    data: [112, 72, 55, 42, 38],
  };

  // 차트 ref
  const salesChartRef = useRef(null);
  const popularityChartRef = useRef(null);

  // sales 차트
  useEffect(() => {
    if (!salesChartRef.current) return;
    if (salesChartRef.current.chartInstance) salesChartRef.current.chartInstance.destroy();
    const chart = new Chart(salesChartRef.current, {
      type: "bar",
      data: {
        labels: salesSummary.labels,
        datasets: [{
          label: "주간 매출 (₩)",
          data: salesSummary.chartData,
          backgroundColor: "#4D774E",
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
        },
      },
    });
    salesChartRef.current.chartInstance = chart;
    return () => chart.destroy();
  }, []); // 최초 렌더에만

  // 인기 메뉴 차트
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
            "#4D774E",
            "#6BAF8B",
            "#A8D5BA",
            "#CDEBD3",
            "#e0e0e0",
          ],
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: "bottom",
            labels: { font: { size: 16 } },
          },
        },
      },
    });
    popularityChartRef.current.chartInstance = chart;
    return () => chart.destroy();
  }, []); // 최초 렌더에만

  return (
    <div className={styles.layout}>
      <div className={styles.dashboardHeader}>
        🥗 SALADMAN - <span className={styles.hq}>본사</span> 운영 현황
      </div>
      <div className={styles.dashboardGrid}>
        <div className={`${styles.card} ${styles.cardTop} ${styles.cardSales}`} style={{ gridArea: "sales" }}>
          <div className={styles.cardHeader}>
            📊 전국 매출 요약
            <div className={styles.selector}>
              <label>지점:</label>
              <select defaultValue="all" disabled>
                <option value="all">전체</option>
                <option value="gangnam">강남점</option>
                <option value="sinchon">신촌점</option>
                <option value="hongdae">홍대점</option>
              </select>
            </div>
          </div>
          <div style={{ width: "100%", height: 320 }}>
            <canvas ref={salesChartRef} />
          </div>
          <ul className={styles.infoList}>
            <li>💰 총 매출: {salesSummary.totalSales.toLocaleString()}원</li>
            <li>🧾 총 판매 수량: {salesSummary.totalCount}개</li>
            <li>📦 총 주문 건수: {salesSummary.totalOrder}건</li>
          </ul>
        </div>
        <div className={`${styles.card} ${styles.cardTop} ${styles.cardPopularity}`} style={{ gridArea: "popularity" }}>
          <div className={styles.cardHeader}>
            🔥 전 지점 인기 메뉴
            <div className={styles.selector}>
              <label>지점:</label>
              <select defaultValue="all" disabled>
                <option value="all">전체</option>
                <option value="gangnam">강남점</option>
                <option value="sinchon">신촌점</option>
                <option value="hongdae">홍대점</option>
              </select>
            </div>
          </div>
          <div style={{ width: "100%", height: 320 }}>
            <canvas ref={popularityChartRef} />
          </div>
          <ul className={`${styles.infoList} ${styles.popularItemsGrid}`}>
            {popularity.labels.map((name, idx) => (
              <li key={name}>
                {name} - {popularity.data[idx]}개
              </li>
            ))}
          </ul>
        </div>
        <div className={`${styles.card} ${styles.cardBottom} ${styles.cardInventory}`} style={{ gridArea: "inventory" }}>
          <h3>📉 재고 및 유통기한 관리</h3>
          <ul className={styles.infoList}>
            <li>📦 재고 부족 품목: 3건</li>
            <li>📦 자동 폐기 예정 품목: 2건</li>
            <li>⏰ 유통기한 임박 D-1: 6건</li>
            <li>⏰ 유통기한 임박 D-2: 7건</li>
            <li>⏰ 유통기한 임박 D-DAY: 3건</li>
          </ul>
        </div>
        <div className={`${styles.card} ${styles.cardBottom} ${styles.cardNotice}`} style={{ gridArea: "notice" }}>
          <h3>📢 공지 및 고객 문의</h3>
          <ul className={styles.infoList}>
            <li>📌 여름 신메뉴 테스트 예정</li>
            <li>🔧 시스템 점검 5/30 예정</li>
            <li>🔧 전 지점 전수조사 실시</li>
            <li>📩 고객 문의: 4건 접수됨</li>
            <li>📩 불편 접수사항 : 6건 접수됨</li>
          </ul>
        </div>
        <div className={`${styles.card} ${styles.cardBottom} ${styles.cardOrder}`} style={{ gridArea: "order" }}>
          <h3>📦 발주 및 폐기 현황</h3>
          <ul className={styles.infoList}>
            <li>🔄 발주 승인 대기: 6개 지점 6건</li>
            <li>🗑️ 폐기 요청 대기: 4개 지점 7건 </li>
            <li>📦 금일 신규 발주 품목: 5건</li>
            <li>📤 자동 발주 예정 품목: 3건</li>
            <li>📈 주간 폐기 상위 품목: 닭가슴살 | 토마토 | 케일</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
