import './MenuStatus.css'
import SidebarMenus from './SidebarMenu';

const menus = [
  { id: 1, name: '치킨 시저 샐러드', price: 12000, image: 'img1.png', registered: true, status: '판매중' },
  { id: 2, name: '연어 아보카도 샐러드', price: 12000, image: 'img1.png', registered: false, status: '판매중' },
  { id: 3, name: '리코타 치즈 샐러드', price: 12000, image: 'img1.png', registered: false, status: '판매중' },
  { id: 4, name: '단호박 닭가슴살 샐러드', price: 12000, image: 'img1.png', registered: false, status: '판매중' },
  { id: 5, name: '훈제 오리 샐러드', price: 12000, image: 'img1.png', registered: false, status: '판매중' },
];

const MenuStatus = () => {
  return (
    <>
      <div className="wrapper">
        <SidebarMenus />
        <div className='content'>
          <div className="page-header">
            <h2>점포 메뉴 관리</h2>
          </div>

          <div className="product-list-header">
            <span>상품 이미지</span>
            <span>상품명</span>
            <span>가격</span>
            <span>등록여부</span>
            <span>판매상태</span>
          </div>

          <div className="product-list">
            {menus.map(menu => (
              <div className="product-row" key={menu.id}>
                <div className="product-img"><img src={menu.image} alt={menu.name} /></div>
                <div className="product-name">{menu.name}</div>
                <div className="product-price">{menu.price.toLocaleString()}원</div>
                <label className="switch">
                  <input type="checkbox" checked={menu.registered} readOnly />
                  <span className="slider round"></span>
                </label>
                <select defaultValue={menu.status}>
                  <option value="판매중">판매중</option>
                  <option value="품절">품절</option>
                </select>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default MenuStatus;