import { Outlet } from "react-router";
import styles from '../Inventory/HqInventorySidebar.module.css'; 

export default function EmpSidebar() {
    return (
        <>
            <div className={styles.sidebar}>
                <div className={styles.title}>매장관리</div>
                <ul className={styles.list}>
                    <li className={styles.listItem}>
                        <a className={styles.link} href="/hq/storeAccount">매장 목록</a>
                    </li>
                    <li className={styles.listItem}>
                        <a className={styles.link} href="/hq/storeRegister">매장 등록</a>
                    </li>
                    <li className={styles.listItem}>
                        <a className={styles.link} href="/hq/empList">직원 목록</a>
                    </li>
                    <li className={styles.listItem}>
                        <a className={styles.link} href="/hq/empRegister">직원 등록</a>
                    </li>
                </ul>
            </div>
            <Outlet />
        </>
    );
}
