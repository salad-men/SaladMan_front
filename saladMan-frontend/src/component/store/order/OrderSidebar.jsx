import { Link, Outlet } from "react-router";
import '../Sidebar.css'

export default function OrderSidebar() {
    return (
        <>
            <div className="sidebar">
                <h3>발주</h3>
                <ul>
                    <li><a href="/store/orderList">발주 목록</a></li>                
                    <li><a href="/store/orderApply">발주 신청</a></li>
                    <li><a href="/store/stockInspection">발주입고 검수</a></li>
                    <li><a href="/store/orderSettings">발주 설정</a></li>                
                </ul>
            </div>
        </>
    );
}