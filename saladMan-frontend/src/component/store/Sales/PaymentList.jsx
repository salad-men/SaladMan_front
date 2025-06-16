import styles from './PaymentList.module.css'

const PaymentList = () => {
    const orderList = [
        {
            orderNo: '20240525-002',
            customer: '홍길동',
            menu: '치킨 시저 샐러드',
            quantity: '1개',
            total: '12,000원',
            status: '주문완료',
            date: '2025-05-25 18:06:41',
        },
        {
            orderNo: '20240522-007',
            customer: '이철수',
            menu: '두부 에그보울',
            quantity: '2개',
            total: '20,000원',
            status: '환불완료',
            date: '2025-05-22 19:00:14',
        },
        // ... 추가 데이터
    ];

    return (
        <div className={styles.container}>
            <h2>주문 및 환불 내역 조회</h2>

            <div className={styles.filterBox}>
                <div className={styles.filterRow}>
                    <div className={styles.filterLabel}>주문 상태</div>
                    <div className={styles.filterContent}>
                        <label><input type="radio" name="status" /> 전체</label>
                        <label><input type="radio" name="status" /> 주문완료</label>
                        <label><input type="radio" name="status" /> 환불완료</label>
                    </div>
                </div>
                <div className={styles.filterRow}>
                    <div className={styles.filterLabel}>검색</div>
                    <div className={styles.filterContent}>
                        <select>
                            <option>고객명</option>
                            <option>전화번호</option>
                            <option>상품명</option>
                        </select>
                        <input type="text" placeholder="검색어 입력" />
                    </div>
                </div>
                <div className={styles.filterRow}>
                    <div className={styles.filterLabel}>기간</div>
                    <div className={styles.filterContent}>
                        <input type="date" /> ~ <input type="date" />
                    </div>
                </div>
                <div className={styles.filterActions}>
                    <button>검색</button>
                    <button className={styles.reset}>초기화</button>
                </div>
            </div>

            <table className={styles.orderTable}>
                <thead>
                    <tr className={styles.orderTableHeader}>
                        <th>주문번호</th>
                        <th>고객명</th>
                        <th>메뉴</th>
                        <th>수량</th>
                        <th>총금액</th>
                        <th>상태</th>
                        <th>주문일자</th>
                    </tr>
                </thead>
                <tbody>
                    {orderList.map((order, idx) => (
                        <tr key={idx}>
                            <td>{order.orderNo}</td>
                            <td>{order.customer}</td>
                            <td>{order.menu}</td>
                            <td>{order.quantity}</td>
                            <td>{order.total}</td>
                            <td><span>{order.status}</span></td>
                            <td>{order.date}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}

export default PaymentList;