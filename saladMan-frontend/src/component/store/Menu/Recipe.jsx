import React, { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { accessTokenAtom } from '/src/atoms';
import { myAxios } from '/src/config.jsx';
import SidebarMenu from './SidebarMenu';
import style from './Recipe.module.css';

const Recipe = () => {
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [token] = useAtom(accessTokenAtom);

  useEffect(() => {
    if (!token) return;

    const axios = myAxios(token);

    axios.get('/store/recipe')
      .then(res => {
        const data = res.data.map(menu => ({
          ...menu,
          ingredients: menu.ingredients || [],
          recipe: menu.recipe || []
        }));
        setMenus(data);
        setSelectedMenu(data[0]);
      })
      .catch(err => console.error(err));
  }, [token]);

  return (
    <div className={style.wrapper}>
      <SidebarMenu />
      <div className={style.content}>
        <header className={style.pageHeader}>
          <h2>레시피 조회</h2>
        </header>
        <div className={style.recipeBody}>
          <div className={style.menuDetail}>
            {selectedMenu && (
              <>
                <h2>{selectedMenu.name}</h2>
                <div className={style.menuInfo}>
                  <img src='/단호박 치킨볼.png' alt={selectedMenu.name} />
                  <table className={style.recipeDetail}>
                    <thead>
                      <tr><th>재료명</th><th>수량</th></tr>
                    </thead>
                    <tbody>
                      {selectedMenu.ingredients?.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {selectedMenu.recipe?.length > 0 && (
                  <ol className={style.recipe}>
                    {selectedMenu.recipe.map((step, idx) => (
                      <li key={idx}>{step}</li>
                    ))}
                  </ol>
                )}
              </>
            )}
          </div>
          <div className={style.menuList}>
            <ul>
              {menus.map(menu => (
                <li
                  key={menu.id}
                  className={selectedMenu?.id === menu.id ? style.active : ''}
                  onClick={() => setSelectedMenu(menu)}
                >
                  {menu.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Recipe;
