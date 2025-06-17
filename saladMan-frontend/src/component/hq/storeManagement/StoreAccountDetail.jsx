import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { myAxios } from "/src/config";
import EmpSidebar from "./EmpSidebar";
import styles from "./StoreAccountDetail.module.css";

export default function StoreAccountDetail() {
    const [store, setStore] = useState(null);
    const location = useLocation();
    const navigate = useNavigate();
    const token = localStorage.getItem("accessToken");

    useEffect(() => {
        const storeId = new URLSearchParams(location.search).get("id");

        const fetchStoreDetail = async () => {
            try {
                const res = await myAxios(null).get("/hq/storeAccountDetail", {
                    params: { storeId }
                });
                setStore(res.data);
            } catch (err) {
                console.error("매장 정보 로드 실패", err);
            }
        };

        fetchStoreDetail();
    }, []);

    if (!store) return <div>로딩 중...</div>;

    return (
        <div className={styles.storeDetailContainer}>
            <EmpSidebar />
            <div className={styles.storeDetailContent}>
                <h2>매장 상세 정보</h2>

                <div className={styles.storeDetailBox}>
                    <div><strong>매장명:</strong> {store.name}</div>
                    <div><strong>지역:</strong> {store.location}</div>
                    <div><strong>주소:</strong> {store.address}</div>
                    <div><strong>전화번호:</strong> {store.phoneNumber}</div>
                    <div><strong>계정 ID:</strong> {store.username}</div>
                    <div><strong>오픈 시간:</strong> {store.openTime}</div>
                    <div><strong>마감 시간:</strong> {store.closeTime}</div>
                    <div><strong>휴무일:</strong> {store.breakDay}</div>
                    <div><strong>계정 생성일:</strong> {store.createdAt?.slice(0, 10)}</div>
                    <div><strong>폐점일:</strong> {store.closedAt ? store.closedAt.slice(0, 10) : "운영 중"}</div>
                    <div><strong>자동 발주:</strong> {store.autoOrderEnabled ? "활성화" : "비활성화"}</div>
                    <div><strong>배달 요일:</strong> {store.deliveryDay ? `${store.deliveryDay}일` : "미설정"}</div>
                    <div><strong>역할:</strong> {store.role}</div>
                </div>

                <button className={styles.backButton} onClick={() => navigate(-1)}>목록으로</button>
            </div>
        </div>
    );
}