import React, { useState } from "react";
import "./OrderItemManage.css";
import OrderSidebar from "./OrderSidebar";

export default function OrderItemManage() {
    const [items, setItems] = useState([
        { id: 1, name: "로메인", category: "야채", unit: "g", stock: 1000, actual: 900, price: 300, enabled: true },
        { id: 2, name: "계란", category: "야채", unit: "g", stock: 800, actual: 750, price: 250, enabled: false },
        { id: 3, name: "양상추", category: "야채", unit: "g", stock: 1200, actual: 600, price: 280, enabled: true },
        { id: 4, name: "닭가슴살", category: "단백질", unit: "g", stock: 500, actual: 400, price: 700, enabled: true },
        { id: 5, name: "두부", category: "단백질", unit: "g", stock: 400, actual: 300, price: 500, enabled: true },
        { id: 6, name: "아보카도", category: "지방", unit: "ea", stock: 100, actual: 95, price: 1500, enabled: true },
        { id: 7, name: "방울토마토", category: "야채", unit: "g", stock: 900, actual: 890, price: 300, enabled: false },
        { id: 8, name: "오이", category: "야채", unit: "ea", stock: 300, actual: 290, price: 400, enabled: false }
    ]);

    const toggleEnabled = (id) => {
        const newList = items.map(item =>
            item.id === id ? { ...item, enabled: !item.enabled } : item
        );
        setItems(newList);
    };
    const [currentPage, setCurrentPage] = useState(1);
    const itemsPerPage = 6;
    const totalPages = Math.ceil(items.length / itemsPerPage);
    const startIdx = (currentPage - 1) * itemsPerPage;
    const currentItems = items.slice(startIdx, startIdx + itemsPerPage);
    return (
        <>
            <OrderSidebar />
            <div className="orderDetailContainer">
                <div className="orderDetailContent">
                    <h2>발주 품목</h2>
                    <table className="orderDetailTable">
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
                                    <td>{item.category}</td>
                                    <td>{item.stock}</td>
                                    <td>{item.unit}</td>
                                    <td>{item.price}</td>
                                    <td>
                                        <label className="switch">
                                            <input type="checkbox" checked={item.enabled} onChange={() => toggleEnabled(item.id)} />
                                            <span className="slider"></span>
                                        </label>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="ordItemManagePagination">
                        {[...Array(totalPages)].map((_, idx) => (
                            <button
                                key={idx}
                                className={currentPage === idx + 1 ? "active" : ""}
                                onClick={() => setCurrentPage(idx + 1)}
                            >
                                {idx + 1}
                            </button>
                        ))}
                    </div>
                </div>
            </div>
        </>
    );
}
