import styles from './HqInventorySidebar.module.css';

export default function InventorySidebar() {
  return (
    <div className={styles.sidebar}>
      <h1 className={styles.title}> 재고 관리</h1>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          <a href="/hq/HqInventoryList" className={styles.link}>재고 관리</a>
        </li>
        <li className={styles.listItem}>
          <a href="/hq/HqInventoryExpiration" className={styles.link}>유통기한 관리</a>
        </li>
        <li className={styles.listItem}>
          <a href="/hq/HqDisposalList" className={styles.link}>폐기 재료</a>
        </li>
        <li className={styles.listItem}>
          <a href="/hq/HqDisposalRequestList" className={styles.link}>폐기 요청 재료</a>
        </li>
        <li className={styles.listItem}>
          <a href="/hq/HqIngredientSetting" className={styles.link}>재료 설정</a>
        </li>
        <li className={styles.listItem}>
          <a href="/hq/HqInventoryRecord" className={styles.link}>입/출고 내역</a>
        </li>
        <li className={styles.listItem}>
          <a href="/hq/HqCategoryIngredientManagePage" className={styles.link}>카테고리 / 재료 관리</a>
        </li>

      </ul>
    </div>
  );
}
