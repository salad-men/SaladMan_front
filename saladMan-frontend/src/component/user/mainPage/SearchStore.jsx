import React, { useState } from 'react';
import './SearchStore.css';

const SearchStore = () => {
  const [keyword, setKeyword] = useState('');

  const handleSearch = () => {
    alert(`"${keyword}"로 매장을 검색합니다.`);
  };

  return (
    <section className="search-section">
      <h2>Search Store</h2>
      <p>가까운 샐러드맨 매장을 검색해보세요!</p>
      <div className="searchBox">
        <input
          type="text"
          placeholder="매장명을 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value)}
        />
        <button onClick={handleSearch}>매장 찾으러 가기</button>
      </div>
    </section>
  );
};

export default SearchStore;
