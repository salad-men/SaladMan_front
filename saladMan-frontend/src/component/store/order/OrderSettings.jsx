import React, { useState } from "react";
import styles from "./OrderSettings.module.css";
import OrderSidebar from "./OrderSidebar";
import { Info, X } from "lucide-react";

export default function OrderSettings() {
    const [isAutoOrderOn, setIsAutoOrderOn] = useState(true);

    const handleToggle = () => {
        setIsAutoOrderOn(prev => !prev);
    };

    const fixedItems = [
        { name: "양상추", category: "베이스채소", minQty: 500 },
        { name: "닭가슴살", category: "단백질", minQty: 300 },
        { name: "방울토마토", category: "야채", minQty: 200 },
    ];

    const [autoItems, setAutoItems] = useState([
        { name: "양상추", category: "베이스채소" },
        { name: "방울토마토", category: "야채" },
    ]);

    const handleRemoveItem = (index) => {
        const updated = autoItems.filter((_, i) => i !== index);
        setAutoItems(updated);
    };


    return (
        <>
            <OrderSidebar />
            <div className={styles.orderSettingContainer}>
                <div className={styles.orderSettingContent}>
                    <h2 className={styles.title}>발주 설정</h2>

                    <div className={styles.autoOrderHeader}>
                        <div className={styles.toggleSection}>
                            <span>자동 발주 사용여부</span>

                            <label className={styles.toggleLabel}>
                                <input type="checkbox" checked={isAutoOrderOn} onChange={handleToggle} />
                                <span className={styles.slider}></span>
                            </label>
                            <div className={styles.tooltipWrap}>
                                자동발주란&nbsp;
                                <Info size={16} className={styles.infoIcon} />
                                <span className={styles.tooltipText}> 자동 발주 시간은 오후 5시입니다</span>
                            </div>
                        </div>
                    </div>

                    {/* 아래는 고정 항목 테이블 및 자동 발주 항목 표시 자리 */}

                    <div className={styles.settingLayout}>
                        <div className={styles.leftPanel}>
                            <h4>고정 발주 항목</h4>
                            <table className={styles.fixedTable}>
                                <thead>
                                    <tr>
                                        <th>품명</th>
                                        <th>구분</th>
                                        <th>최소 발주 수량</th>
                                        <th>설정</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {fixedItems.map((item, idx) => (
                                        <tr key={idx}>
                                            <td>{item.name}</td>
                                            <td>{item.category}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    defaultValue={item.minQty}
                                                    className={styles.inputBox}
                                                />
                                            </td>
                                            <td>
                                                <button className={styles.saveButton}>저장</button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

                        <div className={styles.rightPanel}>
                            <div className={styles.autoHeader}>
                                <h4>자동 발주 항목</h4>
                                <span>총 {autoItems.length}개</span>
                            </div>
                            <table className={styles.autoTable}>
                                <thead>
                                    <tr>
                                        <th>품명</th>
                                        <th>구분</th>
                                        <th>삭제</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {autoItems.map((item, index) => (
                                        <tr key={index}>
                                            <td>{item.name}</td>
                                            <td>{item.category}</td>
                                            <td>
                                                <button onClick={() => handleRemoveItem(index)}>
                                                    <X size={16} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>                    </div>

                </div>
            </div>
        </>
    );
}
