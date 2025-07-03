import { Link, Outlet } from "react-router";


export default function EmpSidebar() {
    return (
        <>
            <div className="sidebar">
                <h3>매장관리</h3>
                <ul>
                    <li><a href="/hq/storeAccount">매장 목록</a></li>                
                    <li><a href="/hq/storeRegister">매장 등록</a></li>
                    <li><a href="/hq/empList">직원 목록</a></li>
                    <li><a href="/hq/empRegister">직원 등록</a></li>
                </ul>
            </div>
            <Outlet />
        </>
    );
}