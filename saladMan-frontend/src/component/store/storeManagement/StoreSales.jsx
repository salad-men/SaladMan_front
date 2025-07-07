import style from './StoreSales.module.css';
import { useState, useEffect, useRef } from 'react';
import { accessTokenAtom } from '/src/atoms';
import { myAxios } from '/src/config.jsx';
import Chart from 'chart.js/auto';
import { useAtom } from 'jotai';
import StoreEmpSidebar from './StoreEmpSidebar';

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
        <div className={style.wrapper}>
            <StoreEmpSidebar/>
            <div className={style.content}>
                <header className={style.pageHeader}>
                    <h2>매출 조회</h2>
                </header>

                <div className={style.filterBox}>
                    <div className={style.filterRow}>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}/>
                            ~ 
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}/>
                        <button className={groupType === 'DAY' ? style.active : ''}
                            onClick={() => setGroupType('DAY')}>일별</button>
                        <button className={groupType === 'WEEK' ? style.active : ''}
                            onClick={() => setGroupType('WEEK')}>주별</button>
                        <button className={groupType === 'MONTH' ? style.active : ''}
                            onClick={() => setGroupType('MONTH')}>월별</button>
                    </div>
                    <div className={style.filterActions}>
                        <button onClick={handleSearch}>검색</button>
                    </div>
                </div>

                <div className={style.dashboard}>
                    <div className={style.chartBox}>
                        <div className={style.summaryBox}>
                            <div className={style.box}>판매 수량<br /><strong>{salesData?.summary?.totalQuantity}건</strong></div>
                            <div className={style.box}>총 매출<br /><strong>₩{salesData?.summary?.totalRevenue.toLocaleString()}</strong></div>
                        </div>
                        <div className={style.chart}>
                            <div className={style.box}>
                                <h4>🥗 판매 인기 항목</h4>
                                <canvas ref={donutChartRef} />
                            </div>
                            <div className={style.box}>
                                <h4>🥗 판매율</h4>
                                <canvas ref={barChartRef} />
                            </div>
                        </div>                        
                    </div>

                    <div className={style.salesTable}>
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

export default StoreSales;
