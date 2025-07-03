import { Link, Outlet } from "react-router";


export default function StoreEmpSidebar() {
    return (
        <>
            <div className="sidebar">
                <h3>매장관리</h3>
                <ul>
                    <li><a href="/store/storeSales">매출 조회</a></li>
                    <li><a href="/store/paymentList">주문 내역</a></li>
                    <li><a href="/store/StoreEmployeeList">직원 목록</a></li>
                    <li><a href="/store/empSchedule">직원 일정 관리</a></li>
                </ul>
            </div>
            <Outlet />
        </>
    );
}