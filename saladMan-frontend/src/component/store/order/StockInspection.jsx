import React from "react";
import styles from "./StockInspection.module.css";
import OrderSidebar from "./OrderSidebar";

export default function StockInspection() {
    const inspector = "홍길동";
    const orderInfo = {
        number: 3,
        date: "2025년 05월 01일",
        requester: "이효봉",
        items: [
            {
                name: "양상추",
                category: "베이스소스",
                quantity: "300g",
                price: 600,
                total: 1800,
                received: "300",
                status: "입고완료",
                note: "이상 없음, 유통기한 양호 등"
            },
            {
                name: "닭가슴살",
                category: "단백질",
                quantity: "500g",
                price: 1200,
                total: 6000,
                received: "480",
                status: "입고완료",
                note: "패키지 훼손 1건"
            },
        ]
    };

    return (
        <>
            <OrderSidebar />
            <div className={styles.stockInspectionContainer}>
                <div className={styles.stockInspectionContent}>
                    <h2 className={styles.title}>입고검수</h2>

                    <div className={styles.infoBox}>
                        <p>발주번호: No. {orderInfo.number}</p>
                        <p>발주일자: {orderInfo.date}</p>
                        <p>주문자: {orderInfo.requester}</p>
                    </div>
                    <div className={styles.inspectorBox}> <span> 검수자: <select><option>{inspector}</option></select></span></div>

                    <table className={styles.inspectionTable}>
                        <thead>
                            <tr>
                                <th>품명</th>
                                <th>구분</th>
                                <th>발주량</th>

                                <th>실제 입고량</th>
                                <th>입고 처리</th>
                                <th>비고</th>
                            </tr>
                        </thead>
                        <tbody>
                            {orderInfo.items.map((item, index) => (
                                <tr key={index}>
                                    <td>{item.name}</td>
                                    <td>{item.category}</td>
                                    <td>{item.quantity}</td>
                                    {/* <td>{item.price}</td>
                                    <td>{item.total.toLocaleString()}</td> */}
                                    <td>
                                        <input type="text" defaultValue={item.received} className={styles.inputBox} />
                                    </td>
                                    <td>
                                        <select defaultValue={item.status} className={styles.selectBox}>
                                            <option>검수완료</option>
                                            <option>파손</option>
                                        </select>
                                    </td>
                                    <td>
                                        <textarea defaultValue={item.note} className={styles.textArea}></textarea>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className={styles.footerSection}>
                        <button className={styles.completeButton}>전체 검수 완료</button>
                    </div>
                </div>
            </div>
        </>
    );
}
