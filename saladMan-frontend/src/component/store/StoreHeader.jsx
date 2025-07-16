// src/component/common/StoreHeader.jsx
import React, { useState, useEffect } from 'react';
import { useAtom } from 'jotai';
import { userAtom, initStore, accessTokenAtom } from '/src/atoms';
import { useNavigate } from 'react-router-dom';
import { myAxios } from '/src/config';
import ChatModal from '../Chat/ChatModal';
import ChatSidebar from '../Chat/ChatSidebar';
import useChatSSE from '../Chat/useChatSSE';
import AlarmModal from '/src/component/common/AlarmModal';
import { alarmsAtom } from "/src/atoms";
import './StoreHeader.css';

const StoreHeader = () => {
  // 사용자·토큰 상태
  const [store, setStore] = useAtom(userAtom);
  const [token, setAccessToken] = useAtom(accessTokenAtom);
  const [user, setUser] = useAtom(userAtom); // userAtom에 유저 정보가 들어있다면 그대로 사용
  const navigate = useNavigate();

  // 로그아웃
  const logout = (e) => {
    e.preventDefault();
    sessionStorage.clear();
    setStore(initStore);
    setUser(null);
    setAccessToken('');
    navigate('/');
  };

  // ── 채팅 알림 상태 ─────────────────────────────────
  const jwt = token?.replace(/^Bearer\s+/i, '');
  const [chatAlarmOn, setChatAlarmOn] = useState(
    () => sessionStorage.getItem('chatAlarmOn') !== 'false'
  );
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

  // 사이드바 열릴 때 방 목록 조회
  useEffect(() => {
    if (!token) return;
    (async () => {
      try {
        const res = await fetch('/chat/my/rooms');
        const rooms = await res.json();
        setChatRooms(()=>rooms);
        setChatUnreadTotal(rooms.reduce((sum, r) => sum + (r.unReadCount || 0), 0));
      } catch {
      setChatRooms(() => []);
        setChatUnreadTotal(0);
      }
    })();
  }, [token]);

  // 알림 on/off 저장
  useEffect(() => {
    sessionStorage.setItem('chatAlarmOn', chatAlarmOn);
  }, [chatAlarmOn]);

  // 모달에 메시지 추가
  const showChatModal = (msg) =>
    setChatModalQueue((q) => [...q, msg].slice(-5));

  // SSE 연결
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
    const timer = setTimeout(() => {
      setChatModalQueue((q) => q.slice(1));
    }, 3200);
    return () => clearTimeout(timer);
  }, [chatModalQueue]);

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
      <div className="storeHeader">
        <div className="logo">
          <a href="/store/StoreDashboard">
            <img src="/샐러드맨로고(블루).png" alt="로고" />
          </a>
        </div>

        <div className="storeNav">
          <div className="storeDropdownContainer">
            <a href="/store/StoreInventoryList">재고</a>
            <div className="storeDropdown">
              <ul>
                <li><a href="/store/StoreInventoryList">재고 관리</a></li>
                <li><a href="/store/StoreInventoryExpiration">유통기한 관리</a></li>
                <li><a href="/store/StoreDisposalList">폐기신청 목록</a></li>
                <li><a href="/store/StoreInventoryRecord">재료 입고 내역</a></li>
                <li><a href="/store/StoreInventoryUsageList">재료 사용 내역</a></li>
                <li><a href="/store/StoreIngredientSetting">재료 설정</a></li>
              </ul>
            </div>
          </div>
          <div className="storeDropdownContainer">
            <a href="/store/orderList">발주</a>
            <div className="storeDropdown">
              <ul>
                <li><a href="/store/orderList">발주 목록</a></li>
                <li><a href="/store/orderApply">발주 신청</a></li>
                <li><a href="/store/orderSettings">자동 발주 설정</a></li>
              </ul>
            </div>
          </div>
          <div className="storeDropdownContainer">
            <a href="/store/totalMenu">메뉴</a>
            <div className="storeDropdown">
              <ul>
                <li><a href="/store/totalMenu">전체 메뉴</a></li>
                <li><a href="/store/menuStatus">판매 메뉴</a></li>
                <li><a href="/store/recipe">레시피 조회</a></li>
              </ul>
            </div>
          </div>
          <div className="storeDropdownContainer">
            <a href="storeSales">매장관리</a>
            <div className="storeDropdown">
              <ul>
                <li><a href="storeSales">매출 조회</a></li>
                <li><a href="paymentList">주문 내역</a></li>
                <li><a href="/store/StoreEmployeeList">직원 관리</a></li>
                <li><a href="/store/empSchedule">직원 일정관리</a></li>
              </ul>
            </div>
          </div>
          <div className="storeDropdownContainer">
            <a href="/store/otherStoreInven">점포 조회</a>
            <div className="storeDropdown">
              <ul>
                <li><a href="/store/otherStoreInven">타 매장 재고 조회</a></li>
              </ul>
            </div>
          </div>
          <div className="storeDropdownContainer">
            <a href="/store/StoreNoticeList">공지사항</a>
            <div className="storeDropdown">
              <ul>
                <li><a href="/store/StoreNoticeList">공지사항</a></li>
                <li><a href="/store/StoreComplaintList">불편사항</a></li>
                <li><a href="/store/alarmList">알림 목록</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="user-info">
          {store?.name && (
            <>
              {store.name} | <a onClick={logout}>로그아웃</a>
            </>
          )}
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

      {/* ── 채팅 모달 ───────────────────────────────────── */}
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
        currentStoreId={store?.storeId}
      />

      {/* fcm알람 */}
      {user?.id && (
        <>
          <div onClick={openModal}
            style={{ position: "absolute", top: 18, right: 49, fontSize: 23, cursor: "pointer" }}>
            <img src="/notification-bell.png" alt="" style={{ width: 28 }} />
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

export default StoreHeader;














