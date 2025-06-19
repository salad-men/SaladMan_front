import React, { useEffect, useState } from "react";
import axios from "axios";
import styles from "./menu.module.css";

export default function Menu({ categoryId }) {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    axios
      .get(`http://localhost:8090/user/menus?categoryId=${categoryId}`)
      .then((res) => setMenus(res.data))
      .catch((err) => console.error("❌ 메뉴 불러오기 실패:", err));
  }, [categoryId]);

  return (
    <div className={styles.container}>
      <div className={styles.grid}>
        {menus.map((menu) => (
          <MenuCard key={menu.id} {...menu} />
        ))}
      </div>
    </div>
  );
}

function MenuCard({ img, name, salePrice, ingredients }) {
  const [showIngredients, setShowIngredients] = useState(false);

  const totalWeight = ingredients?.reduce(
    (sum, i) => sum + (Number(i.quantity) || 0),
    0
  );

  return (
    <div
      className={styles.card}
      onMouseEnter={() => setShowIngredients(true)}
      onMouseLeave={() => setShowIngredients(false)}
    >
      <img src={`/${img}`} alt={name} className={styles.image} />
      <h3 className={styles.title}>{name}</h3>
      <p className={styles.price}>{salePrice?.toLocaleString()}원</p>

      <div
        className={`${styles.ingredientOverlay} ${
          showIngredients ? styles.show : ""
        }`}
      >
        <h3 className={styles.menuName}>{name}</h3>
        {ingredients?.map((i, idx) => (
          <div key={idx} className={styles.ingredientItem}>
            {i.name} - {i.quantity}g
          </div>
        ))}
        <br />
        <div className={styles.totalWeight}>총 중량: {totalWeight}g</div>
      </div>
    </div>
  );
}
