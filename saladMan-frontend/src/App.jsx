import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from '@user/page/MainPage';
import BrandIntro from '@user/page/BrandIntro';
import SloganIntro from '@user/page/SloganIntro';
import MenuPage from '@user/page/Menu';
import Nutrition from '@user/page/Nutrition';
import FindStorePage from '@user/page/FindStore';
import NewsPage from '@user/page/NewsPage';
import PraiseStorePage from '@user/page/PraiseStorePage';
import EventPage from '@user/page/EventPage';



import HqInventoryList from '@hq/Inventory/HqInventoryList';
import HqInventoryExpiration from '@hq/Inventory/HqInventoryExpiration';
import HqDisposalList from '@hq/Inventory/HqDisposalList';
import HqIngredientSetting from '@hq/Inventory/HqIngredientSetting';
import HqInventoryRecord from '@hq/Inventory/HqInventoryRecord';

// 지현
import HqLayout from '@hq/HqLayout';
import HqTotalMenu from '@hq/Menu/HqTotalMenu';
import HqUpdateMenu from '@hq/Menu/HqUpdateMenu';
import HqRecipe from '@hq/Menu/HqRecipe';
import HqTotalSales from '@hq/Sales/HqTotalSales';
import HqStoreSales from '@hq/Sales/HqStoreSales';
import HqAlarmList from '@hq/Notice/HqAlarmList';

import StoreLayout from '@store/StoreLayout';
import TotalMenu from '@store/Menu/TotalMenu';
import MenuStatus from '@store/Menu/MenuStatus';
import Recipe from '@store/Menu/Recipe';
import PaymentList from '@store/storeManagement/PaymentList';
import StoreSales from '@store/storeManagement/StoreSales';
import OtherStoreInven from '@store/FindStore/OtherStoreInven';

import StoreInventoryList from '@store/Inventory/StoreInventoryList';
import StoreInventoryExpiration from '@store/Inventory/StoreInventoryExpiration';
import StoreDisposalList from '@store/Inventory/StoreDisposalList';
import StoreIngredientSetting from '@store/Inventory/StoreIngredientSetting';
import StoreInventoryRecord from '@store/Inventory/StoreInventoryRecord';

import HqNoticeList from '@hq/Notice/HqNoticeList';
import HqNoticeDetail from '@hq/Notice/HqNoticeDetail';
import HqNoticeWrite from "@hq/Notice/HqNoticeWrite";
import HqNoticeModify from "@hq/Notice/HqNoticeModify";
import NewsDetailPage from '@user/page/NewDetailPage';
import KioskPage from '@user/page/KioskPage';
import KioskMenuPage from '@user/page/KioskMenuPage';

import StoreRegister from '@hq/storeManagement/StoreRegister'
import EmployeeRegister from '@hq/storeManagement/EmployeeRegister'
import EmployeeList from '@hq/storeManagement/EmployeeList'
import StoreAccountList from '@hq/storeManagement/StoreAccountList'
import OrderRequestList from '@hq/order/OrderRequestList'
import OrderRequestDetail from '@hq/order/OrderRequestDetail'
import OrderItemManage from '@hq/order/OrderItemManage'
import OrderList from '@store/order/OrderList';
import OrderApply from '@store/order/OrderApply';
import OrderDetail from '@store/order/OrderDetail';
import StockInspection from '@store/order/StockInspection';
import OrderSettings from '@store/order/OrderSettings';
import StockLog from '@store/order/StockLog';
import EmpSchedule from '@store/storeManagement/empSchedule';
import StoreEmployeeList from '@store/storeManagement/StoreEmployeeList';

import HqComplaintList from '@hq/Complaint/HqComplaintList';
import HqComplaintDetail from '@hq/Complaint/HqComplaintDetail';
import AlarmList from '@store/notice/AlarmList';
import StoreNoticeList from '@store/notice/StoreNoticeList';
import StoreNoticeDetail from '@store/notice/StoreNoticeDetail';
import StoreComplaintList from '@store/complaint/StoreComplaintList';
import StoreComplaintDetail from '@store/complaint/StoreComplaintDetail';

import HqDashboard from '@hq/dashboard/HqDashboard';
import StoreDashboard from '@store/dashboard/StoreDashboard';

import Login from './component/common/Login';
import StoreAccountDetail from '@hq/storeManagement/StoreAccountDetail';
import StoreAccountModify from '@hq/storeManagement/StoreAccountModify';
import { useEffect, useState, useRef } from 'react';
import { useAtom, useSetAtom } from 'jotai';
import { fcmTokenAtom,alarmsAtom } from './atoms';
import { firebaseReqPermission, registerServiceWorker } from './firebaseconfig';
import ChatModal from "./component/Chat/ChatModal";
import useChatSSE from "./component/Chat/useChatSSE";
import ChatSidebar from "./component/Chat/ChatSidebar";

import KioskLogin from '@user/kiosk/KioskLogin';
import KioskLayout from '@user/kiosk/KioskLayout';

import { userAtom } from "/src/atoms";
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "/src/atoms";

