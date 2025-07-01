import React from 'react';
import styles from './AlarmModal.module.css';

const AlarmModal = ({ alarms, onClose }) => {
  return (
    <div className={styles.overlay}>
      <div className={styles.modal}>
        <div className={styles.header}>
          <h2>알림 목록</h2>
          <button onClick={onClose} className={styles.closeBtn}>×</button>
        </div>
        <div className={styles.body}>
          {alarms.length === 0 ? (
            <p className={styles.noAlarm}>알림이 없습니다.</p>
          ) : (
            <ul className={styles.list}>
              {alarms.map(alarm => (
                <li key={alarm.id} className={alarm.isRead ? styles.read : styles.unread}>
                  <div className={styles.title}>{alarm.title}</div>
                  <div className={styles.content}>{alarm.content}</div>
                  <div className={styles.time}>{alarm.sentAt}</div>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
};

export default AlarmModal;