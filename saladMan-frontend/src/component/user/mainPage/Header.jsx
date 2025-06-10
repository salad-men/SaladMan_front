import React, { useEffect, useState } from 'react';
import './Header.css';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 800);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header className={`header ${isScrolled ? 'scrolled' : ''}`}>
      <div className="layout-container header-content">
        <div className="logo">Saladman</div> 
        <nav className="nav">
          <a href="/BrandIntro">브랜드</a>
          <a href="/">메뉴</a>
          <a href="/">영양표</a>
          <a href="/">매장</a>
          <a href="/">새소식</a>
          <a href="/">문의하기</a>
        </nav>
      </div>
    </header>
  );
};

export default Header;
