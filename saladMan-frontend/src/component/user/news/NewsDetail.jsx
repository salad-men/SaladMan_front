import React from "react";
import styles from "./NewsDetail.module.css";

const NewsDetail = () => {
  return (
    
    <div className={styles.container}>
      <br />
      <br />
      <br />
      <h1 className={styles.title}>공지사항</h1>

      <div className={styles.header}>
        <div className={styles.subject}>📢 (공지) 메뉴 개편 사항 안내</div>
        <div className={styles.meta}>
          <span>작성일: 25.01.31</span>
          <span>조회수: 4,021</span>
        </div>
      </div>

      <div className={styles.content}>
        <p>안녕하세요, 샐러드맨입니다.</p>
        <p>
          항상 저희 샐러드맨을 사랑해주시는 고객 여러분께 진심으로 감사드립니다.
          고객 여러분의 소중한 의견을 반영하여, 보다 다양하고 건강한 선택을
          제공하고자 샐러드맨의 전 메뉴 구성을 일부 개편하게 되었습니다.
        </p>

        <p>이번 개편을 통해</p>
        <ul>
          <li>신선한 재료의 비중 확대</li>
          <li>고단백·저탄수 메뉴 구성 강화</li>
          <li>시즌 한정 메뉴 신규 도입</li>
          <li>일부 기존 메뉴 리뉴얼</li>
        </ul>

        <p>이루어질 예정입니다.</p>

        <p>
          <strong>개편 일자:</strong> 2025년 6월 3일 (월)
        </p>

        <p className={styles.note}>
          ※ 정확한 메뉴 변경 내용은 추후 별도 공지 및 앱 내 메뉴판을 통해
          확인하실 수 있습니다. <br />
          더 맛있고 건강한 한 끼로 보답드릴 수 있도록 최선을 다하겠습니다.
        </p>

        <p>앞으로도 많은 관심과 응원 부탁드립니다.</p>

        <p>감사합니다. <br /> 샐러드맨 드림</p>
      </div>

      <div className={styles.buttons}>
        <button className={styles.buttonGreen}>목록</button>
        <button className={styles.buttonGray}>이전</button>
        <button className={styles.buttonGray}>다음</button>
      </div>
    </div>
  );
};

export default NewsDetail;
