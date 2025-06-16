import styles from './Header.module.css';

const Header = () => {

    return(
        <>
            <div className={styles.header}>
                <div className={styles.nav}>
                    <div className={styles.dropdownContainer}>
                        <a href="#">재고</a>
                        <div className={styles.dropdown}>
                            <ul>
                                <li><a href="#">전체 재고 조회</a></li>
                                <li><a href="#">재고 입출고 내역</a></li>
                                <li><a href="#">유통기한 조회</a></li>
                                <li><a href="#">폐기 목록 조회</a></li>
                                <li><a href="#">매장별 재료 설정</a></li>
                            </ul>
                        </div>  
                    </div>
                    <div className={styles.dropdownContainer}>
                        <a href="#">발주</a>
                        <div className={styles.dropdown}>
                            <ul>
                                <li><a href="#">발주목록조회</a></li>
                                <li><a href="#">발주목록상세</a></li>
                                <li><a href="#">발주신청</a></li>
                                <li><a href="#">발주입고검수</a></li>
                                <li><a href="#">발주설정</a></li>
                                <li><a href="#">입고/재고사용리스트</a></li>
                            </ul>
                        </div>  
                    </div>
                    <div className={styles.dropdownContainer}>
                        <a href="#">메뉴</a>
                        <div className={styles.dropdown}>
                            <ul>
                                <li><a href="/store/allMenus">전메뉴 조회</a></li>
                                <li><a href="/store/updateMenu">메뉴 등록</a></li>
                                <li><a href="/store/recipe">레시피 조회</a></li>
                            </ul>
                        </div>  
                    </div>
                    <div className={styles.dropdownContainer}>
                        <a href="#">매출</a>
                        <div className={styles.dropdown}>
                            <ul>
                                <li><a href="#">매출 조회</a></li>
                                <li><a href="#">주문내역 조회</a></li>
                            </ul>
                        </div>  
                    </div>
                    <div className={styles.dropdownContainer}>
                        <a href="#">매장관리</a>
                        <div className={styles.dropdown}>
                            <ul>
                                <li><a href="#">직원등록</a></li>
                                <li><a href="#">직원조회</a></li>
                                <li><a href="#">매장등록</a></li>
                                <li><a href="#">매장계정조회</a></li>
                            </ul>
                        </div> 
                    </div>
                    <div className={styles.dropdownContainer}>
                        <a href="#">점포 조회</a>
                        <div className={styles.dropdown}>
                            <ul>
                                <li><a href="#">매장 위치 조회</a></li>
                                <li><a href="#">매장 재고 조회</a></li>
                            </ul>
                        </div> 
                    </div>
                    <div className={styles.dropdownContainer}>
                        <a href="#">공지사항</a>
                        <div className={styles.dropdown}>
                            <ul>
                                <li><a href="#">공지사항 조회</a></li>
                                <li><a href="#">불편사항 조회</a></li>
                                <li><a href="#">쪽지</a></li>
                                <li><a href="/store/notification">알림 목록</a></li>
                            </ul>
                        </div> 
                    </div>
                </div>
                <div className={styles.userInfo}>
                    00지점 | 홍길동 👤
                </div>
            </div>
        </>
    )
} 

export default Header;
