// src/components/FindStore.jsx
import React, { useState, useEffect } from "react";
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
  const [map, setMap] = useState(null);

  const filteredStores = storeData.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase())
  );

  useEffect(() => {
    if (window.kakao && window.kakao.maps) {
      const container = document.getElementById("kakao-map");
      const options = {
        center: new window.kakao.maps.LatLng(37.4812, 126.9526),
        level: 6,
      };
      const kakaoMap = new window.kakao.maps.Map(container, options);
      setMap(kakaoMap);
    }
  }, []);

  useEffect(() => {
    if (map) {
      filteredStores.forEach((store) => {
        new window.kakao.maps.Marker({
          map,
          position: new window.kakao.maps.LatLng(store.lat, store.lng),
          title: store.name,
        });
      });
    }
  }, [map, filteredStores]);

  return (
    <div className={styles.container}>
      {/* 지도 영역 */}
      <div className={styles.mapSection}>
        <div id="kakao-map" style={{ width: "100%", height: "100%" }}></div>
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
              <button
                className={styles.directionsButton}
                onClick={() =>
                  window.open(
                    `https://map.kakao.com/link/to/${store.name},${store.lat},${store.lng}`,
                    "_blank"
                  )
                }
              >
                길찾기
              </button>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default FindStore;
