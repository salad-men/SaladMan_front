import styles from "./OrderItemManage.module.css";
import OrderSidebar from "./OrderSidebar";
import { useEffect, useState } from "react";
import { myAxios } from "/src/config";
import { useAtomValue } from "jotai";
import { tokenAtom } from "/src/atoms";

export default function OrderItemManage() {
    const [items, setItems] = useState([]);
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(0);


    const [availableFilter, setAvailableFilter] = useState("all");
    const [selectedCategory, setSelectedCategory] = useState("all");
    const [searchText, setSearchText] = useState("");

    const [selectedId, setSelectedId] = useState(null);
    const [showModal, setShowModal] = useState(false);

    const token = useAtomValue(tokenAtom);

    useEffect(() => {
        fetchItems();
    }, [currentPage, availableFilter, token]);

    const fetchItems = async () => {
        try {
            const params = {
                page: currentPage - 1,
                size: 6,
            };

            if (availableFilter !== "all") {
                params.available = availableFilter;
            }
            if (selectedCategory !== "all") { params.category = selectedCategory; }
            if (searchText.trim()) { params.keyword = searchText; }

            const res = await myAxios(token).get("/hq/ingredients", { params });
            setItems(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("품목 불러오기 실패", err);
        }
    };

    // 검색 버튼 핸들러
    const handleSearch = () => {
        setCurrentPage(1);
        fetchItems(); // 혹은 useEffect로 자동 반응하게 유지
    };

    const handleToggleClick = (id) => {
        setSelectedId(id);
        setShowModal(true);
    };

    const handleConfirm = () => {
        toggleEnabled(selectedId);
        setShowModal(false);
    };

    const toggleEnabled = async (id) => {
        try {
            const res = await myAxios(token).post(`/hq/ingredients/${id}/available-toggle`);
            const updatedItems = items.map((item) =>
                item.id === id ? { ...item, available: res.data.available } : item
            );
            setItems(updatedItems);
        } catch (err) {
            console.error("토글 실패:", err);
        }
    };

    return (
        <>
            <div className={styles.orderItemContainer}>
                <OrderSidebar />
                <div className={styles.orderItemContent}>
                    <h2>발주 품목</h2>

                    <div className={styles.searchControls}>
                        <select
                            value={availableFilter}
                            onChange={(e) => {
                                setCurrentPage(1);
                                setAvailableFilter(e.target.value);
                            }}
                            className={styles.itemFilterSelect}
                        >
                            <option value="all">전체</option>
                            <option value="possible">발주 가능</option>
                            <option value="impossible">발주 불가</option>
                        </select>

                        <select
                            value={selectedCategory}
                            onChange={(e) => {
                                setSelectedCategory(e.target.value);
                                setCurrentPage(1);
                            }}
                            className={styles.itemFilterSelect}
                        >
                            <option value="all">전체 카테고리</option>
                            <option value="야채">채소</option>
                            <option value="과일">과일</option>
                            <option value="소스">소스</option>
                            {/* 필요에 따라 동적으로 불러올 수도 있음 */}
                        </select>

                        <input
                            type="text"
                            value={searchText}
                            onChange={(e) => setSearchText(e.target.value)}
                            placeholder="품명 또는 카테고리 검색"
                            className={styles.searchInput}
                        />
                        <button onClick={handleSearch} className={styles.searchButton}>검색</button>
                    </div>

                    <table className={styles.orderItemTable}>
                        <thead>
                            <tr>
                                <th>품목명</th>
                                <th>카테고리</th>
                                <th>본사보유량</th>
                                <th>단위</th>
                                <th>단위가격</th>
                                <th>발주 가능</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item) => (
                                <tr key={item.id}>
                                    <td>{item.name}</td>
                                    <td>{item.categoryName}</td>
                                    <td>{item.stockQuantity}</td>
                                    <td>{item.unit}</td>
                                    <td>{item.unitCost}</td>
                                    <td>
                                        <label className={styles.switch}>
                                            <input
                                                type="checkbox"
                                                checked={item.available === true}
                                                onChange={() => handleToggleClick(item.id)}
                                            />
                                            <span className={styles.slider}></span>
                                        </label>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className={styles.ordItemManagePagination}>
                        {[...Array(totalPages)].map((_, idx) => (
                            <button
                                key={idx}
                                className={currentPage === idx + 1 ? styles.active : ""}
                                onClick={() => setCurrentPage(idx + 1)}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {showModal && (
                <div className={styles.customModalOverlay}>
                    <div className={styles.customModal}>
                        <p>발주 상태를 변경하시겠습니까?</p>
                        <div className={styles.customModalButtons}>
                            <button onClick={handleConfirm}>확인</button>
                            <button onClick={() => setShowModal(false)}>취소</button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
}
