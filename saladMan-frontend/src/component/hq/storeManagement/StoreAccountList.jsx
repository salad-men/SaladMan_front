// StoreAccountList.jsx
import EmpSidebar from "./EmpSidebar";
import styles from "./StoreAccountList.module.css";
import { useState, useEffect } from "react";
import { myAxios } from "/src/config";
import { useNavigate } from "react-router";
import { useAtomValue } from 'jotai';
import { tokenAtom } from "/src/atoms";

export default function StoreAccountList() {
    const [location, setLocation] = useState("전체 지역");
    const [status, setStatus] = useState("전체 상태");
    const [keyword, setKeyword] = useState("");
    const [stores, setStores] = useState([]);
    const navigate = useNavigate();
    const token = useAtomValue(tokenAtom);

    const [currentPage, setCurrentPage] = useState(0);
    const [totalPages, setTotalPages] = useState(0);

    useEffect(() => {
        fetchStores();
    }, [token]);

    const fetchStores = async (page = 0) => {
        try {
            const res = await myAxios(token).get("/hq/storeAccountList", {
                params: {
                    location,
                    status,
                    keyword,
                    page,
                    size: 10
                }
            });
            setStores(res.data.content);
            setTotalPages(res.data.totalPages);
            setCurrentPage(res.data.number);
        } catch (err) {
            console.error("매장 정보 가져오기 실패", err);
        }
    };

    const navigateToDetail = (id) => {
        navigate(`/hq/storeAccountDetail?id=${id}`);
    };

    const navigateToModify = (id) => {
        navigate(`/hq/storeModify?id=${id}`);
    };

    const handleSearch = () => {
        fetchStores(0);
    };

    return (
        <>
            <div className={styles.storeAccountContainer}>
                <EmpSidebar />

                <div className={styles.storeAccountContent}>
                    <h2>매장/계정 목록</h2>

                    <div className={styles.storeAccTopBar}>
                        <button className={styles.registerButton} onClick={() => navigate("/hq/storeRegister")}>매장등록</button>
                        <div className={styles.searchGroup}>
                            <select value={location} onChange={(e) => setLocation(e.target.value)}>
                                <option>전체 지역</option>
                                <option>서울</option>
                                <option>경기</option>
                                <option>광주</option>
                                <option>대구</option>
                                <option>대전</option>
                                <option>부산</option>
                                <option>울산</option>
                                <option>인천</option>
                                <option>강원</option>
                                <option>경남</option>
                                <option>경북</option>
                                <option>전남</option>
                                <option>전북</option>
                                <option>충남</option>
                                <option>충북</option>
                                <option>제주</option>
                                <option>세종</option>
                            </select>

                            {/* <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option>매장 상태</option>
                                <option value="true">운영</option>
                                <option value="false">폐점</option>
                            </select> */}

                            <input type="text" placeholder="검색어 입력" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                            <button className={styles.searchButton} onClick={handleSearch}>검색</button>
                        </div>
                    </div>

                    <table className={styles.storeAccountTable}>
                        <thead>
                            <tr>
                                <th>매장번호</th>
                                <th>지역</th>
                                <th>매장명</th>
                                <th>매장주소</th>
                                <th>전화번호</th>
                                <th>계정</th>
                                <th>계정 생성일</th>
                                <th>상태</th>
                                <th>수정</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stores.map((store) => (
                                <tr key={store.id} onClick={() => navigateToDetail(store.id)} className={styles.clickableRow}>
                                    <td>{store.id}</td>
                                    <td>{store.location}</td>
                                    <td>{store.name}</td>
                                    <td>{store.address}</td>
                                    <td>{store.phoneNumber}</td>
                                    <td>{store.username}</td>
                                    <td>{store.createdAt?.slice(0, 10)}</td>
                                    <td>
                                        {store.closedAt ? (
                                            new Date(store.closedAt) > new Date() ? (
                                                <span className={styles["status-wrapper"]}>
                                                    <span className={styles["status-text"]}>운영 종료 예정</span>
                                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="#f1c40f" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="3" cy="3" r="3" />
                                                    </svg>
                                                </span>
                                            ) : (
                                                <span className={styles["status-wrapper"]}>
                                                    <span className={styles["status-text"]}>운영 종료</span>
                                                    <svg width="10" height="10" viewBox="0 0 10 10" fill="#e74c3c" xmlns="http://www.w3.org/2000/svg">
                                                        <circle cx="3" cy="3" r="3" />
                                                    </svg>
                                                </span>
                                            )
                                        ) : (
                                            <span className={styles["status-wrapper"]}>
                                                <span className={styles["status-text"]}>운영중</span>
                                                <svg width="10" height="10" viewBox="0 0 10 10" fill="#2ecc71" xmlns="http://www.w3.org/2000/svg">
                                                    <circle cx="3" cy="3" r="3" />
                                                </svg>
                                            </span>
                                        )}
                                    </td>
                                    <td>
                                        <button className={styles.editButton} onClick={(e) => {
            e.stopPropagation(); // ← 중요! tr 클릭 이벤트 방지
            navigateToModify(store.id); // 수정 페이지로 이동
        }}>수정</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className={styles.pagination}>
                        {Array.from({ length: totalPages }, (_, index) => (
                            <button
                                key={index}
                                className={currentPage === index ? styles.active : ""}
                                onClick={() => fetchStores(index)}
                            >
                                {index + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
