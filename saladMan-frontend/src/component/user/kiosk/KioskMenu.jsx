import React, { useState } from 'react';
import CartBar from './KioskCart';
import styles from './KioskMenu.module.css';

// 더미 메뉴 데이터
const menuData = [
  { id: 1, name: '치킨 샐러볼', category: '샐러볼', price: 8900 },
  { id: 2, name: '연어 포케볼', category: '포케볼', price: 9500 },
  { id: 3, name: '비건 그린볼', category: '비건볼', price: 8700 },
  { id: 4, name: '불고기 샐러볼', category: '샐러볼', price: 9200 },
  { id: 5, name: '두부 비건볼', category: '비건볼', price: 8600 },
  { id: 6, name: '참치 포케볼', category: '포케볼', price: 9400 },
];

const KioskMenu = () => {
  const [selectedTab, setSelectedTab] = useState('전체');
  const [cartItems, setCartItems] = useState([]);

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
    <div className={styles.header}/>
      <h2 className={styles.title}>2단계. 메뉴를 선택하세요</h2>

      <div className={styles.tabs}>
        {categories.map((cat) => (
          <button
            key={cat}
            className={`${styles.tab} ${
              selectedTab === cat ? styles.activeTab : ''
            }`}
            onClick={() => setSelectedTab(cat)}
          >
            {cat}
          </button>
        ))}
      </div>

      <div className={styles.menuGrid}>
        {filteredMenu.map((item) => (
          <div key={item.id} className={styles.card} onClick={() => handleAddToCart(item)}>
            <div className={styles.imgPlaceholder}>🍴</div>
            <p className={styles.itemName}>{item.name}</p>
            <p className={styles.itemPrice}>{item.price.toLocaleString()}원</p>
          </div>
        ))}
      </div>

      <CartBar
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default KioskMenu;
