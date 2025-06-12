import React, { useEffect, useState } from 'react';
import styles from './Header.module.css';

const Header = ({ staticScrolled = false }) => {
  const [isScrolled, setIsScrolled] = useState(staticScrolled);

  useEffect(() => {
    if (staticScrolled) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 800);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [staticScrolled]);

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>
      <div className={`${styles.layoutContainer} ${styles.headerContent}`}>
        <a href="/mainPage" className={styles.logo}>Saladman</a>
        <nav className={styles.nav}>
          <a href="/brandIntro">브랜드</a>
          <a href="/menuPage">메뉴</a>
          <a href="/nutritionPage">영양표</a>
          <a href="/findStore">매장</a>
          <a href="/news">새소식</a>
          <a href="/">문의하기</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
