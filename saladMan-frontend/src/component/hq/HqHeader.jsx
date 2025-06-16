import './HqHeader.css';

const HqHeader = () => {
    return (
        <>
            <div className="header">
                <div className="nav">
                    <div className="dropdown-container">
                        <a href="/hq/HqInventoryList">재고</a>
                        <div className="dropdown">
                            <ul>
                                <li><a href="/hq/HqInventoryList">전체 재고 조회</a></li>
                                <li><a href="/hq/HqInventoryRecord">재고 입출고 내역</a></li>
                                <li><a href="/hq/HqInventoryExpiration">유통기한 조회</a></li>
                                <li><a href="/hq/HqDisposalList">폐기 목록 조회</a></li>
                                <li><a href="/hq/HqIngredientSetting">매장별 재료 설정</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="dropdown-container">
                        <a href="#">발주</a>
                        <div className="dropdown">
                            <ul>
                                <li><a href="/hq/orderRequest">발주목록조회</a></li>
                                <li><a href="/hq/orderItemManage">발주품목설정</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="dropdown-container">
                        <a href="#">메뉴</a>
                        <div className="dropdown">
                            <ul>
                                <li><a href="/hq/allMenus">전메뉴 조회</a></li>
                                <li><a href="/hq/updateMenu">메뉴 등록</a></li>
                                <li><a href="/hq/recipe">레시피 조회</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="dropdown-container">
                        <a href="#">매출</a>
                        <div className="dropdown">
                            <ul>
                                <li><a href="/hq/totalSales">매출 조회(전사)</a></li>
                                <li><a href="/hq/storeSales">매출 조회(매장)</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="dropdown-container">
                        <a href="#">매장관리</a>
                        <div className="dropdown">
                            <ul>
                                <li><a href="/hq/storeRegister">매장등록</a></li>
                                <li><a href="/hq/storeAccount">매장계정</a></li>
                                <li><a href="/hq/empList">직원조회</a></li>
                                <li><a href="/hq/empRegister">직원등록</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="dropdown-container">
                        <a href="#">점포조회</a>
                        <div className="dropdown">
                            <ul>
                                <li><a href="#">매장 위치 조회</a></li>
                                <li><a href="/hq/storeStock">매장 재고 조회</a></li>
                            </ul>
                        </div>
                    </div>
                    <div className="dropdown-container">
                        <a href="/hq/HqNoticeList">공지사항</a>
                        <div className="dropdown">
                            <ul>
                                <li><a href="/hq/HqNoticeList">공지사항 조회</a></li>
                                <li><a href="/hq/HqComplaintList">불편사항 조회</a></li>
                                <li><a href="/hq/notification">알림 목록</a></li>
                                <li><a href="#">쪽지</a></li>
                            </ul>
                        </div>
                    </div>
                </div>
                <div className="user-info">
                    00지점 | 홍길동 👤
                </div>
            </div>

        </>
    )
};

export default HqHeader;
