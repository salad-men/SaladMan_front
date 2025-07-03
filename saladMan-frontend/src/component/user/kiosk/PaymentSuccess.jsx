import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "/src/atoms";
import { myAxios } from "/src/config";

export default function PaymentSuccess() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const token = useAtomValue(accessTokenAtom);

    const paymentKey = searchParams.get("paymentKey");
    const orderId = searchParams.get("orderId");
    const amount = searchParams.get("amount");

    useEffect(() => {
        const confirmPayment = async () => {
            try {
                await myAxios().post("/kiosk/confirm", {
                    paymentKey,
                    orderId,
                    amount: parseInt(amount)
                });
                alert("결제가 완료되었습니다.");
                // navigate("/kiosk/main");
            } catch (err) {
                console.error("결제 확인 오류", err);
                alert("결제 승인에 실패했습니다.");
                // navigate("/kiosk/main");
            }
        };

        if (paymentKey && orderId && amount) {
            confirmPayment();
        }
    }, [paymentKey, orderId, amount, token, navigate]);

    return (
        <div style={{ padding: 40 }}>
            <h2>결제 처리 중...</h2>
        </div>
    );

}
