import EmpSidebar from "./EmpSidebar"
import "./StoreRegister.css"
import { useEffect, useRef, useState } from "react";
import DaumPostcode from "react-daum-postcode";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { Modal, Button } from "antd";
import { useNavigate } from "react-router";

export default function StoreRegister() {

    const mapContainerRef = useRef();
    const [isOpen, setIsOpen] = useState(false);
    const [store, setStore] = useState({ storeName: '', address: '', detailAddress: '', phoneNumber: '', storeAccount: '', storePassword: '' });
    const [coords, setCoords] = useState({ lat: 37.5665, lng: 126.9780 }); // 기본값: 서울시청
    const [isMapReady, setIsMapReady] = useState(false);


    const edit = (e) => {
        setStore({ ...store, [e.target.name]: e.target.value });
    }
    const navigate = useNavigate();
    const themeObj = {
        bgColor: "", 			// 바탕 배경색
        searchBgColor: "", 		// 검색창 배경색
        contentBgColor: "", 		// 본문 배경색(검색결과,결과없음,첫화면,검색서제스트)
        pageBgColor: "", 		// 페이지 배경색
        textColor: "", 			// 기본 글자색
        queryTextColor: "", 		// 검색창 글자색
        postcodeTextColor: "", 	// 우편번호 글자색
        emphTextColor: "", 		// 강조 글자색
        outlineColor: "" 		// 테두리
    };

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


    const completeHandler = (data) => {
        const { address } = data;
        setStore({ ...store, address: address });
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


    return (
        <>


                <div className="storeRegisterContainer">
                <EmpSidebar />
                    <div className="mainContent">
                        <h2>매장 등록</h2>
                        <div className="formSection">
                            <table className="registerTable">
                                <tbody>
                                    <tr>
                                        <td>매장이름</td>
                                        <td><input type="text" name="storeName" onChange={edit} /></td>
                                    </tr>
                                    <tr>
                                        <td>매장위치</td>
                                        <td><input type="button" value="주소 찾기" onClick={() => setIsOpen(!isOpen)} /><br />
                                            <input type="text" id="address" name="address" placeholder="주소" value={store.address} onChange={edit} /><br />
                                            <input type="text" id="detailAddress" name="detailAddress" placeholder="상세주소" onChange={edit} />
                                        </td>
                                    </tr>
                                    <tr>
                                        <td>매장 전화번호</td>
                                        <td><input type="text" name="phoneNumber" placeholder="예: 02-123-4567" onChange={edit} /></td>
                                    </tr>
                                    <tr>
                                        <td>매장 계정</td>
                                        <td>
                                            <input type="text" name="storeAccount" placeholder="아이디" onChange={edit} />
                                            <input type="password" name="storePassword" placeholder="비밀번호" onChange={edit} />
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className="mapBox">
                                <div
                                    ref={mapContainerRef}
                                    style={{ width: '500px', height: '400px' }}
                                ></div>
                            </div>

                        </div>

                        <div className="submitSection">
                            <button className="submitButton">저장</button>
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