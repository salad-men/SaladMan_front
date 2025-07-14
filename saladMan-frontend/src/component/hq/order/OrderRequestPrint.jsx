import React, { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { myAxios } from "/src/config";
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "/src/atoms";
import styles from "./OrderRequestPrint.module.css"; // css import

export default function OrderRequestPrint() {
    const token = useAtomValue(accessTokenAtom);
    const [searchParams] = useSearchParams();
    const id = searchParams.get("id");
    const navigate = useNavigate();

    const [orderDetail, setOrderDetail] = useState(null);

    useEffect(() => {
        const fetchDetail = async () => {
            try {
                const res = await myAxios(token).get(`/hq/purchaseOrders/${id}`);
                setOrderDetail(res.data);
            } catch (err) {
                console.error("발주서 상세 조회 실패", err);
            }
        };
        if (id && token) fetchDetail();
    }, [id, token]);

    useEffect(() => {
    const headerEl = document.querySelector(".header");
    if (headerEl) headerEl.style.display = "none";

    return () => {
        if (headerEl) headerEl.style.display = ""; // 되돌리기
    };
}, []);

    const handlePrint = () => {
        window.print();
    };

    if (!orderDetail) {
        return <div className={styles.orderPrintContainer}>로딩 중...</div>;
    }

    return (
        <div className={styles.orderPrintContainer}>
            <h2>수주 목록</h2>
            <div className={styles.orderInfoWrapper}>
            <div className={styles.orderInfo}>
                <p ><strong>점포명:</strong> {orderDetail.storeName}</p>
                <p><strong>발주번호:</strong> {orderDetail.purchaseOrderId}</p>
                <p ><strong>발주일:</strong> {orderDetail.orderDateTime?.split("T")[0]}</p>
                <p ><strong>발주유형:</strong> {orderDetail.purType}</p>
                <p ><strong>발주자:</strong> {orderDetail.requestedBy}</p>
                <p ><strong>상태:</strong> {orderDetail.orderStatus}</p>
            </div>

            {orderDetail.qrImg && (
                <img src={orderDetail.qrImg} alt="QR 코드" className={styles.qrImage} />
            )}
</div>
            <table className={styles.orderPrintTable}>
                <thead>
                    <tr>
                        <th>품명</th>
                        <th>유통기한</th>
                        <th>수량</th>
                        <th>승인여부</th>
                        <th>반려사유</th>
                    </tr>
                </thead>
                <tbody>
                    {orderDetail.items.map(item => (
                        <React.Fragment key={item.id}>
                            <tr>
                                <td className={styles.itemHeader} colSpan={6}>
                                    {item.ingredientName}
                                </td>
                            </tr>
                            {item.receivedStockList.length > 0 ? (
                                item.receivedStockList.map((stock, idx) => (
                                    <tr key={`${item.id}-${idx}`}>
                                        <td></td>
                                        <td>{stock.expiredDate}</td>
                                        <td>{stock.quantity}</td>
                                        {idx === 0 ? (
                                            <>
                                                <td rowSpan={item.receivedStockList.length}>
                                                    {item.approvalStatus || "-"}
                                                </td>
                                                <td rowSpan={item.receivedStockList.length}>
                                                    {item.approvalStatus === "반려"
                                                        ? item.rejectionReason || "-"
                                                        : "-"}
                                                </td>
                                            </>
                                        ) : null}
                                    </tr>
                                ))
                            ) : (
                                <tr>
                                    <td></td>
                                    <td colSpan={3}>입고 내역 없음</td>
                                    <td>{item.approvalStatus || "-"}</td>
                                    <td>
                                        {item.approvalStatus === "반려"
                                            ? item.rejectionReason || "-"
                                            : "-"}
                                    </td>
                                </tr>
                            )}
                        </React.Fragment>
                    ))}
                </tbody>
            </table>

            <div className={styles.buttons}>
                <button
                    onClick={() => navigate("/hq/orderRequest")}
                    className={`${styles.button} ${styles.buttonSecondary}`}
                >
                    목록으로
                </button>
                <button onClick={handlePrint} className={styles.button}>
                    인쇄
                </button>
            </div>
        </div>
    );
}
