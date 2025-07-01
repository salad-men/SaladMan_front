import React, { useState } from 'react';
import styles from './HqNotification.module.css';
import NoticeSidebar from './NoticeSidebar';

const initialNotifications = [
  { id: 1, title: '새 공지사항', message: '6월 휴무 안내', date: '2025-06-12 14:30', read: false },
  { id: 2, title: '주문 완료', message: '주문이 정상 처리되었습니다.', date: '2025-06-12 11:00', read: false },
  { id: 3, title: '보안 알림', message: '로그인이 감지되었습니다.', date: '2025-06-11 09:42', read: false },
  { id: 4, title: '배송 시작', message: '주문하신 상품이 배송을 시작했습니다.', date: '2025-06-10 16:20', read: false },
  { id: 5, title: '이벤트', message: '여름 맞이 할인 이벤트가 시작되었습니다.', date: '2025-06-09 08:00', read: false },
  { id: 6, title: '시스템 점검', message: '6월 15일 새벽 2시부터 점검 예정입니다.', date: '2025-06-08 12:15', read: true },
  { id: 7, title: '새 메시지', message: '고객센터로부터 답변이 도착했습니다.', date: '2025-06-07 14:45', read: false },
  { id: 8, title: '주문 취소', message: '주문이 취소되었습니다.', date: '2025-06-06 17:30', read: true },
  { id: 9, title: '할인 쿠폰', message: '다음 구매에 사용할 수 있는 쿠폰이 발급되었습니다.', date: '2025-06-05 10:10', read: false },
  { id: 10, title: '계정 변경', message: '비밀번호가 성공적으로 변경되었습니다.', date: '2025-06-04 09:00', read: true },
];

function HqNotification() {
  const [notifications, setNotifications] = useState(initialNotifications);
  const [selected, setSelected] = useState([]);

  const toggleSelectAll = (checked) => {
    setSelected(checked ? notifications.map(n => n.id) : []);
  };

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const markAsRead = () => {
    setNotifications(prev =>
      prev.map(n =>
        selected.includes(n.id) ? { ...n, read: true } : n
      )
    );
    setSelected([]);
  };

  const deleteSelected = () => {
    setNotifications(prev =>
      prev.filter(n => !selected.includes(n.id))
    );
    setSelected([]);
  };

  return (
    <div className={styles.wrapper}>
      <NoticeSidebar />
      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <h2>알림 목록</h2>
        </div>
        <div className={styles.inboxControls}>
          <div className={styles.counts}>
            읽지 않음 {notifications.filter(n => !n.read).length}개 / 총 {notifications.length}개
          </div>
        </div>

        <table className={styles.inboxTable}>
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={selected.length === notifications.length}
                  onChange={e => toggleSelectAll(e.target.checked)}
                />
              </th>
              <th>
                <button onClick={markAsRead}>읽음 처리</button>
                <button onClick={deleteSelected}>삭제</button>
              </th>
              <th></th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            {notifications.length === 0 ? (
              <tr>
                <td colSpan="4" className={styles.noData}>알림이 없습니다.</td>
              </tr>
            ) : (
              notifications.map(noti => (
                <tr key={noti.id} className={noti.read ? '' : styles.unread}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selected.includes(noti.id)}
                      onChange={() => toggleSelect(noti.id)}
                    />
                  </td>
                  <td>{noti.title}</td>
                  <td>{noti.message}</td>
                  <td>{noti.date}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

      </div>
    </div>
  );
}

export default HqNotification;
