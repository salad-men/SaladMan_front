import { useSearchParams, useNavigate } from "react-router-dom";
import styles from "./PaymentFail.module.css";

export default function PaymentFailSoldOut() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const orderId = searchParams.get("orderId");

    return (
        <div className={styles.container}>
            <div className={styles.card}>
                <h2 className={styles.title}>❌ 재고 부족으로 결제에 실패했습니다</h2>
                <p className={styles.message}>매장 직원에게 문의해 주세요.</p>

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
