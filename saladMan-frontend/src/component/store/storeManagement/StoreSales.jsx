import styles from './StoreSales.module.css';
import { useState, useEffect, useRef } from 'react';
import { accessTokenAtom } from '/src/atoms';
import { myAxios } from '/src/config.jsx';
import Chart from 'chart.js/auto';
import { useAtom } from 'jotai';
import StoreEmpSidebar from './StoreEmpSidebar';

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

const StoreSales = () => {
    const [salesData, setSalesData] = useState(null);
    const [groupType, setGroupType] = useState('WEEK');
    const [startDate, setStartDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            .toLocaleDateString('sv-SE')
            .substring(0, 10)
    );
    const [endDate, setEndDate] = useState(
        new Date().toLocaleDateString('sv-SE').substring(0, 10)
    );

    const barChartRef = useRef(null);
    const donutChartRef = useRef(null);
    const [token] = useAtom(accessTokenAtom);

    const handleSearch = () => {
        if (!token) return; 
        const axios = myAxios(token);

        if (!startDate || !endDate) return alert('날짜를 선택해주세요');

        axios.get('/store/storeSales', {
            params: { startDate, endDate, groupType }
        }).then(res => {
            setSalesData(res.data);
        }).catch(err => {
            console.error('매출 데이터 불러오기 실패:', err);
        });
    };

    useEffect(() => {
        if (!token) return;
        const axios = myAxios(token);

        axios.get('/store/storeSales', {
            params: { startDate, endDate }
        })
        .then(res => {
            setSalesData(res.data);
        })
        .catch(err => {
            console.error('매출 데이터 불러오기 실패:', err);
        });
    }, [token]);

    useEffect(() => {
        if (!salesData) return;

        const raw = [...salesData.popularMenus].sort((a, b) => b.quantity - a.quantity);
        const topN = 5;
        const topItems = raw.slice(0, topN);
        const otherItems = raw.slice(topN);
        const othersTotal = otherItems.reduce((sum, item) => sum + item.quantity, 0);

        const finalLabels = topItems.map(m => m.menuName);
        const finalData = topItems.map(m => m.quantity);

        if (othersTotal > 0) {
            finalLabels.push('기타');
            finalData.push(othersTotal);
        }

        const bar = new Chart(barChartRef.current, {
            type: 'line',
            data: {
                labels: salesData.daily.map(d => d.date),
                datasets: [
                    {
                        label: '매출',
                        data: salesData.daily.map(d => d.revenue),
                        borderColor: 'rgba(153,102,255,1)',
                        backgroundColor: 'rgba(153,102,255,0.2)',
                        yAxisID: 'y2',
                        tension: 0.3,
                        fill: true
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: { 
                        beginAtZero: true, 
                        title: { display: true, text: '판매량' } },
                    y2: {
                        beginAtZero: true,
                        position: 'right',
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
                    backgroundColor: ['#82ca9d', '#9ad0ec', '#ffb347', '#e7717d', '#ffecacff', '#cccccc']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'right'
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                const label = context.label || '';
                                const value = context.raw || 0;
                                return `${label}: ${value.toLocaleString()}건`;
                            }
                        }
                    }
                }
            }
        });

        return () => {
            bar.destroy();
            donut.destroy();
        };
    }, [salesData]);

    // 단축 기간 버튼
    const setPeriod = type => {
        const today = getToday();
        if (type === 'DAY') {
            setStartDate(today); setEndDate(today);
            setGroupType('DAY');
        } else if (type === 'WEEK') {
            setStartDate(getWeekAgo()); setEndDate(today);
            setGroupType('WEEK');

        } else if (type === 'MONTH') {
            setStartDate(getMonthAgo()); setEndDate(today);
            setGroupType('MONTH');

        }
    };


    return (
        <div className={styles.wrapper}>
            <StoreEmpSidebar/>
            <div className={styles.content}>
                <header className={styles.pageHeader}>
                    <h2>매출 조회</h2>
                </header>

                <div className={styles.filterBox}>
                    <div className={styles.filterRow}>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}/>
                            ~ 
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}/>
                        <button className={groupType === 'DAY' ? styles.active : ''}
                            onClick={() => setPeriod('DAY')}>일별</button>
                        <button className={groupType === 'WEEK' ? styles.active : ''}
                            onClick={() => setPeriod('WEEK')}>주별</button>
                        <button className={groupType === 'MONTH' ? styles.active : ''}
                            onClick={() => setPeriod('MONTH')}>월별</button>
                    </div>
                    <div className={styles.filterActions}>
                        <button onClick={handleSearch}>검색</button>
                    </div>
                </div>

                <div className={styles.dashboard}>
                    <div className={styles.chartBox}>
                        <div className={styles.summaryBox}>
                            <div className={styles.boxbox}>판매 수량<br /><strong>{salesData?.summary?.totalQuantity}건</strong></div>
                            <div className={styles.boxbox}>총 매출<br /><strong>₩{salesData?.summary?.totalRevenue.toLocaleString()}</strong></div>
                        </div>
                        <div className={styles.chart}>
                            <div className={styles.box}>
                                <h4>🥗 판매 인기 항목</h4>
                                <canvas ref={donutChartRef} />
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
                                            {salesData?.popularMenus && [...salesData.popularMenus]
                                                .sort((a, b) => b.quantity - a.quantity)
                                                .slice(0, 5)
                                                .map((m) => (
                                                    <tr key={m.menuName}>
                                                        <td className={styles.left}>{m.menuName}</td>
                                                        <td className={styles.right}>{m.quantity.toLocaleString()}건</td>
                                                    </tr>
                                                ))}
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                            <div className={styles.box}>
                                <h4>🥗 판매율</h4>
                                <canvas ref={barChartRef} />
                            </div>
                        </div>                        
                    </div>
                    <div className={styles.salesTableWrapper}>                                                
                        <div className={styles.salesTable}>
                            <table className={styles.salesTableInner}>
                                <thead>
                                    <tr><th>날짜</th><th>판매량</th><th>매출</th></tr>
                                </thead>
                                <tbody>
                                    {salesData?.daily?.map(d => (
                                        <tr key={d.date}>
                                            <td>{d.date}</td>
                                            <td>{d.quantity}</td>
                                            <td>₩{d.revenue.toLocaleString()}</td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default StoreSales;
