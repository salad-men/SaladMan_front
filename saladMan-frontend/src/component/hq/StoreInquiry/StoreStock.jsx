import { useEffect, useState } from "react";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import './StoreStock.css'

const StoreStock = () => {
    const [coords, setCoords] = useState({ lat: 37.5665, lng: 126.9780 });
    const [isMapReady, setIsMapReady] = useState(true);

    useEffect(() => {
        let retryCount = 0;
        const maxRetries = 20;

        const checkKakaoLoaded = () => {
            if (window.kakao && window.kakao.maps) {
                console.log('API 로드 완료');
                setIsMapReady(true);
            } else if (retryCount < maxRetries) {
                console.log('API 로드 실패');
                retryCount++;
                if (retryCount > maxRetries) {
                    console.warn("카카오 지도 로딩 실패: 최대 재시도 초과");
                    return;
                }
                setTimeout(checkKakaoLoaded, 100);
            }
        };
        checkKakaoLoaded();
    }, []);

    return (
        <>
            <div className="mapBox">
                {isMapReady && (
                    <Map
                        center={coords}
                        style={{ width: "500px", height: "400px" }}
                        level={3}
                    >
                        <MapMarker position={coords} />
                    </Map>
                )}
            </div>
        </>
    )
}

export default StoreStock;