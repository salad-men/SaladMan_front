import { useState } from "react";
import "./OrderRequestDetail.css";
import OrderSidebar from './OrderSidebar'

export default function OrderRequestDetail() {
    const [items, setItems] = useState([
        { id: 1, name: "치커리", type: "야채", quantity: "500g", price: 1500, total: 7500, status: "", reason: "" },
        { id: 2, name: "방울토마토", type: "야채", quantity: "200개", price: 100, total: 20000, status: "", reason: "" }
    ]);

    const handleStatusChange = (index, value) => {
        const updated = [...items];
        updated[index].status = value;
        if (value !== "REJECTED") updated[index].reason = "";
        setItems(updated);
    };

    const handleReasonChange = (index, value) => {
        const updated = [...items];
        updated[index].reason = value;
        setItems(updated);
    };

    const handleSubmit = () => {
        const invalid = items.some(item => item.status === "REJECTED" && !item.reason.trim());
        if (invalid) {
            alert("반려 사유를 모두 입력해주세요.");
            return;
        }
        console.log("처리 결과:", items);
    };

    return (
        <>
            <OrderSidebar />

            <div className="orderDetailContainer">
                <div className="orderDetailContent">
                    <h2>발주 상세</h2>

                    <div className="orderInfo">
                        <p><strong>점포명:</strong> 강남점</p>
                        <p><strong>No:</strong> 1</p>
                        <p><strong>발주일:</strong> 2025년 05월 01일</p>
                        <p><strong>주문자:</strong> 이효봉</p>
                    </div>

                    <table className="orderDetailTable">
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
                                    <td>{item.name}</td>
                                    <td>{item.type}</td>
                                    <td>{item.quantity}</td>
                                    <td>{item.price.toLocaleString()}</td>
                                    <td>{item.total.toLocaleString()}</td>
                                    <td>
                                        <select
                                            value={item.status}
                                            onChange={(e) => handleStatusChange(index, e.target.value)}
                                        >
                                            <option value="">선택</option>
                                            <option value="APPROVED">승인</option>
                                            <option value="REJECTED">반려</option>
                                        </select>
                                    </td>
                                    <td>
                                        {item.status === "REJECTED" && (
                                            <input
                                                type="text"
                                                value={item.reason}
                                                onChange={(e) => handleReasonChange(index, e.target.value)}
                                                placeholder="반려 사유 입력"
                                            />
                                        )}
                                    </td>
                                </tr>
                            ))}
                            <tr className="summaryRow">
                                <td colSpan="4"></td>
                                <td><strong>{items.reduce((acc, cur) => acc + cur.total, 0).toLocaleString()}</strong></td>
                                <td colSpan="2"></td>
                            </tr>
                        </tbody>
                    </table>

                    <div className="submitArea">
                        <button onClick={handleSubmit}>저장</button>
                    </div>
                </div>
            </div>
        </>
    );
}
