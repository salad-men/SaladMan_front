import styles from './MenuStatus.module.css';
import SidebarMenus from './SidebarMenu';
import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import { accessTokenAtom } from '/src/atoms';
import { myAxios } from '/src/config';

const MenuStatus = () => {
  const [menus, setMenus] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const token = useAtomValue(accessTokenAtom);
  console.log("토큰:", token);

  useEffect(() => {
    if (!token) return;
    
    const fetchMenus = async () => {
      try {
        const res = await myAxios(token).get('/store/menuStatus');
        console.log(res);
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
      await myAxios(token).patch('/store/menuStatus/toggle', {
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
    <div className={styles.wrapper}>
      <SidebarMenus />
      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <h2>점포 메뉴 관리</h2>
        </div>
        
        <table className={styles.menuTable}>
          <thead>
            <tr>
              <th>상품 이미지</th>
              <th>상품명</th>
              <th>판매가</th>
              <th>등록여부</th>
            </tr>
          </thead>

          <tbody>
            {menus.map(menu => (
              <tr key={menu.id}>
                <td>
                  <img src={`/${menu.name}.png`} alt={menu.name} style={{ width: '60px', height: '60px' }} />
                </td>
                <td>{menu.name}</td>
                <td>{menu.salePrice.toLocaleString()}원</td>
                <td>
                  <label className={styles.switch}>
                    <input type="checkbox" checked={!!menu.status} onChange={() => openModal(menu)}/>
                    <span className={`${styles.slider} ${styles.round}`}></span>
                  </label>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* 모달 */}
      {modalOpen && (
        <div className={styles.modalOverlay}>
          <div className={styles.modalContent}>
            <p>
              {selectedMenu?.status === true
              ? `"${selectedMenu.name}" 메뉴의 등록을 해제하시겠습니까?`
              : `"${selectedMenu.name}" 메뉴를 ${selectedMenu?.status === null
              ? '등록하시겠습니까?' : '활성화하시겠습니까?'}`}
            </p>
            <div className={styles.modalButtons}>
              <button className={styles.confirm} onClick={confirmToggle}>확인</button>
              <button className={styles.cancel} onClick={closeModal}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MenuStatus;
