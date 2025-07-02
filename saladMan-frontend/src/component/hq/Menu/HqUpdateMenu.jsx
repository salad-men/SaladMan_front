import { useState, useEffect } from 'react';
import { useAtomValue } from 'jotai';
import styles from './HqUpdateMenu.module.css';
import HqSidebarMenu from './HqSidebarMenu';
import { myAxios } from '../../../config';
import { accessTokenAtom } from '/src/atoms';

export default function HqUpdateMenu() {
  const token = useAtomValue(accessTokenAtom);

  const [isModalOpen, setModalOpen] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredientId, setSelectedIngredientId] = useState(null);
  const [ingredientDetails, setIngredientDetails] = useState([]);

  const fetchIngredients = async () => {
    try {
      const res = await myAxios(token).get('/hq/ingredientInfo');
      console.log("모달에 내려받은 ingredients:", res.data);
      setIngredients(res.data);
    } catch (error) {
      console.error('재료 목록 불러오기 실패', error);
    }
  };


  const openModal = async () => {
    await fetchIngredients();
    setModalOpen(true);
  };

  const addSelectedIngredient = () => {
    if (!selectedIngredientId) return alert('재료를 선택하세요');
    const selectedIngredient = ingredients.find(ing => ing.ingredientId === selectedIngredientId);
    if (!selectedIngredient) return alert('재료 정보를 찾을 수 없습니다.');

    setIngredientDetails(prev => [
      ...prev,
      { ...selectedIngredient, quantity: '' }
    ]);
    setModalOpen(false);
    setSelectedIngredientId(null);
  };

  return (
    <div className={styles.wrapper}>
      <HqSidebarMenu />
      <div className={styles.content}>
        <header className={styles.pageHeader}>
          <h2>메뉴 등록</h2>
        </header>
        <form>
          <table className={styles.table}>
            <tbody>
              <tr>
                <td className={styles.labelCell}>메뉴 사진</td>
                <td><input type="file" id="image" accept="image/*" /></td>
              </tr>
              <tr>
                <td className={styles.labelCell}>메뉴 이름</td>
                <td><input type="text" id="name" required /></td>
              </tr>
              <tr>
                <td className={styles.labelCell}>메뉴 재료</td>
                <td>
                  <button type="button" className={styles.button} onClick={openModal}>
                    재료 선택
                  </button>
                  <table className={styles.ingredientTable}>
                    <thead>
                      <tr>
                        <th>품명</th>
                        <th>구분</th>
                        <th>단위</th>
                        <th>용량</th>
                        <th>단위가격</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ingredientDetails.map((ing) => (
                        <tr key={ing.ingredientId}>
                          <td>{ing.name}</td>
                          <td>{ing.category}</td>
                          <td>{ing.unit}</td>
                          <td>
                            <input
                              type="number"
                              placeholder="용량 입력"
                              value={ing.quantity}
                              min="0"
                              onChange={(e) => {
                                const value = e.target.value;
                                setIngredientDetails(prev =>
                                  prev.map(item =>
                                    item.ingredientId === ing.ingredientId ? { ...item, quantity: value } : item
                                  )
                                );
                              }}
                            />
                          </td>
                          <td>{ing.price}원</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </td>
              </tr>
              <tr>
                <td className={styles.labelCell}>판매가 / 원가</td>
                <td>
                  <div className={styles.flexRow}>
                    <input type="number" id="price" placeholder="판매가 (₩)" min="0" />
                    <input type="number" id="cost" placeholder="원가 (₩)" min="0" />
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            <button type="submit" className={styles.button}>저장</button>
          </div>
        </form>

        {/* 재료 선택 모달 */}
        {isModalOpen && (
          <div className={`${styles.modal} ${isModalOpen ? styles.modalOpen : ''}`}>
            <div className={styles.modalContent}>
              <h3>재료 선택</h3>
              <div className={styles.ingredientGrid}>
                {ingredients.map(ing => (
                  <label key={ing.ingredientId}>
                    <input
                      type="radio"
                      name="ingredient"
                      value={ing.ingredientId}
                      checked={selectedIngredientId === ing.ingredientId}
                      onChange={() => setSelectedIngredientId(ing.ingredientId)}
                    />
                    {ing.name}
                  </label>
                ))}
              </div>
              <div className={styles.flexRow}>
                <button type="button" className={styles.button} onClick={addSelectedIngredient}>확인</button>
                <button type="button" className={styles.button} onClick={() => setModalOpen(false)}>취소</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
