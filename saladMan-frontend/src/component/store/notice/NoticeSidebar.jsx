import styles from "./NoticeSidebar.module.css";

export default function NoticeSidebar() {
  return (
    <aside className={styles.sidebar}>
      <h1 className={styles.title}>공지사항</h1>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          <a href="/store/StoreNoticeList" className={styles.link}>공지사항 목록</a>
        </li>
        <li className={styles.listItem}>
          <a href="/store/StoreComplaintList" className={styles.link}>불편사항 목록</a>
        </li>
        <li className={styles.listItem}>
          <a href="/store/alarmList" className={styles.link}>알림목록</a>
        </li>
      </ul>
    </aside>
  );
}
