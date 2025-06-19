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
    const token = useAtomValue(tokenAtom);
    const [selectedId, setSelectedId] = useState(null);
    const [showModal, setShowModal] = useState(false);

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
            const res = await myAxios(token).get("/hq/ingredients", { params });
            setItems(res.data.content);
            setTotalPages(res.data.totalPages);
        } catch (err) {
            console.error("품목 불러오기 실패", err);
        }
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
                    <table className={styles.orderItemTable}>
                        <thead>
                            <tr>
                                <th>품목명</th>
                                <th>구분</th>
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
