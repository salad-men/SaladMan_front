import React, { useState } from 'react';
import styles from './SearchStore.module.css';

const SearchStore = () => {
  const [keyword, setKeyword] = useState('');


  return (
    <section className={styles.searchSection}>
      <a href="/findStore" className={styles.atag}>
      <h2>Search Store</h2>
      <p>가까운 샐러드맨 매장을 검색해보세요!</p>
      <div className={styles.searchBox}>
        <input
          className={styles.inputbox}
          type="text"
          placeholder="매장명을 입력하세요"
          value={keyword}
          onChange={(e) => setKeyword(e.target.value) 
            
          }
        />
      </div>
      </a>
    </section>
  );
};

export default SearchStore;
