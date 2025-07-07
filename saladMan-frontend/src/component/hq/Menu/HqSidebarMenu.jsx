import styles from '../Inventory/HqInventorySidebar.module.css'; 

export default function HqSidebarMenu() {
    return (
        <div className={styles.sidebar}>
            <h1 className={styles.title}>메뉴</h1>
            <ul className={styles.list}>
                <li className={styles.listItem}>
                    <a href="/hq/totalMenu" className={styles.link}>전체 메뉴</a>
                </li>
                <li className={styles.listItem}>
                    <a href="/hq/updateMenu" className={styles.link}>메뉴 등록</a>
                </li>
                <li className={styles.listItem}>
                    <a href="/hq/recipe" className={styles.link}>레시피 조회</a>
                </li>
            </ul>
        </div>
    );
}
