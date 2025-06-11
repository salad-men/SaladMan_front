import { Link, Outlet } from "react-router";


export default function EmpSidebar() {
    return (
        <>
            <div className="sidebar">
                <h3>매장관리</h3>
                <ul>
                    <li><a href="storeAccount">매장및계정조회</a></li>                

                    <li><a href="storeRegister">매장등록</a></li>
                    <li><a href="empList">직원조회</a></li>
                    <li><a href="empRegister">직원등록</a></li>
                </ul>
            </div>
            <Outlet />
        </>
    );
}