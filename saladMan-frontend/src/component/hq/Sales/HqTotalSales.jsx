import { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { accessTokenAtom } from '/src/atoms';
import { myAxios } from '/src/config.jsx';
import Chart from 'chart.js/auto';
import HqSidebarSales from './HqSidebarSales';
import styles from './HqSales.module.css';

// 주차 → 날짜범위 변환
function getWeekDateRange(weekStr) {
  const [year, week] = weekStr.split('-').map(Number);
  const simple = new Date(year, 0, 4 + (week - 1) * 7);
  const dayOfWeek = simple.getDay() || 7;
  simple.setDate(simple.getDate() - dayOfWeek + 1);
  const monday = new Date(simple);
  const sunday = new Date(monday);
  sunday.setDate(monday.getDate() + 6);
  const fmt = d => d.toISOString().slice(0, 10);
  return `${fmt(monday)} ~ ${fmt(sunday)}`;
}

const getToday = () => new Date().toISOString().slice(0, 10);
const getWeekAgo = () => {
  const d = new Date();
  d.setDate(d.getDate() - 6);
  return d.toISOString().slice(0, 10);
};
const getMonthAgo = () => {
  const d = new Date();
  d.setMonth(d.getMonth() - 1);
  return d.toISOString().slice(0, 10);
};

export default function HqTotalSales() {
  const [salesData, setSalesData] = useState(null);
  const [groupType, setGroupType] = useState('WEEK');
  const barChartRef = useRef(null);
  const donutChartRef = useRef(null);
  const [token] = useAtom(accessTokenAtom);

  const [startDate, setStartDate] = useState(() => {
    const date = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
    return date.toLocaleDateString("sv-SE");
  });
  const [endDate, setEndDate] = useState(getToday());

  // 단위(일/주/월) 변경시 바로 조회
  useEffect(() => {
    if (!token) return;
    if (!startDate || !endDate) return;
    const axios = myAxios(token);
    axios.get('/hq/totalSales', { params: { startDate, endDate, groupType } })
      .then(res => setSalesData(res.data))
      .catch(() => alert("매출 데이터 불러오기 실패"));
  }, [token, startDate, endDate, groupType]);

  // 단축 기간 버튼
  const setPeriod = type => {
    const today = getToday();
    if (type === 'today') {
      setStartDate(today); setEndDate(today);
    } else if (type === 'week') {
      setStartDate(getWeekAgo()); setEndDate(today);
    } else if (type === 'month') {
      setStartDate(getMonthAgo()); setEndDate(today);
    }
  };

  useEffect(() => {
     if (!salesData || !salesData.popularMenus) return; 
  const raw = [...salesData.popularMenus].sort((a, b) => b.quantity - a.quantity);
    const topN = 5;
    const topItems = raw.slice(0, topN);
    const othersTotal = raw.slice(topN).reduce((sum, item) => sum + item.quantity, 0);
    const finalLabels = topItems.map(m => m.menuName);
    const finalData = topItems.map(m => m.quantity);
    if (othersTotal > 0) { finalLabels.push('기타'); finalData.push(othersTotal); }

    const bar = new Chart(barChartRef.current, {
      type: 'line',
      data: {
        labels: salesData.daily.map(d => d.date),
        datasets: [
          {
            label: '매출',
            data: salesData.daily.map(d => d.revenue),
            borderColor: '#2196f3',
            backgroundColor: '#f0f8ff',
            yAxisID: 'y2',
            tension: 0.3,
            fill: true
          }
        ]
      },
      options: {
        responsive: true,
        scales: {
          y: { beginAtZero: true, title: { display: true, text: '판매량' } },
          y2: {
            beginAtZero: true, position: 'right',
            grid: { drawOnChartArea: false },
            title: { display: true, text: '매출(₩)' }
          }
        }
      }
    });

    const donut = new Chart(donutChartRef.current, {
      type: 'doughnut',
      data: {
        labels: finalLabels,
        datasets: [{
          data: finalData,
          backgroundColor: ['#82ca9d', '#9ad0ec', '#f6c85f', '#e7717d', '#ffb347', '#cccccc']
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: { position: 'right' },
          tooltip: {
            callbacks: {
              label: (context) => `${context.label}: ${context.raw?.toLocaleString() ?? 0}건`
            }
          }
        }
      }
    });

    return () => { bar.destroy(); donut.destroy(); };
  }, [salesData]);

  return (
    <div className={styles.container}>
      <HqSidebarSales />
      <div className={styles.content}>
        <div className={styles.innerContainer}>
          <h2 className={styles.title}>매출 조회(전사)</h2>
          {/* <div className={styles.filterArea}> */}
            <div className={styles.filterRow}>
              <label className={styles.labelDate}>기간</label>
              <input type="date" className={styles.inputDate} value={startDate} onChange={e => setStartDate(e.target.value)} />
              <span className={styles.labelSep}>~</span>
              <input type="date" className={styles.inputDate} value={endDate} onChange={e => setEndDate(e.target.value)} />
              <button className={styles.periodBtn} onClick={() => setPeriod('today')}>오늘</button>
              <button className={styles.periodBtn} onClick={() => setPeriod('week')}>1주</button>
              <button className={styles.periodBtn} onClick={() => setPeriod('month')}>1달</button>
              {/* <button className={styles.btnSearch} onClick={handleSearch}>검색</button> */}
              <div className={styles.unitBtnsRight}>
                {/* <label className={styles.label} style={{marginLeft:0}}>단위</label> */}
                <button className={groupType === 'DAY' ? styles.periodBtnActive : styles.periodBtn}
                  onClick={() => setGroupType('DAY')}>일별</button>
                <button className={groupType === 'WEEK' ? styles.periodBtnActive : styles.periodBtn}
                  onClick={() => setGroupType('WEEK')}>주별</button>
                <button className={groupType === 'MONTH' ? styles.periodBtnActive : styles.periodBtn}
                  onClick={() => setGroupType('MONTH')}>월별</button>
              </div>
            </div>
          {/* </div> */}
          <div className={styles.dashboard}>
            <div className={styles.chartBox}>
              <div className={styles.summaryBox}>
                <div className={styles.box}>판매 수량<br /><strong>{salesData?.summary?.totalQuantity?.toLocaleString()}건</strong></div>
                <div className={styles.box}>총 매출<br /><strong>₩{salesData?.summary?.totalRevenue?.toLocaleString()}</strong></div>
              </div>
              <div className={styles.chart}>
                <div className={`${styles.box} ${styles.chartBoxWide}`}>
                  <h4>인기 판매 항목</h4>
                  <canvas ref={donutChartRef} width={400} height={310}/>
                </div>
                <div className={styles.salesTableWrap} style={{ marginTop: '2rem' }}>
                <h3 className={styles.subTitle}>메뉴별 판매 수량</h3>
                <div className={styles.tableScroll}>
                  <table className={styles.salesTable}>
                    <thead>
                      <tr>
                        <th className={styles.menuCell}>메뉴명</th>
                        <th className={styles.qtyCell}>판매 수량</th>
                      </tr>
                    </thead>
<tbody>
  {salesData?.popularMenus
    ? [...salesData.popularMenus]
        .sort((a, b) => b.quantity - a.quantity)
        .slice(0, 5)
        .map((m) => (
          <tr key={m.menuName}>
            <td className={styles.left}>{m.menuName}</td>
            <td className={styles.right}>{m.quantity.toLocaleString()}건</td>
          </tr>
        ))
    : <tr><td colSpan={2}>데이터를 가져오는 중입니다...</td></tr>
  }
</tbody>
                  </table>
                </div>
              </div>
                <div className={`${styles.box} ${styles.chartBoxWide}`}>
                  <h4>판매 추이</h4>
                  <canvas ref={barChartRef} width={510} height={310}/>
                </div>
              </div>
            </div>
            
                <div className={styles.salesTableWrap}>
                <div className={styles.tableScroll}>
                    <table className={styles.salesTable}>
                    <thead>
                        <tr>
                        <th className={styles.qtyCell}>날짜</th>
                        <th className={styles.qtyCell}>판매량</th>
                        <th className={styles.qtyCell}>매출</th>
                        <th className={styles.qtyCell}>원가</th>
                        <th className={styles.qtyCell}>순이익</th>
                        </tr>
                    </thead>
                    <tbody>
                        {salesData?.daily?.map(d => (
                        <tr key={d.date}>
                            <td className={styles.dateCell}>
                            {groupType === 'WEEK'
                                ? getWeekDateRange(d.date)
                                : d.date}
                            </td>
                            <td className={styles.qtyCell}>{d.quantity}</td>
                            <td className={styles.priceCell}>₩{d.revenue.toLocaleString()}</td>
                            <td className={styles.priceCell}>₩{d.cost.toLocaleString()}</td>
                            <td className={styles.priceCell}>₩{d.profit.toLocaleString()}</td>
                        </tr>
                        ))}
                    </tbody>
                    </table>
                </div>
                </div>

          </div>
        </div>
      </div>
    </div>
  );
}
