import '../Sidebar.css'

export default function SidebarMenus() {
    return(
        <>
            <div className="sidebar">
                <h1>매출</h1>
                <ul>
                    <li><a href="/store/totalMenu">매출 조회</a></li>
                    <li><a href="/store/paymentList">주문내역 조회</a></li>
                </ul>
            </div>
        </>
    )
}