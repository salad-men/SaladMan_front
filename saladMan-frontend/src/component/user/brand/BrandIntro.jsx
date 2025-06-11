import React from 'react';
import styles from './BrandIntro.module.css';

const BrandIntro = () => {
  return (
    <div className={styles.brandIntro}>
      <section className={styles.mission}>
        <h2 className={styles.sectionTitle}>Mission</h2>
        <p>
          음식을 통해 사람들의 삶을 즐겁고 건강하게 만듭니다.
        </p>
      </section>

      <section className={styles.story}>
        <h2 className={styles.sectionTitle}>Story</h2>
        <p>
          샐러리맨은 매일을 살아내는 수많은 직장인들의 삶에서 시작됐습니다.<br />
          이른 아침 지하철, 반복되는 회의, 빠듯한 점심시간.<br />
          누구보다 치열하게 하루를 보내면서도, 정작 자신을 돌보는 데에 익숙하지 않은 사람들.<br />
          그들이 우리의 시작이자 이유였습니다.<br /><br />
          우리는 생각했습니다.<br />
          바쁜 당신이 가장 간단하게, 그리고 꾸준하게 자기 관리를 시작할 수 있는 방법은 무엇일까?<br />
          그 해답은 바로 ‘한 끼’였습니다.<br /><br />
          샐러리맨은<br />
          <b>출근 준비만큼 빠르게,</b><br />
          <b>회의 열정만큼 정확하게,</b><br />
          <b>야근 후에도 부담 없이 가볍게</b><br />
          챙길 수 있는 샐러드를 고민하고, 만들고, 개선해왔습니다.<br /><br />
          그 결과, 우리는 단순한 샐러드 브랜드가 아닌<br />
          ***직장인의 건강 루틴 파트너***가 되기로 했습니다.
        </p>
      </section>

      <section className={styles.palette}>
        <h2 className={styles.sectionTitle}>Color Palette</h2>
        <div className={styles.colorSample} />
      </section>
    </div>
  );
};

export default BrandIntro;
