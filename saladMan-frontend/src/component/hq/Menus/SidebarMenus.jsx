import '../Sidebar.css'

export default function SidebarMenus() {
    return(
        <>
            <div className="sidebar">
                <h1>메뉴</h1>
                <ul>
                    <li><a href="/hq/allMenus">전메뉴 조회</a></li>
                    <li><a href="/hq/updateMenu">메뉴 등록</a></li>
                    <li><a href="/hq/recipe">레시피 조회</a></li>
                </ul>
            </div>
        </>
    )
}