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
      const res = await myAxios(token).get('/api/ingredients');
      setIngredients(res.data);
    } catch (error) {
      console.error('재료 목록 불러오기 실패', error);
    }
  };

  const openModal = () => {
    fetchIngredients();
    setModalOpen(true);
  };

  const addSelectedIngredient = async () => {
    if (!selectedIngredientId) return alert('재료를 선택하세요');
    try {
      const res = await myAxios(token).get(`/api/ingredients/${selectedIngredientId}`);
      setIngredientDetails(prev => [...prev, res.data]);
      setModalOpen(false);
      setSelectedIngredientId(null);
    } catch (error) {
      console.error('재료 상세 정보 불러오기 실패', error);
    }
  };

  return (
    <div className={styles.wrapper}>
      <HqSidebarMenu />
      <div className={styles.content}>
        <header className={styles.pageHeader}>
          <h2>메뉴 등록</h2>
        </header>
        <form>
          <table className={styles.mtable}>
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
                      {ingredientDetails.map((ing, index) => (
                        <tr key={index}>
                          <td>{ing.name}</td>
                          <td>{ing.category}</td>
                          <td>{ing.unit}</td>
                          <td><input type="text" placeholder="용량 입력" /></td>
                          <td>{ing.price}</td>
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
              <tr>
                <td className={styles.labelCell}>레시피</td>
                <td><textarea id="recipe" placeholder="레시피 입력"></textarea></td>
              </tr>
            </tbody>
          </table>
          <div>
            <button type="submit" className={styles.button}>저장</button>
          </div>
        </form>

        {/* 재료 선택 모달 */}
        {isModalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>재료 선택</h3>
              <div className={styles.ingredientGrid}>
                {ingredients.map(ing => (
                  <label key={ing.id}>
                    <input
                      type="radio"
                      name="ingredient"
                      value={ing.id}
                      checked={selectedIngredientId === ing.id}
                      onChange={() => setSelectedIngredientId(ing.id)}
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
