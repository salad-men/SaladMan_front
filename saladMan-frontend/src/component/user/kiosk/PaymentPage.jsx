import React, { useEffect, useRef, useState } from "react";
import { loadPaymentWidget, ANONYMOUS } from "@tosspayments/payment-widget-sdk";
import { nanoid } from "nanoid";
import { useLocation, useNavigate } from "react-router-dom";
import styles from "./PaymentPage.module.css";


export default function PaymentPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const { orderId, amount } = location.state || {};

    const widgetClientKey = import.meta.env.VITE_TOSS_CLIENT_KEY;
    const customerKey = "KIOSK-GUEST-001";

    const [paymentWidget, setPaymentWidget] = useState(null);
    const paymentMethodsWidgetRef = useRef(null);

    useEffect(() => {
        // orderId와 amount가 없으면 잘못된 접근
        if (!orderId || !amount) {
            alert("잘못된 접근입니다.");
            navigate("/kiosk/main");
            return;
        }

        const fetchPaymentWidget = async () => {
            try {
                const loadedWidget = await loadPaymentWidget(widgetClientKey, customerKey);
                setPaymentWidget(loadedWidget);
            } catch (error) {
                console.error("Error fetching payment widget:", error);
            }
        };

        fetchPaymentWidget();
    }, [orderId, amount, navigate]);

    useEffect(() => {
        if (paymentWidget == null) {
            return;
        }

        const paymentMethodsWidget = paymentWidget.renderPaymentMethods(
            "#payment-widget",
            { value: amount, currency: "KRW" },
            { variantKey: "DEFAULT" }
        );

        paymentWidget.renderAgreement(
            "#agreement",
            { variantKey: "AGREEMENT" }
        );

        paymentMethodsWidgetRef.current = paymentMethodsWidget;
    }, [paymentWidget, amount]);

    useEffect(() => {
        const paymentMethodsWidget = paymentMethodsWidgetRef.current;

        if (paymentMethodsWidget == null) {
            return;
        }

        paymentMethodsWidget.updateAmount(amount);
    }, [amount]);

    const handlePaymentRequest = async () => {
        try {
            await paymentWidget?.requestPayment({
                orderId,
                orderName: "키오스크 주문",
                customerName: "매장 고객",
                successUrl: `${window.location.origin}/kiosk/paymentSuccess`,
                failUrl: `${window.location.origin}/kiosk/paymentFail`,
            });
        } catch (error) {
            console.error("Error requesting payment:", error);
            alert("결제 요청에 실패했습니다.");
        }
    };

    return (
        <div className={styles.container}>
            <div id="payment-widget" />
            <div id="agreement" className={styles.agreementSection} />
            <button
                className={styles.paymentButton}
                onClick={handlePaymentRequest}
            >
                💳 결제하기
            </button>
        </div>
    );
}