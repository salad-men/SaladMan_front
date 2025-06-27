import React, { useEffect, useState } from "react";
import styles from "./FindOtherStore.module.css";
import SidebarInquiry from './SidebarInquiry'

const FindStore = () => {
  const [stores, setStores] = useState([]);
  const [location, setLocation] = useState("");
  const [userName, setUserName] = useState("");
  const [filteredStores, setFilteredStores] = useState([]);

  return (
    <div className={styles.wrapper}>
      <SidebarInquiry />
      <div className={styles.content}>
        <header className={styles.pageHeader}>
          <h2>매장 위치 조회</h2>
        </header>

        <div className={styles.layout}>
          <div className={styles.leftPanel}>
          <div className={styles.filters}>
            <div className={styles.filterRow}>
              <label>점포 선택</label>
              <select value={selectedLocation} onChange={handleLocationChange}>
                <option value="">지역</option>
                {locations.map((loc, idx) => (
                  <option key={idx} value={loc}>
                    {loc}
                  </option>
                ))}
              </select>

              <select>
                <option value="">지점명</option>
                {filteredStores.map((store) => (
                  <option key={store.id} value={store.name}>
                    {store.name}
                  </option>
                ))}
              </select>

              <button>검색</button>
            </div>
          </div>

          <table className={styles.inventoryTable}>
            <thead>
              <tr>
                <th>점포명</th>
              </tr>
            </thead>
            <tbody>
              {filteredStores.map((store) => (
                <tr key={store.id}>
                  <td>{store.name}</td>
                </tr>
              ))}
            </tbody>
          </table>
          </div>


          {/* <div className={styles.rightPanel}>
            <div id="kakao-map" className={styles.mapArea}></div>
          </div> */}
        </div>
      </div>
    </div>

  );
};

export default FindStore;
