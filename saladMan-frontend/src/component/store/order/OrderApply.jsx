import React, { useState } from "react";
import styles from "./OrderApply.module.css";
import OrderSidebar from "./OrderSidebar";
import LowStockList from "./LowStockList";

export default function OrderApply() {
    const [orderItems, setOrderItems] = useState([]); // 실제 신청할 품목
    const [showModal, setShowModal] = useState(false);

    const [shortages, setShortages] = useState([     // 부족 품목
        { name: "양상추", category: "베이스채소", current: 500 },
        { name: "로메인", category: "베이스채소", current: 0 },
        { name: "닭가슴살", category: "단백질", current: 800 },
        { name: "믹스채소", category: "베이스채소", current: 0 },
    ]);

    const [stockList, setStockList] = useState([      // 재고 목록
        { name: "양상추", stock: 800, incoming: 0, orderQty: 900, price: 1800 },
        { name: "토마토", stock: 300, incoming: 0, orderQty: 450, price: 2000 },
        { name: "로메인", stock: 150, incoming: 0, orderQty: 550, price: 1900 },
        { name: "두부", stock: 0, incoming: 500, orderQty: 150, price: 1400 },
        { name: "훈제오리고기", stock: 550, incoming: 0, orderQty: 450, price: 2300 },
    ]);

    const totalAmount = stockList.reduce(
        (acc, item) => acc + item.orderQty * item.price,
        0
    );

    const handleRemoveStock = (index) => {
        const updated = stockList.filter((_, i) => i !== index);
        setStockList(updated);
    };

    const handleApplyOrder = () => {
        // TODO: 서버로 orderItems 전송
        alert("발주가 신청되었습니다.");
    };

    return (
        <>
            <div className={styles.orderApplyContainer}>
            <OrderSidebar />

                <div className={styles.orderApplyContent}>

                    <h2>발주신청</h2>
                    <div className={styles.contentBox}>

                    <LowStockList />

                        <div className={styles.stockTableBox}>
                            <h4>품목 선택</h4>
                            <table className={styles.stockTable}>
                                <thead>
                                    <tr><th>품명</th><th>재고</th><th>입고중</th><th>발주량</th><th>구매단가</th><th>합계</th><th></th></tr>
                                </thead>
                                <tbody>
                                    {stockList.map((item, i) => (
                                        <tr key={i}>
                                            <td>{item.name}</td>
                                            <td>{item.stock}g</td>
                                            <td>{item.incoming}g</td>
                                            <td>{item.orderQty}g</td>
                                            <td>{item.price}</td>
                                            <td>{item.orderQty * item.price}</td>
                                            <td><button onClick={() => handleRemoveStock(i)}>X</button></td>

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                            <div className={styles.summary}>
                                <button className={styles.plusButton} onClick={() => setShowModal(true)}>＋</button>
                                <div className={styles.total}>총계 : {totalAmount.toLocaleString()}원</div>
                            </div>
                            <div className={styles.submitArea}>
                                <button className={styles.submitButton} onClick={handleApplyOrder}>신청하기</button>
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h4>품목 선택</h4>
                        <div className={styles.modalHeader}>
                            <select className={styles.modalSelect}>
                                <option>카테고리 전체</option>
                                <option>단백질</option>

                            </select>
                            <input type="text" placeholder="품명 검색" className={styles.searchInput} />

                        </div>
                        <table className={styles.modalTable}>
                            <thead>
                                <tr>
                                    <th>품명</th><th>구분</th><th>단위</th><th>재고</th><th>최소수량</th><th>선택</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr>
                                    <td>로메인</td><td>야채</td><td>g</td><td>800</td><td>500</td>
                                    <td><button>추가</button></td>
                                </tr>
                                <tr>
                                    <td>닭가슴살</td><td>단백질</td><td>g</td><td>300</td><td>200</td>
                                    <td><button>추가</button></td>
                                </tr>
                            </tbody>
                        </table>
                        <div className={styles.modalActions}>
                            <button onClick={() => setShowModal(false)}>닫기</button>
                            <button onClick={() => setShowModal(false)}>추가 완료</button>
                        </div>
                    </div>
                </div>
            )}

        </>
    );
}
