import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { accessTokenAtom } from "/src/atoms";
import { myAxios } from "/src/config.jsx";
import styles from "./PaymentList.module.css";
import StoreEmpSidebar from "./StoreEmpSidebar";

const PaymentList = () => {
  const [payments, setPayments] = useState([]);
  const [status, setStatus] = useState("");
  const [pageInfo, setPageInfo] = useState({
    curPage: 1,
    allPage: 1,
    startPage: 1,
    endPage: 1,
  });
  const [pageNums, setPageNums] = useState([]);
  const [token] = useAtom(accessTokenAtom);

  const [startDate, setStartDate] = useState(
    new Date(new Date().getFullYear(), new Date().getMonth(), 1)
      .toLocaleDateString("sv-SE")
      .substring(0, 10)
  );
  const [endDate, setEndDate] = useState(
    new Date().toLocaleDateString("sv-SE").substring(0, 10)
  );

  useEffect(() => {
    if (token) submit(1);
  }, [token]);

  const submit = (page) => {
    if (!token) return;
    const axios = myAxios(token);

    axios
      .get("/store/paymentList", {
        params: {
          status: status || "",
          startDate: startDate || "",
          endDate: endDate || "",
          page,
        },
      })
      .then((res) => {
        setPayments(res.data.content);

        const pi = {
          curPage: page,
          allPage: res.data.pageInfo.allPage,
          startPage: res.data.pageInfo.startPage,
          endPage: res.data.pageInfo.endPage
        };
        setPageInfo(pi);

        const pages = [];
        for (let i = pi.startPage; i <= pi.endPage; i++) {
          pages.push(i);
        }
        setPageNums(pages);
      })
      .catch((err) => {
        console.error("매출 데이터 불러오기 실패:", err);
      });
  };

  const movePage = (p) => {
    if (p < 1 || p > pageInfo.allPage) return;
    console.log("요청 페이지:", p); // ← 확인
    submit(p);
  };

  const handleSearch = () => {
    if (!token) return;
    if (!startDate || !endDate) return alert("날짜를 선택해주세요");
    submit(1);
  };

  return (
    <div className={styles.wrapper}>
      <StoreEmpSidebar />
      <div className={styles.content}>
        <header className={styles.pageHeader}>
          <h2>주문 및 환불 내역 조회</h2>
        </header>

        <div className={styles.filterBox}>
          <div className={styles.filterRow}>
            <div className={styles.filterLabel}>기간</div>
            <div className={styles.filterContent}>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              ~
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>

          <div className={styles.filterRow}>
            <div className={styles.filterLabel}>주문 상태</div>
            <div className={styles.filterContent}>
              <label>
                <input
                  type="radio"
                  name="status"
                  value=""
                  checked={status === ""}
                  onChange={(e) => setStatus(e.target.value)}
                />{" "}
                전체
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="주문완료"
                  checked={status === "주문완료"}
                  onChange={(e) => setStatus(e.target.value)}
                />{" "}
                주문완료
              </label>
              <label>
                <input
                  type="radio"
                  name="status"
                  value="환불완료"
                  checked={status === "환불완료"}
                  onChange={(e) => setStatus(e.target.value)}
                />{" "}
                환불완료
              </label>
              <button onClick={handleSearch}>검색</button>
            </div>
          </div>
        </div>

        <table className={styles.orderTable}>
          <thead>
            <tr className={styles.orderTableHeader}>
              <th>주문번호</th>
              <th>메뉴</th>
              <th>수량</th>
              <th>총금액</th>
              <th>상태</th>
              <th>주문일자</th>
            </tr>
          </thead>
          <tbody>
            {payments.length > 0 ? (
              payments.map((order, idx) => (
                <tr key={idx}>
                  <td>
                    {order.orderTime.split("T")[0]}-{order.id}
                  </td>
                  <td>{order.name}</td>
                  <td>{order.quantity}</td>
                  <td>{order.totalPrice.toLocaleString()}</td>
                  <td>
                    <span>{order.status}</span>
                  </td>
                  <td>{order.orderTime.replace("T", " ")}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" style={{ textAlign: "center" }}>
                  조회된 내역이 없습니다.
                </td>
              </tr>
            )}
          </tbody>
        </table>

        <div className={styles.pagination}>
          <button onClick={() => movePage(1)} disabled={pageInfo.curPage === 1}>{"<<"}</button>
          <button onClick={() => movePage(pageInfo.curPage - 1)} disabled={pageInfo.curPage === 1}>{"<"}</button>

          {pageNums.map((p) => (
            <button
              key={p}
              onClick={() => movePage(p)}
              className={p === pageInfo.curPage ? styles.active : ""}
            >
              {p}
            </button>
          ))}

          <button onClick={() => movePage(pageInfo.curPage + 1)} disabled={pageInfo.curPage === pageInfo.allPage}>{">"}</button>
          <button onClick={() => movePage(pageInfo.allPage)} disabled={pageInfo.curPage === pageInfo.allPage}>{">>"}</button>
        </div>
      </div>
    </div>
  );
};

export default PaymentList;
