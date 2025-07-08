import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { accessTokenAtom } from '/src/atoms';
import { myAxios } from '/src/config.jsx';
import HqSidebarMenu from './HqSidebarMenu';
import styles from './HqRecipe.module.css';

// 카테고리 상수 (id는 DB 기준)
const CATEGORY_LIST = [
  { id: 1, name: '샐러볼' },
  { id: 2, name: '포케볼' },
  { id: 3, name: '비건볼' },
];

const HqRecipe = () => {
  const [menus, setMenus] = useState([]);
  const [pageInfo, setPageInfo] = useState({ curPage: 1, allPage: 1, startPage: 1, endPage: 1 });
  const [pageNums, setPageNums] = useState([]);
  const [activeCategory, setActiveCategory] = useState(1);
  const [token] = useAtom(accessTokenAtom);

  // 메뉴 불러오기
  const fetchMenus = (page = 1, categoryId = activeCategory) => {
    if (!token) return;
    const axios = myAxios(token);

    axios
      .get(`/recipe?page=${page}&category_id=${categoryId}`)
      .then(res => {
        const data = res.data.menus.map(menu => ({
          ...menu,
          ingredients: menu.ingredients || [],
          recipe: menu.recipe || []
        }));

        setMenus(data);
        setPageInfo(res.data.pageInfo);

        const pages = [];
        for (let i = res.data.pageInfo.startPage; i <= res.data.pageInfo.endPage; i++) {
          pages.push(i);
        }
        setPageNums(pages);
      })
      .catch(err => console.error(err));
  };

  useEffect(() => {
    if (token) {
      fetchMenus(1, activeCategory);
    }
    // eslint-disable-next-line
  }, [token, activeCategory]);

  return (
    <div className={styles.wrapper}>
      <HqSidebarMenu />
      <div className={styles.content}>
        <header className={styles.pageHeader}>
          <h2>레시피 조회</h2>
          {/* 카테고리 탭 */}
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
          {menus.length === 0 ? (
            <div className={styles.emptyMsg}>등록된 레시피가 없습니다.</div>
          ) : (
            menus.map((menu) => (
              <div className={styles.recipeCard} key={menu.id}>
                <img
                  src={`/${menu.name}.png`}
                  alt={menu.name}
                  onError={(e) => (e.target.src = '/default-salad.png')}
                  className={styles.cardImage}
                />
                <div className={styles.cardText}>
                  <h3 className={styles.cardTitle}>{menu.name}</h3>
                  <ul className={styles.ingredientList}>
                    {menu.ingredients.map((ingredient, idx) => (
                      <li key={idx} className={styles.ingredientItem}>
                        {ingredient.name} - {ingredient.quantity}{ingredient.unit}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))
          )}
        </div>

        <div className={styles.pagination}>
          <button onClick={() => fetchMenus(pageInfo.curPage - 1, activeCategory)} disabled={pageInfo.curPage === 1}>
            &lt;
          </button>
          {pageNums.map(p => (
            <button
              key={p}
              onClick={() => fetchMenus(p, activeCategory)}
              className={p === pageInfo.curPage ? styles.active : ''}
            >
              {p}
            </button>
          ))}
          <button onClick={() => fetchMenus(pageInfo.curPage + 1, activeCategory)} disabled={pageInfo.curPage >= pageInfo.allPage}>
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default HqRecipe;
