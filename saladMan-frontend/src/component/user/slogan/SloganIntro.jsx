import React from 'react';
import styles from './SloganIntro.module.css';

const SloganIntro = () => {
  return (
    <div className={styles.brandIntro}>
      <section className={styles.mission}>
        <h2 className={styles.sectionTitle}>Slogan</h2>
        <p>
          출근보다 어려운건, 나를 챙기는 일이니까
        </p>
      </section>

      <section className={styles.story}>
        <h2 className={styles.sectionTitle}>Describe</h2>
        <p>
          아침마다 반복되는 출근 준비는 익숙하지만,<br /> 
          정작 스스로를 돌보는 일은 늘 뒷전이 되곤 합니다. <br /> <br /> 
          이 슬로건은 그런 현실 속에서, ‘한 끼 샐러드’라는 작은 선택이 <br /> 
          나를 위한 진짜 배려가 될 수 있다는 메시지를 전합니다.<br /> 
          <br /> 
          일상 속에서도 자신을 돌보는 순간이 필요하다는 <br /> 
          브랜드의 진심을 담은 위로이자 제안입니다.
        </p>
      </section>
    </div>
  );
};

export default SloganIntro;
