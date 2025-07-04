import React, { useState,useEffect } from "react";
import styles from "./OrderSettings.module.css";
import OrderSidebar from "./OrderSidebar";
import { Info, X } from "lucide-react";
import { myAxios } from "/src/config";
import { useAtomValue } from 'jotai';
import { accessTokenAtom } from "/src/atoms";
import { useNavigate } from "react-router";

export default function OrderSettings() {
    const [isAutoOrderOn, setIsAutoOrderOn] = useState(true);
    const [items, setItems] = useState([]);
    const token = useAtomValue(accessTokenAtom);

    useEffect(() => {
        if (!token) return;


        const fetchAutoOrder = async () => {
            try {
                const res = await myAxios(token).get("/store/autoOrderEnabled");
                setIsAutoOrderOn(res.data.enabled);
            } catch (err) {
                console.error("자동발주 상태 조회 실패", err);
                alert("자동발주 상태를 불러오지 못했습니다.");
            }
        };

        const fetchSettings = async () => {
            try {
                const res = await myAxios(token).get("/store/orderSettings");
                setItems(res.data);
                console.log(res.data);
                // 여기서 전체 자동발주 여부도 별도 API로 가져와도 됩니다.
            } catch (err) {
                console.error("설정 조회 실패", err);
                alert("설정을 불러오지 못했습니다.");
            }
        };
        fetchAutoOrder();
        fetchSettings();
    }, [token]);

    const handleToggle = async () => {
        const newValue = !isAutoOrderOn;
        setIsAutoOrderOn(newValue);

        try {
            await myAxios(token).post("/store/autoOrderEnabled", {
                enabled: newValue,
            });
        } catch (err) {
            console.error("자동발주 상태 저장 실패", err);
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    // 필드 변경
    const handleItemChange = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = value;
        setItems(updated);
    };

    // 저장
    const handleSave = async () => {
        if (!window.confirm("발주 설정을 저장하시겠습니까?")) return;

        try {
            await myAxios(token).post("/store/orderSettings", items);
            alert("저장되었습니다.");
        } catch (err) {
            console.error("저장 실패", err);
            alert("저장 중 오류가 발생했습니다.");
        }
    };

    return (
        <>
            <div className={styles.orderSettingContainer}>
                <OrderSidebar />

                <div className={styles.orderSettingContent}>
                    <h2 className={styles.title}>발주 설정</h2>

                    <div className={styles.autoOrderHeader}>
                        <div className={styles.toggleSection}>
                            <span>자동 발주 사용여부</span>
                            <label className={styles.toggleLabel}>
                                <input
                                    type="checkbox"
                                    checked={isAutoOrderOn}
                                    onChange={handleToggle}
                                />
                                <span className={styles.slider}></span>
                            </label>
                            <div className={styles.tooltipWrap}>
                                자동발주란&nbsp;
                                <span className={styles.tooltipText}>
                                    자동 발주 시간은 오후 5시입니다.
                                </span>
                            </div>
                        </div>
                    </div>

                    <table className={styles.autoTable}>
                        <thead>
                            <tr>
                                <th>품명</th>
                                <th>구분</th>
                                <th>최소량</th>
                                <th>자동주문량</th>
                                <th>자동발주</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={item.ingredientId}>
                                    <td>{item.ingredientName}</td>
                                    <td>{item.categoryName}</td>
                                    <td>
                                        <input
                                            type="number"
                                            value={item.minQuantity || ""}
                                            readOnly
                                            onChange={(e) =>
                                                handleItemChange(index, "minQuantity", e.target.value)
                                            }
                                        />
                                    </td>
                                    <td>
                                        <div className={styles.qtyControl}>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const minUnit = Number(item.minimumOrderUnit) || 1;
                                                    const current = Number(item.autoOrderQty) || 0;
                                                    const newValue = Math.max(current - minUnit, 0);
                                                    handleItemChange(index, "autoOrderQty", newValue);
                                                }}
                                            >
                                                -
                                            </button>
                                            <input
                                                type="number"
                                                value={item.autoOrderQty || 0}
                                                readOnly
                                            />
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    const minUnit = Number(item.minimumOrderUnit) || 1;
                                                    const current = Number(item.autoOrderQty) || 0;
                                                    const newValue = current + minUnit;
                                                    handleItemChange(index, "autoOrderQty", newValue);
                                                }}
                                            >
                                                +
                                            </button>
                                        </div>
                                    </td>

                                    <td>
                                        <input
                                            type="checkbox"
                                            checked={item.autoOrderEnabled || false}
                                            onChange={(e) =>
                                                handleItemChange(
                                                    index,
                                                    "autoOrderEnabled",
                                                    e.target.checked
                                                )
                                            }
                                        />
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className={styles.footerSection}>
                        <button className={styles.saveButton} onClick={handleSave}>
                            저장
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
