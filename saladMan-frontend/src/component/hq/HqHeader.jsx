import { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { userAtom, initStore, accessTokenAtom } from "/src/atoms";
import { useNavigate } from "react-router";
import './HqHeader.css';

const HqHeader = () => {
    const [store, setStore] = useAtom(userAtom);
    const [user, setUser] = useAtom(userAtom);
    const [token, setAccessToken] = useAtom(accessTokenAtom);
    const [isScrolled, setIsScrolled] = useState(false);

  // 채팅 알림 on/off
  const [chatAlarmOn, setChatAlarmOn] = useState(
    () => sessionStorage.getItem('chatAlarmOn') !== 'false'
  );
  // 모달 큐, 방 목록, 언읽 토탈, 사이드바 열림 여부
  const [chatModalQueue, setChatModalQueue] = useState([]);
  const [chatRooms, setChatRooms] = useState([]);
  const [chatUnreadTotal, setChatUnreadTotal] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);
  const [activeRoomId, setActiveRoomId] = useState(null);

  // 사이드바 열릴 때 방 목록 fetch
  useEffect(() => {
    if (!token || !showSidebar) return;
    (async () => {
      try {
        const res = await myAxios(token).get('/chat/my/rooms');
        const rooms = res.data || [];
        setChatRooms(rooms);
        setChatUnreadTotal(rooms.reduce((sum, r) => sum + (r.unReadCount || 0), 0));
      } catch {
        setChatRooms([]);
        setChatUnreadTotal(0);
      }
    })();
  }, [token, showSidebar]);

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 0);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    return (
        <div className={`header ${isScrolled ? 'scrolled' : ''}`}>
            <div className="logo">
                <a href="/hq/HqDashboard">
                    <img src="/샐러드맨로고(그린).png" alt="로고" />
                </a>
            </div>
            <div className="go-home-btn">
                <a href="/mainPage">홈페이지로 &nbsp;▶</a>
            </div>
            <div className="nav">
                <div className="dropdown-container">
                    <a href="/hq/HqInventoryList">재고</a>
                    <div className="dropdown">
                        <ul>
                            <li><a href="/hq/HqInventoryList">재고 목록</a></li>
                            <li><a href="/hq/HqInventoryExpiration">유통기한 목록</a></li>
                            <li><a href="/hq/HqDisposalList">폐기 목록</a></li>
                            <li><a href="/hq/HqIngredientSetting">재료 설정</a></li>
                            <li><a href="/hq/HqInventoryRecord">재고 기록</a></li>
                        </ul>
                    </div>
                </div>
                <div className="dropdown-container">
                    <a href="#">수주</a>
                    <div className="dropdown">
                        <ul>
                            <li><a href="/hq/orderRequest">수주 목록</a></li>
                            <li><a href="/hq/orderItemManage">수주품목 설정</a></li>
                        </ul>
                    </div>
                </div>
                <div className="dropdown-container">
                    <a href="#">메뉴</a>
                    <div className="dropdown">
                        <ul>
                            <li><a href="/hq/totalMenu">전체 메뉴</a></li>
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
                            <li><a href="/hq/storeSales">매출 조회(지점)</a></li>
                        </ul>
                    </div>
                </div>
                <div className="dropdown-container">
                    <a href="#">매장관리</a>
                    <div className="dropdown">
                        <ul>
                            <li><a href="/hq/storeAccount">매장 목록</a></li>
                            <li><a href="/hq/storeRegister">매장 등록</a></li>
                            <li><a href="/hq/empList">직원 목록</a></li>
                            <li><a href="/hq/empRegister">직원 등록</a></li>
                        </ul>
                    </div>
                </div>
                <div className="dropdown-container">
                    <a href="/hq/HqNoticeList">공지사항</a>
                    <div className="dropdown">
                        <ul>
                            <li><a href="/hq/HqNoticeList">공지사항</a></li>
                            <li><a href="/hq/HqComplaintList">불편사항</a></li>
                            <li><a href="/hq/alarmList">알림 목록</a></li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="user-info">
                {store && store.name && (
                    <>
                        {store.name} | <a onClick={logout}>로그아웃</a>
                    </>
                )}
            </div>
        </div>
    );
};

export default HqHeader;
