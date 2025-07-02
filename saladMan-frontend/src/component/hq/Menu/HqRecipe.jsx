import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { accessTokenAtom } from '/src/atoms';
import { myAxios } from '/src/config.jsx';
import HqSidebarMenu from './HqSidebarMenu';
import styles from './HqRecipe.module.css';

const HqRecipe = () => {
  const [menus, setMenus] = useState([]);
  const [pageInfo, setPageInfo] = useState({curPage:1, allPage:1, startPage:1, endPage:1});
  const [pageNums, setPageNums] = useState([]);
  const [token] = useAtom(accessTokenAtom);

  useEffect(() => {
    if(token) {
      submit(1);
    }
  }, [token])

  const submit = (page) => {
    if (!token) return;
    const axios = myAxios(token);

    axios.get(`/recipe?page=${page}`)
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

  return (
    <div className={styles.wrapper}>
      <HqSidebarMenu />
      <div className={styles.content}>
        <header className={styles.pageHeader}>
          <h2>레시피 조회</h2>
        </header>
        
        <div className={styles.cardWrapper}>
          {menus.map((menu) => (
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
          ))}
        </div>
        <div className={styles.pagination}>
                    <button onClick={() => submit(pageInfo.curPage - 1)} disabled={pageInfo.curPage === 1}>
                        &lt;
                    </button>
                    {pageNums.map(p => (
                        <button key={p} onClick={() => submit(p)} className={p === pageInfo.curPage ? styles.active : ''}>
                            {p}
                        </button>
                    ))}
                    <button onClick={() => submit(pageInfo.curPage + 1)} disabled={pageInfo.curPage >= pageInfo.allPage}>
                        &gt;
                    </button>
                </div>
      </div>
    </div>
  );
};

export default HqRecipe;