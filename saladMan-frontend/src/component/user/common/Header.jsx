import React, { useEffect, useState, useRef } from "react";
import { useNavigate } from "react-router-dom";
import styles from "./Header.module.css";

const Header = ({ staticScrolled = false, onSelectCategory }) => {
  const [isScrolled, setIsScrolled] = useState(staticScrolled);
  const [activeMenu, setActiveMenu] = useState(null);
  const [isHq, setIsHq] = useState(false);
  const menuRef = useRef();
  const navigate = useNavigate();

  useEffect(() => {
    if (staticScrolled) return;
    const handleScroll = () => setIsScrolled(window.scrollY > 800);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [staticScrolled]);

  useEffect(() => {
    try {
      const storeStr = sessionStorage.getItem("store");
      if (storeStr) {
        const storeData = JSON.parse(storeStr);
        if ((storeData.role || "").trim() === "ROLE_HQ") {
          setIsHq(true);
        }
      }
    } catch (err) {
      console.error("store 파싱 실패:", err);
    }
  }, []);

  const handleMenuClick = (categoryId) => {
    if (onSelectCategory) onSelectCategory(categoryId);
    navigate("/menuPage");
  };

  const menuItems = [
    {
      label: "브랜드",
      href: "/brandIntro",
      sub: [
        { label: "스토리", href: "/brandIntro" },
        { label: "슬로건", href: "/sloganIntro" },
      ],
    },
    {
      label: "메뉴",
      href: "/menuPage",
      sub: [
        { label: "샐러볼", onClick: () => handleMenuClick(1) },
        { label: "포케볼", onClick: () => handleMenuClick(2) },
        { label: "비건볼", onClick: () => handleMenuClick(3) },
      ],
    },
    {
      label: "영양표",
      href: "/nutritionPage",
    },
    {
      label: "매장",
      href: "/findStore",
    },
    {
      label: "소식",
      href: "/news",
      sub: [
        { label: "공지사항", href: "/News" },
        { label: "칭찬매장", href: "/PraiseStore" },
        { label: "이벤트", href: "/Event" },
      ],
    },
  ];

  return (
    <header className={`${styles.header} ${isScrolled ? styles.scrolled : ""}`}>
      <div
        className={`${styles.layoutContainer} ${styles.headerContent}`}
        ref={menuRef}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
          <a href="/mainPage" className={styles.logo}>
            <img
              src="/샐러드맨로고(화이트).png"
              alt="Saladman Logo"
              className={styles.logoImage}
            />
          </a>
          {isHq && (
            <div className={styles.hqBtn}>
              <a href="/hq/HqDashboard">관리 페이지로 &nbsp;▶</a>
            </div>
          )}
        </div>

        <nav className={styles.nav}>
          {menuItems.map((item, index) => (
            <div
              key={index}
              className={styles.menuItem}
              onMouseEnter={() => setActiveMenu(index)}
              onMouseLeave={() => setActiveMenu(null)}
            >
              <a href={item.href || "#"} className={styles.atag}>
                {item.label}
              </a>
              {item.sub && activeMenu === index && (
                <div className={styles.subMenuWrapper}>
                  <div className={styles.arrow}></div>
                  <div className={styles.subMenu}>
                    {item.sub.map((subItem, idx) =>
                      subItem.onClick ? (
                        <div
                          key={idx}
                          onClick={subItem.onClick}
                          className={styles.subMenuItem}
                          style={{ cursor: "pointer" }}
                        >
                          {subItem.label}
                        </div>
                      ) : (
                        <a
                          key={idx}
                          href={subItem.href}
                          className={styles.subMenuItem}
                        >
                          {subItem.label}
                        </a>
                      )
                    )}
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
