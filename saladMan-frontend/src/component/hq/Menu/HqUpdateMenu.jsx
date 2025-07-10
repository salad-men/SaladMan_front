import React, { useState, useRef, useEffect } from "react";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import HqSidebarMenu from "./HqSidebarMenu";
import { myAxios } from "../../../config";
import { accessTokenAtom } from "/src/atoms";
import { useMemo } from "react";
import styles from "./HqUpdateMenu.module.css";

export default function HqUpdateMenu() {
  const token = useAtomValue(accessTokenAtom);
  const navigate = useNavigate();

  // 메뉴 사진
  const [imgFile, setImgFile] = useState(null);
  const [imgPreview, setImgPreview] = useState("");
  const imgInputRef = useRef(null);

  // 폼 입력
  const [menuName, setMenuName] = useState("");
  const [salePrice, setSalePrice] = useState("");
  const [menuCategory, setMenuCategory] = useState([]);
  const [selectedMenuCategoryId, setSelectedMenuCategoryId] = useState("");

  // 재료
  const [ingredientDetails, setIngredientDetails] = useState([]);
  const [isModalOpen, setModalOpen] = useState(false);
  const [ingredients, setIngredients] = useState([]);
  const [selectedIngredientIds, setSelectedIngredientIds] = useState([]);
  const [selectedCategoryId, setSelectedCategoryId] = useState(null);

  useEffect(() => {
    if (!token) return;
    myAxios(token)
      .get("/hq/menuCategory")
      .then((res) => setMenuCategory(res.data))
      .catch(console.error);
  }, [token]);

  // 재료 목록 불러오기
  const fetchIngredients = async () => {
    try {
      const res = await myAxios(token).get("/hq/ingredientInfo");
      setIngredients(res.data);
      setSelectedCategoryId(res.data[0]?.categoryId ?? null);
    } catch (e) {
      alert("재료 목록 불러오기 실패");
    }
  };

  const openModal = async () => {
    await fetchIngredients();
    setModalOpen(true);
  };

  const addSelectedIngredient = () => {
    if (selectedIngredientIds.length === 0) return alert("재료를 선택하세요");
    const selected = ingredients.filter((ing) =>
      selectedIngredientIds.includes(ing.ingredientId)
    );
    setIngredientDetails((prev) => {
      const existingIds = prev.map((i) => i.ingredientId);
      const newItems = selected
        .filter((ing) => !existingIds.includes(ing.ingredientId))
        .map((ing) => ({ ...ing, quantity: 0 }));
      return [...prev, ...newItems];
    });
    setModalOpen(false);
    setSelectedIngredientIds([]);
  };

  const toggleIngredientSelection = (id) => {
    setSelectedIngredientIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 메뉴 사진 업로드(1장)
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setImgFile(file);
      setImgPreview(ev.target.result);
    };
    reader.readAsDataURL(file);
    e.target.value = "";
  };
  const handleRemoveImg = () => {
    setImgFile(null);
    setImgPreview("");
  };

  // 저장
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!menuName || !salePrice || !selectedMenuCategoryId) {
      return alert("메뉴 이름, 가격, 카테고리를 모두 입력하세요.");
    }
    if (ingredientDetails.length < 5 || ingredientDetails.length > 8) {
      return alert("재료는 5개 이상 8개 이하로 선택해주세요.");
    }
    const menu = {
      name: menuName,
      salePrice: parseInt(salePrice),
      categoryId: selectedMenuCategoryId,
      ingredients: ingredientDetails.map((i) => ({
        ingredientId: i.ingredientId,
        quantity: parseInt(i.quantity),
      })),
    };
    const formData = new FormData();
    formData.append("menu", JSON.stringify(menu));
    if (imgFile) formData.append("image", imgFile);

    try {
      await myAxios(token).post("/hq/registerMenu", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      alert("메뉴 등록 성공!");
      navigate("/hq/totalMenu");
    } catch (err) {
      alert("등록 실패");
      console.error(err);
    }
  };

  //원가계산
  const originPrice = useMemo(() => {
  return ingredientDetails.reduce((sum, ing) => {
    const qty = parseFloat(ing.quantity);
    const price = parseFloat(ing.price);
    if (!isNaN(qty) && !isNaN(price)) {
      return sum + qty * price;
    }
    return sum;
  }, 0);
}, [ingredientDetails]);

