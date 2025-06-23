import React, { useState } from "react";
import styles from "./Nutrition.module.css";

const data = {
  채소: [
    {
      name: "로메인",
      gram: 70,
      kcal: 13.6,
      carbs: 2.64,
      sugar: 0.96,
      protein: 0.96,
      fat: 0.24,
    },
    {
      name: "케일",
      gram: 70,
      kcal: 29.4,
      carbs: 5.28,
      sugar: 1.38,
      protein: 2.58,
      fat: 0.54,
    },
    {
      name: "양상추",
      gram: 70,
      kcal: 10.5,
      carbs: 2.03,
      sugar: 0.84,
      protein: 0.98,
      fat: 0.14,
    },
    {
      name: "방울토마토",
      gram: 70,
      kcal: 91.8,
      carbs: 19.89,
      sugar: 13.26,
      protein: 4.59,
      fat: 1.02,
    },
    {
      name: "적채",
      gram: 70,
      kcal: 9.3,
      carbs: 2.22,
      sugar: 1.14,
      protein: 0.42,
      fat: 0.06,
    },
    {
      name: "오이",
      gram: 70,
      kcal: 16.0,
      carbs: 3.6,
      sugar: 1.7,
      protein: 0.7,
      fat: 0.1,
    },
    {
      name: "파프리카",
      gram: 50,
      kcal: 48.0,
      carbs: 2.55,
      sugar: 0.21,
      protein: 0.6,
      fat: 4.5,
    },
    {
      name: "믹스야채",
      gram: 50,
      kcal: 76.8,
      carbs: 16.8,
      sugar: 3.6,
      protein: 2.72,
      fat: 1.2,
    },
    {
      name: "브로콜리",
      gram: 50,
      kcal: 225.0,
      carbs: 10.0,
      sugar: 5.0,
      protein: 17.0,
      fat: 13.0,
    },
  ],
  단백질: [
    {
      name: "닭가슴살",
      gram: 100,
      kcal: 165.0,
      carbs: 0.0,
      sugar: 0.0,
      protein: 31.0,
      fat: 3.6,
    },
    {
      name: "훈제연어",
      gram: 100,
      kcal: 93.6,
      carbs: 0.0,
      sugar: 0.0,
      protein: 14.64,
      fat: 3.44,
    },
    {
      name: "구운 두부",
      gram: 100,
      kcal: 130.5,
      carbs: 3.51,
      sugar: 0.54,
      protein: 13.95,
      fat: 7.2,
    },
    {
      name: "삶은 계란",
      gram: 50,
      kcal: 77.5,
      carbs: 0.55,
      sugar: 0.55,
      protein: 6.5,
      fat: 5.5,
    },
    {
      name: "소고기",
      gram: 100,
      kcal: 200.0,
      carbs: 0.0,
      sugar: 0.0,
      protein: 20.8,
      fat: 13.6,
    },
    {
      name: "참치",
      gram: 100,
      kcal: 105.6,
      carbs: 0.0,
      sugar: 0.0,
      protein: 22.4,
      fat: 1.04,
    },
    {
      name: "리코타치즈",
      gram: 30,
      kcal: 63.0,
      carbs: 14.0,
      sugar: 5.6,
      protein: 1.26,
      fat: 0.07,
    },
    {
      name: "아몬드",
      gram: 15,
      kcal: 69.6,
      carbs: 1.2,
      sugar: 0.12,
      protein: 4.4,
      fat: 5.2,
    },
    {
      name: "아보카도",
      gram: 30,
      kcal: 57.9,
      carbs: 2.2,
      sugar: 0.44,
      protein: 2.1,
      fat: 5.0,
    },
    {
      name: "치킨텐더",
      gram: 70,
      kcal: 28.6,
      carbs: 1.65,
      sugar: 0.1,
      protein: 2.93,
      fat: 0.35,
    },
    {
      name: "소불고기",
      gram: 70,
      kcal: 270.0,
      carbs: 15.0,
      sugar: 0.0,
      protein: 15.0,
      fat: 17.0,
    },
    {
      name: "두부",
      gram: 50,
      kcal: 46.2,
      carbs: 11.27,
      sugar: 3.85,
      protein: 0.84,
      fat: 0.07,
    },
  ],
  탄수화물: [
    {
      name: "귀리밥",
      gram: 100,
      kcal: 180.0,
      carbs: 32.4,
      sugar: 0.48,
      protein: 6.0,
      fat: 3.0,
    },
    {
      name: "현미밥",
      gram: 100,
      kcal: 177.6,
      carbs: 38.4,
      sugar: 0.24,
      protein: 3.72,
      fat: 1.44,
    },
    {
      name: "콜리플라워라이스",
      gram: 100,
      kcal: 30.0,
      carbs: 6.0,
      sugar: 2.4,
      protein: 2.4,
      fat: 0.36,
    },
    {
      name: "크루통",
      gram: 30,
      kcal: 64.65,
      carbs: 0.48,
      sugar: 0.0,
      protein: 5.7,
      fat: 4.35,
    },
    {
      name: "구운 단호박",
      gram: 50,
      kcal: 81.4,
      carbs: 14.4,
      sugar: 0.4,
      protein: 2.4,
      fat: 1.88,
    },
    {
      name: "옥수수",
      gram: 30,
      kcal: 9.3,
      carbs: 1.8,
      sugar: 1.26,
      protein: 0.3,
      fat: 0.09,
    },
    {
      name: "김가루",
      gram: 5,
      kcal: 24.0,
      carbs: 4.8,
      sugar: 2.4,
      protein: 1.2,
      fat: 0.16,
    },
    {
      name: "단호박",
      gram: 50,
      kcal: 37.5,
      carbs: 2.5,
      sugar: 1.5,
      protein: 0.0,
      fat: 3.25,
    },
  ],
  소스: [
    {
      name: "시저",
      gram: 20,
      kcal: 120.0,
      carbs: 1.0,
      sugar: 0.35,
      protein: 0.75,
      fat: 12.5,
    },
    {
      name: "발사믹",
      gram: 20,
      kcal: 22.0,
      carbs: 4.25,
      sugar: 3.75,
      protein: 0.12,
      fat: 0.0,
    },
    {
      name: "유자청",
      gram: 20,
      kcal: 65.5,
      carbs: 16.25,
      sugar: 15.0,
      protein: 0.0,
      fat: 0.0,
    },
    {
      name: "고추마요",
      gram: 20,
      kcal: 67.5,
      carbs: 0.75,
      sugar: 0.5,
      protein: 0.25,
      fat: 6.75,
    },
    {
      name: "참깨",
      gram: 20,
      kcal: 148.75,
      carbs: 2.27,
      sugar: 0.07,
      protein: 4.42,
      fat: 13.45,
    },
    {
      name: "와사비마요",
      gram: 20,
      kcal: 13.6,
      carbs: 2.64,
      sugar: 0.68,
      protein: 1.12,
      fat: 0.16,
    },
    {
      name: "비건 레몬드레싱",
      gram: 20,
      kcal: 62.5,
      carbs: 1.5,
      sugar: 0.5,
      protein: 0.25,
      fat: 6.0,
    },
  ],
};

const Nutrition = () => {
  const categories = Object.keys(data);
  const [activeTab, setActiveTab] = useState("탄수화물");

  return (
    <div className={styles.container}>
      <div className={styles.tabs}>
        {categories.map((category) => (
          <button
            key={category}
            className={`${styles.tab} ${
              activeTab === category ? styles.active : ""
            }`}
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
            <th>중량 (g, ml)</th>
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
              <td>{item.gram}</td>
              <td>{item.kcal}</td>
              <td>{item.carbs}</td>
              <td>{item.sugar}</td>
              <td>{item.protein}</td>
              <td>{item.fat}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.infoText}>
        <p>※현재 재료는 샐러드에 들어가는 용량이 기준으로 되어있습니다.</p>
        <p>※중량은 조리 전 재료의 중량을 기준으로 합니다.</p>
        <p>※실제 샐러드와 오차가 발생할 수 있습니다.</p>
      </div>
    </div>
  );
};

export default Nutrition;
