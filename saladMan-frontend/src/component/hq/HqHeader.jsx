import React, { useState, useEffect } from 'react';
import { useAtomValue,useAtom } from 'jotai';
import { userAtom, accessTokenAtom } from '/src/atoms';
import { useNavigate } from 'react-router-dom';
import { myAxios } from '/src/config';
import AlarmModal from '/src/component/common/AlarmModal';
import { fcmTokenAtom, alarmsAtom } from "/src/atoms";

import ChatModal from '../Chat/ChatModal';
import ChatSidebar from '../Chat/ChatSidebar';
import useChatSSE from '../Chat/useChatSSE';

import './HqHeader.css';

const HqHeader = () => {
    const [user, setUser] = useAtom(userAtom);
    const token = useAtomValue(accessTokenAtom);
    const jwt = token?.replace(/^Bearer\s+/i, '');
    const navigate = useNavigate();

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

  const setRoomsFn = (updater) => {
  setChatRooms(prev => {
    const next = typeof updater === "function" ? updater(prev) : updater;
    setChatUnreadTotal(next.reduce((sum, r) => sum + (r.unReadCount || 0), 0));
    return next;
  });
};
  // 사이드바 열릴 때 방 목록 fetch
useEffect(() => {
  if (!token) return;
  (async () => {
    try {
      const res = await myAxios(token).get('/chat/my/rooms');
      const rooms = res.data || [];
      setChatRooms(() => rooms);
      setChatUnreadTotal(rooms.reduce((sum, r) => sum + (r.unReadCount || 0), 0));
    } catch {
      setChatRooms(() => []);
      setChatUnreadTotal(0);
    }
  })();
}, [token]);

  // 로컬 스토리지에 알림 설정 저장
  useEffect(() => {
    sessionStorage.setItem('chatAlarmOn', chatAlarmOn);
  }, [chatAlarmOn]);

  // 새로운 메시지 오면 모달에 쌓기
  const showChatModal = (msg) =>
    setChatModalQueue((q) => [...q, msg].slice(-5));

  // SSE 연결 (newMessage)
  useChatSSE({
    enabled: !!jwt,
    user,
    token: jwt,
    rooms: chatRooms,
    setRooms: setRoomsFn,
    onUnreadTotal: setChatUnreadTotal,
    onModal: chatAlarmOn ? showChatModal : undefined,
    activeRoomId,
  });


  // 모달 자동 제거
  useEffect(() => {
    if (chatModalQueue.length === 0) return;
    const timer = setTimeout(() => setChatModalQueue((q) => q.slice(1)), 3200);
    return () => clearTimeout(timer);
  }, [chatModalQueue]);

  // 로그아웃
  const logout = (e) => {
    e.preventDefault();
    sessionStorage.clear();
    setUser(null);
    navigate('/');
  };

  
  // fcm알람
  const [isAlarmOpen, setIsAlarmOpen] = useState(false);
  const [alarms, setAlarms] = useAtom(alarmsAtom);
  

  const fetchAlarms = async (open = false) => {
  if (!token) return;
    try {
      const res = await myAxios(token).post("/alarms");
      setAlarms(res.data);
      if (open) setIsAlarmOpen(true);
    } catch (err) {
      console.error("알림 데이터를 가져오는데 실패했습니다.", err);
    }
  };

  // 초기 알림 로딩
  useEffect(() => {
    fetchAlarms(false);
  }, [token]);

  // 모달 열기
  const openModal = () => {
    fetchAlarms(true);
  };

  // 모달 닫기
  const closeModal = () => setIsAlarmOpen(false);


  return (
    <>
      <div className="header">
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
                    <li><a href="/hq/HqInventoryList">재고 관리</a></li>
                    <li><a href="/hq/HqInventoryExpiration">유통기한 관리</a></li>
                    <li><a href="/hq/HqDisposalList">폐기 재료</a></li>
                    <li><a href="/hq/HqDisposalRequestList">폐기 요청 재료</a></li>
                    <li><a href="/hq/HqIngredientSetting">재료 설정</a></li>
                    <li><a href="/hq/HqInventoryRecord">입/출고 내역</a></li>
                    <li><a href="/hq/HqCategoryIngredientManagePage">카테고리/재료 관리</a></li>
                </ul>
            </div>
        </div>
        <div className="dropdown-container">
            <a href="/hq/orderRequest">수주</a>
            <div className="dropdown">
                <ul>
                    <li><a href="/hq/orderRequest">수주 목록</a></li>
                    <li><a href="/hq/orderItemManage">재료별 수주 가능 여부 설정</a></li>
                </ul>
            </div>
        </div>
        <div className="dropdown-container">
            <a href="/hq/totalMenu">메뉴</a>
            <div className="dropdown">
                <ul>
                    <li><a href="/hq/totalMenu">전체 메뉴</a></li>
                    <li><a href="/hq/updateMenu">메뉴 등록</a></li>
                    <li><a href="/hq/recipe">레시피 조회</a></li>
                </ul>
            </div>
        </div>
        <div className="dropdown-container">
            <a href="/hq/totalSales">매출</a>
            <div className="dropdown">
                <ul>
                    <li><a href="/hq/totalSales">매출 조회(전사)</a></li>
                    <li><a href="/hq/storeSales">매출 조회(지점)</a></li>
                </ul>
            </div>
        </div>
        <div className="dropdown-container">
            <a href="/hq/storeAccount">매장관리</a>
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
          {user?.name ? (
            <>
              {user.name} | <a onClick={logout}>로그아웃</a>
            </>
          ) : null}
        </div>

        {/* ── 채팅 아이콘 ───────────────────────────────── */}
        {token && (
          <button
            className="global-chat-badge"
            style={{
              position: 'absolute',
              top: -10,
              right: 70,
              background: 'none',
              border: 'none',
              borderRadius: '50%',
              width: 45,
              height: 75,
              fontSize: 28,
              boxShadow: 'none',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 10000,
              padding: 0,
              cursor: 'pointer',
            }}
            onClick={() => setShowSidebar(true)}
            title="채팅"
          >
            <img
              src="/chatIcon.png"
              alt="채팅"
              style={{
                width: 40,
                height: 40,
                display: 'block',
                objectFit: 'contain',
              }}
            />
            {chatUnreadTotal > 0 && (
              <span
                style={{
                  position: 'absolute',
                  top: 18,
                  left: 25,
                  background: 'red',
                  color: 'white',
                  borderRadius: '50%',
                  fontSize: '10px',
                  minWidth: '8px',
                  textAlign: 'center',
                  fontWeight: 700,
                  padding: '1px 6px',
                }}
              >
                {chatUnreadTotal}
              </span>
            )}
          </button>
        )}
      </div>

      {/* ── 채팅 모달 ────────────────────────────────────── */}
      {chatAlarmOn && chatModalQueue.length > 0 && (
        <div
          style={{
            position: 'fixed',
            top: 22,
            right: 28,
            zIndex: 10001,
            display: 'flex',
            flexDirection: 'column-reverse',
            gap: 8,
          }}
        >
          {chatModalQueue.map((msg, idx) => (
            <ChatModal
              key={idx}
              message={msg}
              onClose={() =>
                setChatModalQueue((q) => q.filter((_, i) => i !== idx))
              }
              onGoRoom={(roomId) => {
                setShowSidebar(true);
                setActiveRoomId(roomId);
                setChatModalQueue((q) => q.filter((_, i) => i !== idx));
              }}
            />
          ))}
        </div>
      )}

      {/* ── 채팅 사이드바 ────────────────────────────────── */}
      <ChatSidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        chatAlarmOn={chatAlarmOn}
        setChatAlarmOn={setChatAlarmOn}
        rooms={chatRooms}
        setRooms={setRoomsFn}

        activeRoomId={activeRoomId}
        setActiveRoomId={setActiveRoomId}
        currentStoreId={user?.storeId}
      />

      {/* fcm알람 */}
      {user?.id && (
        <>
          <div onClick={openModal}
          style={{position: "absolute", top: 18, right: 49, fontSize: 23, cursor:"pointer"}}>
            <img src="/notification-bell.png" alt="" style={{width:28}}/>
          </div>
          {alarms.length > 0 && (
            <div style={{
              width: '5px', height: '5px', backgroundColor: 'red',
              position: 'absolute', top: 21, right: 47, borderRadius: '50%'
            }}></div>
          )}
        </>
      )}

      {isAlarmOpen && (
        <AlarmModal
          alarms={alarms}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default HqHeader;
