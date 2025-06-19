import './MenuStatus.module.css';
import SidebarMenus from './SidebarMenu';
import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '/src/atoms';
import { myAxios } from '/src/config';

const MenuStatus = () => {
  const [menus, setMenus] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const token = useAtomValue(tokenAtom);

  useEffect(() => {
    const fetchMenus = async () => {
      try {
        const res = await myAxios(token).get('/hq/store-menu/status');
        setMenus(res.data);
      } catch (err) {
        console.error('메뉴 조회 실패', err);
      }
    };

    fetchMenus();
  }, [token]);

  const openModal = (menu) => {
    setSelectedMenu(menu);
    setModalOpen(true);
  };

  const closeModal = () => {
    setSelectedMenu(null);
    setModalOpen(false);
  };

  const confirmToggle = async () => {
    if (!selectedMenu) return;

    try {
      await myAxios(token).patch('/hq/store-menu/toggle', {
        menuId: selectedMenu.id,
      });

      const updatedMenus = menus.map(menu =>
        menu.id === selectedMenu.id ? { ...menu, status: !menu.status } : menu
      );
      setMenus(updatedMenus);

    } catch (error) {
      console.error('메뉴 상태 변경 실패:', error);
      alert('서버 오류로 상태 변경에 실패했습니다.');
    }

    closeModal();
  };

  return (
    <div className="wrapper">
      <SidebarMenus />
      <div className='content'>
        <div className="page-header">
          <h2>점포 메뉴 관리</h2>
        </div>

        <div className="product-list-header">
          <span>상품 이미지</span>
          <span>상품명</span>
          <span>판매가</span>
          <span>등록여부</span>
        </div>

        <div className="product-list">
          {menus.map(menu => (
            <div className="product-row" key={menu.id}>
              <div className="product-img"><img src='/' alt={menu.name} /></div>
              <div className="product-name">{menu.name}</div>
              <div className="product-price">{menu.price.toLocaleString()}원</div>
              <label className="switch">
                <input
                  type="checkbox"
                  checked={menu.status}
                  onChange={() => openModal(menu)}
                />
                <span className="slider round"></span>
              </label>
            </div>
          ))}
        </div>
      </div>

      {/* 모달 */}
      {modalOpen && (
        <div className="modal-overlay">
          <div className="modal-content">
            <p>
              {selectedMenu?.status
                ? `"${selectedMenu.name}" 메뉴의 등록을 해제하시겠습니까?`
                : `"${selectedMenu.name}" 메뉴를 등록하시겠습니까?`}
            </p>
            <div className="modal-buttons">
              <button className="confirm" onClick={confirmToggle}>확인</button>
              <button className="cancel" onClick={closeModal}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuStatus;
