import styles from "./StoreInventorySidebar.module.css";

export default function StoreInventorySidebar() {
  return (
    <div className={styles.sidebar}>
      <h1 className={styles.title}>재고 관리</h1>
      <ul className={styles.list}>
       
        <li className={styles.listItem}>
          <a href="/store/StoreInventoryList" className={styles.link}>
            재고 목록
          </a>
        </li>

        <li className={styles.listItem}>
          <a href="/store/StoreInventoryExpiration" className={styles.link}>
            유통기한 목록
          </a>
        </li>
         <li className={styles.listItem}>
          <a href="/store/StoreDisposalList" className={styles.link}>
            폐기 목록
          </a>
        </li>

        <li className={styles.listItem}>
          <a href="/store/StoreIngredientSetting" className={styles.link}>
            재료 설정
          </a>
        </li>
        
        <li className={styles.listItem}>
          <a href="/store/StoreInventoryRecord" className={styles.link}>
            재고 기록
          </a>
        </li>

      </ul>
    </div>
  );
}