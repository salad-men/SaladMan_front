import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { accessTokenAtom } from '/src/atoms';
import { myAxios } from '/src/config.jsx';
import HqSidebarMenu from './HqSidebarMenu';
import style from './HqRecipe.module.css';

const HqRecipe = () => {
  const [menus, setMenus] = useState([]);
  const [token] = useAtom(accessTokenAtom);

  useEffect(() => {
    if (!token) return;
    const axios = myAxios(token);

    axios.get('/hq/recipe')
      .then(res => {
        const data = res.data.map(menu => ({
          ...menu,
          ingredients: menu.ingredients || [],
          recipe: menu.recipe || []
        }));
        setMenus(data);
      })
      .catch(err => console.error(err));

  }, [token]);

  return (
    <div className={style.wrapper}>
      <HqSidebarMenu />
      <div className={style.content}>
        <header className={style.pageHeader}>
          <h2>레시피 조회</h2>
        </header>
        
        <div className={style.cardWrapper}>
          {menus.map((menu) => (
            <div className={style.recipeCard} key={menu.id}>
              <img
                src={`/${menu.name}.png`}
                alt={menu.name}
                onError={(e) => (e.target.src = '/default-salad.png')}
                className={style.cardImage}
              />
              <h3 className={style.cardTitle}>{menu.name}</h3>
              <ul className={style.ingredientList}>
                {menu.ingredients.map((ingredient, idx) => (
                  <li key={idx} className={style.ingredientItem}>
                    {ingredient.name} - {ingredient.quantity}{ingredient.unit}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default HqRecipe;