import React, { useEffect, useRef, useState } from "react";
import { loadPaymentWidget } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import { useLocation, useNavigate } from "react-router-dom";


export default function PaymentTest() {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, amount } = location.state || {};

    const [paymentWidget, setPaymentWidget] = useState(null);

    useEffect(() => {
        if (!orderId || !amount) {
            alert("잘못된 접근입니다.");
            navigate("/kiosk/main");
            return;
        }

        (async () => {
            const widget = await loadPaymentWidget(import.meta.env.VITE_TOSS_CLIENT_KEY);
            const widgets = widget.widgets({
                customerKey: "kioskCustomer=1@K" // ✅ 반드시 유효한 키
            });
            await widgets.renderPaymentMethods({
                selector: "#payment-method",
                amount: {
                    value: amount,
                    currency: "KRW"
                }
            });
            setPaymentWidget(widget);
        })();
    }, [orderId, amount, navigate]);

    const handlePayment = async () => {
        if (!paymentWidget) return;

        try {
            await paymentWidget.requestPayment({
                orderId,
                orderName: "키오스크 주문",
                successUrl: window.location.origin + "/kiosk/success",
                failUrl: window.location.origin + "/kiosk/fail",
                customerName: "매장 고객"
            });
        } catch (err) {
            console.error("결제 오류", err);
            alert("결제에 실패했습니다.");
        }
    };

    return (
        <div style={{ padding: 40 }}>
            <h2>결제하기</h2>
            <div id="payment-method" />
            <button onClick={handlePayment}>결제 진행</button>
        </div>
    );
}