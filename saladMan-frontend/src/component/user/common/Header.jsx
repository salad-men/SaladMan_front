import React, { useEffect, useState, useRef } from 'react';
import styles from './Header.module.css';

const Header = ({ staticScrolled = false }) => {
  const [isScrolled, setIsScrolled] = useState(staticScrolled);
  const [activeMenu, setActiveMenu] = useState(null);
  const menuRef = useRef();

  useEffect(() => {
    if (staticScrolled) return;

    const handleScroll = () => {
      setIsScrolled(window.scrollY > 800);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [staticScrolled]);

  const menuItems = [
    {
      label: '브랜드',
      href: '/brandIntro',
      sub: [
        { label: '스토리', href: '/brandIntro' },
        { label: '슬로건', href: '/sloganIntro' },
      ],
    },
    {
      label: '메뉴',
      href: '/menuPage',
      sub: [
        { label: '샐러볼', href: '/menuPage/saladbowl' },
        { label: '포케볼', href: '/menuPage/pokebowl' },
        { label: '비건볼', href: '/menuPage/veganbowl' },
      ],
    },
    {
      label: '영양표',
      href: '/nutritionPage',
    },
    {
      label: '매장',
      href: '/findStore',
    },
    {
      label: '소식',
      href: '/news',
      sub: [
        { label: '칭찬매장', href: '/PraiseStore' },
        { label: '이벤트', href: '/Event' },
        { label: '공지사항', href: '/News' },
      ],
    },
  ];

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ''}`}>      
      <div className={`${styles.layoutContainer} ${styles.headerContent}`} ref={menuRef}>
        <a href="/mainPage" className={styles.logo}>Saladman</a>
        <nav className={styles.nav}>
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={styles.menuItem}
              onMouseEnter={() => setActiveMenu(index)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <a href={item.href} className={styles.atag}>{item.label}</a>
              {item.sub && activeMenu === index && (
                <div className={styles.subMenuWrapper}>
                  <div className={styles.arrow}></div>
                  <div className={styles.subMenu}>
                    {item.sub.map((subItem, idx) => (
                      <a
                        key={idx}
                        href={subItem.href}
                        className={styles.subMenuItem}
                      >
                        {subItem.label}
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </nav>
      </div>
    </header>
  );
};

export default Header;
