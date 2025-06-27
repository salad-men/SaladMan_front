import '../Sidebar.css'

export default function SidebarMenus() {
    return(
        <>
            <div className="sidebar">
                <h1>메뉴</h1>
                <ul>
                    <li><a href="/store/findOtherStore">매장 위치 조회</a></li>
                    <li><a href="/store/OtherStoreInven">매장 재고 조회</a></li>
                </ul>
            </div>
        </>
    )
}