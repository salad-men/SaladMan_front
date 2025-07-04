import { useState, useEffect } from "react";
import styles from "./StockInspection.module.css";
import OrderSidebar from "./OrderSidebar";
import { myAxios } from "/src/config";
import { useAtomValue } from 'jotai';
import { accessTokenAtom } from "/src/atoms";
import { useNavigate } from "react-router";

export default function StockInspection() {
    const [items, setItems] = useState([]);
    const [isMobile, setIsMobile] = useState(false);
    const navigate = useNavigate();
    const token = useAtomValue(accessTokenAtom);
    const [orderDate, setOrderDate] = useState(0);
    const id = new URLSearchParams(location.search).get("id");

    useEffect(() => {
        const isMobile = window.innerWidth <= 768;
        if (isMobile) {
            const headerEl = document.querySelector(".header");
            if (headerEl) {
                headerEl.style.display = "none";
            }
        }
        return () => {
            // 언마운트 시 복원
            const headerEl = document.querySelector(".header");
            if (headerEl) {
                headerEl.style.display = "";
            }
        };
    }, []);

    useEffect(() => {
        if (!token) return;
        if (!id) return;

        const fetchDetail = async () => {
            try {
                const res = await myAxios(token).get(`/store/stockInspection/${id}`);
                setItems(res.data);
                setOrderDate(res.data[0]?.orderDateTime);
            } catch (err) {
                console.error("검수 조회 실패", err);
            }
        };
        fetchDetail();
    }, [id, token]);

    const handleInputChange = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = value;
        setItems(updated);
    };

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const yyyy = date.getFullYear();
        const mm = date.getMonth() + 1;
        const dd = date.getDate();
        const hh = date.getHours();
        const min = date.getMinutes().toString().padStart(2, "0");
        return `${yyyy}년 ${mm}월 ${dd}일 ${hh}시 ${min}분`;
    };

    const handleSubmit = async () => {
        if (!window.confirm("검수를 완료하시겠습니까?")) return;

        try {
            await myAxios(token).post("/store/stockInspection", items);
            alert("검수가 완료되었습니다.");
            navigate("/store/orderList");
        } catch (err) {
            console.error("검수 저장 실패", err);
            alert("검수 저장 중 오류가 발생했습니다.");
        }
    };

    return (
        <div className={styles.stockInspectionContainer}>
            {!isMobile && <OrderSidebar />}

            <div className={styles.stockInspectionContent}>
                <h2 className={styles.title}>입고검수</h2>

                <div className={styles.infoBox}>
                    <p>발주번호: No.{id}</p>
                    <p>발주일자: {formatDate(orderDate)}</p>
                    <p>주문자: </p>
                </div>
                <div className={styles.inspectorBox}>
                    <span>
                        <span style={{ width: 100 }}>검수자:</span>{" "}
                        <select>
                            <option></option>
                        </select>
                    </span>
                </div>

                <div className={styles.inspectionTableWrapper}>
                    <table className={styles.inspectionTable}>
                        <thead>
                            <tr>
                                <th>품명</th>
                                <th>구분</th>
                                <th>발주량</th>
                                <th>입고 처리</th>
                                <th>비고</th>
                                <th>단가</th>
                                <th>합계</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr
                                    key={item.id}
                                    style={{
                                        backgroundColor:
                                            item.approvalStatus === "반려" ? "#e0e0e0" : "inherit",
                                        color:
                                            item.approvalStatus === "반려" ? "#555" : "inherit",
                                    }}
                                >
                                    <td>{item.ingredientName}</td>
                                    <td>{item.categoryName}</td>
                                    <td>
                                        {item.orderedQuantity} {item.unit}
                                    </td>
                                    <td>
                                        {item.approvalStatus === "반려" ? (
                                            <span>반려됨</span>
                                        ) : (
                                            <select
                                                value={item.inspection}
                                                className={styles.selectBox}
                                                onChange={(e) =>
                                                    handleInputChange(index, "inspection", e.target.value)
                                                }
                                            >
                                                <option value="검수완료">검수완료</option>
                                                <option value="파손">파손</option>
                                            </select>
                                        )}
                                    </td>
                                    <td>
                                        {item.approvalStatus === "반려" ? (
                                            <span>-</span>
                                        ) : (
                                            <input
                                                type="text"
                                                defaultValue={item.inspectionNote}
                                                className={styles.textArea}
                                                onChange={(e) =>
                                                    handleInputChange(
                                                        index,
                                                        "inspectionNote",
                                                        e.target.value
                                                    )
                                                }
                                            />
                                        )}
                                    </td>
                                    <td>{(item.unitCost ?? 0).toLocaleString()} 원</td>
                                    <td>{(item.totalPrice ?? 0).toLocaleString()} 원</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                <div className={styles.footerSection}>
                    <button className={styles.completeButton} onClick={handleSubmit}>
                        검수 완료
                    </button>
                </div>
            </div>
        </div>
    );
}
