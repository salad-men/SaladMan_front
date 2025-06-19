import React, { useState } from "react";
import styles from "./StockLog.module.css";
import OrderSidebar from "./OrderSidebar";

export default function StockLog() {
    const [activeTab, setActiveTab] = useState("inbound");

    const inboundData = [
        { date: "2024-05-01", item: "양상추", quantity: "500g", handler: "이수민" },
        { date: "2024-05-02", item: "방울토마토", quantity: "1kg", handler: "김지호" },
        { date: "2024-05-03", item: "닭가슴살", quantity: "2kg", handler: "박지현" },
    ];

    const usageData = [
        { date: "2024-05-01", item: "양상추", quantity: "200g", usage: "시그니처샐러드" },
        { date: "2024-05-01", item: "방울토마토", quantity: "300g", usage: "그린샐러드" },
        { date: "2024-05-01", item: "닭가슴살", quantity: "500g", usage: "단백질샐러드" },
    ];

    return (
        <>
            <div className={styles.stockHistoryContainer}>
                            <OrderSidebar />

                <div className={styles.stockHistoryContent}>
                    <h2 className={styles.title}>입고 / 재고 사용 리스트</h2>

                    <div className={styles.filterSection}>
                        <label>기간</label>
                        <input type="date" /> ~ <input type="date" />
                        <button>오늘</button>
                        <button>1주</button>
                        <button>2주</button>
                        <button>1달</button>
                        <button>검색</button>
                        <button>초기화</button>
                    </div>

                    <div className={styles.tabButtons}>
                        <button
                            className={activeTab === "inbound" ? styles.active : ""}
                            onClick={() => setActiveTab("inbound")}
                        >
                            입고 내역
                        </button>
                        <button
                            className={activeTab === "usage" ? styles.active : ""}
                            onClick={() => setActiveTab("usage")}
                        >
                            재고 사용 내역
                        </button>
                    </div>

                    <table className={styles.table}>
                        <thead>
                            <tr>
                                {activeTab === "inbound" ? (
                                    <>
                                        <th>입고일</th>
                                        <th>품목명</th>
                                        <th>수량</th>
                                        <th>담당자</th>
                                    </>
                                ) : (
                                    <>
                                        <th>사용일</th>
                                        <th>품목명</th>
                                        <th>사용량</th>
                                        <th>사용처</th>
                                    </>
                                )}
                            </tr>
                        </thead>
                        <tbody>
                            {(activeTab === "inbound" ? inboundData : usageData).map((row, idx) => (
                                <tr key={idx}>
                                    <td>{row.date}</td>
                                    <td>{row.item}</td>
                                    <td>{row.quantity}</td>
                                    <td>{activeTab === "inbound" ? row.handler : row.usage}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
