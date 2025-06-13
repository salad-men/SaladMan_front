import React, { useEffect, useState } from 'react';
import HqSidebarMenus from './HqSidebarMenus'
import './HqRecipe.css';

const HqRecipe = () => {
  const [menus, setMenus] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);

  useEffect(() => {
    // 🔽 더미 데이터 정의
    const dummyData = [
      {
        id: 1,
        name: '치킨 시저 샐러드',
        imageUrl: '/img1.png',
        ingredients: [
          { name: '로메인', unit: '40g' },
          { name: '닭가슴살', unit: '100g' },
          { name: '파마산 치즈', unit: '30g' },
          { name: '크루통', unit: '30g (5~6개)' }
        ],
        recipe: [
          '양상추는 흐르는 물에 씻어 손으로 찢는다.',
          '닭가슴살은 조리한 후 잘게 찢어둔다.',
          '파마산 치즈는 갈아둔다.',
          '로메인과 토마토를 썬다.',
          '접시에 모든 재료를 예쁘게 담는다.',
          '시저 드레싱을 뿌려 마무리한다.'
        ]
      },
      {
        id: 2,
        name: '연어 아보카도 샐러드',
        imageUrl: '/img1.png',
        ingredients: [
          { name: '연어', unit: '80g' },
          { name: '아보카도', unit: '1/2개' },
          { name: '양상추', unit: '50g' }
        ],
        recipe: [
          '연어를 익히거나 훈제 연어를 준비한다.',
          '아보카도는 슬라이스 한다.',
          '모든 재료를 그릇에 담고 드레싱을 뿌린다.'
        ]
      }
    ];

    setMenus(dummyData);
    setSelectedMenu(dummyData[0]); // 첫 번째 메뉴 기본 선택
  }, []);

  return (
    <div className='wrapper'>
      <HqSidebarMenus />
      <div className="content">
        <header className="page-header">
          <h2>레시피 조회</h2>
        </header>
        <div className="recipe-body">
          <div className="menu-detail">
            {selectedMenu && (
              <>
                <h2>{selectedMenu.name}</h2>
                <div className="menu-info">
                  <img src={selectedMenu.imageUrl} alt={selectedMenu.name} />
                  <table className='recipe-detail'>
                    <thead>
                      <tr><th>재료명</th><th>단위</th></tr>
                    </thead>
                    <tbody>
                      {selectedMenu.ingredients.map((item, index) => (
                        <tr key={index}>
                          <td>{item.name}</td>
                          <td>{item.unit}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                <ol className="recipe">
                  {selectedMenu.recipe.map((step, idx) => (
                    <li key={idx}>{step}</li>
                  ))}
                </ol>
              </>
            )}
          </div>
          <div className="menu-list">
            <ul>
              {menus.map(menu => (
                <li
                  key={menu.id}
                  className={selectedMenu?.id === menu.id ? 'active' : ''}
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

export default HqRecipe;
