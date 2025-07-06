import { useState, useEffect, useRef } from 'react';
import { accessTokenAtom } from '/src/atoms';
import { myAxios } from '/src/config.jsx';
import { useAtom } from 'jotai';
import Chart from 'chart.js/auto';
import HqSidebarSales from './HqSidebarSales';
import styles from './HqSales.module.css';

const HqStoreSales = () => {
    const [stores, setStores] = useState([]);
    const [locations, setLocations] = useState([]);
    const [selectedLocation, setSelectedLocation] = useState("");
    const [storeOptions, setStoreOptions] = useState([]); // 선택한 지역의 점포들
    const [selectedStoreId, setSelectedStoreId] = useState("");

    const [salesData, setSalesData] = useState(null);
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [groupType, setGroupType] = useState('DAY');
    const barChartRef = useRef(null);
    const donutChartRef = useRef(null);
    const [token] = useAtom(accessTokenAtom);

    // 점포 목록 조회
    useEffect(() => {
        if (!token) return;
        const axios = myAxios(token);

        axios.get('/hq/storeSales/filter')
            .then(res => {
                const filteredStores = res.data.filter(store => store.id !== 1);
                setStores(filteredStores);

                const uniqueLocations = [...new Set(filteredStores.map(store => store.location))];
                setLocations(uniqueLocations);
            })
            .catch(err => {
                console.error('점포 목록 불러오기 실패:', err);
            });
    }, [token]);

    // 지역 선택 시 해당 지역의 점포들 필터링
    useEffect(() => {
        if (selectedLocation) {
            const filtered = stores.filter(store => store.location === selectedLocation);
            setStoreOptions(filtered);
            setSelectedStoreId(""); // 지역 바뀔 때 초기화
        } else {
            setStoreOptions([]);
            setSelectedStoreId("");
        }
    }, [selectedLocation, stores]);

    const handleSearch = () => {
        if (!token) return;
        const axios = myAxios(token);

        if (!startDate || !endDate || !selectedStoreId) {
            return alert('검색할 매장과 날짜를 선택해주세요');
        }

        axios.get('/hq/storeSales', {
            params: { storeId: selectedStoreId, startDate, endDate, groupType }
        }).then(res => {
            setSalesData(res.data);
        }).catch(err => {
            console.error('매출 데이터 불러오기 실패:', err);
        });
    };

    // 차트 렌더링
    useEffect(() => {
        if (!salesData) return;

        const raw = [...salesData.popularMenus].sort((a, b) => b.quantity - a.quantity);
        const topN = 5;
        const topItems = raw.slice(0, topN);
        const othersTotal = raw.slice(topN).reduce((sum, item) => sum + item.quantity, 0);

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
                        title: { display: true, text: '판매량' }
                    },
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
                            label: function (context) {
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
                    <h2>매출 조회(지점)</h2>
                </header>

                <div className={styles.filterBox}>
                    <div className={styles.filterRow}>
                        <label className={styles.filterLabel}>점포 선택</label>
                        <select
                            value={selectedLocation}
                            onChange={(e) => setSelectedLocation(e.target.value)}
                        >
                            <option value="">지역</option>
                            {locations.map(loc => (
                                <option key={loc} value={loc}>{loc}</option>
                            ))}
                        </select>
                        <select
                            value={selectedStoreId}
                            onChange={(e) => setSelectedStoreId(e.target.value)}
                            disabled={!selectedLocation}
                            style={{width:'150px'}}
                        >
                            <option value="">지점명</option>
                            {storeOptions.map(store => (
                                <option key={store.id} value={store.id}>{store.name}</option>
                            ))}
                        </select>

                        <label className={styles.filterLabel}>기간</label>
                        <input type="date" value={startDate} onChange={e => setStartDate(e.target.value)}/>
                            ~ 
                        <input type="date" value={endDate} onChange={e => setEndDate(e.target.value)}/>
                        <label className={styles.filterLabel}>검색 단위</label>
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

                {/* 차트 및 테이블 */}
                <div className={styles.dashboard}>
                    <div className={styles.chartBox}>
                        <div className={styles.summaryBox}>
                            <div className={styles.box}>판매 수량<br /><strong>{salesData?.summary?.totalQuantity}건</strong></div>
                            <div className={styles.box}>총 매출<br /><strong>₩{salesData?.summary?.totalRevenue?.toLocaleString()}</strong></div>
                        </div>
                        <div className={styles.chart}>
                            <div className={styles.box} style={{width:'280px'}}>
                                <h4>🥗 판매 인기 항목</h4>
                                <canvas ref={donutChartRef}/>
                            </div>
                            <div className={styles.box} style={{width:'571px'}}>
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

export default HqStoreSales;
