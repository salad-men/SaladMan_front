import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { myAxios } from "/src/config";
import EmpSidebar from "./EmpSidebar";
import styles from "./StoreAccountDetail.module.css";
import { CustomOverlayMap, Map, MapMarker } from "react-kakao-maps-sdk";
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "/src/atoms";

export default function StoreAccountDetail() {
    const [store, setStore] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();

    const token = useAtomValue(accessTokenAtom);
    const id = new URLSearchParams(location.search).get("id");

    useEffect(() => {
        if(!token) return;

        const fetchStoreDetail = async () => {
            try {
                const res = await myAxios(token).get("/hq/storeAccountDetail", {
                    params: { id }
                });
                setStore(res.data);
            } catch (err) {
                console.error("매장 정보 로드 실패", err);
            }
        };

        fetchStoreDetail();
    }, [token]);

    if (!store) return <div>로딩 중...</div>;

    return (
        <div className={styles.storeDetailContainer}>
            <EmpSidebar />
            <div className={styles.storeDetailContent}>
                <h2>매장 상세 정보</h2>

                <div className={styles.detailLayout}>
                    <div className={styles.detailGrid}>
                        <div className={styles.item}>
                            <span className={styles.label}>지역</span>
                            <span className={styles.value}>{store.location}</span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.label}>매장명</span>
                            <span className={styles.value}>{store.name}</span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.label}>주소</span>
                            <span className={styles.value}>{store.address}</span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.label}>전화번호</span>
                            <span className={styles.value}>{store.phoneNumber}</span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.label}>오픈시간</span>
                            <span className={styles.value}>{store.openTime}</span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.label}>마감시간</span>
                            <span className={styles.value}>{store.closeTime}</span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.label}>휴무일</span>
                            <span className={styles.value}>{store.breakDay}</span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.label}>개업일</span>
                            <span className={styles.value}>{store.createdAt?.slice(0, 10)}</span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.label}>운영여부</span>
                            <span className={styles.value}>{store.closedAt ? store.closedAt.slice(0, 10) : "운영 중"}</span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.label}>자동발주</span>
                            <span className={styles.value}>{store.autoOrderEnabled ? "활성화" : "비활성화"}</span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.label}>배달소요일수</span>
                            <span className={styles.value}>{store.deliveryDay ? `${store.deliveryDay}일` : "미설정"}</span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.label}>계정</span>
                            <span className={styles.value}>{store.username}</span>
                        </div>
                    </div>

                    {store.latitude && store.longitude && (
                        <div className={styles.mapBox}>
                            <Map // 지도를 표시할 Container
                                center={{ lat: store.latitude, lng: store.longitude }}
                                style={{
                                    // 지도의 크기
                                    width: "100%",
                                    height: "450px",
                                }}
                                level={4} // 지도의 확대 레벨
                            >
                                <MapMarker // 마커를 생성합니다
                                    position={{ lat: store.latitude, lng: store.longitude }}

                                />
                                {/* <CustomOverlayMap
                                    position={{ lat: store.latitude, lng: store.longitude }}
                                    yAnchor={1}
                                >
                                    <div style={{
                                        position: "relative",
                                        display: "inline-block"
                                    }}>
                                        <div style={{
                                            background: "#888",
                                            padding: "6px 12px",
                                            borderRadius: "8px",
                                            fontSize: "14px",
                                            fontWeight: "500",
                                            color: "#333",
                                            whiteSpace: "nowrap",
                                            position: "relative",
                                            zIndex: 2
                                        }}>
                                            {store.name}
                                        </div>

                                        <div style={{
                                            width: 10,
                                            height: 10,
                                            backgroundColor: "#888",
                                            borderLeft: "1px solid #ddd",
                                            borderBottom: "1px solid #ddd",
                                            transform: "rotate(45deg)",
                                            position: "absolute",
                                            top: "100%",
                                            left: "50%",
                                            transformOrigin: "center",
                                            marginLeft: -5,
                                            marginTop: -5,
                                            zIndex: 1
                                        }}></div>
                                    </div>
                                </CustomOverlayMap> */}
                            </Map>
                        </div>
                    )}
                </div>
                <div className={styles.buttonGroup}>
                    <button className={styles.modifyButton} onClick={() => navigate(`/hq/storeModify?id=${id}`)}>수정</button>
                    <button className={styles.backButton} onClick={() => navigate(-1)}>목록으로</button>
                </div>
            </div>
        </div>
    );
}