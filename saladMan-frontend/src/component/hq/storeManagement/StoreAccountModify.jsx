import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { myAxios } from "/src/config";
import EmpSidebar from "./EmpSidebar";
import styles from "./StoreAccountModify.module.css";
import DaumPostcode from "react-daum-postcode";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { Modal } from "antd";
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "/src/atoms";

export default function StoreAccountModify() {
    const [isOpen, setIsOpen] = useState(false);
    const [coords, setCoords] = useState({ lat: 37.5665, lng: 126.9780 });
    const [store, setStore] = useState({
        id: "",
        storeName: "",
        address: "",
        detailAddress: "",
        phoneNumber: "",
        region: "",
        openTime: "",
        closeTime: "",
        breakDay: "",
        deliveryDay: "",
        username: ""
    });
    const location = useLocation();
    const navigate = useNavigate();
    const token = useAtomValue(accessTokenAtom);
    const id = new URLSearchParams(location.search).get("id");
    
    // 주소에서 도로명과 상세주소 분리 (마지막 토큰이 상세주소라고 가정)
    function splitAddress(fullAddress) {
        if (!fullAddress) return { address: '', detailAddress: '' };
        // 마지막 숫자가 상세주소라면 (더 안전하게 하고 싶으면 정규표현식 활용)
        const arr = fullAddress.trim().split(' ');
        if (arr.length < 2) {
            return { address: fullAddress, detailAddress: '' };
        }
        // 상세주소가 꼭 마지막에 온다는 전제 (더 복잡하게 할 수도 있음)
        return {
            address: arr.slice(0, -1).join(' '),
            detailAddress: arr.slice(-1)[0]
        };
    }

    useEffect(() => {
        if (!token || !id) return;
        const fetchStoreDetail = async () => {
            try {
                const res = await myAxios(token).get("/hq/storeAccountDetail", { params: { id } });
                const data = res.data;
                const { address, detailAddress } = splitAddress(data.address);

                setStore({
                    id: data.id || "",
                    storeName: data.name || "",
                    address: address || "",
                    detailAddress: detailAddress || "",
                    phoneNumber: data.phoneNumber || "",
                    region: data.location || "",
                    openTime: data.openTime || "",
                    closeTime: data.closeTime || "",
                    breakDay: data.breakDay || "",
                    deliveryDay: data.deliveryDay || "",
                    username: data.username || "",
                    createdAt: data.createdAt || ""

                });
                setCoords({
                    lat: data.latitude || 37.5665,
                    lng: data.longitude || 126.9780
                });
            } catch (err) {
                alert("매장 정보 로드 실패");
            }
        };
        fetchStoreDetail();
    }, [token, id]);

    const edit = (e) => {
        setStore({ ...store, [e.target.name]: e.target.value });
    };

    const simplifySidoToRegion = (sido) => {
        const map = {
            "서울특별시": "서울", "부산광역시": "부산", "대구광역시": "대구",
            "인천광역시": "인천", "광주광역시": "광주", "대전광역시": "대전",
            "울산광역시": "울산", "세종특별자치시": "세종", "경기도": "경기",
            "강원특별자치도": "강원", "충청북도": "충북", "충청남도": "충남",
            "전라북도": "전북", "전라남도": "전남", "경상북도": "경북",
            "경상남도": "경남", "제주특별자치도": "제주"
        };
        return map[sido] || sido;
    };

    const completeHandler = (data) => {
        const { address, sido } = data;
        const region = simplifySidoToRegion(sido);
        setStore({ ...store, address, region });
        setIsOpen(false);

        // 좌표 변환
        if (window.kakao && window.kakao.maps) {
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.addressSearch(address, function (result, status) {
                if (status === window.kakao.maps.services.Status.OK) {
                    setCoords({ lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) });
                }
            });
        }
    };

    // 저장
    const updateStore = async (e) => {
        e.preventDefault();
        const payload = {
            id: store.id,
            name: store.storeName,
            address: store.address + ' ' + store.detailAddress,
            phoneNumber: store.phoneNumber,
            username: store.username,
            location: store.region,
            latitude: coords.lat,
            longitude: coords.lng,
            openTime: store.openTime,
            closeTime: store.closeTime,
            breakDay: store.breakDay,
            deliveryDay: store.deliveryDay
        };
        try {
            const axiosInstance = myAxios(token);
            const response = await axiosInstance.post("/hq/storeUpdate", payload);

            if (response.data === true) {
                alert("매장 수정 완료");
                navigate(`/hq/storeAccountDetail?id=${id}`);
            } else {
                alert("수정 실패");
            }
        } catch (error) {
            alert("서버 오류 발생");
        }
    };



    return (
        <div className={styles.storeDetailContainer}>
            <EmpSidebar />
            <div className={styles.detailMainContent}>
                <h2 className={styles.title}>매장 정보 수정</h2>
                <div className={styles.detailCard}>
                    <div className={styles.infoMapRow}>
                        <form className={styles.detailInfoGrid} onSubmit={updateStore} autoComplete="off">
                            <ModifyItem label="지역">
                                <input type="text" name="region" value={store.region} onChange={edit} className={styles.inputBase} disabled />
                            </ModifyItem>
                            <ModifyItem label="매장명">
                                <input type="text" name="storeName" value={store.storeName} onChange={edit} className={styles.inputBase} />
                            </ModifyItem>
                            <ModifyItem label="주소" wide>
                            <input
                                type="text"
                                name="address"
                                value={store.address}
                                className={`${styles.inputBase} ${styles.addressInput}`}
                                readOnly
                            />
                            <button type="button" className={styles.checkButton} onClick={() => setIsOpen(true)}>검색</button>
                        </ModifyItem>
                        <ModifyItem label="상세주소" wide>
                            <input
                                type="text"
                                name="detailAddress"
                                value={store.detailAddress}
                                onChange={edit}
                                className={styles.inputBase}
                                placeholder="상세주소"
                            />
                        </ModifyItem>

                            <ModifyItem label="전화번호">
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    value={store.phoneNumber}
                                    onChange={edit}
                                    className={styles.inputBase}
                                />
                            </ModifyItem>
                            <ModifyItem label="오픈시간">
                                <input
                                    type="text"
                                    name="openTime"
                                    value={store.openTime}
                                    onChange={edit}
                                    className={styles.inputBase}
                                />
                            </ModifyItem>
                            <ModifyItem label="마감시간">
                                <input
                                    type="text"
                                    name="closeTime"
                                    value={store.closeTime}
                                    onChange={edit}
                                    className={styles.inputBase}
                                />
                            </ModifyItem>
                            <ModifyItem label="휴무일">
                                <input
                                    type="text"
                                    name="breakDay"
                                    value={store.breakDay}
                                    onChange={edit}
                                    className={styles.inputBase}
                                />
                            </ModifyItem>
                            <ModifyItem label="개업일">
                                <input
                                    type="text"
                                    value={store.createdAt?.slice(0, 10) || ""}
                                    className={styles.inputBase}
                                    disabled
                                />
                            </ModifyItem>
                            <ModifyItem label="배달소요일수">
                                <input
                                    type="text"
                                    name="deliveryDay"
                                    value={store.deliveryDay}
                                    onChange={edit}
                                    className={styles.inputBase}
                                    style={{ width: "70px" }}
                                />
                                <span style={{ marginLeft: "4px" }}>일</span>
                            </ModifyItem>
                            <ModifyItem label="계정" wide>
                                <input
                                    type="text"
                                    name="username"
                                    value={store.username}
                                    className={styles.inputBase}
                                    disabled
                                />
                            </ModifyItem>
                        </form>
                        <div className={styles.mapBox}>
                            <Map
                                center={coords}
                                style={{ width: "100%", height: "100%" }}
                                level={4}
                            >
                                <MapMarker position={coords} />
                            </Map>
                        </div>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button type="button" className={styles.backButton} onClick={() => navigate("/hq/storeAccount")}>이전</button>
                        <button type="submit" className={styles.modifyButton} onClick={updateStore}>저장</button>
                    </div>
                </div>
                <Modal
                    title="주소입력"
                    open={isOpen}
                    footer={null}
                    onCancel={() => setIsOpen(false)}
                    width={400}
                >
                    <DaumPostcode onComplete={completeHandler} />
                </Modal>
            </div>
        </div>
    );
}

function ModifyItem({ label, children, wide }) {
    return (
        <div className={wide ? styles.detailItemWide : styles.detailItem}>
            <span className={styles.detailLabel}>{label}</span>
            <span className={styles.detailValue}>{children}</span>
        </div>
    );
}
