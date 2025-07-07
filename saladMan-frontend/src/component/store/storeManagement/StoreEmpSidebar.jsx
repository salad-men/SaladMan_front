import { Link, Outlet } from "react-router";
import styles from "./StoreEmpSidebar.module.css";

export default function StoreEmpSidebar() {
    return (
        <>
            <div className={styles.sidebar}>
                <h3 className={styles.title}>매장관리</h3>
                <ul className={styles.list}>
                    <li className={styles.listItem}>
                        <a href="/store/storeSales" className={styles.link}>매출 조회</a>
                    </li>
                    <li className={styles.listItem}>
                        <a href="/store/paymentList" className={styles.link}>주문 내역</a>
                    </li>
                    <li className={styles.listItem}>
                        <a href="/store/StoreEmployeeList" className={styles.link}>직원 목록</a>
                    </li>
                    <li className={styles.listItem}>
                        <a href="/store/empSchedule" className={styles.link}>직원 일정 관리</a>
                    </li>
                </ul>
            </div>
            <Outlet />
        </>
    );
}
