import { useState, useEffect } from "react";
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
    useEffect(() => {
        if (!token) return;

        if (!id) return;

        const fetchDetail = async () => {
            try {
                const res = await myAxios(token).get(`/hq/orderRequestDetail/${id}`);
                setItems(res.data);
                setStoreName(res.data[0]?.storeName || '');
            } catch (err) {
                console.error("상세 조회 실패", err);
            }
        };

        fetchDetail();
    }, [id, token]);

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
                purchaseOrderId: id
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
                <h2>발주 상세</h2>

                <div className={styles.orderInfo}>
                    <p><strong>점포명:</strong> {storeName}</p>
                    <p><strong>No:</strong> {id} </p>
                    <p><strong>발주일:</strong> 2025년 05월 01일</p>
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
                            <tr key={item.id}>
                                <td>{item.ingredientName}</td>
                                <td>{item.categoryName}</td>
                                <td>{item.orderedQuantity} {item.unit}</td>
                                <td>{item.unitCost.toLocaleString()}원</td>
                                <td>{item.totalPrice.toLocaleString()}원</td>
                                <td>
                                    <select
                                        value={item.approvalStatus}
                                        onChange={(e) => handleStatusChange(index, e.target.value)}
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
                        ))}
                        <tr className={styles.summaryRow}>
                            <td colSpan="4"></td>
                            <td><strong>총 {items.reduce((acc, cur) => acc + cur.totalPrice, 0).toLocaleString()}원</strong></td>
                            <td colSpan="2"></td>
                        </tr>
                    </tbody>
                </table>

                <div className={styles.submitArea}>
                    <button onClick={handleSubmit}>저장</button>
                </div>
            </div>
        </div>
    );
}
