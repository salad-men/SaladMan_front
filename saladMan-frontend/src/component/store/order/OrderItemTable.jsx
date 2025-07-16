import { useState, useEffect } from "react";
import styles from "./OrderItemTable.module.css";
import { myAxios } from "/src/config"; // ← 유틸 함수
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "/src/atoms";
import { useNavigate } from "react-router-dom";

export default function OrderItemTable() {

    const [stockList, setStockList] = useState([]);
    const [showAlertModal, setShowAlertModal] = useState(false);

    const [showModal, setShowModal] = useState(false);

    const [modalItems, setModalItems] = useState([]);

    const [category, setCategory] = useState("전체");
    const [keyword, setKeyword] = useState("");
    const navigate = useNavigate();
    const token = useAtomValue(accessTokenAtom);

    useEffect(() => {
        if (!token) return;

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
                console.log(res.data);
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

        const orderQty = item.minimumOrderUnit;
        const itemPrice = (orderQty / item.minimumOrderUnit) * item.unitCost;

        setStockList([
            ...stockList,
            {
                ...item,
                orderQty,
                itemPrice,
            }
        ]);
        setShowModal(false);
    };

    const handlePlus = (i) => {
        const updated = [...stockList];
        updated[i].orderQty += updated[i].minimumOrderUnit;
        updated[i].itemPrice = (updated[i].orderQty / updated[i].minimumOrderUnit) * updated[i].unitCost;
        setStockList(updated);
    };

    const handleMinus = (i) => {
        const updated = [...stockList];
        const min = updated[i].minimumOrderUnit;
        if (updated[i].orderQty > min) {
            updated[i].orderQty -= min;
            updated[i].itemPrice = (updated[i].orderQty / updated[i].minimumOrderUnit) * updated[i].unitCost;
            setStockList(updated);
        }
    };

    const handleRemove = (i) => {
        const updated = stockList.filter((_, idx) => idx !== i);
        setStockList(updated);
    };

    const totalAmount = stockList.reduce(
        (acc, item) => acc + item.itemPrice, 0
    );

    const handleSubmit = async () => {
        if (stockList.length === 0) {
            setShowAlertModal(true);
            return;
        }

        try {
            const payload = stockList.map((item) => ({
                ingredientId: item.ingredientId,
                quantity: item.orderQty,
                unitCost: item.unitCost,
                totalPrice: item.itemPrice
            }));

            const res = await myAxios(token).post("/store/orderApply", payload);
            alert("발주 신청이 완료되었습니다.");
            setStockList([]); // 초기화
            navigate(`/store/orderDetail?id=${res.data.orderId}`);

        } catch (err) {
            console.error("발주 신청 실패", err);
            alert("신청에 실패했습니다.");
        }
    };

    return (
        <div className={styles.stockTableBox}>
            <h4>재료 선택</h4>
            <table className={styles.stockTable}>
                <thead>
                    <tr>
                        <th>재료</th><th>재고</th><th>입고중</th><th>발주량</th><th></th>
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
                <button className={styles.submitBtn} onClick={handleSubmit}>신청하기</button>
            </div>

            {showModal && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setShowModal(false)} // ⬅ 바깥 클릭시 닫힘
                >
                    <div
                        className={styles.modalContent}
                        onClick={(e) => e.stopPropagation()} // ⬅ 내부 클릭 이벤트 버블링 방지
                    >
                        <div className={styles.modalHeaderTop}>
                            <h4>품목 선택</h4>
                            <button
                                className={styles.closeButton}
                                onClick={() => setShowModal(false)}
                            >
                                ✕
                            </button>
                        </div>

                        <div className={styles.modalHeader}>
                            <select
                                className={styles.modalSelect}
                                value={category}
                                onChange={(e) => setCategory(e.target.value)}
                            >
                                <option>전체</option>
                                <option>단백질</option>
                                <option>채소</option>
                                <option>탄수화물</option>
                                <option>소스</option>
                                <option>일회용품</option>
                            </select>
                            <input
                                type="text"
                                placeholder="재료 검색"
                                value={keyword}
                                onChange={(e) => setKeyword(e.target.value)}
                                className={styles.searchInput}
                            />
                        </div>

                        <table className={styles.modalTable}>
                            <thead>
                                <tr>
                                    <th>구분</th>
                                    <th>재료</th>
                                    <th>단위</th>
                                    <th>재고</th>
                                    <th>입고중</th>
                                    <th>선택</th>
                                </tr>
                            </thead>
                            <tbody>
                                {modalItems.map((item) => (
                                    <tr key={item.ingredientId}>
                                        <td>{item.name}</td>
                                        <td>{item.categoryName}</td>
                                        <td>{item.unit}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.incoming}</td>
                                        <td>
                                            {!item.available ? (
                                                <span className={styles.disabledText}>주문 불가</span>
                                            ) : !item.unitCost || item.hqStock < item.minimumOrderUnit ? (
                                                <span className={styles.disabledText}>본사 품절</span>
                                            ) : (
                                                <button onClick={() => handleAddItem(item)}>추가</button>
                                            )}
                                        </td>
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

            {showAlertModal && (
                <div
                    className={styles.modalOverlay}
                    onClick={() => setShowAlertModal(false)}
                >
                    <div
                        className={styles.alertModal}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className={styles.alertModalHeader}>
                            <span className={styles.alertModalTitle}>알림</span>
                            <button
                                className={styles.alertModalClose}
                                onClick={() => setShowAlertModal(false)}
                            >
                                ×
                            </button>
                        </div>
                        <div className={styles.alertModalBody}>
                            선택된 품목이 없습니다.<br />최소 1개 이상 선택해주세요.
                        </div>
                        <div className={styles.alertModalFooter}>
                            <button
                                className={styles.alertModalButton}
                                onClick={() => setShowAlertModal(false)}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>


    );
}
