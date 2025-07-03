import'../HqSidebar.css'

export default function HqSidebarMenus() {
    return(
        <>
            <div className="sidebar">
                <h1>메뉴</h1>
                <ul>
                    <li><a href="/hq/totalMenu">전체 메뉴</a></li>
                    <li><a href="/hq/updateMenu">메뉴 등록</a></li>
                    <li><a href="/hq/recipe">레시피 조회</a></li>
                </ul>
            </div>
        </>
    )
}