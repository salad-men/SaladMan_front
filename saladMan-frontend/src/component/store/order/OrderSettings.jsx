import React, { useState, useEffect, useMemo, useRef  } from "react";
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
            } catch (err) {
                console.error("설정 조회 실패", err);
                alert("설정을 불러오지 못했습니다.");
            }
        };
        fetchAutoOrder();
        fetchSettings();
    }, [token]);
    const checkedCount = useMemo(() => {
        return items.filter((item) => item.autoOrderEnabled).length;
    }, [items]);

    const sortedItems = useMemo(() => {
        return [...items].sort((a, b) => {
            const aChecked = a.autoOrderEnabled ? 1 : 0;
            const bChecked = b.autoOrderEnabled ? 1 : 0;
            return bChecked - aChecked; // true 먼저 오게
        });
    }, [items]);
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

        const invalidItems = items.filter(
            (item) =>
                item.autoOrderEnabled && (!item.autoOrderQty || item.autoOrderQty <= 0)
        );

        if (invalidItems.length > 0) {
            alert("자동발주가 체크된 품목 중 묶음수가 입력되지 않은 항목이 있습니다.");
            return;
        }

        if (!window.confirm("발주 설정을 저장하시겠습니까?")) return;

        try {
            await myAxios(token).post("/store/orderSettings", items);
            alert("저장되었습니다.");
        } catch (err) {
            console.error("저장 실패", err);
            alert("저장 중 오류가 발생했습니다.");
        }
    };
    const handleItemChangeById = (ingredientId, field, value) => {
        const updated = items.map((item) =>
            item.ingredientId === ingredientId ? { ...item, [field]: value } : item
        );
        setItems(updated);
    };
    return (
        <>
            <div className={styles.orderSettingContainer}>
                <OrderSidebar />

                <div className={styles.orderSettingContent}>
                    <h2 className={styles.title}>자동 발주 설정</h2>

                    <div className={styles.headWrap}>
                        {/* ✅ 체크된 항목 수 표시 */}
                        <div className={styles.autoOrderHeader}>
                            <div className={styles.toggleSection}>
                                <span>자동 발주 사용 여부</span>
                                <label className={styles.toggleLabel}>
                                    <input
                                        type="checkbox"
                                        checked={isAutoOrderOn}
                                        onChange={handleToggle}
                                    />
                                    <span className={styles.slider}></span>
                                </label>
                                <div className={styles.tooltipWrap}>
                                    자동 발주 시간&nbsp;
                                    <span className={styles.tooltipText}>
                                        자동 발주 시간은 오후 5시입니다.
                                    </span>
                                </div>
                            </div>
                        </div>
                        
                        <div className={styles.checkedCount} style={{ marginBottom: 10 }}>
                            자동 발주 체크된 품목 수: <strong>{checkedCount}</strong>개
                        </div>
                    </div>

                    <div className={styles.tableOuter}>
                        <table className={styles.autoTable}>
                            <thead>
                                <tr>
                                    <th>분류</th>
                                    <th>재료명</th>
                                    <th>매장 최소 수량</th>
                                    <th>묶음단위</th>
                                    <th>묶음수</th>
                                    <th>총 자동발주량</th>
                                    <th>자동발주</th>
                                </tr>
                            </thead>
                        </table>
                        <div className={styles.tableScroll}>
                            <table className={styles.autoTable}>
                                <tbody>
                                    {sortedItems.map((item) => (
                                        <tr key={item.ingredientId}>
                                            <td>{item.categoryName}</td>
                                            <td>{item.ingredientName}</td>
                                            <td>{item.minQuantity ?? 0}</td>
                                            <td>{item.minimumOrderUnit}</td>
                                            <td>
                                                <input
                                                    type="number"
                                                    min="0"
                                                    value={
                                                        item.autoOrderQty
                                                        ? Math.floor((item.autoOrderQty ?? 0) / (item.minimumOrderUnit || 1))
                                                        :""}
                                                    disabled={!item.autoOrderEnabled}
                                                    onChange={(e) => {
                                                        if (!item.autoOrderEnabled) {
                                                            alert("자동발주 체크가 되어 있어야 묶음수를 입력할 수 있습니다.");
                                                            return;
                                                        }
                                                        const bundle = parseInt(e.target.value, 10);
                                                        const minUnit = Number(item.minimumOrderUnit) || 1;
                                                        const qty = isNaN(bundle) ? 0 : bundle * minUnit;
                                                        handleItemChangeById(item.ingredientId, "autoOrderQty", qty);
                                                    }}
                                                    className={styles.bundleInput}
                                                />
                                            </td>
                                            <td>
                                                <span className={styles.totalQty}>{item.autoOrderQty ?? 0}</span>
                                            </td>
                                            <td>
                                                <input
                                                    type="checkbox"
                                                    checked={item.autoOrderEnabled ?? false}
                                                    disabled={!item.minimumOrderUnit || item.minimumOrderUnit <= 0} // 묶음단위 없으면 비활성화
                                                    onChange={(e) =>
                                                        handleItemChangeById(item.ingredientId, "autoOrderEnabled", e.target.checked)
                                                    }
                                                />
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>

                    <div className={styles.footerSticky}>
                        <button className={styles.saveButton} onClick={handleSave}>
                            저장
                        </button>
                    </div>
                </div>
            </div>
        </>
    );
}
