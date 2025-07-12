import { useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { accessTokenAtom } from '/src/atoms';
import { myAxios } from '/src/config.jsx';
import Chart from 'chart.js/auto';
import HqSidebarSales from './HqSidebarSales';
import styles from './HqSales.module.css';

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

export default function HqStoreSales() {
  const [stores, setStores] = useState([]);
  const [locations, setLocations] = useState([]);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [storeOptions, setStoreOptions] = useState([]);
  const [selectedStoreId, setSelectedStoreId] = useState("");
  const [salesData, setSalesData] = useState(null);
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [groupType, setGroupType] = useState('DAY');
  const barChartRef = useRef(null);
  const donutChartRef = useRef(null);
  const [token] = useAtom(accessTokenAtom);

  // 지점 목록/지역 불러오기
  useEffect(() => {
    if (!token) return;
    myAxios(token).get('/hq/storeSales/filter')
      .then(res => {
        const filtered = res.data.filter(store => store.id !== 1);
        setStores(filtered);
        setLocations([...new Set(filtered.map(s => s.location))]);
      });
  }, [token]);

  useEffect(() => {
    if (selectedLocation)
      setStoreOptions(stores.filter(s => s.location === selectedLocation));
    else setStoreOptions([]);
    setSelectedStoreId("");
  }, [selectedLocation, stores]);

  // 단위 변경시 바로 조회
  useEffect(() => {
    if (!token) return;
    if (!startDate || !endDate || !selectedStoreId) return;
    myAxios(token).get('/hq/storeSales', {
      params: { storeId: selectedStoreId, startDate, endDate, groupType }
    }).then(res => setSalesData(res.data))
      .catch(() => alert("매출 데이터 불러오기 실패"));
  }, [token, startDate, endDate, groupType, selectedStoreId]);

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

  const handleSearch = () => {
    if (!token || !startDate || !endDate || !selectedStoreId)
      return alert('검색할 매장과 날짜를 선택해주세요');
    myAxios(token).get('/hq/storeSales', {
      params: { storeId: selectedStoreId, startDate, endDate, groupType }
    }).then(res => setSalesData(res.data))
      .catch(() => alert("매출 데이터 불러오기 실패"));
  };

  useEffect(() => {
    if (!salesData) return;
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
            label: '판매량',
            data: salesData.daily.map(d => d.quantity),
            borderColor: '#4D774E',
            backgroundColor: '#eaf3eb',
            yAxisID: 'y',
            tension: 0.3,
            fill: true
          },
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
          <h2 className={styles.title}>매출 조회(지점)</h2>

          {/* 1번째 줄: 기간, 단축 버튼 */}
          <div className={styles.storeFilterRow}>
            <label className={styles.labelDate}>기간</label>
            <input type="date" className={styles.inputDate} value={startDate} onChange={e => setStartDate(e.target.value)} />
            <span className={styles.labelSep}>~</span>
            <input type="date" className={styles.inputDate} value={endDate} onChange={e => setEndDate(e.target.value)} />
            <button className={styles.periodBtn} onClick={() => setPeriod('today')}>오늘</button>
            <button className={styles.periodBtn} onClick={() => setPeriod('week')}>1주</button>
            <button className={styles.periodBtn} onClick={() => setPeriod('month')}>1달</button>
          </div>

          {/* 2번째 줄: 지역, 지점, 검색, (오른쪽) 단위 */}
          <div className={styles.storeFilterRow}>
            <label className={styles.label}>지역</label>
            <select
              className={styles.selectStore}
              value={selectedLocation}
              onChange={e => setSelectedLocation(e.target.value)}
              style={{ minWidth: 100 }}
            >
              <option value="">지역</option>
              {locations.map(loc => (
                <option key={loc} value={loc}>{loc}</option>
              ))}
            </select>
            <select
              className={styles.selectStore}
              value={selectedStoreId}
              onChange={e => setSelectedStoreId(e.target.value)}
              disabled={!selectedLocation}
              style={{ minWidth: 140 }}
            >
              <option value="">지점명</option>
              {storeOptions.map(store => (
                <option key={store.id} value={store.id}>{store.name}</option>
              ))}
            </select>
            <button className={styles.btnSearch} onClick={handleSearch}>검색</button>
            {/* 오른쪽: 단위(일/주/월) */}
            <div className={styles.storeUnitBtnsRight}>
              {/* <label className={styles.label} style={{marginLeft:0}}>단위</label> */}
              <button className={groupType === 'DAY' ? styles.periodBtnActive : styles.periodBtn}
                onClick={() => setGroupType('DAY')}>일별</button>
              <button className={groupType === 'WEEK' ? styles.periodBtnActive : styles.periodBtn}
                onClick={() => setGroupType('WEEK')}>주별</button>
              <button className={groupType === 'MONTH' ? styles.periodBtnActive : styles.periodBtn}
                onClick={() => setGroupType('MONTH')}>월별</button>
            </div>
          </div>

          {/* 이하 동일 */}
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
                    <th className={styles.dateCell}>날짜</th>
                    <th className={styles.qtyCell}>판매량</th>
                    <th className={styles.priceCell}>매출</th>
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
