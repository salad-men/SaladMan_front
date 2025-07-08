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

    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [newPasswordInput, setNewPasswordInput] = useState("");
    const [adminPasswordInput, setAdminPasswordInput] = useState("");

    const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
    const [closedDateInput, setClosedDateInput] = useState(new Date().toISOString().slice(0, 10));

    const token = useAtomValue(accessTokenAtom);
    const id = new URLSearchParams(location.search).get("id");

    useEffect(() => {
        if (!token) return;

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

    const handleResetPassword = async () => {
        // 1차 확인
        if (!window.confirm("정말 이 계정의 비밀번호를 재설정하시겠습니까?")) return;

        // 새 비밀번호 입력
        const newPassword = prompt("새 비밀번호를 입력하세요");
        if (!newPassword) return;

        try {
            await myAxios(token).post("/hq/resetStorePassword", {
                id,
                adminPassword: adminPasswordInput,
                newPassword: newPasswordInput
            });
            alert("비밀번호가 성공적으로 변경되었습니다.");
        } catch (err) {
            console.error("비밀번호 재설정 실패", err);
            alert("비밀번호 재설정 중 오류가 발생했습니다.");
        }
    };
    const handleCloseStore = async () => {
        if (!window.confirm("이 매장을 폐업 처리하시겠습니까?")) return;

        try {
            await myAxios(token).post("/hq/closeStore", {
                id,
                closedAt: new Date().toISOString()
            });
            alert("폐업 처리 완료");
            navigate("/hq/storeAccountList");
        } catch (err) {
            console.error("폐업 처리 실패", err);
            alert("폐업 처리 중 오류가 발생했습니다.");
        }
    };

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
                        <div className={styles.item} style={{ flexDirection: "row", alignItems: "center" }}>
                            <div>
                                <span className={styles.label}>운영여부</span>
                                <span className={styles.value}>
                                    {store.closedAt ? store.closedAt.slice(0, 10) : "운영 중"}
                                </span>
                            </div>
                            <button
                                className={styles.closeStoreButton}
                                onClick={() => setIsCloseModalOpen(true)}
                            >
                                폐업 처리
                            </button>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.label}>자동발주</span>
                            <span className={styles.value}>{store.autoOrderEnabled ? "활성화" : "비활성화"}</span>
                        </div>
                        <div className={styles.item}>
                            <span className={styles.label}>배달소요일수</span>
                            <span className={styles.value}>{store.deliveryDay ? `${store.deliveryDay}일` : "미설정"}</span>
                        </div>
                        <div className={styles.item} style={{ flexDirection: "row", alignItems: "center" }}>
                            <div>
                                <span className={styles.label}>계정</span>
                                <span className={styles.value}>{store.username}</span>
                            </div>
                            <button
                                className={styles.resetPasswordButton}
                                onClick={() => setIsResetModalOpen(true)}
                            >
                                비밀번호 재설정
                            </button>
                        </div>
                    </div>
                    {store.latitude && store.longitude && (
                        <div className={styles.mapBox}>
                            <Map // 지도를 표시할 Container
                                center={{ lat: store.latitude, lng: store.longitude }}
                                style={{
                                    // 지도의 크기
                                    width: "100%",
                                    height: "555px",
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

            {isResetModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>🔒 비밀번호 재설정</h3>
                        <p>관리자 비밀번호와 새 비밀번호를 입력하세요.</p>
                        <div className={styles.modalForm}>
                            <label>관리자 비밀번호</label>
                            <input
                                type="password"
                                value={adminPasswordInput}
                                onChange={(e) => setAdminPasswordInput(e.target.value)}
                                className={styles.modalInput}
                                placeholder="관리자 비밀번호"
                            />
                            <label>새 비밀번호</label>
                            <input
                                type="password"
                                value={newPasswordInput}
                                onChange={(e) => setNewPasswordInput(e.target.value)}
                                className={styles.modalInput}
                                placeholder="새 비밀번호 (8자리 이상)"
                            />
                        </div>
                        <div className={styles.modalButtons}>
                            <button
                                onClick={() => {
                                    setIsResetModalOpen(false);
                                    setNewPasswordInput("");
                                    setAdminPasswordInput("");
                                }}
                                className={styles.cancelButton}
                            >
                                취소
                            </button>
                            <button
                                onClick={async () => {
                                    if (!adminPasswordInput) {
                                        alert("관리자 비밀번호를 입력하세요.");
                                        return;
                                    }
                                    if (newPasswordInput.length < 8) {
                                        alert("새 비밀번호는 8자리 이상이어야 합니다.");
                                        return;
                                    }
                                    if (!window.confirm("정말 비밀번호를 재설정하시겠습니까?")) return;

                                    try {
                                        await myAxios(token).post("/hq/resetStorePassword", {
                                            id,
                                            adminPassword: adminPasswordInput,
                                            newPassword: newPasswordInput
                                        });
                                        alert("비밀번호가 성공적으로 변경되었습니다.");
                                        setAdminPasswordInput("");
                                        setNewPasswordInput("");
                                        setIsResetModalOpen(false);
                                    } catch (err) {
                                        console.error("비밀번호 재설정 실패", err);
                                        alert("비밀번호 재설정 중 오류가 발생했습니다.");
                                    }
                                }}
                                className={styles.confirmButton}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isCloseModalOpen && (
                <div className={styles.modalOverlay}>
                    <div className={styles.modalContent}>
                        <h3>🏚️ 폐업 처리</h3>
                        <p>폐업일을 선택하세요.</p>
                        <div className={styles.modalForm}>
                            <label>폐업일</label>
                            <input
                                type="date"
                                value={closedDateInput}
                                onChange={(e) => setClosedDateInput(e.target.value)}
                                className={styles.modalInput}
                            />
                        </div>
                        <div className={styles.modalButtons}>
                            <button
                                onClick={() => setIsCloseModalOpen(false)}
                                className={styles.cancelButton}
                            >
                                취소
                            </button>
                            <button
                                onClick={async () => {
                                    if (!window.confirm(`선택하신 ${closedDateInput}에 폐업 처리하시겠습니까?`)) return;

                                    try {
                                        await myAxios(token).post("/hq/closeStore", {
                                            id,
                                            closedAt: new Date(closedDateInput).toISOString()
                                        });
                                        alert("폐업 처리 완료");
                                        setIsCloseModalOpen(false);
                                        navigate("/hq/storeAccount");
                                    } catch (err) {
                                        console.error("폐업 처리 실패", err);
                                        alert("폐업 처리 중 오류가 발생했습니다.");
                                    }
                                }}
                                className={styles.confirmButton}
                            >
                                확인
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}