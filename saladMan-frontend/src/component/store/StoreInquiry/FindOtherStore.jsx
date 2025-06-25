import React, { useEffect, useState } from "react";
import styles from "./FindOtherStore.module.css";
import SidebarInquiry from './SidebarInquiry'

// 거리 계산 함수
const getDistanceFromLatLonInKm = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // km
  const dLat = deg2rad(lat2 - lat1);
  const dLon = deg2rad(lon2 - lon1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(deg2rad(lat1)) *
    Math.cos(deg2rad(lat2)) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const deg2rad = (deg) => deg * (Math.PI / 180);

const FindStore = () => {
  const [stores, setStores] = useState([]);
  const [map, setMap] = useState(null);
  const [selectedLocation, setSelectedLocation] = useState("");
  const [filteredStores, setFilteredStores] = useState([]);
  const [userPosition, setUserPosition] = useState(null);

  //전체 매장 목록 불러오기
  useEffect(() => {
    fetch("/store/findOtherStore")
      .then((res) => res.json())
      .then((data) => setStores(data))
      .catch((err) => console.error("매장 목록 불러오기 실패:", err));
  }, []);

  //카카오맵 초기화
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

  //내 위치 기반 500m 이내 매장 필터링
  useEffect(() => {
    if (!stores.length) return;

    navigator.geolocation.getCurrentPosition((position) => {
      const { latitude, longitude } = position.coords;
      setUserPosition({ lat: latitude, lng: longitude });

      const nearbyStores = stores.filter((store) => {
        const dist = getDistanceFromLatLonInKm(
          latitude,
          longitude,
          store.lat,
          store.lng
        );
        return dist <= 0.5;
      });

      setFilteredStores(nearbyStores);

      if (map) {
        map.setCenter(new window.kakao.maps.LatLng(latitude, longitude));
      }
    });
  }, [stores, map]);

  //지역 선택 시 해당 지역의 매장 목록 필터링
  const handleLocationChange = (e) => {
    const loc = e.target.value;
    setSelectedLocation(loc);
    const filtered = stores.filter((store) => store.location === loc);
    setFilteredStores(filtered);
  };

  //마커 표시
  useEffect(() => {
    if (map && filteredStores.length) {
      filteredStores.forEach((store) => {
        new window.kakao.maps.Marker({
          map,
          position: new window.kakao.maps.LatLng(store.lat, store.lng),
          title: store.name,
        });
      });
    }
  }, [map, filteredStores]);

  // 지역 목록 추출
  const locations = [...new Set(stores.map((s) => s.location))];

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


          <div className={styles.rightPanel}>
            <div id="kakao-map" className={styles.mapArea}></div>
          </div>
        </div>
      </div>
    </div>

  );
};

export default FindStore;
