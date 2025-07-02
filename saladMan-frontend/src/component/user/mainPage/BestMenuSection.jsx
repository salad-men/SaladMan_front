import React, { useEffect, useState } from "react";
import { myAxios } from "../../../config";
import "./BestMenuSection.css";

export default function BestMenuSection() {
  const [menus, setMenus] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const instance = myAxios();
        const res = await instance.get("/user/bestmenu/bestMenus");
        setMenus(res.data);
      } catch (err) {
        console.error("BestMenu 불러오기 실패:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenus();
  }, []);

  return (
    <section className="best-menu-section">
      <h2>Best Menu</h2>
      {loading ? (
        <p>로딩 중...</p>
      ) : (
        <div className="menuList">
          {menus.slice(0, 4).map((menu, idx) => (
            <div key={menu.id} className="card">
              <img src={`/${menu.img}`} alt={menu.name} />
              <span className="badge">BEST {idx + 1}</span>
              <h3>{menu.name}</h3>
              {/* <p>총 판매량: {menu.totalQuantity}건</p> */}
            </div>
          ))}
        </div>
      )}
      <br />
      <br />
      <br />
      <br />
      <br />
    </section>
  );
}
