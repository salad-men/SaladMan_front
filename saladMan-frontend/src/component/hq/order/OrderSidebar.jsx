import { Link, Outlet } from "react-router";
import './orderSidebar.css'

export default function OrderSidebar() {
    return (
        <>
            <div className="orderSidebar">
                <h3>발주</h3>
                <ul>
                    <li><a href="/hq/orderRequest">발주목록</a></li>                
                    <li><a href="/hq/orderItemManage">발주품목</a></li>                

                </ul>
            </div>
            <Outlet />
        </>
    );
}