import React, { useState, useEffect } from "react";
import styles from "./OrderRequestDetail.module.css"; // ← 변경
import OrderSidebar from './OrderSidebar'
import { myAxios } from "/src/config";
import { useAtomValue } from 'jotai';
import { accessTokenAtom } from "/src/atoms";
import { useNavigate } from "react-router";
import { useParams } from "react-router-dom";

export default function OrderRequestDetail() {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const token = useAtomValue(accessTokenAtom);
    const id = new URLSearchParams(location.search).get("id");
    const [storeName, setStoreName] = useState('');
    const [isCompleted, setIsCompleted] = useState(false);


    useEffect(() => {
        if (!token) return;

        if (!id) return;

        const fetchDetail = async () => {
            try {
                const res = await myAxios(token).get(`/hq/orderRequestDetail/${id}`);
                const updated = res.data.map(item => ({
                    ...item,
                    selectedStockIds: [] // 선택한 재고 id 배열
                }));
                setItems(updated);
                setStoreName(res.data[0]?.storeName || '');

                if (res.data[0]?.orderStatus === "대기중") {
                    setIsCompleted(false); // 대기중이면 아직 완료 안된 상태
                } else {
                    setIsCompleted(true);  // 대기중이 아니면 완료된 상태
                }

                console.log(res.data);

            } catch (err) {
                console.error("상세 조회 실패", err);
            }
        };

        fetchDetail();

    }, [id, token]);

    const handleStockSelect = (itemIndex, stockId, checked) => {
        const updated = [...items];
        const selected = new Set(updated[itemIndex].selectedStockIds);

        if (checked) {
            selected.add(stockId);
        } else {
            selected.delete(stockId);
        }

        updated[itemIndex].selectedStockIds = Array.from(selected);
        setItems(updated);
    };

    const handleStatusChange = (index, value) => {
        const updated = [...items];
        updated[index].approvalStatus = value;
        if (value !== "반려") updated[index].rejectionReason = "";
        setItems(updated);
    };

    const handleReasonChange = (index, value) => {
        const updated = [...items];
        updated[index].rejectionReason = value;
        setItems(updated);
    };

    const handleSubmit = async () => {
        const invalid = items.some(item => item.approvalStatus === "반려" && !item.rejectionReason?.trim());
        if (invalid) {
            alert("반려 사유를 입력해주세요");
            return;
        }

        try {
            await myAxios(token).post("/hq/orderRequestDetail", items.map(item => ({
                id: item.id,
                approvalStatus: item.approvalStatus,
                rejectionReason: item.rejectionReason,
                purchaseOrderId: id,
                selectedStockIds: item.selectedStockIds
            })));
            alert("저장 완료");
            navigate("/hq/orderRequest");
        } catch (e) {
            console.error("저장 실패", e);
            alert("저장 중 오류 발생");
        }
    };

    return (
        <div className={styles.orderDetailContainer}>
            <OrderSidebar />

            <div className={styles.orderDetailContent}>
                <h2>수주 상세</h2>

                <div className={styles.orderInfo}>
                    <p><strong>점포명:</strong> {storeName}</p>
                    <p><strong>No:</strong> {id} </p>
                    <p><strong>수주일:</strong> 2025년 05월 01일</p>
                    <p><strong>주문자:</strong> 이효봉</p>
                </div>

                <table className={styles.orderDetailTable}>
                    <thead>
                        <tr>
                            <th>품명</th>
                            <th>구분</th>
                            <th>발주량</th>
                            <th>단가(원)</th>
                            <th>합계(원)</th>
                            <th>승인여부</th>
                            <th>반려사유</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item, index) => (
                            <React.Fragment key={item.id}>
                                <tr key={item.id}>
                                    <td>{item.ingredientName}</td>
                                    <td>{item.categoryName}</td>
                                    <td>{item.orderedQuantity} {item.unit}</td>
                                    <td>{Math.round(item.totalPrice / item.orderedQuantity).toLocaleString()}원</td>
                                    <td>{item.totalPrice.toLocaleString()}원</td>
                                    <td>
                                        <select
                                            value={item.approvalStatus}
                                            onChange={(e) => handleStatusChange(index, e.target.value)}
                                            disabled={isCompleted}
                                        >
                                            <option value="">선택</option>
                                            <option value="승인">승인</option>
                                            <option value="반려">반려</option>
                                        </select>
                                    </td>
                                    <td>
                                        {item.approvalStatus === "반려" && (
                                            <input
                                                type="text"
                                                value={item.rejectionReason}
                                                onChange={(e) => handleReasonChange(index, e.target.value)}
                                                placeholder="반려 사유 입력"

                                            />
                                        )}
                                    </td>
                                </tr>
                                {item.approvalStatus === "승인" && item.stockList?.length > 0 && (
                                    <tr className={styles.stockRow}>
                                        <td colSpan="7">
                                            <div className={styles.stockListWrapper}>
                                                {item.stockList.map(stock => (
                                                    <label key={stock.id} className={styles.stockItem}>
                                                        <input
                                                            type="checkbox"
                                                            checked={item.selectedStockIds.includes(stock.id)}
                                                            onChange={(e) =>
                                                                handleStockSelect(index, stock.id, e.target.checked)
                                                            }
                                                            disabled={isCompleted}

                                                        />
                                                        [유통기한: {stock.expiredDate}] {stock.ingredientName} - {stock.quantity} {item.unit} /  수량:{stock.quantity}{stock.unit}
                                                    </label>
                                                ))}
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </React.Fragment>
                        ))}
                        <tr className={styles.summaryRow}>
                            <td colSpan="4"></td>
                            <td><strong>총 {items.reduce((acc, cur) => acc + cur.totalPrice, 0).toLocaleString()}원</strong></td>
                            <td colSpan="2"></td>
                        </tr>
                    </tbody>
                </table>


                <div className={styles.submitArea}>
                    <button onClick={() => navigate(-1)}>뒤로가기</button>

                    {!isCompleted && (
                        <button onClick={handleSubmit}>저장</button>
                    )}

                </div>



            </div>
        </div>
    );
}
