import './Header.css'
import MenusSidebar from './MenusSidebar'

export default function Header() {

    return(
        <>
            <div className="header">
                <div className="nav">
                <a href="#" className="active">재고</a>
                <div className="dropdown">
                    <a href="#">전체 재고 조회</a>
                    <a href="#">재고 입출고 내역</a>
                    <a href="#">유통기한 조회</a>
                    <a href="#">폐기 목록 조회</a>
                    <a href="#">매장별 재료 설정</a>
                </div>  
                <a href="/hq/orderSidebar">발주</a>
                <a href="#">메뉴</a>
                <a href="#">매출</a>
                <a href="/hq/empSidebar">매장관리</a>
                <a href="#">점포조회</a>
                <a href="#">공지사항</a>
                </div>
                <div className="user-info">
                00지점 | 홍길동 👤
                </div>
            </div>
            
        </>
    )
} 