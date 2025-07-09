import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { myAxios } from "/src/config";
import EmpSidebar from "./EmpSidebar";
import styles from "./StoreAccountDetail.module.css";
import { Map, MapMarker } from "react-kakao-maps-sdk";
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "/src/atoms";

export default function StoreAccountDetail() {
    const [store, setStore] = useState(null);
    const [isResetModalOpen, setIsResetModalOpen] = useState(false);
    const [isCloseModalOpen, setIsCloseModalOpen] = useState(false);
    const [newPasswordInput, setNewPasswordInput] = useState("");
    const [adminPasswordInput, setAdminPasswordInput] = useState("");
    const [closedDateInput, setClosedDateInput] = useState(new Date().toISOString().slice(0, 10));

    const token = useAtomValue(accessTokenAtom);
    const location = useLocation();
    const navigate = useNavigate();
    const id = new URLSearchParams(location.search).get("id");

    useEffect(() => {
        if (!token) return;
        const fetchStoreDetail = async () => {
            try {
                const res = await myAxios(token).get("/hq/storeAccountDetail", { params: { id } });
                setStore(res.data);
            } catch (err) {
                alert("매장 정보 로드 실패");
            }
        };
        fetchStoreDetail();
    }, [token]);

    if (!store) return null; 

    // 비밀번호 재설정
    const handlePasswordReset = async () => {
        if (!adminPasswordInput) return alert("관리자 비밀번호를 입력하세요.");
        if (newPasswordInput.length < 8) return alert("새 비밀번호는 8자리 이상이어야 합니다.");
        if (!window.confirm("정말 비밀번호를 재설정하시겠습니까?")) return;
        try {
            await myAxios(token).post("/hq/resetStorePassword", {
                id,
                adminPassword: adminPasswordInput,
                newPassword: newPasswordInput
            });
            alert("비밀번호가 성공적으로 변경되었습니다.");
            setIsResetModalOpen(false);
            setNewPasswordInput("");
            setAdminPasswordInput("");
        } catch (err) {
            alert("비밀번호 재설정 중 오류가 발생했습니다.");
        }
    };

    // 폐업 처리
    const handleCloseStore = async () => {
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
            alert("폐업 처리 중 오류가 발생했습니다.");
        }
    };

    // 긴 주소 2줄로(최대 32자 기준) 줄바꿈 처리 함수
    function wrapAddress(addr, maxLen = 32) {
        if (!addr || addr.length <= maxLen) return addr;
        const first = addr.slice(0, maxLen);
        const second = addr.slice(maxLen);
        return (
            <>
                {first}
                <br />
                {second}
            </>
        );
    }

    return (
        <div className={styles.storeDetailContainer}>
            <EmpSidebar />
            <div className={styles.detailMainContent}>
                <h2 className={styles.title}>매장 상세정보</h2>
                <div className={styles.detailCard}>
                    <div className={styles.infoMapRow}>
                        {/* 2열 정보 그리드 */}
                        <div className={styles.detailInfoGrid}>
                            <DetailItem label="지역" value={store.location} />
                            <DetailItem label="매장명" value={store.name} />
                            <DetailItem label="주소" value={wrapAddress(store.address)} />
                            <DetailItem label="전화번호" value={store.phoneNumber} />
                            <DetailItem label="오픈시간" value={store.openTime} />
                            <DetailItem label="마감시간" value={store.closeTime} />
                            <DetailItem label="휴무일" value={store.breakDay} />
                            <DetailItem label="개업일" value={store.createdAt?.slice(0, 10)} />
                            <DetailItem label="운영여부" value={store.closedAt ? store.closedAt.slice(0, 10) : "운영 중"}>
                                {!store.closedAt && (
                                    <button className={styles.closeStoreButton} onClick={() => setIsCloseModalOpen(true)}>
                                        폐업 처리
                                    </button>
                                )}
                            </DetailItem>
                            <DetailItem label="자동발주" value={store.autoOrderEnabled ? "활성화" : "비활성화"} />
                            <DetailItem label="배달소요일수" value={store.deliveryDay ? `${store.deliveryDay}일` : "미설정"} />
                            <DetailItem label="계정" wide>
                                <span className={styles.detailValue + " " + styles.accountValue}>
                                    {store.username}
                                </span>
                                <button className={styles.resetPasswordButton} onClick={() => setIsResetModalOpen(true)}>
                                    비밀번호 재설정
                                </button>
                            </DetailItem>
                        </div>
                        {/* 지도 */}
                        <div className={styles.mapBox}>
                            {store.latitude && store.longitude ? (
                                <Map
                                    center={{ lat: store.latitude, lng: store.longitude }}
                                    style={{ width: "100%", height: "100%" }}
                                    level={4}
                                >
                                    <MapMarker position={{ lat: store.latitude, lng: store.longitude }} />
                                </Map>
                            ) : (
                                <div className={styles.emptyMap}>지도 정보 없음</div>
                            )}
                        </div>
                    </div>
                    <div className={styles.buttonGroup}>
                        <button className={styles.backButton} onClick={() => navigate(-1)}>목록</button>
                        <button className={styles.modifyButton} onClick={() => navigate(`/hq/storeModify?id=${id}`)}>수정</button>
                    </div>
                </div>
            </div>
            {/* 비밀번호 재설정 모달 */}
            {isResetModalOpen && (
                <Modal
                    title="비밀번호 재설정"
                    onCancel={() => setIsResetModalOpen(false)}
                    onConfirm={handlePasswordReset}
                    confirmText="확인"
                >
                    <label>관리자 비밀번호</label>
                    <input
                        type="password"
                        value={adminPasswordInput}
                        onChange={e => setAdminPasswordInput(e.target.value)}
                        className={styles.modalInput}
                        placeholder="관리자 비밀번호"
                    />
                    <label>새 비밀번호</label>
                    <input
                        type="password"
                        value={newPasswordInput}
                        onChange={e => setNewPasswordInput(e.target.value)}
                        className={styles.modalInput}
                        placeholder="새 비밀번호 (8자리 이상)"
                    />
                </Modal>
            )}
            {/* 폐업 처리 모달 */}
            {isCloseModalOpen && (
                <Modal
                    title="폐업 처리"
                    onCancel={() => setIsCloseModalOpen(false)}
                    onConfirm={handleCloseStore}
                    confirmText="확인"
                >
                    <label>폐업일</label>
                    <input
                        type="date"
                        value={closedDateInput}
                        onChange={e => setClosedDateInput(e.target.value)}
                        className={styles.modalInput}
                    />
                </Modal>
            )}
        </div>
    );
}

// 2열 정보 item
function DetailItem({ label, value, children, wide }) {
    return (
        <div className={wide ? styles.detailItemWide : styles.detailItem}>
            <span className={styles.detailLabel}>{label}</span>
            {children ? (
                value !== undefined && value !== null && value !== "" ? (
                    // 값이 있을 경우 detailValue와 버튼 모두 보여줌
                    <>
                        <span className={styles.detailValue}>{value}</span>
                        {children}
                    </>
                ) : (
                    // 값이 없으면 버튼만(예비)
                    <>{children}</>
                )
            ) : (
                // 기본값
                <span className={styles.detailValue}>{value}</span>
            )}
        </div>
    );
}

// 모달
function Modal({ title, children, onCancel, onConfirm, confirmText = "확인" }) {
    return (
        <div className={styles.modalOverlay}>
            <div className={styles.modalContent}>
                <h3>{title}</h3>
                <div className={styles.modalForm}>
                    {children}
                </div>
                <div className={styles.modalButtons}>
                    <button className={styles.cancelButton} onClick={onCancel}>취소</button>
                    <button className={styles.confirmButton} onClick={onConfirm}>{confirmText}</button>
                </div>
            </div>
        </div>
    );
}
