import styles from './OrderSidebar.module.css';

export default function OrderSidebar() {
    return (
        <div className={styles.sidebar}>
            <h1 className={styles.title}>발주</h1>
            <ul className={styles.list}>
                <li className={styles.listItem}>
                    <a href="/store/orderList" className={styles.link}>발주 목록</a>
                </li>
                <li className={styles.listItem}>
                    <a href="/store/orderApply" className={styles.link}>발주 신청</a>
                </li>
                <li className={styles.listItem}>
                    <a href="/store/orderSettings" className={styles.link}>발주 설정</a>
                </li>
            </ul>
        </div>
    );
}
