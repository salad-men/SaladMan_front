import React, { useEffect, useState } from 'react';
import CartBar from './KioskCart';
import styles from './KioskMenu.module.css';
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "/src/atoms";
import { myAxios } from "/src/config";

export default function KioskMenu() {
  const [selectedTab, setSelectedTab] = useState('전체');
  const [cartItems, setCartItems] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 820);
  const [menuData, setMenuData] = useState([]);

  const token = useAtomValue(accessTokenAtom);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 820);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

    // 메뉴 불러오기
  useEffect(() => {
    console.log("메뉴불러오기 토근:"+token);
    console.log( token);
    if (!token) return;
    

    const fetchMenus = async () => {
      try {
        const res = await myAxios(token).get("/kiosk/menus");
        setMenuData(res.data);
        console.log("메뉴 불러옴:", res.data);
      } catch (err) {
        console.error("메뉴 가져오기 실패", err);
      }
    };

    fetchMenus();
  }, [token]);

  const categories = ['전체', '샐러볼', '포케볼', '비건볼'];

  const handleAddToCart = (item) => {
    setCartItems((prev) => {
      const existing = prev.find((i) => i.id === item.id);
      if (existing) {
        return prev.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      } else {
        return [...prev, { ...item, quantity: 1 }];
      }
    });
  };

  const handleClearCart = () => {
    setCartItems([]);
  };
  const handleUpdateQuantity = (id, newQty) => {
    if (newQty <= 0) {
      setCartItems((prev) => prev.filter((item) => item.id !== id));
    } else {
      setCartItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, quantity: newQty } : item
        )
      );
    }
  };

  const handleRemoveItem = (id) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  const filteredMenu =
    selectedTab === '전체'
      ? menuData
      : menuData.filter((item) => item.category === selectedTab);

  return (

    <div className={styles.page}>
      <div className={styles.header} />
      {isMobile ? (
        <>
          <div className={styles.content}>
            <h2 className={styles.title}>메뉴를 선택하세요</h2>
            <div className={styles.tabs}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.tab} ${selectedTab === cat ? styles.activeTab : ''}`}
                  onClick={() => setSelectedTab(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className={styles.menuWrapper}>
              <div className={styles.menuGrid}>
                {filteredMenu.map((item) => (
                  <div
                    key={item.id}
                    className={styles.card}
                    onClick={() => handleAddToCart(item)}
                  >
                    <div className={styles.imgPlaceholder}>
                      <img src={`/${item.img}`} alt={item.img} className={styles.menuImg} />

                    </div>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemPrice}>{item.salePrice.toLocaleString()}원</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <CartBar
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            className={styles.fixedBar}
          />
        </>
      ) : (
        <div className={styles.content}>
          <div className={styles.contentWrapper}>
            <h2 className={styles.title}>메뉴를 선택하세요</h2>
            <div className={styles.tabs}>
              {categories.map((cat) => (
                <button
                  key={cat}
                  className={`${styles.tab} ${selectedTab === cat ? styles.activeTab : ''}`}
                  onClick={() => setSelectedTab(cat)}
                >
                  {cat}
                </button>
              ))}
            </div>
            <div className={styles.menuWrapper}>

              <div className={styles.menuGrid}>
                {filteredMenu.map((item) => (
                  <div
                    key={item.id}
                    className={styles.card}
                    onClick={() => handleAddToCart(item)}
                  >
                    <div className={styles.imgPlaceholder}>
                      <img src={`/${item.img}`} alt={item.img} className={styles.menuImg} />

                    </div>
                    <p className={styles.itemName}>{item.name}</p>
                    <p className={styles.itemPrice}>{item.salePrice.toLocaleString()}원</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className={styles.cartContainer}>
            <CartBar
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              className={styles.staticCart}
            />
          </div>
        </div>
      )}
    </div>

  );
};