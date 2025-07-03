import '../Sidebar.css'

export default function SidebarMenus() {
    return(
        <>
            <div className="sidebar">
                <h1>점포 조회</h1>
                <ul>
                    <li><a href="/store/OtherStoreInven">타 매장 재고 조회</a></li>
                </ul>
            </div>
        </>
    )
}