import React, { useState, useEffect } from "react";
import axios from "axios";
import styles from "./FindStore.module.css";

const FindStore = () => {
  const [search, setSearch] = useState("");
  const [map, setMap] = useState(null);
  const [stores, setStores] = useState([]);
  const [allStores, setAllStores] = useState([]);
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);

  // 페이지별 매장 불러오기 (오른쪽 리스트용)
  useEffect(() => {
    axios
      .get(`http://localhost:8090/user/stores?page=${page}`)
      .then((res) => {
        setStores(res.data.content || []);
        setTotalPages(res.data.totalPages || 0);
      })
      .catch((err) => {
        console.error("❌ 매장 데이터 불러오기 실패:", err);
        setStores([]);
        setTotalPages(0);
      });
  }, [page]);

  // 전체 매장 가져오기 (지도 마커용)
  useEffect(() => {
    axios
      .get("http://localhost:8090/user/stores/all")
      .then((res) => {
        if (!Array.isArray(res.data)) throw new Error("잘못된 데이터 형식");
        setAllStores(res.data);
      })
      .catch((err) => {
        console.error("❌ 전체 매장 마커 데이터 실패:", err);
        setAllStores([]);
      });
  }, []);

  // 검색 필터
  const filteredStores = stores.filter((store) =>
    store.name.toLowerCase().includes(search.toLowerCase())
  );

  // 카카오맵 초기화
  useEffect(() => {
    const container = document.getElementById("kakao-map");
    const waitForKakao = setInterval(() => {
      if (window.kakao && window.kakao.maps) {
        const options = {
          center: new window.kakao.maps.LatLng(37.554722, 126.970833),
          level: 6,
        };
        const kakaoMap = new window.kakao.maps.Map(container, options);
        setMap(kakaoMap);
        clearInterval(waitForKakao);
      }
    }, 300);
    return () => clearInterval(waitForKakao);
  }, []);

  // 전체 매장 마커 찍기
  useEffect(() => {
    if (!map) return;

    const newMarkers = [];

    allStores.forEach((store) => {
      const marker = new window.kakao.maps.Marker({
        map,
        position: new window.kakao.maps.LatLng(store.latitude, store.longitude),
        title: store.name,
      });
      newMarkers.push(marker);
    });

    return () => {
      newMarkers.forEach((marker) => marker.setMap(null));
    };
  }, [map, allStores]);

  // 리스트 항목 클릭 시 지도 이동
  const handleClickStore = (store) => {
    if (map) {
      const moveLatLng = new window.kakao.maps.LatLng(
        store.latitude,
        store.longitude
      );
      map.panTo(moveLatLng);
    }
  };

  return (
    <div className={styles.wrapper}>
      <div className={styles.left}>
        <div id="kakao-map" className={styles.map}></div>
      </div>

      <div className={styles.right}>
        <h2 className={styles.title}>매장 검색</h2>
        <input
          type="text"
          placeholder="매장 이름 또는 지역 검색"
          className={styles.searchInput}
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <ul className={styles.storeList}>
          {filteredStores.map((store) => (
            <li
              key={store.id}
              className={styles.storeItem}
              onClick={() => handleClickStore(store)}
            >
              <div className={styles.storeTitle}>{store.name}</div>
              <div className={styles.storeAddress}>{store.address}</div>
              <button
                className={styles.directionsButton}
                onClick={(e) => {
                  e.stopPropagation();
                  window.open(
                    `https://map.kakao.com/link/to/${store.name},${store.latitude},${store.longitude}`,
                    "_blank"
                  );
                }}
              >
                길찾기
              </button>
            </li>
          ))}
        </ul>
        <div className={styles.pagination}>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={i === page ? styles.activePage : ""}
              onClick={() => setPage(i)}
            >
              {i + 1}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FindStore;
