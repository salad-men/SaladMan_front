import { useEffect,useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "/src/atoms";
import { myAxios } from "/src/config";
import styles from "./PaymentSuccess.module.css";

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = useAtomValue(accessTokenAtom);

    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    const [isLoading, setIsLoading] = useState(true);
    const [isSuccess, setIsSuccess] = useState(false);

    useEffect(() => {
        if (!token) return;

        const confirmPayment = async () => {
            try {
                await myAxios(token).post("/kiosk/confirm", {
                    paymentKey,
                    orderId,
                    amount: parseInt(amount)
                });
                setIsSuccess(true);
            } catch (err) {
                const status = err.response?.status;
                const message = err.response?.data;

                if (status === 400 && message?.includes("재고")) {
                    navigate("/kiosk/paymentFailSoldOut");
                } else {
                    alert("결제 확인 중 문제가 발생했습니다");
                    navigate("/kiosk/paymentFail");
                }
            } finally {
                setIsLoading(false);
            }
        };

        if (paymentKey && orderId && amount) {
            confirmPayment();
        } else {
            navigate("/kiosk/paymentFail");
        }
    }, [paymentKey, orderId, amount, token, navigate]);
    
    if (isLoading) {
        return (
            <div className={styles.container}>
                <div className={styles.card}>
                    <h2 className={styles.title}>결제 확인 중입니다...</h2>
                </div>
            </div>
        );
    }

    if (!isSuccess) return null;
    return (
        <div className={styles.container}>
            
            <div className={styles.card}>
                <h2 className={styles.title}>✅ 결제가 완료되었습니다</h2>
                <p className={styles.orderInfo}>
                    <strong>주문번호:</strong> {orderId}
                </p>
                <p className={styles.amount}>
                    <strong>결제금액:</strong> {parseInt(amount).toLocaleString()}원
                </p>
                <button
                    className={styles.homeButton}
                    onClick={() => navigate("/kiosk/main")}
                >
                    홈으로
                </button>
            </div>
        </div>
    );
}
