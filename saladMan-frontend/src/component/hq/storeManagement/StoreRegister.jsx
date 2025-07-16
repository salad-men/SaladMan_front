import EmpSidebar from "./EmpSidebar";
import styles from "./StoreRegister.module.css";
import { useEffect, useRef, useState } from "react";
import DaumPostcode from "react-daum-postcode";
import { Modal } from "antd";
import { useNavigate } from "react-router-dom";
import { myAxios } from "/src/config.jsx";
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "/src/atoms";

export default function StoreRegister() {
    const mapContainerRef = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const [store, setStore] = useState({
        storeName: '', address: '', detailAddress: '',
        phoneNumber: '', storeAccount: '', storePassword: '',
        region: '', deliveryDay: ''
    });
    const [coords, setCoords] = useState({ lat: 37.5665, lng: 126.9780 }); 
    const [storeNameChecked, setStoreNameChecked] = useState(false);
    const [usernameChecked, setUsernameChecked] = useState(false);
    const [isStoreNameValid, setIsStoreNameValid] = useState(null);
    const [isUsernameValid, setIsUsernameValid] = useState(null);

    const token = useAtomValue(accessTokenAtom);
    const navigate = useNavigate();

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

    const edit = (e) => {
        setStore({ ...store, [e.target.name]: e.target.value });
    };

    useEffect(() => {
        if (!window.kakao || !window.kakao.maps || !mapContainerRef.current) return;
        const container = mapContainerRef.current;
        const options = {
            center: new window.kakao.maps.LatLng(coords.lat, coords.lng),
            level: 3
        };
        const map = new window.kakao.maps.Map(container, options);
        const marker = new window.kakao.maps.Marker({
            position: new window.kakao.maps.LatLng(coords.lat, coords.lng)
        });
        marker.setMap(map);
    }, [coords]);

    useEffect(() => {
        setStoreNameChecked(false);
        setIsStoreNameValid(null);
    }, [store.storeName]);
    useEffect(() => {
        setUsernameChecked(false);
        setIsUsernameValid(null);
    }, [store.storeAccount]);

    const completeHandler = (data) => {
        const { address, sido } = data;
        const region = simplifySidoToRegion(sido);
        setStore({ ...store, address, region });
        setIsOpen(false);

        if (window.kakao && window.kakao.maps) {
            const geocoder = new window.kakao.maps.services.Geocoder();
            geocoder.addressSearch(address, function (result, status) {
                if (status === window.kakao.maps.services.Status.OK) {
                    setCoords({ lat: parseFloat(result[0].y), lng: parseFloat(result[0].x) });
                }
            });
        }
    };
    const closeHandler = () => setIsOpen(false);

    const checkStoreName = async () => {
        if (!store.storeName) return alert("매장이름을 입력해주세요.");
        try {
            const axiosInstance = myAxios(token);
            const res = await axiosInstance.get(`/hq/checkStorename`, {
                params: { name: store.storeName }
            });
            setIsStoreNameValid(!res.data);
            if (res.data) {
                alert("이미 사용 중인 매장이름입니다.");
                setStoreNameChecked(false);
            } else {
                alert("사용 가능한 매장이름입니다.");
                setStoreNameChecked(true);
            }
        } catch (err) {
            alert("매장이름 중복 확인 중 오류");
            setStoreNameChecked(false);
        }
    };

    const checkUsername = async () => {
        if (!store.storeAccount) return alert("아이디를 입력해주세요.");
        try {
            const axiosInstance = myAxios(token);
            const res = await axiosInstance.get(`/hq/checkUsername`, {
                params: { username: store.storeAccount }
            });
            setIsUsernameValid(!res.data);
            if (res.data) {
                alert("이미 사용 중인 아이디입니다.");
                setUsernameChecked(false);
            } else {
                alert("사용 가능한 아이디입니다.");
                setUsernameChecked(true);
            }
        } catch (err) {
            alert("아이디 중복 확인 중 오류");
            setUsernameChecked(false);
        }
    };

    const registerStore = async (e) => {
        e.preventDefault();
        if (!storeNameChecked) return alert("매장이름 중복 확인을 해주세요.");
        if (!usernameChecked) return alert("아이디 중복 확인을 해주세요.");
        const payload = {
            name: store.storeName,
            address: store.address + ' ' + store.detailAddress,
            phoneNumber: store.phoneNumber,
            username: store.storeAccount,
            password: store.storePassword,
            location: store.region,
            latitude: coords.lat,
            longitude: coords.lng,
            deliveryDay: store.deliveryDay
        };
        try {
            const axiosInstance = myAxios(token);
            const response = await axiosInstance.post("/hq/storeRegister", payload);
            console.log("등록 응답:", response.data);

            if (response.data && response.data.success) {
                alert("매장 등록 완료");
                navigate(`/hq/storeAccountDetail?id=${response.data.id}`);
            } else {
                alert("등록 실패");
            }
        } catch (error) {
            alert("서버 오류 발생");
        }
    };

    return (
        <div className={styles.storeRegisterContainer}>
            <EmpSidebar />
            <div className={styles.regMainContent}>
                <h2 className={styles.title}>매장 등록</h2>
                <form className={styles.regFormSection} onSubmit={registerStore} autoComplete="off">
                      <div className={styles.innerFlexRow}>

                <div className={styles.regFormBox}>
                    {/* 매장 이름 */}
                    <div className={styles.formRow}>
                    <label htmlFor="storeName">매장이름</label>
                    <div className={styles.flexRow}>
                        <input
                        type="text"
                        name="storeName"
                        value={store.storeName}
                        onChange={edit}
                        className={[
                            styles.inputBase,
                            styles.longInput,
                            isStoreNameValid === false
                            ? styles.inputFalse
                            : isStoreNameValid === true
                            ? styles.inputSuccess
                            : "",
                        ].join(" ")}
                        autoComplete="off"
                        />
                        <button type="button" className={styles.checkButtonSmall} onClick={checkStoreName}>중복확인</button>
                    </div>
                    </div>
                    {/* 주소/상세주소 */}
                    <div className={styles.formRow}>
                    <label htmlFor="address">매장위치</label>
                    <div className={styles.flexRow}>
                        <input
                        type="text"
                        name="address"
                        value={store.address}
                        autoComplete="off"
                        placeholder="주소"
                        onChange={edit}
                        readOnly
                        className={[styles.inputBase, styles.longInput].join(" ")}
                        />
                        <button
                        type="button"
                        className={styles.checkButtonSmall}
                        onClick={() => setIsOpen(true)}
                        >검색</button>
                    </div>
                    </div>
                    <div className={styles.formRow}>
                    <label></label>
                    <input
                        type="text"
                        name="detailAddress"
                        value={store.detailAddress}
                        placeholder="상세주소"
                        onChange={edit}
                        className={[styles.inputBase, styles.longInput].join(" ")}
                    />
                    </div>
                    {/* 전화번호 */}
                    <div className={styles.formRow}>
                    <label htmlFor="phoneNumber">전화번호</label>
                    <input
                        type="text"
                        name="phoneNumber"
                        value={store.phoneNumber}
                        placeholder="예: 02-123-4567"
                        onChange={edit}
                        className={[styles.inputBase, styles.longInput].join(" ")}
                    />
                    </div>
                    {/* 배송소요일자 */}
                    <div className={styles.formRow}>
                    <label htmlFor="deliveryDay">배송소요일자</label>
                    <div className={styles.flexRow}>
                        <input
                        type="text"
                        name="deliveryDay"
                        value={store.deliveryDay}
                        onChange={edit}
                        className={[styles.inputBase, styles.shortInput].join(" ")}
                        />
                        <span className={styles.dayLabel}>일</span>
                    </div>
                    </div>
                    {/* 매장 계정 */}
                    <div className={styles.formRow}>
                    <label htmlFor="storeAccount">매장 계정</label>
                    <div className={styles.flexRow}>
                        <input
                        type="text"
                        name="storeAccount"
                        value={store.storeAccount}
                        placeholder="아이디"
                        onChange={edit}
                        className={[
                            styles.inputBase,
                            styles.longInput,
                            isUsernameValid === false
                            ? styles.inputFalse
                            : isUsernameValid === true
                            ? styles.inputSuccess
                            : "",
                        ].join(" ")}
                        />
                        <button type="button" className={styles.checkButtonSmall} onClick={checkUsername}>중복확인</button>
                    </div>
                    </div>
                    {/* 비밀번호 */}
                    <div className={styles.formRow}>
                    <label htmlFor="storePassword">비밀번호</label>
                    <div className={styles.flexRow}>
                        <input
                        type="password"
                        name="storePassword"
                        value={store.storePassword}
                        placeholder="비밀번호"
                        onChange={edit}
                        className={[styles.inputBase, styles.passwordInput].join(" ")}
                        />
                    </div>
                    </div>
                </div>
                <div className={styles.mapBox}>
                    <div ref={mapContainerRef} className={styles.kakaoMap} />
                </div>
                </div>
                <div className={styles.buttonGroup}>
                <button type="button" className={styles.backButton} onClick={() => navigate("/hq/storeAccount")}>목록</button>
                <button type="submit" className={styles.submitButton}>저장</button>
                </div>
                </form>

            </div>
            {isOpen &&
                <Modal title="주소입력" open={isOpen} footer={null} onCancel={closeHandler}>
                    <DaumPostcode onComplete={completeHandler} onClose={closeHandler} />
                </Modal>
            }
        </div>
    );
}
