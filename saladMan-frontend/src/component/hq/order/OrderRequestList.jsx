// OrderRequestList.jsx
import "./OrderRequestList.css";
import { useState } from "react";

export default function OrderRequestList() {
    const [orders] = useState([
        { no: 1324, store: "강남점", item: "양상추 외 9", date: "2025-05-25", status: "대기중", count: "0/10", total: "0원", result: "" },
        { no: 1323, store: "구로디지털점", item: "양상추 외 9", date: "2025-05-25", status: "대기중", count: "0/10", total: "0원", result: "" },
        { no: 1322, store: "독산역점", item: "양상추 외 9", date: "2025-05-25", status: "대기중", count: "0/10", total: "0원", result: "" },
        { no: 1321, store: "신림역점", item: "양상추", date: "2025-05-25", status: "반려", count: "0/10", total: "0원", result: "반려 (반려 사유 보기)" },
        { no: 1320, store: "서동탄점", item: "양상추 외 9", date: "2025-05-25", status: "입고완료", count: "0/8", total: "0원", result: "승인" },
        { no: 1219, store: "신도림점", item: "양상추 외 9", date: "2025-05-24", status: "접수완료", count: "8/8", total: "0원", result: "승인" }
    ]);

    return (
        <div className="orderRequestContainer">
            <div className="orderRequestContent">
                <h2>발주 신청 목록</h2>

                <div className="orderRequestFilters">
                    <div className="row">
                        <label>기간</label>
                        <input type="date" />
                        <span>~</span>
                        <input type="date" />
                        <button>오늘</button>
                        <button>1주</button>
                        <button>2주</button>
                        <button>1달</button>
                    </div>

                    <div className="row">
                        <label>점포</label>
                        <input type="text" placeholder="점포 검색" />
                        <label>상태</label>
                        <select>
                            <option>전체</option>
                            <option>대기중</option>
                            <option>접수완료</option>
                            <option>입고완료</option>
                            <option>반려</option>
                        </select>
                        <label>승인</label>
                        <select>
                            <option>전체</option>
                            <option>승인</option>
                            <option>반려</option>
                        </select>
                        <button className="searchButton">검색</button>
                        <button className="resetButton">초기화</button>
                    </div>
                </div>

                <table className="orderTable">
                    <thead>
                        <tr>
                            <th><input type="checkbox" className="checkboxColumn" /></th>
                            <th>No</th>
                            <th>지점명</th>
                            <th>품명</th>
                            <th>발주일</th>
                            <th>상태</th>
                            <th>품목개수</th>
                            <th>합계</th>
                            <th>승인여부</th>
                        </tr>
                    </thead>
                    <tbody>
                        {orders.map((order) => (
                            <tr key={order.no}>
                                <td><input type="checkbox" className="checkboxColumn"/></td>
                                <td>{order.no}</td>
                                <td>{order.store}</td>
                                <td>{order.item}</td>
                                <td>{order.date}</td>
                                <td>{order.status}</td>
                                <td>{order.count}</td>
                                <td>{order.total}</td>
                                <td>{order.result}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
