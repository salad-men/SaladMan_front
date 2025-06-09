import './Header.css'
import MenusSidebar from './MenusSidebar'

export default function Header() {
    const [isOpen, setIsOpen] = useState(false);

    return(
        <>
            <div class="header">
                <div class="nav">
                <a href="#" class="active">재고</a>
                <div class="dropdown">
                    <a href="#">전체 재고 조회</a>
                    <a href="#">재고 입출고 내역</a>
                    <a href="#">유통기한 조회</a>
                    <a href="#">폐기 목록 조회</a>
                    <a href="#">매장별 재료 설정</a>
                </div>  
                <a href="#">발주</a>
                <a href="#">메뉴</a>
                <a href="#">매출</a>
                <a href="#">매장관리</a>
                <a href="#">점포조회</a>
                <a href="#">공지사항</a>
                </div>
                <div class="user-info">
                00지점 | 홍길동 👤
                </div>
            </div>
            <MenusSidebar/>
        </>
    )
} 