useEffect(() => {
  const rawPrice = originPrice * 2.5;
  const rounded = Math.ceil(rawPrice / 100) * 100;
  if (!isNaN(rounded)) setSalePrice(rounded.toString());
}, [originPrice]);



  return (
    <div className={styles.container}>
      <HqSidebarMenu />
      <main className={styles.content}>
        {/* 타이틀은 innerContainer 바깥 */}
        <h2 className={styles.title}>메뉴 등록</h2>
        <div className={styles.innerContainer}>
          <form className={styles.form} onSubmit={handleSubmit}>
            {/* 메뉴 사진 */}
            <div className={styles.formRow}>
              <label className={styles.formLabel}>메뉴 사진</label>
              <div className={styles.imagesContainer}>
                {imgPreview ? (
                  <div className={styles.imageBox}>
                    <img
                      src={imgPreview}
                      alt="미리보기"
                      className={styles.imagePreview}
                    />
                    <button
                      type="button"
                      className={styles.imgRemoveBtn}
                      title="삭제"
                      onClick={handleRemoveImg}
                    >
                      ×
                    </button>
                  </div>
                ) : (
                  <div
                    className={styles.imageBox + " " + styles.addBox}
                    onClick={() => imgInputRef.current.click()}
                    tabIndex={0}
                    role="button"
                    title="이미지 추가"
                  >
                    <img
                      src="/plus.png"
                      alt="이미지 추가"
                      className={styles.plusIcon}
                    />
                    <input
                      type="file"
                      accept="image/*"
                      style={{ display: "none" }}
                      ref={imgInputRef}
                      onChange={handleImageChange}
                    />
                  </div>
                )}
              </div>
            </div>

            {/* 메뉴명 */}
            <div className={styles.formRow}>
              <label className={styles.formLabel}>메뉴명</label>
              <input
                type="text"
                className={styles.input}
                value={menuName}
                onChange={(e) => setMenuName(e.target.value)}
                placeholder="메뉴명을 입력하세요"
                required
              />
            </div>

            {/* 카테고리 */}
            <div className={styles.formRow}>
              <label className={styles.formLabel}>카테고리</label>
              <select
                className={styles.input}
                value={selectedMenuCategoryId}
                onChange={(e) => setSelectedMenuCategoryId(e.target.value)}
                required
              >
                <option value="">카테고리를 선택하세요</option>
                {menuCategory.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            {/* 판매가 */}
            <div className={styles.formRow}>
              <label className={styles.formLabel}>판매가</label>
              <input
                type="text"
                className={styles.input}
                value={salePrice}
                onChange={(e) => setSalePrice(e.target.value)}
                placeholder="판매가 (₩)"
                min="0"
                required
              />
              {/* 원가 */}
              <label className={styles.formLabel}>원가</label>
              <input
                type="text"
                className={styles.input}
                value={originPrice.toLocaleString()}
                placeholder="판매가 (₩)"
                min="0"
                readOnly
              />
            </div>

            {/* 재료 추가 */}
            <div className={styles.formRow}>
              <label className={styles.formLabel}>메뉴 재료</label>
              <div className={styles.ingredientArea}>
                <div className={styles.ingredientHeaderRow}>
                  <span className={styles.ingredientTitle}></span>
                  <button
                    type="button"
                    className={styles.btnAddIng}
                    onClick={openModal}
                  >
                    + 재료추가
                  </button>
                </div>
                <table className={styles.ingredientTable}>
                  <thead>
                    <tr>
                      <th>재료명</th>
                      <th>용량</th>
                      <th>단가</th>
                      <th>원가</th>
                      <th>-</th>
                    </tr>
                  </thead>
                  <tbody className={styles.scrollBody}>
                    {ingredientDetails.length === 0 && (
                      <tr>
                        <td colSpan={4} className={styles.noIngredient}>재료를 추가하세요</td>
                      </tr>
                    )}
                    {ingredientDetails.map((ing) => (
                      <tr key={ing.ingredientId}>
                        {/* <td>{ing.category}</td> */}
                        <td>{ing.name}</td>
                        <td className={styles.qtyCell}>
                          <div className={styles.qtyFlex}>
                            <input
                              type="number"
                              className={styles.ingQtyInput}
                              placeholder="용량 입력"
                              value={ing.quantity}
                              min="0"
                              onChange={(e) => {
                                const value = e.target.value;
                                setIngredientDetails((prev) =>
                                  prev.map((item) =>
                                    item.ingredientId === ing.ingredientId
                                      ? { ...item, quantity: value }
                                      : item
                                  )
                                );
                              }}
                              required
                            />
                            <span className={styles.unit}>{ing.unit}</span>
                          </div>
                        </td>
                        <td>{ing.price}원</td>
                        <td>
                          {ing.quantity && !isNaN(ing.quantity)
                            ? `${(Number(ing.quantity) * Number(ing.price)).toLocaleString()}원`
                            : "-"}
                        </td>
                        <td>
                          <button
                            type="button"
                            className={styles.btnRemoveIng}
                            onClick={() =>
                              setIngredientDetails((prev) =>
                                prev.filter((item) => item.ingredientId !== ing.ingredientId)
                              )
                            }
                          >
                            삭제
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>


              </div>
            </div>

            {/* 버튼 */}
            <div className={styles.btnBox}>
              <button type="submit" className={styles.btnSubmit}>
                저장
              </button>
              <button
                type="button"
                className={styles.btnCancel}
                onClick={() => navigate("/hq/totalMenu")}
              >
                취소
              </button>
            </div>
          </form>

          {/* 재료 선택 모달 */}
          {isModalOpen && (
            <div className={styles.modalBg} onClick={() => setModalOpen(false)}>
              <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
                <h3 className={styles.modalHeader}>재료 선택</h3>
                <div className={styles.tabRow}>
                  {Array.from(new Set(ingredients.map((ing) => ing.categoryId))).map(
                    (catId) => {
                      const catName = ingredients.find(
                        (ing) => ing.categoryId === catId
                      )?.category;
                      return (
                        <button
                          key={catId}
                          className={
                            styles.tabButton +
                            " " +
                            (selectedCategoryId === catId ? styles.activeTab : "")
                          }
                          onClick={() => setSelectedCategoryId(catId)}
                          type="button"
                        >
                          {catName}
                        </button>
                      );
                    }
                  )}
                </div>
                <div className={styles.ingredientGrid}>
                  {ingredients
                    .filter(
                      (ing) =>
                        selectedCategoryId === null ||
                        ing.categoryId === selectedCategoryId
                    )
                    .map((ing) => (
                      <label key={ing.ingredientId} className={styles.checkboxLabel}>
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
                <div className={styles.modalFooter}>
                  <button
                    type="button"
                    className={styles.btnModalSave}
                    onClick={addSelectedIngredient}
                  >
                    확인
                  </button>
                  <button
                    type="button"
                    className={styles.btnModalCancel}
                    onClick={() => setModalOpen(false)}
                  >
                    취소
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
