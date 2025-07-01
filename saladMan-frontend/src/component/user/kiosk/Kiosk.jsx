import React from 'react';
import styles from './Kiosk.module.css';

const Kiosk = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>SaladMan</h1>
      </div>

      <div className={styles.body}>
        <h2>이용 유형을 선택하세요</h2>
        <div className={styles.buttonGroup}>
          <div className={styles.option}>
            <a href="/kiosk/menu">
            <img src="/eat-in.png" alt="매장 식사" />
            <p>매장 식사</p>
            </a>
          </div>
          <div className={styles.option}>
            <a href="/kiosk/menu">
            <img src="/takeout.png" alt="포장" />
            <p>포장</p>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kiosk;
