import React, { useEffect, useState } from "react";
import FindstoreSidebar from './FindStoreSidebar';
import styles from "./OtherStoreInven.module.css";
import { useAtomValue } from 'jotai';
import { accessTokenAtom } from '/src/atoms';
import { useRef } from 'react';
import { myAxios } from "/src/config";

const getDistance = (lat1, lng1, lat2, lng2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) * Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const FindStore = () => {
  const [ingredientSearch, setIngredientSearch] = useState("");
  const [userLocation, setUserLocation] = useState(null);
  const [map, setMap] = useState(null);
  const [radius, setRadius] = useState(5); // 사용자가 선택 가능하게 변경
  const [filteredStores, setFilteredStores] = useState([]);
  const [storeData, setStoreData] = useState([]);
  const [isFallback, setIsFallback] = useState(false); // fallback 여부 상태
  const markersRef = useRef([]);
  const token = useAtomValue(accessTokenAtom);

  useEffect(() => {
    if (!token || !userLocation) return; 
    const axios = myAxios(token);

    const fetchStores = async () => {
      try {
        const response = await axios.get("/store/nearby-inventory", {
        params: {
          lat: userLocation.lat,
          lng: userLocation.lng,
          radiusKm: radius,
        }
      });
        setStoreData(response.data);
        console.log("서버 응답:", response.data); 
      } catch (err) {
        console.error("매장 정보 가져오기 실패:", err);
      }
    };

    fetchStores();
  }, [token, userLocation, radius]);

  useEffect(() => {
    console.log("📍 위치 요청 useEffect 실행");
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
        },
        (error) => {
          console.error("위치 정보 가져오기 실패", error);
        }
      );
    }
  }, []);

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
    if (!userLocation) return;

    // 모든 매장에 대해 거리 계산
    const storesWithDistance = storeData.map((store) => ({
      ...store,
      distance: getDistance(userLocation.lat, userLocation.lng, store.lat, store.lng),
    }));

    // 반경 내 매장 필터
    const nearby = storesWithDistance.filter((s) => s.distance <= radius);

    let result;
    // fallback 로직 주석 처리 또는 수정
      if (nearby.length > 0) {
        result = nearby;
        setIsFallback(false);
      } else {
        // fallback 없이 전체 매장 보여주기
        result = storesWithDistance; // 3개 제한 없음
        setIsFallback(false);        // fallback 안내도 끔
      }


    // 검색어 필터
    const final = result.filter(store =>
      (store.storeName || '').toLowerCase().includes(ingredientSearch.toLowerCase()) ||
      (store.ingredientName || '').toLowerCase().includes(ingredientSearch.toLowerCase())
    );

    setFilteredStores(final);
  }, [userLocation, ingredientSearch, radius, storeData]);

 useEffect(() => {
  console.log("🧪 마커 useEffect 실행됨");
  if (!map) {return;}
  if (!filteredStores || filteredStores.length === 0) {return; }

  // 마커 제거
  markersRef.current.forEach(marker => marker.setMap(null));
  markersRef.current = [];

  map.setLevel(6);
  map.setCenter(
    new window.kakao.maps.LatLng(userLocation?.lat || 37.4812, userLocation?.lng || 126.9526)
  );

  // 중복 제거
  const uniqueStoresMap = new Map();
  filteredStores.forEach((store) => {
    if (!uniqueStoresMap.has(store.storeId)) {
      uniqueStoresMap.set(store.storeId, store);
    }
  });
  const uniqueStores = Array.from(uniqueStoresMap.values());

  uniqueStores.forEach((store) => {
    if (!store.lat || !store.lng) {
      console.warn("❗ 위도/경도 누락된 매장:", store);
      return;
    }

    const marker = new window.kakao.maps.Marker({
      map,
      position: new window.kakao.maps.LatLng(store.lat, store.lng),
      title: store.storeName,
    });
    markersRef.current.push(marker);
  });

}, [map, filteredStores]);


  return (
    <div className={styles.wrapper}>
      <FindstoreSidebar />
      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <h2>내 위치 기반 매장 재고 조회</h2>
        </div>
        <div className={styles.mainArea}>
          <div className={styles.leftPanel}>
            <div className={styles.filters}>
              <div className={styles.filterRow}>
                <input
                  type="text"
                  placeholder="재료명 또는 점포명"
                  value={ingredientSearch}
                  onChange={(e) => setIngredientSearch(e.target.value)}
                />
              </div>
              <div className={styles.filterRow}>
                <label>검색 반경 (km): </label>
                <select value={radius} onChange={(e) => setRadius(Number(e.target.value))}>
                  <option value={3}>3km</option>
                  <option value={5}>5km</option>
                  <option value={10}>10km</option>
                  <option value={999}>전체</option>
                </select>
              </div>
            </div>
            {isFallback && (
              <div className={styles.notice}>
                <p>※ 반경 내 매장이 없어 가장 가까운 매장 3개를 표시합니다.</p>
              </div>
            )}
            <div className={styles.tableWrapper}>
            <table className={styles.inventoryTableHeader}>
              <thead>
                <tr>
                  <th>점포명</th>
                  <th>재료명</th>
                  <th>재고량</th>
                </tr>
              </thead>
            </table>
            <div className={styles.scrollBody}>
              <table className={styles.inventoryTable}>
                <tbody>
                  {filteredStores.map((store) => (
                    <tr key={`${store.storeId}-${store.ingredientId}`}>
                      <td>{store.storeName}</td>
                      <td>{store.ingredientName}</td>
                      <td>{store.totalQuantity}{store.unit}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
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