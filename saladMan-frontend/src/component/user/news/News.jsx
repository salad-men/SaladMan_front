import React from 'react';
import styles from './News.module.css';

const notices = [
  { id: 189, title: '여름 입맛 깨우는 ‘닭갈 휘폴’ 시리즈 출시', date: '25.05.20', views: 41 },
  { id: 188, title: '업계점 리뉴얼 오픈…‘more’로 일상 건강식의 새로운 기준 제시', date: '25.04.30', views: 28 },
  { id: 187, title: '광고 모델로 배우 박보검 발탁', date: '25.04.25', views: 31 },
  { id: 186, title: '재료수급 달인 왔네… 농산물 직영 키우는 식품사', date: '25.04.16', views: 26 },
  { id: 185, title: '프렌차이즈 "2024년 최우수 외식 한판" 우수기업 선정 시상식 개최', date: '25.04.15', views: 201 },
  { id: 184, title: '친환경·로컬 농산물 유통 협력 MOU…지역 상생 물길 튼다', date: '25.04.07', views: 210 },
  { id: 183, title: '새해 웰빙이슈 트렌드 진입 신메뉴 6종 출시', date: '25.02.11', views: 917 },
  { id: 182, title: '「토핑(반짝할인) 무료 쿠폰」 사용 조건 변경 안내', date: '25.02.06', views: 388 },
  { id: 181, title: '다문화인의 입맛을 건 건강식과 트렌드의 새로운 시너지 창출', date: '25.01.21', views: 502 },
  { id: 180, title: '젊은 세대 겨냥한 "저소노블"형 링크로 ‘브랜드’ 제안', date: '25.01.17', views: 439 }
];

const News = () => {
  return (
    <div className={styles.container}>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>번호</th>
            <th>제목</th>
            <th>작성자</th>
            <th>작성일</th>
            <th>조회</th>
          </tr>
        </thead>
        <tbody>
          {notices.map((notice) => (
            <tr key={notice.id}>
              <td>{notice.id}</td>
              <td>{notice.title}</td>
              <td>관리자</td>
              <td>{notice.date}</td>
              <td>{notice.views.toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <div className={styles.pagination}>
        {[1,2,3,4,5,6,7,8,9,10].map((num) => (
          <button key={num}>{num}</button>
        ))}
        <button>&gt;&gt;</button>
      </div>
    </div>
  );
};

export default News;
