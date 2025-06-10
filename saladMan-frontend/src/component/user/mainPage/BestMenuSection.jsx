// BestMenuSection.jsx
import React from "react";
import "./BestMenuSection.css";

const menus = [
  {
    id: 1,
    name: "메밀면+훈제오리",
    eng: "Soba noodle + Duck Meat",
    badge: "BEST 5",
    img: "/assets/images/menu1.jpg",
  },
  {
    id: 2,
    name: "곡물밥+연어",
    eng: "Grain Rice + Salmon",
    badge: "BEST 6",
    img: "/assets/images/menu2.jpg",
  },
  {
    id: 3,
    name: "야채만+구운버섯",
    eng: "Vegetable only + Grilled Mushroom",
    badge: "BEST 4",
    img: "/assets/images/menu3.jpg",
  },
  {
    id: 4,
    name: "육회 들기름 메밀면 샐러드",
    eng: "Beef tartare perilla oil soba salad",
    badge: "BEST 2",
    img: "/assets/images/menu4.jpg",
  },
];

const BestMenuSection = () => {
  return (
    <section className="best-menu-section">
      <h2>Best Menu</h2>
      <div className="menuList">
        {menus.map((menu) => (
          <div key={menu.id} className="card">
            <img src={menu.img} alt={menu.name} />
            <span className="badge">{menu.badge}</span>
            <h3>{menu.name}</h3>
            <p>{menu.eng}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default BestMenuSection;
