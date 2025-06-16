import '../HqSidebar.css'

export default function HqSidebarSales() {
    return(
        <>
            <div className="sidebar">
                <h1>매출</h1>
                <ul>
                    <li><a href="/hq/totalSales">매출 조회(전사)</a></li>
                    <li><a href="/hq/storeSales">매출 조회(지점)</a></li>
                </ul>
            </div>
        </>
    )
}