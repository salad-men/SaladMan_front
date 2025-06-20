import { useState, useEffect } from "react";
import styles from "./OrderItemTable.module.css";
import { myAxios } from "/src/config"; // ← 유틸 함수
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "/src/atoms";

export default function OrderItemTable() {

    const [stockList, setStockList] = useState([]);  // ✅ OK
    const [showModal, setShowModal] = useState(false);

    const [modalItems, setModalItems] = useState([]);

    const [category, setCategory] = useState("전체");
    const [keyword, setKeyword] = useState("");

    const token = useAtomValue(accessTokenAtom);

    useEffect(() => {
        if (!showModal) return;

        const fetchItems = async () => {
            try {
                const res = await myAxios(token).get("/store/orderApply/items", {
                    params: {
                        category: category === "전체" ? null : category,
                        keyword: keyword.trim() === "" ? null : keyword
                    }
                });
                setModalItems(res.data);
            } catch (err) {
                console.error("품목 목록 조회 실패:", err);
            }
        };

        fetchItems();
    }, [showModal, category, keyword]);

    // 품목 추가
    const handleAddItem = (item) => {
        // 중복 방지
        if (stockList.find((s) => s.ingredientId === item.ingredientId)) return;

        setStockList([
            ...stockList,
            {
                ...item,
                orderQty: item.minimumOrderUnit
            }
        ]);
        setShowModal(false);
    };

    const handlePlus = (i) => {
        const updated = [...stockList];
        updated[i].orderQty += updated[i].minimumOrderUnit;
        setStockList(updated);
    };

    const handleMinus = (i) => {
        const updated = [...stockList];
        const min = updated[i].minimumOrderUnit;
        if (updated[i].orderQty > min) {
            updated[i].orderQty -= min;
            setStockList(updated);
        }
    };

    const handleRemove = (i) => {
        const updated = stockList.filter((_, idx) => idx !== i);
        setStockList(updated);
    };

    const totalAmount = stockList.reduce(
        (acc, item) => acc + item.orderQty * item.unitCost,
        0
    );

    return (
        <div className={styles.stockTableBox}>
            <h4>품목 선택</h4>
            <table className={styles.stockTable}>
                <thead>
                    <tr>
                        <th>품명</th><th>재고</th><th>입고중</th><th>발주량</th><th>구매단가</th><th>합계</th><th></th>
                    </tr>
                </thead>
                <tbody>
                    {stockList.map((item, i) => (
                        <tr key={i}>
                            <td>{item.name}</td>
                            <td>{item.quantity}{item.unit}</td>
                            <td>{item.incoming}{item.unit}</td>
                            <td>
                                <button onClick={() => handleMinus(i)} className={styles.qtyBtn}>-</button>
                                {item.orderQty}{item.unit}
                                <button onClick={() => handlePlus(i)} className={styles.qtyBtn}>+</button>
                            </td>
                            <td>{item.unitCost.toLocaleString()}원</td>
                            <td>{(item.orderQty * item.unitCost).toLocaleString()}원</td>
                            <td><button onClick={() => handleRemove(i)}>X</button></td>

                        </tr>
                    ))}
                    <tr>
                        <td colSpan={7}>
                            <div className={styles.addRowButton} onClick={() => setShowModal(true)}>
                                ＋ 품목 추가하기
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <div className={styles.summary}>
                <div className={styles.total}>총계 : {totalAmount.toLocaleString()}원</div>
            </div>

            {/* 🔽 모달 내부 포함 */}
            {showModal && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h4>품목 선택</h4>
                        <div className={styles.modalHeader}>
                            <select className={styles.modalSelect} value={category} onChange={(e)=>setCategory(e.target.value)}>
                                <option>카테고리 전체</option>
                                <option>단백질</option>
                                <option>채소</option>
                            </select>
                            <input type="text" placeholder="품명 검색" value={keyword}
                                onChange={(e) => setKeyword(e.target.value)} className={styles.searchInput} />
                        </div>
                        <table className={styles.modalTable}>
                            <thead>
                                <tr><th>품명</th><th>구분</th><th>단위</th><th>재고</th><th>입고중</th><th>선택</th></tr>
                            </thead>
                            <tbody>
                                {modalItems.map((item) => (
                                    <tr key={item.ingredientId}>
                                        <td>{item.name}</td>
                                        <td>{item.category}</td>
                                        <td>{item.unit}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.incoming}</td>
                                        <td><button onClick={() => handleAddItem(item)}>추가</button></td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        <div className={styles.modalActions}>
                            <button onClick={() => setShowModal(false)}>닫기</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
