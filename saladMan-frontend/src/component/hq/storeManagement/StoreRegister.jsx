import EmpSidebar from "./EmpSidebar"
import styles from "./StoreRegister.module.css" // ← 변경
import { useEffect, useRef, useState } from "react";
import DaumPostcode from "react-daum-postcode";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { Modal, Button } from "antd";
import { useNavigate } from "react-router";
import { myAxios } from "/src/config.jsx";
import { useAtomValue } from 'jotai';
import { accessTokenAtom } from "/src/atoms";

export default function StoreRegister() {

    const mapContainerRef = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const [store, setStore] = useState({ storeName: '', address: '', detailAddress: '', phoneNumber: '', storeAccount: '', storePassword: '', region: '',deliveryDay:'' });
    const [coords, setCoords] = useState({ lat: 37.5665, lng: 126.9780 }); // 기본값: 서울시청

    const [storeNameChecked, setStoreNameChecked] = useState(false);
    const [usernameChecked, setUsernameChecked] = useState(false);

    const [isStoreNameValid, setIsStoreNameValid] = useState(null); // true, false, null
    const [isUsernameValid, setIsUsernameValid] = useState(null);

    const [isMapReady, setIsMapReady] = useState(false);
    const token = useAtomValue(accessTokenAtom);

    const simplifySidoToRegion = (sido) => {
        const map = {
            "서울특별시": "서울",
            "부산광역시": "부산",
            "대구광역시": "대구",
            "인천광역시": "인천",
            "광주광역시": "광주",
            "대전광역시": "대전",
            "울산광역시": "울산",
            "세종특별자치시": "세종",
            "경기도": "경기",
            "강원특별자치도": "강원",
            "충청북도": "충북",
            "충청남도": "충남",
            "전라북도": "전북",
            "전라남도": "전남",
            "경상북도": "경북",
            "경상남도": "경남",
            "제주특별자치도": "제주"
        };

        return map[sido] || sido;
    }

    const edit = (e) => {
        setStore({ ...store, [e.target.name]: e.target.value });
    }
    const navigate = useNavigate();

    const postCodeStyle = {
        width: '360px',
        height: '480px',
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
        setStore({ ...store, address: address, region: region });
        setIsOpen(false);

        // 주소 → 좌표 변환
        if (window.kakao && window.kakao.maps) {
            const geocoder = new window.kakao.maps.services.Geocoder();

            geocoder.addressSearch(address, function (result, status) {
                if (status === window.kakao.maps.services.Status.OK) {
                    const lat = result[0].y;
                    const lng = result[0].x;
                    setCoords({ lat: parseFloat(lat), lng: parseFloat(lng) });
                }
            });
        }
    };

    const closeHandler = (state) => {
        if (state === 'FORCE_CLOSE') {
            setIsOpen(false);
        } else if (state === 'COMPLETE_CLOSE') {
            setIsOpen(false);
        }
    };

    const checkStoreName = async () => {
        if (!store.storeName) {
            alert("매장이름을 입력해주세요.");
            return;
        }

        try {
            const axiosInstance = myAxios(token);
            const res = await axiosInstance.get(`/hq/checkStorename`, {
                params: { name: store.storeName }
            });
            setIsStoreNameValid(!res.data);

            if (res.data) {
                alert("이미 사용 중인 매장이름입니다.");
                setStoreNameChecked(false);
            }
            else {
                alert("사용 가능한 매장이름입니다.");
                setStoreNameChecked(true);

            }

        } catch (err) {
            console.error(err);
            alert("매장이름 중복 확인 중 오류");
            setStoreNameChecked(false);

        }
    };
    // ✅ 여기에 추가
    useEffect(() => {
        if (!token) return;

        // token이 있을 때 실행할 로직
        console.log("토큰이 준비되어 실행됩니다.", token);

        // 예시: 매장 초기 데이터 불러오기
        // fetchStoreDefaults();
    }, [token]);
    const checkUsername = async () => {
        if (!store.storeAccount) {
            alert("아이디를 입력해주세요.");
            return;
        }

        try {
            const axiosInstance = myAxios(token);
            const res = await axiosInstance.get(`/hq/checkUsername`, {
                params: { username: store.storeAccount }
            });
            setIsUsernameValid(!res.data);
            if (res.data) {
                alert("이미 사용 중인 아이디입니다.");
                setUsernameChecked(false);
            }
            else {
                alert("사용 가능한 아이디입니다.");
                setUsernameChecked(true);

            }

        } catch (err) {
            console.error(err);
            alert("아이디 중복 확인 중 오류");
            setUsernameChecked(false);

        }
    };

    const registerStore = async (e) => {

        e.preventDefault();

        if (!storeNameChecked) {
            alert("매장이름 중복 확인을 해주세요.");
            return;
        }

        if (!usernameChecked) {
            alert("아이디 중복 확인을 해주세요.");
            return;
        }
        const payload = {
            name: store.storeName,
            address: store.address + ' ' + store.detailAddress,
            phoneNumber: store.phoneNumber,
            username: store.storeAccount,
            password: store.storePassword,
            location: store.region,
            latitude: coords.lat,
            longitude: coords.lng,
            deliveryDay:store.deliveryDay
        };
        try {
            const axiosInstance = myAxios(token); // 토큰 없으면 null
            const response = await axiosInstance.post("/hq/storeRegister", payload);

            if (response.data === true) {
                alert("매장 등록 완료");
                navigate("/hq/storeAccount");
            } else {
                alert("등록 실패");
            }
        } catch (error) {
            console.error("등록 오류:", error);
            alert("서버 오류 발생");
        }
    }


 return (
        <>
            <div className={styles.storeRegisterContainer}>
                <EmpSidebar />
                <div className={styles.mainContent}>
                    <h2>매장 등록</h2>
                    <div className={styles.formSection}>
                        <table className={styles.registerTable}>
                            <tbody>
                                <tr>
                                    <td>매장이름</td>
                                    <td>
                                        <input
                                            type="text"
                                            name="storeName"
                                            onChange={edit}
                                            className={
                                                isStoreNameValid === false ? styles.inputFalse :
                                                isStoreNameValid === true ? styles.inputSuccess :
                                                ""
                                            }
                                        />
                                        <button type="button" className={styles.checkButton} onClick={checkStoreName}>중복확인</button>
                                    </td>
                                </tr>
                                <tr>
                                    <td>매장위치</td>
                                    <td>
                                        <input type="text" id="address" name="address" placeholder="주소" value={store.address} onChange={edit} />
                                        <input type="button" value="검색" onClick={() => setIsOpen(!isOpen)} /><br />
                                        <input type="text" id="detailAddress" name="detailAddress" placeholder="상세주소" onChange={edit} />
                                    </td>
                                </tr>
                                <tr>
                                    <td>매장 전화번호</td>
                                    <td><input type="text" name="phoneNumber" placeholder="예: 02-123-4567" onChange={edit} /></td>
                                </tr>
                                <tr>
                                    <td>배송소요일자</td>
                                    <td><input type="text" name="deliveryDay" value={store.deliveryDay} onChange={edit} />일</td>
                                </tr>
                                <tr>
                                    <td>매장 계정</td>
                                    <td>
                                        <input
                                            type="text"
                                            name="storeAccount"
                                            placeholder="아이디"
                                            onChange={edit}
                                            className={
                                                isUsernameValid === false ? styles.inputFalse :
                                                isUsernameValid === true ? styles.inputSuccess :
                                                ""
                                            }
                                        />
                                        <button type="button" className={styles.checkButton} onClick={checkUsername}>중복확인</button>
                                        <input type="password" name="storePassword" placeholder="비밀번호" onChange={edit} />
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                        <div className={styles.mapBox}>
                            <div
                                ref={mapContainerRef}
                                style={{ width: '500px', height: '400px' }}
                            ></div>
                        </div>
                    </div>

                    <div className={styles.submitSection}>
                        <button className={styles.submitButton} onClick={registerStore}>저장</button>
                    </div>
                </div>
            </div>
            {isOpen &&
                <Modal title="주소입력"
                    open={isOpen} footer={null} >
                    <DaumPostcode onComplete={completeHandler} onClose={closeHandler} />
                </Modal>
            }
        </>
    )
}