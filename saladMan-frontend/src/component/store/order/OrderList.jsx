import styles from "./OrderList.module.css";
import OrderSidebar from "./OrderSidebar";
import { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "/src/atoms";
import { myAxios } from "/src/config";
import { useNavigate } from "react-router-dom";

export default function OrderList() {
  const [filters, setFilters] = useState({
    productName: "",
    orderType: "",
    status: "",
  });
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [orderData, setOrderData] = useState([]);
  const [selectedRange, setSelectedRange] = useState("");

  const [pageInfo, setPageInfo] = useState({
    curPage: 1,
    allPage: 1,
    startPage: 1,
    endPage: 1,
  });
  const [pageNums, setPageNums] = useState([]);

  const token = useAtomValue(accessTokenAtom);
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) return;
    fetchOrderList(1);
  }, [token]);

  const fetchOrderList = async (page = 1) => {
    const validPage = Number.isNaN(page) || page < 1 ? 1 : page;
    try {
      const res = await myAxios(token).get("/store/orderList", {
        params: {
          page: validPage - 1, // Spring은 0부터
          size: 10,
          startDate: startDate || null,
          endDate: endDate || null,
          orderType: filters.orderType,
          productName: filters.productName,
          status: filters.status,
        },
      });

      setOrderData(res.data.content);

      // ✅ 페이지 정보 세팅
      const pi = {
        curPage: validPage,
        allPage: res.data.totalPages || 1,
        startPage: Math.floor((validPage - 1) / 5) * 5 + 1,
        endPage: Math.min(
          Math.floor((validPage - 1) / 5) * 5 + 5,
          res.data.totalPages || 1
        ),
      };
      setPageInfo(pi);

      // ✅ 페이지 번호 배열
      const nums = [];
      for (let i = pi.startPage; i <= pi.endPage; i++) {
        nums.push(i);
      }
      setPageNums(nums);
    } catch (err) {
      console.error("발주 목록 조회 실패", err);
    }
  };

  const movePage = (p) => {
    if (p < 1 || p > pageInfo.allPage) return;
    fetchOrderList(p);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const handleReset = () => {
    setFilters({ productName: "", orderType: "", status: "" });
    setStartDate("");
    setEndDate("");
    setSelectedRange("");
  };

  const formatDateToKST = (date = new Date()) => {
    const offset = date.getTimezoneOffset(); // 한국 기준: -540
    const localDate = new Date(date.getTime() - offset * 60 * 1000);
    return localDate.toISOString().slice(0, 10);
  };

  const setDateRange = (range) => {
    const today = new Date();
    const offset = today.getTimezoneOffset();
    const localToday = new Date(today.getTime() - offset * 60000);
    const end = localToday.toISOString().slice(0, 10);

    let start = new Date(localToday); // 복사


    if (range === "today") {
      start = today;
    } else if (range === "1week") {
      start.setDate(today.getDate() - 7);
    } else if (range === "2weeks") {
      start.setDate(today.getDate() - 14);
    } else if (range === "1month") {
      start.setMonth(today.getMonth() - 1);
    }


    const startStr = new Date(start.getTime() - offset * 60000).toISOString().slice(0, 10);
    setStartDate(startStr);
    setEndDate(end);
    setSelectedRange(range);
  };

  const navigateToInspection = (id) => {
    navigate(`/store/stockInspection?id=${id}`);
  };
  const navigateToOrderDetail = (id) => {
    navigate(`/store/orderDetail?id=${id}`);
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

  return (
    <div className={styles.orderListContainer}>
      <OrderSidebar />
      <div className={styles.orderListContent}>
        <h2>발주 목록</h2>

        <div className={styles.filters}>
          <div className={styles.row}>
            <label>기간</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <span>~</span>
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
            />
            <button
              onClick={() => setDateRange("today")}
              className={`${styles.dateButton} ${selectedRange === "today" ? styles.selected : ""
                }`}
            >
              오늘
            </button>
            <button
              onClick={() => setDateRange("1week")}
              className={`${styles.dateButton} ${selectedRange === "1week" ? styles.selected : ""
                }`}
            >
              1주
            </button>
            <button
              onClick={() => setDateRange("2weeks")}
              className={`${styles.dateButton} ${selectedRange === "2weeks" ? styles.selected : ""
                }`}
            >
              2주
            </button>
            <button
              onClick={() => setDateRange("1month")}
              className={`${styles.dateButton} ${selectedRange === "1month" ? styles.selected : ""
                }`}
            >
              1달
            </button>
          </div>
          <div className={styles.row}>
            <label htmlFor="orderType">발주유형</label>
            <select
              id="orderType"
              name="orderType"
              value={filters.orderType}
              onChange={handleChange}
            >
              <option value="">전체</option>
              <option value="자동발주">자동발주</option>
              <option value="수기발주">수기발주</option>
            </select>

            <label htmlFor="status">상태</label>
            <select
              id="status"
              name="status"
              value={filters.status}
              onChange={handleChange}
            >
              <option value="">전체</option>
              <option value="대기중">대기중</option>
              <option value="입고완료">입고완료</option>
              <option value="검수완료">검수완료</option>
              <option value="반려">반려</option>
            </select>

            <label htmlFor="productName">품명</label>
            <input
              type="text"
              id="productName"
              name="productName"
              value={filters.productName}
              onChange={handleChange}
            />

            <button
              className={styles.searchButton}
              onClick={() => fetchOrderList(1)}
            >
              검색
            </button>
            <button className={styles.resetButton} onClick={handleReset}>
              초기화
            </button>
          </div>
        </div>

        <div className={styles.orderTableWrapper}>
          <table className={styles.orderTable}>
            <thead>
              <tr>
                <th>no</th>
                <th>발주유형</th>
                <th>품명</th>
                <th>발주일</th>
                <th>상태</th>
                <th>입고량</th>
                <th>입고 검수서</th>
              </tr>
            </thead>
            <tbody>
              {orderData.map((order, index) => (
                <tr
                  key={order.id}
                  onClick={() => navigateToOrderDetail(order.id)}
                  className={styles.clickableRow}
                >
                  <td>{index + 1}</td>
                  <td>{order.purType}</td>
                  <td>{order.productNameSummary}</td>
                  <td>{formatDate(order.orderDateTime)}</td>
                  <td>{order.status}</td>
                  <td>{order.quantitySummary}</td>
                  <td>
                    <button
                      disabled={
                        !order.receiptAvailable ||
                        order.status.trim() === "검수완료"
                      }
                      className={
                        order.receiptAvailable &&
                          order.status.trim() !== "검수완료"
                          ? styles.activeButton
                          : styles.disabledButton
                      }
                      onClick={(e) => {
                        e.stopPropagation();
                        if (
                          order.receiptAvailable &&
                          order.status.trim() !== "검수완료"
                        ) {
                          navigateToInspection(order.id);
                        }
                      }}
                    >
                      검수서
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className={styles.pagination}>
          <button onClick={() => movePage(1)} disabled={pageInfo.curPage === 1}>
            {"<<"}
          </button>
          <button
            onClick={() => movePage(pageInfo.curPage - 1)}
            disabled={pageInfo.curPage === 1}
          >
            {"<"}
          </button>

          {pageNums.map((p) => (
            <button
              key={p}
              onClick={() => movePage(p)}
              className={pageInfo.curPage === p ? styles.active : ""}
            >
              {p}
            </button>
          ))}

          <button
            onClick={() => movePage(pageInfo.curPage + 1)}
            disabled={pageInfo.curPage === pageInfo.allPage}
          >
            {">"}
          </button>
          <button
            onClick={() => movePage(pageInfo.allPage)}
            disabled={pageInfo.curPage === pageInfo.allPage}
          >
            {">>"}
          </button>
        </div>
      </div>
    </div>
  );
}
