import React from 'react';
import styles from './Kiosk.module.css';

const Kiosk = () => {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>SaladMan</h1>
        <p>서울 독산점</p>
      </div>

      <div className={styles.body}>
        <h2>1단계. 이용 유형을 선택하세요</h2>
        <div className={styles.buttonGroup}>
          <div className={styles.option}>
            <a href="/kioskMenu">
            <img src="/eat-in.png" alt="매장 식사" />
            <p>매장 식사</p>
            </a>
          </div>
          <div className={styles.option}>
            <a href="/kioskMenu">
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
