import styles from '../Inventory/HqInventorySidebar.module.css';

export default function HqSidebarSales() {
    return (
        <div className={styles.sidebar}>
            <div className={styles.title}>매출</div>
            <ul className={styles.list}>
                <li className={styles.listItem}>
                    <a className={styles.link} href="/hq/totalSales">매출 조회(전사)</a>
                </li>
                <li className={styles.listItem}>
                    <a className={styles.link} href="/hq/storeSales">매출 조회(지점)</a>
                </li>
            </ul>
        </div>
    );
}
