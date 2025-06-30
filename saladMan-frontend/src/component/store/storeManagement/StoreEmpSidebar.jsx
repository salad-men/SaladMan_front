import { Link, Outlet } from "react-router";


export default function EmpSidebar() {
    return (
        <>
            <div className="sidebar">
                <h3>매장관리</h3>
                <ul>
                    <li><a href="/store/StoreEmployeeListStore">직원 조회</a></li>
                    <li><a href="/store/empSchedule">일정 관리</a></li>
                </ul>
            </div>
            <Outlet />
        </>
    );
}