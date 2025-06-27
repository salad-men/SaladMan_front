import styles from "./OrderList.module.css";
import OrderSidebar from "./OrderSidebar";
import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { accessTokenAtom } from '/src/atoms';
import { myAxios } from '/src/config';
import { useNavigate } from 'react-router-dom';



export default function OrderList() {

    const [filters, setFilters] = useState({
        productName: '',
        orderType: ''
    });
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [orderData, setOrderData] = useState([]);
    const [totalPages, setTotalPages] = useState(1); // 전체 페이지 수
    const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
    const navigate = useNavigate();

    const token = useAtomValue(accessTokenAtom);

    useEffect(() => {
        if (!token) return;

        handleSearch(1);
    }, [token]);

    const handleSearch = async (page = 1) => {
        const validPage = Number.isNaN(page) || page < 1 ? 1 : page;

        try {
            const res = await myAxios(token).get("/store/orderList", {
                params: {
                    page: validPage - 1, // Spring은 0부터
                    size: 10,
                    startDate: startDate || null,
                    endDate: endDate || null,
                    orderType: filters.orderType,
                    productName: filters.productName,
                },
            });

            setOrderData(res.data.content);
            console.log(res.data.content);

            setTotalPages(res.data.totalPages);
            setCurrentPage(validPage);
        } catch (err) {
            console.error("발주 목록 조회 실패", err);
        }
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleReset = () => {
        setFilters({ productName: '', orderType: '' });
        setStartDate('');
        setEndDate('');
    };

    const navigateToInspection = (id) => {
        navigate(`/store/stockInspection?id=${id}`);
    };
    const navigateToOrderDetail = (id) => {
        navigate(`/store/orderDetail?id=${id}`);
    };

        const formatDate = (isoString) => {
        const date = new Date(isoString);
        const yyyy = date.getFullYear();
        const mm = date.getMonth() + 1;
        const dd = date.getDate();
        const hh = date.getHours();
        const min = date.getMinutes().toString().padStart(2, '0');
        return `${yyyy}년 ${mm}월 ${dd}일 ${hh}시 ${min}분`;

    };
    return (
        <>
            <div className={styles.orderListContainer}>
                <OrderSidebar />

                <div className={styles.orderListContent}>
                    <h2>발주 목록</h2>

                    <div className={styles.filters}>
                        <div className={styles.row}>
                            <label>기간</label>
                            <input type="date" value={startDate}
                                onChange={(e) => setStartDate(e.target.value)} />
                            <span>~</span>
                            <input type="date" value={endDate}
                                onChange={(e) => setEndDate(e.target.value)} />
                        </div>
                        <div className={styles.row}>
                            <label htmlFor="orderType">발주유형</label>
                            <select
                                id="orderType"
                                name="orderType"
                                value={filters.orderType}
                                onChange={handleChange}
                            >
                                <option value="">전체</option>
                                <option value="auto">자동발주</option>
                                <option value="manual">수기발주</option>
                            </select>
                            <label htmlFor="productName">품명</label>
                            <input
                                type="text"
                                id="productName"
                                name="productName"
                                value={filters.productName}
                                onChange={handleChange}
                            />


                            <button className={styles.searchButton} onClick={handleSearch}>검색</button>
                            <button className={styles.resetButton} onClick={handleReset}>초기화</button>
                        </div>
                    </div>

                    <table className={styles.orderTable}>
                        <thead>
                            <tr>
                                <th>no</th>
                                <th>발주유형</th>
                                <th>품명</th>
                                <th>발주일</th>
                                <th>상태</th>
                                <th>입고량</th>
                                <th>합계</th>
                                <th>입고 검수서</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderData.map((order, index) => (
                                
                                <tr key={order.id} onClick={() => navigateToOrderDetail(order.id)} className={styles.clickableRow}>
                                    <td>{index + 1}</td>
                                    <td>{order.purType}</td>
                                    <td>{order.productNameSummary}</td>
                                    <td>{formatDate(order.orderDateTime)}</td>
                                    <td>{order.status}</td>
                                    <td>{order.quantitySummary}</td>
                                    <td>{order.totalPrice} 원</td>
                                    <td>
                                        <button
                                        
                                            disabled={!order.receiptAvailable || order.status.trim() === "검수완료"}
                                            className={order.receiptAvailable && !order.status.trim() === "검수완료" ? styles.activeButton : styles.disabledButton}
                                            onClick={(e) =>  {e.stopPropagation(); order.receiptAvailable && navigateToInspection(order.id)}}
                                        >
                                            검수서
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className={styles.pagination}>
                        <button onClick={() => handleSearch(currentPage - 1)} disabled={currentPage === 1}>{"<"}</button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => handleSearch(i + 1)}
                                className={currentPage === i + 1 ? styles.active : ""}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button onClick={() => handleSearch(currentPage + 1)} disabled={currentPage === totalPages}>{">"}</button>
                    </div>

                </div>
            </div>
        </>
    );
}
