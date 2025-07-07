import styles from './SidebarMenu.module.css';

export default function SidebarMenus() {
  return (
    <div className={styles.sidebar}>
      <h1 className={styles.title}>메뉴</h1>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          <a href="/store/totalMenu" className={styles.link}>전체 메뉴</a>
        </li>
        <li className={styles.listItem}>
          <a href="/store/menuStatus" className={styles.link}>판매 메뉴</a>
        </li>
        <li className={styles.listItem}>
          <a href="/store/recipe" className={styles.link}>레시피 조회</a>
        </li>
      </ul>
    </div>
  );
}
