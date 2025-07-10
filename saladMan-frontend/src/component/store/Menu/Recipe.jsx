import React, { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { accessTokenAtom } from "/src/atoms";
import { myAxios } from "/src/config.jsx";
import SidebarMenu from "./SidebarMenu";
import styles from "./Recipe.module.css";

const CATEGORY_LIST = [
  { id: 1, name: '샐러볼' },
  { id: 2, name: '포케볼' },
  { id: 3, name: '비건볼' }
];

const Recipe = () => {
  const [menus, setMenus] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    curPage: 1,
    allPage: 1,
    startPage: 1,
    endPage: 1,
  });
  const [pageNums, setPageNums] = useState([]);
  const [activeCategory, setActiveCategory] = useState(1);
  const [token] = useAtom(accessTokenAtom);

  useEffect(() => {
    if (token) {
      submit(1, activeCategory);
    }
  }, [token, activeCategory]);

  const submit = (page, category = activeCategory) => {
    if (!token) return;
    const axios = myAxios(token);

    axios
      .get(`/recipe?page=${page}&category_id=${category}`)
      .then((res) => {
        const data = res.data.menus.map((menu) => ({
          ...menu,
          ingredients: menu.ingredients || [],
          recipe: menu.recipe || [],
        }));

        setMenus(data);

        const pi = {
          curPage: page,
          allPage: res.data.pageInfo.allPage,
          startPage: res.data.pageInfo.startPage,
          endPage: res.data.pageInfo.endPage,
        };
        setPageInfo(pi);

        const pages = [];
        for (let i = pi.startPage; i <= pi.endPage; i++) {
          pages.push(i);
        }
        setPageNums(pages);
      })
      .catch((err) => console.error(err));
  };

  const movePage = (p) => {
    if (p < 1 || p > pageInfo.allPage) return;
    submit(p);
  };

  return (
    <div className={styles.wrapper}>
      <SidebarMenu />
      <div className={styles.content}>
        <header className={styles.pageHeader}>
          <h2>레시피 조회</h2>

          {/* ✅ 카테고리 탭 */}
          <nav className={styles.tabNav}>
            {CATEGORY_LIST.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.tabBtn} ${activeCategory === cat.id ? styles.activeTab : ''}`}
                onClick={() => setActiveCategory(cat.id)}
                type="button"
                aria-current={activeCategory === cat.id ? "page" : undefined}
              >
                {cat.name}
              </button>
            ))}
          </nav>
        </header>

        <div className={styles.cardWrapper}>
          {menus.map((menu) => (
            <div className={styles.recipeCard} key={menu.id}>
              <div className={styles.imageBlock}>
                <img
                  src={`/${menu.name}.png`}
                  alt={menu.name}
                  onError={(e) => (e.target.src = "/default-salad.png")}
                />
                <h3>{menu.name}</h3>
              </div>
              <div className={styles.cardText}>
                <ul>
                  {menu.ingredients.map((ingredient, idx) => (
                    <li key={idx}>
                      {ingredient.name} - {ingredient.quantity}
                      {ingredient.unit}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.pagination}>
          <button onClick={() => movePage(1)} disabled={pageInfo.curPage === 1}>{"<<"}</button>
          <button onClick={() => movePage(pageInfo.curPage - 1)} disabled={pageInfo.curPage === 1}>{"<"}</button>

          {pageNums.map((p) => (
            <button
              key={p}
              onClick={() => movePage(p)}
              className={p === pageInfo.curPage ? styles.active : ""}
            >
              {p}
            </button>
          ))}

          <button onClick={() => movePage(pageInfo.curPage + 1)} disabled={pageInfo.curPage === pageInfo.allPage}>{">"}</button>
          <button onClick={() => movePage(pageInfo.allPage)} disabled={pageInfo.curPage === pageInfo.allPage}>{">>"}</button>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
