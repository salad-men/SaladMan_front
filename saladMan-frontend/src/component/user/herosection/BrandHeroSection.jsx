// src/components/brand/BrandHeroSection.jsx
import React from 'react';
import styles from './HeroSection.module.css';

const BrandHeroSection = () => {
return (
    <div className={styles.heroSection}>
    <h1 className={styles.title}><b>BRAND</b></h1>
    <br />
    <p className={styles.subtitle}>
        <a href='/brandIntro'>스토리</a> <span className={styles.divider}>ㅣ</span> <a href='/sloganIntro'>슬로건</a>
    </p>
     <div className={styles.imageBanner}>
        <img src="/brand.jpg" alt="샐러드" />
        <span className={styles.Overlay}>SaladMan</span>
     </div>
    </div>
  );
};

export default BrandHeroSection;
