import styles from './HqTotalSales.module.css';
import { useState, useEffect, useRef } from 'react';
import { accessTokenAtom } from '/src/atoms';
import { myAxios } from '/src/config.jsx';
import HqSidebarSales from './HqSidebarSales';
import Chart from 'chart.js/auto';
import { useAtom } from 'jotai';

const HqTotalSales = () => {
    const [salesData, setSalesData] = useState(null);
    const [groupType, setGroupType] = useState('WEEK');
    const barChartRef = useRef(null);
    const donutChartRef = useRef(null);
    const [token] = useAtom(accessTokenAtom);
    const [startDate, setStartDate] = useState(
        new Date(new Date().getFullYear(), new Date().getMonth(), 1)
            .toLocaleDateString('sv-SE')
            .substring(0, 10)
    );
    const [endDate, setEndDate] = useState(
        new Date().toLocaleDateString('sv-SE').substring(0, 10)
    );

    const handleSearch = () => {
            if (!token) return;
            const axios = myAxios(token);
    
            if (!startDate || !endDate) return alert('날짜를 선택해주세요');
    
            axios.get('/hq/totalSales', {
                params: { startDate, endDate }
            }).then(res => {
                setSalesData(res.data);
            }).catch(err => {
                console.error('매출 데이터 불러오기 실패:', err);
            });
        };
    
        useEffect(() => {
            if (!token) return;
            const axios = myAxios(token);
    
            axios.get('/hq/totalSales', {
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
                            label: '판매량',
                            data: salesData.daily.map(d => d.quantity),
                            borderColor: 'rgba(75,192,192,1)',
                            backgroundColor: 'rgba(75,192,192,0.6)',
                            yAxisID: 'y',
                            tension: 0.3,
                            fill: true
                        },
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
                        backgroundColor: ['#82ca9d', '#9ad0ec', '#f6c85f', '#e7717d', '#ffb347', '#cccccc']
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

    return (
        <div className={styles.wrapper}>
            <HqSidebarSales />
            <div className={styles.content}>
                <header className={styles.pageHeader}>
                    <h2>매출 조회(전사)</h2>
                </header>

                <div className={styles.filterBox}>
                    <div className={styles.filterRow}>
                        <label className={styles.filterLabel}>기간</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}/>
                            ~ 
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}/>
                        <button className={groupType === 'DAY' ? styles.active : ''}
                            onClick={() => setGroupType('DAY')}>일별</button>
                        <button className={groupType === 'WEEK' ? styles.active : ''}
                            onClick={() => setGroupType('WEEK')}>주별</button>
                        <button className={groupType === 'MONTH' ? styles.active : ''}
                            onClick={() => setGroupType('MONTH')}>월별</button>
                    </div>
                    <div className={styles.filterActions}>
                        <button onClick={handleSearch}>검색</button>
                    </div>
                </div>

                <div className={styles.dashboard}>
                    <div className={styles.chartBox}>
                        <div className={styles.summaryBox}>
                            <div className={styles.box}>판매 수량<br /><strong>{salesData?.summary?.totalQuantity}건</strong></div>
                            <div className={styles.box}>총 매출<br /><strong>₩{salesData?.summary?.totalRevenue.toLocaleString()}</strong></div>
                        </div>
                        <div className={styles.chart}>
                            <div className={styles.box}>
                                <h4>🥗 판매 인기 항목</h4>
                                <canvas ref={donutChartRef} />
                            </div>
                            <div className={styles.box}>
                                <h4>🥗 판매율</h4>
                                <canvas ref={barChartRef} />
                            </div>
                        </div>                        
                    </div>

                    <div className={styles.salesTable}>
                        <table>
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
    );
};

export default HqTotalSales;
