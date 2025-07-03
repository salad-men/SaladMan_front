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
  const [selectedIngredientIds, setSelectedIngredientIds] = useState([]);
  const [ingredientDetails, setIngredientDetails] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(ingredients[0]?.categoryId || null);
  const [Menucategory, setMenuCategory] = useState([]);
  const [selectedMenuCategoryId, setSelectedMenuCategoryId] = useState('');

  // 파일 업로드 상태
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState("/images/profile-placeholder.png");

  useEffect(() => {
    if (!token) return;
    const axios = myAxios(token);

    const MenuCategory = async () => {
      try {
        const res = await axios.get('/hq/menuCategory');
        setMenuCategory(res.data);
      } catch (error) {
        console.error('카테고리 목록 불러오기 실패', error);
      }
  };

    MenuCategory();
  }, [token]);

  const fetchIngredients = async () => {
    try {
      const res = await myAxios(token).get('/hq/ingredientInfo');
      setIngredients(res.data);

      const firstCategoryId = res.data[0]?.categoryId ?? null;
      setSelectedCategoryId(firstCategoryId);
    } catch (error) {
      console.error('재료 목록 불러오기 실패', error);
    }
  };


  const openModal = async () => {
    await fetchIngredients();
    setModalOpen(true);
  };

  const addSelectedIngredient = () => {
  if (selectedIngredientIds.length === 0) {
    return alert('재료를 선택하세요');
  }

  const selectedIngredients = ingredients.filter(ing =>
    selectedIngredientIds.includes(ing.ingredientId)
  );

  if (selectedIngredients.length === 0) {
    return alert('재료 정보를 찾을 수 없습니다.');
  }

  // 이미 추가된 재료 중복 방지
  setIngredientDetails(prev => {
    const existingIds = prev.map(i => i.ingredientId);
    const newItems = selectedIngredients
      .filter(ing => !existingIds.includes(ing.ingredientId))
      .map(ing => ({ ...ing, quantity: '' }));
    return [...prev, ...newItems];
  });

  setModalOpen(false);
  setSelectedIngredientIds([]);
};

  const toggleIngredientSelection = (id) => {
  setSelectedIngredientIds((prev) =>
    prev.includes(id)
      ? prev.filter((selectedId) => selectedId !== id)
      : [...prev, id]
  );
};

const menuData = {
  name: '', salePrice: '', categoryId: '',
  ingredients: ingredientDetails.map(i => ({
    ingredientId: i.ingredientId,
    quantity: parseInt(i.quantity)
  }))
};

const formData = new FormData();
formData.append("menu", JSON.stringify(menuData));

const imageInput = document.getElementById("image");
if (imageInput.files.length > 0) {
  formData.append("image", imageInput.files[0]);
}

 myAxios.post("/hq/registerMenu", formData, {
  headers: { "Content-Type": "multipart/form-data" }
});

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
                <td className={styles.labelCell}>판매가</td>
                <td>
                  <div className={styles.flexRow}>
                    <input type="number" id="price" placeholder="판매가 (₩)" min="0" />
                  </div>
                </td>
              </tr>
              <tr>
                <td className={styles.labelCell}>메뉴 이름</td>
                <td><input type="text" id="name" required /></td>
                <td className={styles.labelCell}>카테고리</td>
                  <td>
                    <select
                      value={selectedMenuCategoryId}
                      onChange={(e) => setSelectedMenuCategoryId(e.target.value)}
                      required
                    >
                      <option value="">카테고리를 선택하세요</option>
                      {Menucategory.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                          {cat.name}
                        </option>
                      ))}
                    </select>
                  </td>
              </tr>
              <tr>
                <td className={styles.labelCell}>메뉴 재료</td>
                <td colSpan={3} className={styles.ingredientCell}>
                  <div className={styles.ingredientWrapper}>
                  <table className={styles.ingredientTable}>
                    <thead>
                      <tr>
                        <th>카테고리</th>
                        <th>재료명</th>
                        <th>용량</th>
                        <th>-</th>
                      </tr>
                    </thead>
                    <tbody>
                      {ingredientDetails.map((ing) => (
                        <tr key={ing.ingredientId}>
                          <td>{ing.category}</td>
                          <td>{ing.name}</td>                          
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
                            {ing.unit}
                          </td>
                          <td>
                            <button
                              type="button"
                              className={styles.deleteButton}
                              onClick={() => {
                                setIngredientDetails(prev =>
                                  prev.filter(item => item.ingredientId !== ing.ingredientId)
                                );
                              }}
                            >
                              삭제
                            </button>
                          </td>
                        </tr>
                      ))}
                      <tr>
                        <td colSpan={4}>
                           <a onClick={openModal}> + </a>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>
          <div>
            <button type="submit" className={styles.button}>저장</button>
          </div>
        </form>

        {isModalOpen && (
          <div className={`${styles.modal} ${isModalOpen ? styles.modalOpen : ''}`}>
            <div className={styles.modalContent}>
              <h3>재료 선택</h3>

              {/* 카테고리 탭 */}
              <div className={styles.tabRow}>
                {Array.from(new Set(ingredients.map(ing => ing.categoryId))).map(catId => {
                  const catName = ingredients.find(ing => ing.categoryId === catId)?.category;
                  return (
                    <button
                      key={catId}
                      className={`${styles.tabButton} ${selectedCategoryId === catId ? styles.activeTab : ''}`}
                      onClick={() => setSelectedCategoryId(catId)}
                    >
                      {catName}
                    </button>
                  );
                })}
              </div>

              {/* 선택된 카테고리의 재료 목록 */}
              <div className={styles.ingredientGrid}>
                {ingredients
                  .filter(ing => selectedCategoryId === null || ing.categoryId === selectedCategoryId)
                  .map(ing => (
                    <label key={ing.ingredientId}>
                      <input
                        type="checkbox"
                        value={ing.ingredientId}
                        checked={selectedIngredientIds.includes(ing.ingredientId)}
                        onChange={() => toggleIngredientSelection(ing.ingredientId)}
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


