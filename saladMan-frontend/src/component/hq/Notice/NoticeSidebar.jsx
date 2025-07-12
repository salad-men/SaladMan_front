import styles from '../Inventory/HqInventorySidebar.module.css'; 

export default function NoticeSidebar() {
  return (
    <div className={styles.sidebar}>
      <div className={styles.title}>공지사항</div>
      <ul className={styles.list}>
        <li className={styles.listItem}>
          <a className={styles.link} href="/hq/HqNoticeList">공지사항</a>
        </li>
        <li className={styles.listItem}>
          <a className={styles.link} href="/hq/HqComplaintList">불편사항</a>
        </li>
        <li className={styles.listItem}>
          <a className={styles.link} href="/hq/alarmList">알림 목록</a>
        </li>
      </ul>
    </div>
  );
}
