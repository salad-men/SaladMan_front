import React from 'react';
import styles from './Kiosk.module.css';
import { useNavigate } from "react-router-dom";

const Kiosk = () => {
  const navigate = useNavigate();

  const goToMenu = (type) => {
    navigate("/kiosk/menu", { state: { orderType: type } });
  };


  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h1>SaladMan</h1>
      </div>

      <div className={styles.body}>
        <h2>이용 유형을 선택하세요</h2>
        <div className={styles.buttonGroup}>
          <div className={styles.option} onClick={() => goToMenu("매장")}>
            <div className={styles.optionImage} style={{ backgroundImage: `url('/eat-in.png')` }} />
            <p>매장</p>
          </div>
          <div className={styles.option} onClick={() => goToMenu("포장")}>
            <div className={styles.optionImage} style={{ backgroundImage: `url('/takeout.png')` }} />
            <p>포장</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Kiosk;
