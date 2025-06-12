import React, { useState } from 'react';
import styles from './Nutrition.module.css';

const data = {
  채소: [
    { name: '로메인', kcal: 17, carbs: 3.3, sugar: 1.2, protein: 1.2, fat: 0.3 },
    { name: '케일', kcal: 49, carbs: 9, sugar: 2, protein: 4.3, fat: 0.9 },
    { name: '양상추', kcal: 15, carbs: 2.9, sugar: 0.8, protein: 1.4, fat: 0.2 },
    { name: '방울토마토', kcal: 18, carbs: 3.9, sugar: 2.6, protein: 0.9, fat: 0.2 },
    { name: '적채', kcal: 31, carbs: 7.4, sugar: 3.8, protein: 1.4, fat: 0.2 },
    { name: '오이', kcal: 12, carbs: 2.2, sugar: 0.9, protein: 0.6, fat: 0.1 },
  ],
  단백질: [
    { name: '닭가슴살', kcal: 165, carbs: 0, sugar: 0, protein: 31, fat: 3.6 },
    { name: '훈제연어', kcal: 117, carbs: 0, sugar: 0, protein: 18.3, fat: 4.3 },
    { name: '구운 두부', kcal: 145, carbs: 3.9, sugar: 0.5, protein: 15.5, fat: 8.5 },
    { name: '삶은 계란', kcal: 155, carbs: 1.1, sugar: 1.1, protein: 13, fat: 11 },
    { name: '소고기', kcal: 250, carbs: 0, sugar: 0, protein: 26, fat: 17 },
    { name: '참치', kcal: 132, carbs: 0, sugar: 0, protein: 28, fat: 1.3 },
  ],
  탄수화물: [
    { name: '귀리밥', kcal: 150, carbs: 27.3, sugar: 0.4, protein: 5.5, fat: 2.5 },
    { name: '현미밥', kcal: 110, carbs: 23, sugar: 0.3, protein: 2.3, fat: 0.9 },
    { name: '콜리플라워라이스', kcal: 25, carbs: 5, sugar: 2, protein: 2, fat: 0.1 },
  ],
  소스: [
    { name: '시저', kcal: 80, carbs: 1, sugar: 0.5, protein: 1, fat: 8 },
    { name: '발사믹', kcal: 50, carbs: 5, sugar: 4, protein: 0, fat: 3 },
    { name: '유자청', kcal: 65, carbs: 16, sugar: 14, protein: 0.3, fat: 0 },
    { name: '고추마요', kcal: 90, carbs: 2, sugar: 1, protein: 0.5, fat: 9 },
    { name: '참깨', kcal: 100, carbs: 2, sugar: 1, protein: 1, fat: 10 },
    { name: '비건레몬드레싱', kcal: 60, carbs: 3, sugar: 2, protein: 0.5, fat: 5 },
  ],
};

const Nutrition = () => {
  const categories = Object.keys(data);
  const [activeTab, setActiveTab] = useState('탄수화물');

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.tab} ${activeTab === category ? styles.active : ''}`}
            onClick={() => setActiveTab(category)}
          >
            {category}
          </button>
        ))}
      </div>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>재료</th>
            <th>열량 (kcal)</th>
            <th>탄수화물 (g)</th>
            <th>당류 (g)</th>
            <th>단백질 (g)</th>
            <th>지방 (g)</th>
          </tr>
        </thead>
        <tbody>
          {data[activeTab].map((item) => (
            <tr key={item.name}>
              <td>{item.name}</td>
              <td>{item.kcal}</td>
              <td>{item.carbs}</td>
              <td>{item.sugar}</td>
              <td>{item.protein}</td>
              <td>{item.fat}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Nutrition;
