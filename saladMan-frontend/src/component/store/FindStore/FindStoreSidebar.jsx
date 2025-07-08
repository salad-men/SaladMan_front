import styles from './FindStoreSidebar.module.css';

export default function SidebarMenus() {
    return (
        <div className={styles.sidebar}>
            <h1 className={styles.title}>점포 조회</h1>
            <ul className={styles.list}>
                <li className={styles.listItem}>
                    <a href="/store/OtherStoreInven" className={styles.link}>
                        타 매장 재고 조회
                    </a>
                </li>
            </ul>
        </div>
    );
}
