import { Link, Outlet } from "react-router";
import'../HqSidebar.css'

export default function OrderSidebar() {
    return (
        <>
            <div className="sidebar">
                <h3>수주</h3>
                <ul>
                    <li><a href="/hq/orderRequest">수주 목록</a></li>                
                    <li><a href="/hq/orderItemManage">수주품목 설정</a></li>                

                </ul>
            </div>
            <Outlet />
        </>
    );
}