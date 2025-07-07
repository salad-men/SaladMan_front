import styles from '../Inventory/HqInventorySidebar.module.css';

export default function OrderSidebar() {
  return (
    <div className={styles.sidebar}>
      <h1 className={styles.title}>수주</h1>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          <a href="/hq/orderRequest" className={styles.link}>수주 목록</a>
        </li>
        <li className={styles.listItem}>
          <a href="/hq/orderItemManage" className={styles.link}>수주품목 설정</a>
        </li>
      </ul>
    </div>
  );
}
