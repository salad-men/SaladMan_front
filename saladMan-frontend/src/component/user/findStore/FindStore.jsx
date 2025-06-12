// src/components/FindStore.jsx
import React, { useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import styles from "./FindStore.module.css";

const storeData = [
  {
    id: 1,
    name: "샐러드맨 낙성대점",
    address: "서울 관악구 남부순환로 1946 건도빌딩",
    lat: 37.4781,
    lng: 126.9637,
  },
  {
    id: 2,
    name: "샐러드맨 신월중점",
    address: "서울 양천구 신월동",
    lat: 37.5312,
    lng: 126.8462,
  },
  {
    id: 3,
    name: "샐러드맨 서울대입구점",
    address: "서울 관악구 관악로 144-1",
    lat: 37.4786,
    lng: 126.9526,
  },
  {
    id: 4,
    name: "샐러드맨 선유도역점",
    address: "서울 영등포구 양평로21길 4",
    lat: 37.5371,
    lng: 126.8939,
  },
];

const FindStore = () => {
  const [search, setSearch] = useState("");

  const filteredStores = storeData.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className={styles.container}>
      {/* 지도 영역 */}
      <div className={styles.mapSection}>
        <Map
          center={{ lat: 37.4812, lng: 126.9526 }}
          style={{ width: "100%", height: "100%" }}
          level={6}
          id="kakao-map"
        >
          {filteredStores.map((store) => (
            <MapMarker
              key={store.id}
              position={{ lat: store.lat, lng: store.lng }}
              title={store.name}
            />
          ))}
        </Map>
        
      </div>

      {/* 리스트 영역 */}
      <div className={styles.listSection}>
        <h2 className={styles.title}>매장 검색</h2>
        <input
          type="text"
          placeholder="지역 또는 매장 이름을 검색해 주세요"
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul>
          {filteredStores.map((store) => (
            <li key={store.id} className={styles.storeItem}>
              <div className={styles.storeTitle}>{store.name}</div>
              <div className={styles.storeAddress}>{store.address}</div>
              <button className={styles.directionsButton}>길찾기</button>
            </li>
          ))}
        </ul>
      </div>
    </div>
    
  );
};

export default FindStore;
