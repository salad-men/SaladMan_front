import { Link, Outlet } from "react-router";
import '../Sidebar.css'

export default function OrderSidebar() {
    return (
        <>
            <div className="sidebar">
                <h3>발주</h3>
                <ul>
                    <li><a href="/store/orderList">발주목록</a></li>                
                    <li><a href="/store/">발주신청</a></li>
                    <li><a href="/store/orderList">발주설정</a></li>                
                    <li><a href="/store/">입고/재고사용 내역</a></li>                 
                </ul>
            </div>
        </>
    );
}