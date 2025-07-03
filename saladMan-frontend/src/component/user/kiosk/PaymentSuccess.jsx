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

        if (!token) return;

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
                // ❗에러 상태 코드와 메시지 확인
                const status = err.response?.status;
                const message = err.response?.data;

                if (status === 400 && message?.includes("재고")) {
                    navigate("/kiosk/paymentFail");
                } else {
                    // 다른 오류는 재시도 혹은 실패 처리
                    alert("결제 확인 중 문제가 발생했습니다");
                    navigate("/kiosk/paymentFail");
                }
            }
        };

        if (paymentKey && orderId && amount) {
            confirmPayment();
        }
    }, [paymentKey, orderId, amount, token, navigate]);

    return (
        <div style={{ padding: 40 }}>
            <h2>결제 완료</h2>
            <span>결제번호: {orderId}</span>
            <button onClick={() => { navigate("/kiosk/main") }}>홈으로</button>
        </div>
    );

}