function App() {
  const [alarm, setAlarm] = useState({});
  const setFcmToken = useSetAtom(fcmTokenAtom);
  const [alarms, setAlarms] = useAtom(alarmsAtom);


  useEffect(() => {
    const init = async () => {
      registerServiceWorker();
      await navigator.serviceWorker.ready;
      firebaseReqPermission(setFcmToken, setAlarm);
    };
    init();
  }, []);


  useEffect(() => {
    JSON.stringify(alarm) !== "{}" && setAlarms([...alarms, alarm]);
  },[alarm])


  // ====== 채팅 알림 전역 ======
  const user = useAtomValue(userAtom); 
  const token = useAtomValue(accessTokenAtom);
  const jwt = token?.replace(/^Bearer\s+/i, ""); 

const [chatAlarmOn, setChatAlarmOn] = useState(
  () => sessionStorage.getItem("chatAlarmOn") !== "false"
); 
  const [chatModalQueue, setChatModalQueue] = useState([]); 
  const [chatRooms, setChatRooms] = useState([]);           
  const [chatUnreadTotal, setChatUnreadTotal] = useState(0);
  const [showSidebar, setShowSidebar] = useState(false);

  // 채팅 알림 모달
  const showChatModal = (msg) => {
    setChatModalQueue(q => [...q, msg].slice(-5));
  };

  // 자동 닫힘 (오래된 것부터)
  useEffect(() => {
  if (chatModalQueue.length === 0) return;
  // 각 알림마다 3.2초 후 자동 닫힘 (최신 알림에만 타이머를 거는 방식)
  const timer = setTimeout(() => {
    setChatModalQueue(q => q.slice(1));
  }, 3200);
  return () => clearTimeout(timer);
  }, [chatModalQueue]);
  
  useEffect(() => {
  sessionStorage.setItem("chatAlarmOn", chatAlarmOn);
  }, [chatAlarmOn]);

  // ===== SSE 연결 =====
  useChatSSE({
    enabled: !!jwt,
    user,
    token: jwt,
    rooms: chatRooms,
    setRooms: setChatRooms,
    onUnreadTotal: setChatUnreadTotal,
    onModal: chatAlarmOn ? showChatModal : undefined
  });

  return (
    <>
      {/* 채팅 */}
      {chatAlarmOn && chatModalQueue.length > 0 &&
      <div
        style={{
          position: "fixed",
          top: 22,
          right: 28,
          zIndex: 10001,
          display: "flex",
          flexDirection: "column-reverse",
          gap: 8,
        }}
      >
        {chatModalQueue.map((msg, idx) => (
          <ChatModal
            key={idx}
            message={msg}
            onClose={() => setChatModalQueue(q => q.filter((_, i) => i !== idx))}
          />
        ))}
      </div>
    }
      {/* 채팅 버튼 */}
      <button
      className="global-chat-badge"
      style={{
        position: "fixed",
        top: -15,             // 상단!
        right: 70,           // 오른쪽 여백 조절
        background: "none",  // 초록 원 제거!
        color: "#4d774e",
        border: "none",
        borderRadius: "50%",
        width: 45,
        height: 50,
        fontSize: 28,
        boxShadow: "none",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        zIndex: 10000,
        padding: 0,
      }}
      onClick={() => setShowSidebar(true)}
      title="채팅"
    >
      <span role="img" aria-label="chat" style={{ fontSize: 30 }}>💬</span>
      {chatUnreadTotal > 0 && (
        <span style={{
          position: "absolute", top: -2, left: 30, background: "red", color: "white",
          borderRadius: "50%", fontSize: "12px", minWidth: "18px", textAlign: "center",
          fontWeight: 700, padding: "1px 6px"
        }}>
          {chatUnreadTotal}
        </span>
      )}
    </button>

      <ChatSidebar
        isOpen={showSidebar}
        onClose={() => setShowSidebar(false)}
        chatAlarmOn={chatAlarmOn}
        setChatAlarmOn={setChatAlarmOn}
        rooms={chatRooms}
        setRooms={setChatRooms}
      />

      <Routes>

        <Route element={
          <HqLayout
            chatAlarmOn={chatAlarmOn}
            setChatAlarmOn={setChatAlarmOn}
            chatUnreadTotal={chatUnreadTotal}
            showChatModal={showChatModal}
            setChatUnreadTotal={setChatUnreadTotal}
            />
          }>

          {/* 재고 */}
          <Route path='/hq/HqInventoryList' element={<HqInventoryList />} />
          <Route path='/hq/HqInventoryExpiration' element={<HqInventoryExpiration />} />
          <Route path='/hq/HqDisposalList' element={<HqDisposalList />} />
          <Route path='/hq/HqIngredientSetting' element={<HqIngredientSetting />} />
          <Route path='/hq/HqInventoryRecord' element={<HqInventoryRecord />} />

          {/*발주*/}
          <Route path="/hq/orderRequest" element={<OrderRequestList />} />
          <Route path="/hq/orderRequestDetail" element={<OrderRequestDetail />} />
          <Route path="/hq/orderItemManage" element={<OrderItemManage />} />

          {/* 메뉴 */}
          <Route path='/hq/totalMenu' element={<HqTotalMenu />} />
          <Route path='/hq/updateMenu' element={<HqUpdateMenu />} />
          <Route path='/hq/recipe' element={<HqRecipe />} />

          {/* 매출 */}
          <Route path='/hq/totalSales' element={<HqTotalSales />} />
          <Route path='/hq/storeSales' element={<HqStoreSales />} />

          {/*매장관리 */}
          <Route path="/hq/storeRegister" element={<StoreRegister />} />
          <Route path="/hq/storeAccount" element={<StoreAccountList />} />
          <Route path="/hq/storeAccountDetail" element={<StoreAccountDetail/>}/>
          <Route path="/hq/storeModify" element={<StoreAccountModify/>}/>
          <Route path="/hq/empRegister" element={<EmployeeRegister />} />
          <Route path="/hq/empList" element={<EmployeeList />} />

          {/* 공지- 공지 */}
          <Route path='/hq/HqNoticeList' element={<HqNoticeList />} />
          <Route path='/hq/HqNoticeDetail/:id' element={<HqNoticeDetail />} />
          <Route path="/hq/HqNoticeWrite" element={<HqNoticeWrite />} />
          <Route path="/hq/HqNoticeModify/:id" element={<HqNoticeModify />} />
          {/* 공지-불만 */}
          <Route path='/hq/HqComplaintList' element={<HqComplaintList />} />
          <Route path='/hq/HqComplaintDetail/:id' element={<HqComplaintDetail />} />
          {/* 공지-알림목록 */}
          <Route path='/hq/alarmList' element={<HqAlarmList />} />

          {/* 대시보드 */}
          <Route path='/hq/HqDashboard' element={<HqDashboard />} />

        </Route>

        <Route element={<StoreLayout />}>

          {/* 재고 */}
          <Route path='/store/StoreInventoryList' element={<StoreInventoryList />} />
          <Route path='/store/StoreInventoryExpiration' element={<StoreInventoryExpiration />} />
          <Route path='/store/StoreDisposalList' element={<StoreDisposalList />} />
          <Route path='/store/StoreIngredientSetting' element={<StoreIngredientSetting />} />
          <Route path='/store/StoreInventoryRecord' element={<StoreInventoryRecord />} />
          
          {/*매장 발주*/}
          <Route path="/store/orderList" element={<OrderList />} />
          <Route path="/store/orderApply" element={<OrderApply />} />
          <Route path="/store/orderDetail" element={<OrderDetail />} />
          <Route path="/store/stockInspection" element={<StockInspection />} />
          <Route path="/store/orderSettings" element={<OrderSettings />} />
          <Route path="/store/stockLog" element={<StockLog />} />
          
          {/* 메뉴 */}
          <Route path='/store/TotalMenu' element={<TotalMenu />} />
          <Route path='/store/menuStatus' element={<MenuStatus />} />
          <Route path='/store/recipe' element={<Recipe />} />

          {/*매장관리*/}
          <Route path="/store/EmpSchedule" element={<EmpSchedule />} />
          <Route path="/store/StoreEmployeeList" element={<StoreEmployeeList />} />
          
          {/* 매출 */}
          <Route path="/store/paymentList" element={<PaymentList />} />
          <Route path="/store/storeSales" element={<StoreSales />} />

          {/* 점포조회 */}
          <Route path='/store/otherStoreInven' element={<OtherStoreInven />} />

          {/* 공지사항 */}
          <Route path='/store/StoreNoticeList' element={<StoreNoticeList />} />
          <Route path='/store/StoreNoticeDetail/:id' element={<StoreNoticeDetail />} />
          <Route path='/store/alarmList' element={<AlarmList />} />

          {/* 공지 -고객불만사항 */}
          <Route path='/store/StoreComplaintList' element={<StoreComplaintList />} />
          <Route path='/store/StoreComplaintDetail/:id' element={<StoreComplaintDetail />} />
          
          {/* 대시보드 */}
          <Route path='/store/StoreDashboard' element={<StoreDashboard />} />

        </Route>

        {/* 로그인페이지 */}
        <Route path='/' element={<Login />} />

        {/* 소비자 메인 페이지 */}
        <Route path="/mainPage" element={<MainPage />} />
        <Route path="/brandIntro" element={<BrandIntro />} />
        <Route path="/sloganIntro" element={<SloganIntro />} />
        <Route path="/menuPage" element={<MenuPage />} />
        <Route path="/nutritionPage" element={<Nutrition />} />
        <Route path="/news" element={<NewsPage />} />
        <Route path="/newsDetail" element={<NewsDetailPage />} />
        <Route path="/praiseStore" element={<PraiseStorePage />} />
        <Route path="/event" element={<EventPage />} />
        <Route path="/findStore" element={<FindStorePage />} />

        {/* 키오스크 페이지 */}
        
        <Route path="/kiosk/login" element={<KioskLogin/>}/>
        
        <Route element={<KioskLayout />}>
          <Route path="/kiosk/main" element={<KioskPage />} />
          <Route path="/kiosk/menu" element={<KioskMenuPage />} />
        </Route>
      </Routes>
    </>
  )
}

export default App
