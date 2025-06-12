import React from "react";
import styles from "./OrderDetail.module.css";
import OrderSidebar from "./OrderSidebar";

export default function OrderDetail() {
    const orderInfo = {
        status: "대기중",
        number: 1,
        progress: 10,
        date: "2025년 05월 01일",
        requester: "이름",
        items: [
            { name: "양상추", quantity: "500g", price: 1500, total: 7500 },
            { name: "일회용 포크", quantity: "300개", price: 100, total: 30000 },
        ],
    };

    const totalAmount = orderInfo.items.reduce((acc, item) => acc + item.total, 0);

    return (
        <>
            <OrderSidebar />
            <div className={styles.orderDetailContainer}>
                <div className={styles.orderDetailContent}>
                    <h2 className={styles.title}>발주상세</h2>

                    <div className={styles.infoSection}>
                        <div className={styles.status}>{orderInfo.status}</div>
                        <div className={styles.orderNumber}>No: {orderInfo.number}</div>
                        <progress value={orderInfo.progress} max="100" className={styles.progressBar} />
                        <div className={styles.orderDate}>발주일: {orderInfo.date}</div>
                        <div className={styles.requester}>주문자: {orderInfo.requester}</div>
                    </div>

                    <div className={styles.tableSection}>
                        {orderInfo.status === "대기중" && (
                            <button className={styles.editButton}>수정</button>
                        )}                        
                        <table className={styles.detailTable}>
                            <thead>
                                <tr>
                                    <th>품명</th>
                                    <th>발주량</th>
                                    <th>구매단가</th>
                                    <th>합계</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orderInfo.items.map((item, i) => (
                                    <tr key={i}>
                                        <td>{item.name}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.price.toLocaleString()}</td>
                                        <td>{item.total.toLocaleString()}</td>
                                    </tr>
                                ))}
                                <tr>
                                    <td colSpan="4" className={styles.totalRow}>
                                        총계 : {totalAmount.toLocaleString()}원
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
        </>
    );
}
