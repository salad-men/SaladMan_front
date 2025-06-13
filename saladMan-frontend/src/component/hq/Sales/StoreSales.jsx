import './TotalSales.css'
import { useEffect, useRef } from 'react';
import SidebarSales from './Sales/SidebarSales'
import Chart from 'chart.js/auto';

const TotalSales = () => {
    const barChartRef = useRef(null);
    const donutChartRef = useRef(null);

    useEffect(() => {
        const bar = new Chart(barChartRef.current, {
            type: 'bar',
            data: {
                labels: ['5/21', '5/22', '5/23', '5/24', '5/25'],
                datasets: [
                    {
                        label: '판매량',
                        data: [35, 42, 38, 30, 46],
                        backgroundColor: 'rgba(75,192,192,0.6)'
                    },
                    {
                        label: '매출',
                        data: [85000, 102000, 95000, 78000, 110000],
                        backgroundColor: 'rgba(153,102,255,0.5)',
                        yAxisID: 'y2'
                    }
                ]
            },
            options: {
                responsive: true,
                scales: {
                    y: { beginAtZero: true, title: { display: true, text: '판매량' } },
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
                labels: ['시그니처 샐러드', '닭가슴살 샐러드', '훈제연어 샐러드', '불고기 샐러드', '두부 샐러드'],
                datasets: [{
                    data: [170, 72, 38, 41, 27],
                    backgroundColor: ['#82ca9d', '#9ad0ec', '#f6c85f', '#e7717d', '#c2b0ea']
                }]
            },
            options: {
                responsive: true,
                plugins: {
                    legend: {
                        position: 'bottom'
                    }
                }
            }
        });
        // 클린업
        return () => {
            bar.destroy();
            donut.destroy();
        };
    }, []);

    return (
        <div className='wrapper'>
        <SidebarSales />
        <div className="content">
            <header className="page-header">
                <h2>통합 매출 조회</h2>
            </header>

            <div className="filter-box">
                <div className="filter-row">
                    <label className="filter-label">점포 선택</label>
                    <select>
                        <option>지역</option>
                        <option>강남점</option>
                    </select>
                    <select>
                        <option>지점명</option>
                        <option>강남점</option>
                    </select>
                </div>
                <div className="filter-row">
                    <label className="filter-label">기간</label>
                    <input type="date" /> ~ <input type="date" />
                    <button>오늘</button>
                    <button>1주</button>
                    <button>15일</button>
                    <button>1개월</button>
                    <button>3개월</button>
                    <button>6개월</button>
                </div>
                <div className="filter-actions">
                    <button>검색</button>
                    <button className="reset">초기화</button>
                </div>
            </div>

            <div className="dashboard">
                <div className="left-panel">
                    <div className="summary-box">
                        <div>조회 기간<br /><strong>2024.05.21 ~ 2024.05.25</strong></div>
                        <div>판매 수량<br /><strong>191건</strong></div>
                        <div>총 매출<br /><strong>₩470,000</strong></div>
                    </div>

                    <div className="chart-box">
                        <canvas ref={barChartRef} height="100" />
                    </div>

                    <div className="sales-table">
                        <table>
                            <thead>
                                <tr><th>날짜</th><th>판매량</th><th>매출</th></tr>
                            </thead>
                            <tbody>
                                <tr><td>2024-05-21</td><td>35</td><td>₩85,000</td></tr>
                                <tr><td>2024-05-22</td><td>42</td><td>₩102,000</td></tr>
                                <tr><td>2024-05-23</td><td>38</td><td>₩95,000</td></tr>
                                <tr><td>2024-05-24</td><td>30</td><td>₩78,000</td></tr>
                                <tr><td>2024-05-25</td><td>46</td><td>₩110,000</td></tr>
                            </tbody>
                        </table>
                    </div>
                </div>

                <div className="donut-box">
                    <h4>🥗 판매 인기 항목</h4>
                    <canvas ref={donutChartRef} width="300" height="300" />
                </div>
            </div>
        </div>
        </div>
    )
}

export default TotalSales;