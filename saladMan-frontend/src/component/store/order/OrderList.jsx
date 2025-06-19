import styles from "./OrderList.module.css";
import OrderSidebar from "./OrderSidebar";
import { useState } from 'react';

export default function OrderList() {
 const [filters, setFilters] = useState({
        productName: '',
        orderType: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({ ...prev, [name]: value }));
    };

    const handleSearch = () => {
        console.log('검색 요청', filters);
    };

    const handleReset = () => {
        setFilters({ productName: '', orderType: '' });
    };

    const orderData = [
        {
            id: 1,
            orderType: '자동발주',
            productName: '양상추 외 9',
            date: '2025-05-11',
            status: '대기중',
            quantity: '0/10',
            total: '0원',
            receiptAvailable: false
        },
        {
            id: 2,
            orderType: '일반발주',
            productName: '양상추 외 8',
            date: '2025-05-10',
            status: '검수완료',
            quantity: '9/9',
            total: '0원',
            receiptAvailable: true
        },
        {
            id: 3,
            orderType: '일반발주',
            productName: '양상추 외 8',
            date: '2025-05-09',
            status: '입고완료',
            quantity: '0/8',
            total: '0원',
            receiptAvailable: true
        },
    ];

    return (
        <>
            <div className={styles.orderListContainer}>
                            <OrderSidebar />

                <div className={styles.orderListContent}>
                    <h2>발주 목록</h2>

                    <div className={styles.filters}>
                        <div className={styles.row}>
                            <label>기간</label>
                            <input type="date" />
                            <span>~</span>
                            <input type="date" />
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
                                <option value="manual">일반발주</option>
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
                                <tr key={order.id}>
                                    <td>{index + 1}</td>
                                    <td>{order.orderType}</td>
                                    <td>{order.productName}</td>
                                    <td>{order.date}</td>
                                    <td>{order.status}</td>
                                    <td>{order.quantity}</td>
                                    <td>{order.total}</td>
                                    <td>
                                        <button
                                            disabled={!order.receiptAvailable}
                                            className={order.receiptAvailable ? styles.activeButton : styles.disabledButton}
                                        >
                                            검수서
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className={styles.pagination}>
                        <button>{"<"}</button>
                        <button className={styles.active}>1</button>
                        <button>2</button>
                        <button>3</button>
                        <button>{">"}</button>
                    </div>
                </div>
            </div>
        </>
    );
}
