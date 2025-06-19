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



import HqInventoryList from '@hq/inventory/HqInventoryList';
import HqInventoryExpiration from '@hq/inventory/HqInventoryExpiration';
import HqDisposalList from '@hq/inventory/HqDisposalList';
import HqIngredientSetting from '@hq/inventory/HqIngredientSetting';
import HqInventoryRecord from '@hq/inventory/HqInventoryRecord';

// 지현
import HqLayout from '@hq/HqLayout';
import HqTotalMenu from '@hq/Menu/HqTotalMenu';
import HqUpdateMenu from '@hq/Menu/HqUpdateMenu';
import HqRecipe from '@hq/Menu/HqRecipe';
import HqTotalSales from '@hq/Sales/HqTotalSales';
import HqStoreSales from '@hq/Sales/HqStoreSales';
import HqStoreStock from '@hq/StoreInquiry/HqStoreStock';
import HqNotification from '@hq/notice/HqNotification';

import StoreLayout from '@store/StoreLayout';
import TotalMenu from '@store/Menu/TotalMenu';
import MenuStatus from '@store/Menu/MenuStatus';
import Recipe from '@store/Menu/Recipe';
import OtherStoreInven from '@store/StoreInquiry/OtherStoreInven';
import FindOtherStore from '@store/StoreInquiry/FindOtherStore';

import StoreInventoryList from '@store/Inventory/StoreInventoryList';
import StoreInventoryExpiration from '@store/Inventory/StoreInventoryExpiration';
import StoreDisposalList from '@store/Inventory/StoreDisposalList';
import StoreIngredientSetting from '@store/Inventory/StoreIngredientSetting';
import StoreInventoryRecord from '@store/Inventory/StoreInventoryRecord';

import HqNoticeList from '@hq/notice/HqNoticeList';
import HqNoticeDetail from '@hq/notice/HqNoticeDetail';
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


import HqComplaintList from '@hq/complaint/HqComplaintList';
import HqComplaintDetail from '@hq/complaint/HqComplaintDetail';
import Notification from '@hq/notice/HqNotification';
import StoreNoticeList from '@store/notice/StoreNoticeList';
import StoreNoticeDetail from '@store/notice/StoreNoticeDetail';
import StoreComplaintList from '@store/complaint/StoreComplaintList';
import StoreComplaintDetail from '@store/complaint/StoreComplaintDetail';

import Login from './component/common/Login';
import StoreAccountDetail from '@hq/storeManagement/StoreAccountDetail';
import StoreAccountModify from '@hq/storeManagement/StoreAccountModify';

function App() {

  return (
    <>
      <Routes>

        <Route element={<HqLayout />}>

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
          <Route path="/hq/storeAccountModify" element={<StoreAccountModify/>}/>
          <Route path="/hq/empRegister" element={<EmployeeRegister />} />
          <Route path="/hq/empList" element={<EmployeeList />} />

          {/* 점포조회 */}
          <Route path='/hq/storeStock' element={<HqStoreStock />} />

          {/* 공지- 공지 */}
          <Route path='/hq/HqNoticeList' element={<HqNoticeList />} />
          <Route path='/hq/HqNoticeDetail' element={<HqNoticeDetail />} />
          {/* 공지-불만 */}
          <Route path='/hq/HqComplaintList' element={<HqComplaintList />} />
          <Route path='/hq/HqComplaintDetail' element={<HqComplaintDetail />} />
          {/* 공지-알림목록 */}
          <Route path='/hq/notification' element={<HqNotification />} />

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
          <Route path="/store/empSchedule" element={<EmpSchedule />} />
          
          {/* 매출 */}

          {/* 점포조회 */}
          <Route path='/store/findOtherStore' element={<FindOtherStore />} />
          <Route path='/store/otherStoreInven' element={<OtherStoreInven />} />

          {/* 공지사항 */}
          <Route path='/store/StoreNoticeList' element={<StoreNoticeList />} />
          <Route path='/store/StoreNoticeDetail' element={<StoreNoticeDetail />} />
          <Route path='/store/notification' element={<Notification />} />

          {/* 공지 -고객불만사항 */}
          <Route path='/store/StoreComplaintList' element={<StoreComplaintList />} />
          <Route path='/store/StoreComplaintDetail' element={<StoreComplaintDetail />} />

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
        <Route path="/kiosk" element={<KioskPage />} />
        <Route path="/kioskMenu" element={<KioskMenuPage />} />

      </Routes>
    </>
  )
}

export default App
