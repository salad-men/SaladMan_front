import React, { useEffect, useState } from "react";
import FindstoreSidebar from './FindStoreSidebar'
import styles from "./OtherStoreInven.module.css";

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
    const container = document.getElementById("kakao-map");

    const waitForKakao = setInterval(() => {
      if (window.kakao && window.kakao.maps) {
        const options = {
          center: new window.kakao.maps.LatLng(37.4812, 126.9526),
          level: 6,
        };
        const kakaoMap = new window.kakao.maps.Map(container, options);
        setMap(kakaoMap);
        clearInterval(waitForKakao);
      }
    }, 300);

    return () => clearInterval(waitForKakao);
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
    <div className={styles.wrapper}>
      <FindstoreSidebar />
      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <h2>타매장 재고 조회</h2>
        </div>
        <div className={styles.mainArea}>
          <div className={styles.leftPanel}>
            <div className={styles.filters}>
              <div className={styles.filterRow}>
                <label>점포 선택</label>
                <select><option>전체</option></select>
                <select><option>전체품목</option></select>
              </div>
              <div className={styles.filterRow}>
                <input
                  type="text"
                  placeholder="재료명"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
                <button>검색</button>
              </div>
            </div>

            <table className={styles.inventoryTable}>
              <thead>
                <tr>
                  <th>점포명</th>
                  <th>재료명</th>
                  <th>단위</th>
                  <th>재고량</th>
                </tr>
              </thead>
              <tbody>
                {filteredStores.map((store, i) => (
                  <tr key={store.id}>
                    <td>{store.name}</td>
                    <td>로메인</td>
                    <td>g</td>
                    <td>{(i % 2 === 0 ? 400 : 1200)}g</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className={styles.rightPanel}>
            <div id="kakao-map" className={styles.mapArea}></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FindStore;