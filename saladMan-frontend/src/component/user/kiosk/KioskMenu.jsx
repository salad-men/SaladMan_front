import React, { useEffect, useState } from 'react';
import CartBar from './KioskCart';
import styles from './KioskMenu.module.css';
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "/src/atoms";
import { userAtom } from "/src/atoms";

import { myAxios } from "/src/config";

export default function KioskMenu() {

  const [selectedTab, setSelectedTab] = useState('전체');
  const [cartItems, setCartItems] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 820);

  const [menuData, setMenuData] = useState([]);
  const [categories, setCategories] = useState([]);

  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(1);

  const token = useAtomValue(accessTokenAtom);
  const store = useAtomValue(userAtom);

  const pageSize = 9;
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 820);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  //카테고리 불러오기
  useEffect(() => {
    if (!token) return;

    const fetchCategories = async () => {
      try {
        const res = await myAxios(token).get("/kiosk/menuCategories");
        setCategories(res.data);
        console.log("카테고리 불러옴:", res.data);
      } catch (err) {
        console.error("카테고리 가져오기 실패", err);
      }
    };

    fetchCategories();
  }, [token]);


  // 메뉴 불러오기
  useEffect(() => {
    console.log("메뉴불러오기 토근:" + token);
    console.log(token);
    if (!token) return;


    const fetchMenus = async () => {
      try {
        const res = await myAxios(token).get(`/kiosk/menus?page=${currentPage}&size=${pageSize}`);
        setMenuData(res.data.content);
        setTotalPages(res.data.totalPages);
        console.log("메뉴 불러옴:", res.data);
      } catch (err) {
        console.error("메뉴 가져오기 실패", err);
      }
    };

    fetchMenus();
  }, [token, currentPage]);


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
    selectedTab === "전체"
      ? menuData
      : menuData.filter((item) => item.categoryName === selectedTab);

  return (

    <div className={styles.page}>

      <div className={styles.header} />

      <div className={styles.content}>
        <div className={styles.menuWrapper}>
          
          <h2 className={styles.title}>메뉴를 선택하세요</h2>

          <div className={styles.tabs}>
            <button
              key="전체"
              className={`${styles.tab} ${selectedTab === "전체" ? styles.activeTab : ""}`}
              onClick={() => setSelectedTab("전체")}>
                전체
            </button>

            {categories.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.tab} ${selectedTab === cat.name ? styles.activeTab : ""}`}
                onClick={() => setSelectedTab(cat.name)}
              >
                {cat.name}
              </button>
            ))}
          </div>

          <div className={styles.menuGrid}>
            {filteredMenu.map((item) => (
              <div
                key={item.id}
                className={styles.card}
                onClick={() => handleAddToCart(item)}
              >
                <div className={styles.imgPlaceholder}>
                  <img
                    src={item.img ? `/${item.img}` : "/placeholder.png"}
                    alt={item.name}
                    className={styles.menuImg}
                  />
                </div>
                <p className={styles.itemName}>{item.name}</p>
                <p className={styles.itemPrice}>
                  {item.salePrice != null
                    ? `${item.salePrice.toLocaleString()}원`
                    : "- 원"}
                </p>
              </div>
            ))}
          </div>
          <div className={styles.pagination}>
            <button
              className={styles.pageButton}
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 0))}
              disabled={currentPage === 0}
            >
              ◀ 이전
            </button>

            <span className={styles.pageInfo}>
              {currentPage + 1} / {totalPages}
            </span>

            <button
              className={styles.pageButton}
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages - 1))}
              disabled={currentPage === totalPages - 1}
            >
              다음 ▶
            </button>
          </div>
        </div>
        {isMobile ? (
          <CartBar
            cartItems={cartItems}
            onUpdateQuantity={handleUpdateQuantity}
            onRemoveItem={handleRemoveItem}
            onClearCart={handleClearCart}
            className="fixedBar"
          />) : (
          <div className={styles.cartContainer}>
            <CartBar
              cartItems={cartItems}
              onUpdateQuantity={handleUpdateQuantity}
              onRemoveItem={handleRemoveItem}
              onClearCart={handleClearCart}
              className="staticCart"
            />
          </div>
        )};
      </div>

    </div>

  );
};