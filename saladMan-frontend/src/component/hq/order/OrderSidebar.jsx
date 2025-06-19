import { Link, Outlet } from "react-router";
import'../HqSidebar.css'

export default function OrderSidebar() {
    return (
        <>
            <div className="sidebar">
                <h3>발주</h3>
                <ul>
                    <li><a href="/hq/orderRequest">발주신청목록</a></li>                
                    <li><a href="/hq/orderItemManage">발주품목</a></li>                

                </ul>
            </div>
            <Outlet />
        </>
    );
}