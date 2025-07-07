// OrderRequestList.jsx
import styles from "./OrderRequestList.module.css";
import { useEffect, useState } from "react";
import OrderSidebar from "./OrderSidebar";
import { useAtomValue } from 'jotai';
import { accessTokenAtom } from '/src/atoms';
import { myAxios } from '/src/config';
import { useNavigate } from "react-router";

export default function OrderRequestList() {
    const token = useAtomValue(accessTokenAtom);
    const navigate = useNavigate();

    const [storeList, setStoreList] = useState([]);
    const [filters, setFilters] = useState({
        storeName: "",
        status: "",
    });
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    const [orders, setOrders] = useState([]);
    const [totalPages, setTotalPages] = useState(1);
    const [currentPage, setCurrentPage] = useState(1);


    useEffect(() => {
        if (!token) return;
        const fetchStores = async () => {
            try {
                const res = await myAxios(token).get("/hq/storeNames");
                setStoreList(res.data);
            } catch (err) {
                console.error("점포 목록 조회 실패", err);

            }
        }
        fetchStores();
        handleSearch(1);
    }, [token]);

    const navigateToDetail = (id) => {
        navigate(`/hq/orderRequestDetail?id=${id}`);
    }


    const handleSearch = async (page = 1) => {
        try {
            const res = await myAxios(token).get("/hq/orderRequestList", {
                params: {
                    page: page - 1,
                    size: 10,
                    startDate: startDate || null,
                    endDate: endDate || null,
                    storeName: filters.storeName,
                    status: filters.status,
                },
            });

            setOrders(res.data.orders); // Map 기반 응답의 키가 orders라고 가정
            setTotalPages(res.data.totalPages);
            setCurrentPage(page);
            console.log(res.data);
        } catch (err) {
            console.error("수주 목록 조회 실패", err);
        }
    };

    const handleReset = () => {
        setFilters({ storeName: "", status: "", approval: "" });
        setStartDate("");
        setEndDate("");
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFilters((prev) => ({ ...prev, [name]: value }));
    };

    const setDateRange = (range) => {
        const today = new Date();
        const end = today.toISOString().slice(0, 10); // 오늘 날짜 yyyy-mm-dd

        let start = new Date();

        if (range === "today") {
            start = today;
        } else if (range === "1week") {
            start.setDate(today.getDate() - 7);
        } else if (range === "2weeks") {
            start.setDate(today.getDate() - 14);
        } else if (range === "1month") {
            start.setMonth(today.getMonth() - 1);
        }

        setStartDate(start.toISOString().slice(0, 10));
        setEndDate(end);
    };

    return (
        <>

            <div className={styles.orderRequestContainer}>
                <OrderSidebar />
                <div className={styles.orderRequestContent}>
                    <h2>수주 목록</h2>

                    <div className={styles.orderRequestFilters}>
                        <div className={styles.row}>
                            <label>기간</label>
                            <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
                            <span>~</span>
                            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />
                            <button onClick={() => setDateRange("today")}>오늘</button>
                            <button onClick={() => setDateRange("1week")}>1주</button>
                            <button onClick={() => setDateRange("2weeks")}>2주</button>
                            <button onClick={() => setDateRange("1month")}>1달</button>
                        </div>

                        <div className={styles.row}>
                            <label>점포</label>
                            <select
                                name="storeName"
                                value={filters.storeName}
                                onChange={handleChange}
                            >
                                <option value="">전체</option>
                                {storeList.map((store) => (
                                    <option key={store.id} value={store.name}>
                                        {store.name}
                                    </option>
                                ))}
                            </select>
                            <label>상태</label>
                            <select name="status" value={filters.status} onChange={handleChange}>
                                <option value="">전체</option>
                                <option value="대기중">대기중</option>
                                <option value="입고완료">입고완료</option>
                                <option value="검수완료">검수완료</option>
                                <option value="반려">반려</option>
                            </select>

                            <button className={styles.searchButton} onClick={() => handleSearch(1)}>검색</button>
                            <button className={styles.resetButton} onClick={handleReset}>초기화</button>
                        </div>
                    </div>

                    <table className={styles.orderTable}>
                        <thead>
                            <tr>
                                <th>No</th>
                                <th>지점명</th>
                                <th>품명</th>
                                <th>발주일</th>
                                <th>상태</th>
                                <th>품목개수</th>
                                <th>합계</th>
                                <th>승인여부</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {orders.map((order) => (
                                <tr key={order.id} onClick={() => navigateToDetail(order.id)}>
                                    <td>{order.id}</td>
                                    <td>{order.storeName}</td>
                                    <td>{order.productNameSummary}</td>
                                    <td>{order.orderDateTime?.split("T")[0]}</td>
                                    <td>{order.status}</td>
                                    <td>{order.quantitySummary}</td>
                                    <td>{order.totalPrice?.toLocaleString()}원</td>
                                    <td>{order.orderStatus}</td>
                                    <td>
                                        <button
                                            onClick={(e) => {
                                                e.stopPropagation();
                                                window.open(`/hq/orderRequestPrint?id=${order.id}`, "_blank");
                                            }}
                                            disabled={!order.orderStatus}  // 승인 여부 없으면 비활성화
                                            style={{
                                                backgroundColor: order.orderStatus ? "#2f6042" : "#ccc",
                                                color: "white",
                                                border: "none",
                                                padding: "4px 8px",
                                                borderRadius: "4px",
                                                cursor: order.orderStatus ? "pointer" : "not-allowed"
                                            }}
                                        >
                                            발주서 출력
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className={styles.pagination}>
                        <button
                            onClick={() => handleSearch(1)}
                            disabled={currentPage === 1}
                        >{"<<"}</button>
                        <button
                            onClick={() => handleSearch(currentPage - 1)}
                            disabled={currentPage === 1}
                        >{"<"}</button>
                        {Array.from({ length: totalPages }, (_, i) => (
                            <button
                                key={i}
                                onClick={() => handleSearch(i + 1)}
                                className={currentPage === i + 1 ? styles.activePage : ""}
                            >
                                {i + 1}
                            </button>
                        ))}
                        <button
                            onClick={() => handleSearch(currentPage + 1)}
                            disabled={currentPage === totalPages}
                        >{">"}</button>
                        <button
                            onClick={() => handleSearch(totalPages)}
                            disabled={currentPage === totalPages}
                        >{">>"}</button>
                    </div>

                </div>
            </div>
        </>
    );
}
