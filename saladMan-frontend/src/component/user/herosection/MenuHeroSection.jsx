import React from "react";
import styles from './HeroSection.module.css';

const MenuHeroSection = ({ selectedId, onChange }) => {
  const categories = [
    { id: 1, name: "샐러볼" },
    { id: 2, name: "포케볼" },
    { id: 3, name: "비건볼" },
  ];

  return (
    <div className={styles.heroSection}>
      <h1 className={styles.title}>메뉴</h1>
      <br />
      <p className={styles.subtitle}>
        {categories.map((cat, idx) => (
          <React.Fragment key={cat.id}>
            <button
              className={`${styles.atag} ${selectedId === cat.id ? styles.active : ""}`}
              onClick={() => onChange(cat.id)}
            >
              {cat.name}
            </button>
            {idx < categories.length - 1 && <span className={styles.divider}>ㅣ</span>}
          </React.Fragment>
        ))}
      </p>
      <div className={styles.imageBanner}>
        <img src="/Menu.jpg" alt="메뉴" />
        <span className={styles.Overlay}>Signature</span>
      </div>
    </div>
  );
};

export default MenuHeroSection;
