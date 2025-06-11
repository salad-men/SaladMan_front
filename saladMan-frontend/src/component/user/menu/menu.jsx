import React, { useEffect, useState } from "react";
import styles from "./Menu.module.css"; // CSS 모듈 import

const mockMenus = [
  {
    id: 1,
    titleKor: "직화 닭다리살 포케",
    imageSrc: "1.png",
  },
  {
    id: 2,
    titleKor: "단호박 치킨볼",
    imageSrc: "2.png",
  },
  {
    id: 3,
    titleKor: "리코타 프레쉬볼",
    imageSrc: "3.png",
  },
];

export default function Menu() {
  const [menus, setMenus] = useState([]);

  useEffect(() => {
    setMenus(mockMenus);
  }, []);

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

function MenuCard({ imageSrc, titleKor }) {
  return (
    <div className={styles.card}>
      <img src={imageSrc} alt={titleKor} className={styles.image} />
      <h3 className={styles.title}>{titleKor}</h3>
    </div>
  );
}
