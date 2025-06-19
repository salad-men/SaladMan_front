import '../Sidebar.css'

export default function SidebarMenus() {
    return(
        <>
            <div className="sidebar">
                <h1>메뉴</h1>
                <ul>
                    <li><a href="/store/totalMenu">전메뉴 조회</a></li>
                    <li><a href="/store/menuStatus">판매 메뉴 관리</a></li>
                    <li><a href="/store/recipe">레시피 조회</a></li>
                </ul>
            </div>
        </>
    )
}