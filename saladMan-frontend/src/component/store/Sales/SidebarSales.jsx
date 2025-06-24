import '../Sidebar.css'

export default function SidebarMenus() {
    return(
        <>
            <div className="sidebar">
                <h1>매출</h1>
                <ul>
                    <li><a href="/store/totalMenu">매출 조회</a></li>
                    <li><a href="/store/menuStatus">판매 메뉴 관리</a></li>
                </ul>
            </div>
        </>
    )
}