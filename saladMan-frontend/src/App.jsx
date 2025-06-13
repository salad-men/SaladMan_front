import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './component/user/page/MainPage';
import BrandIntro from './component/user/page/BrandIntro';
import SloganIntro from './component/user/page/SloganIntro';
import MenuPage from './component/user/page/Menu';
import Nutrition from './component/user/page/Nutrition';
import FindStorePage from './component/user/page/FindStore';
import NewsPage from './component/user/page/NewsPage';
import PraiseStorePage from './component/user/page/PraiseStorePage';
import EventPage from './component/user/page/EventPage';



import HqInventoryList from './component/hq/Inventory/HqInventoryList';
import HqInventoryExpiration from './component/hq/Inventory/HqInventoryExpiration';
import HqDisposalList from './component/hq/Inventory/HqDisposalList';
import HqIngredientSetting from './component/hq/Inventory/HqIngredientSetting';
import HqInventoryRecord from './component/hq/Inventory/HqInventoryRecord';

// 지현
import HqLayout from './component/hq/HqLayout';
import HqAllMenus from './component/hq/Menus/HqAllMenus';
import HqUpdateMenu from './component/hq/Menus/HqUpdateMenu';
import HqRecipe from './component/hq/Menus/HqRecipe';
import HqTotalSales from './component/hq/Sales/HqTotalSales';
import HqStoreSales from './component/hq/Sales/HqStoreSales';
import HqStoreStock from './component/hq/StoreInquiry/HqStoreStock';
import HqNotification from './component/hq/Notice/HqNotification';
import Login from './component/common/Login';
import StoreLayout from './component/store/StoreLayout';
import AllMenus from './component/store/Menus/AllMenus';
import MenuStatus from './component/store/Menus/MenuStatus';
import Recipe from './component/store/Menus/Recipe';
import OtherStoreInven from './component/store/StoreInquiry/OtherStoreInven';
import FindOtherStore from './component/store/StoreInquiry/FindOtherStore';

import StoreInventoryList from './component/store/Inventory/StoreInventoryList';
import StoreInventoryExpiration from './component/store/Inventory/StoreInventoryExpiration';
import StoreDisposalList from './component/store/Inventory/StoreDisposalList';
import StoreIngredientSetting from './component/store/Inventory/StoreIngredientSetting';
import StoreInventoryRecord from './component/store/Inventory/StoreInventoryRecord';

import HqNoticeList from './component/hq/Notice/HqNoticeList';
import HqNoticeDetail from './component/hq/Notice/HqNoticeDetail';
import NewsDetailPage from './component/user/page/NewDetailPage';
import KioskPage from './component/user/page/KioskPage';
import KioskMenuPage from './component/user/page/KioskMenuPage';

import StoreRegister from './component/hq/storeManagement/StoreRegister'
import EmployeeRegister from './component/hq/storeManagement/EmployeeRegister'
import EmployeeList from './component/hq/storeManagement/EmployeeList'
import StoreAccountList from './component/hq/storeManagement/StoreAccountList'
import OrderRequestList from './component/hq/order/OrderRequestList'
import OrderRequestDetail from './component/hq/order/OrderRequestDetail'
import OrderItemManage from './component/hq/order/OrderItemManage'
import OrderList from './component/store/order/OrderList';
import OrderApply from './component/store/order/OrderApply';
import OrderDetail from './component/store/order/OrderDetail';
import StockInspection from './component/store/order/StockInspection';
import OrderSettings from './component/store/order/OrderSettings';
import StockLog from './component/store/order/StockLog';
import EmpSchedule from './component/store/storeManagement/empSchedule';


import HqComplaintList from './component/hq/Complaint/HqComplaintList';
import HqComplaintDetail from './component/hq/Complaint/HqComplaintDetail';
import Notification from './component/hq/Notice/HqNotification';
import StoreNoticeList from './component/store/notice/StoreNoticeList';
import StoreNoticeDetail from './component/store/notice/StoreNoticeDetail';
import StoreComplaintList from './component/store/complaint/StoreComplaintList';
import StoreComplaintDetail from './component/store/complaint/StoreComplaintDetail';
import HqHeader from './component/hq/HqHeader';

function App() {

  return (
    <>
      {/* <Header/> */}

      <Routes>
        <Route path='/hq/HqInventoryList' element={<HqInventoryList />} />
        <Route path='/hq/HqInventoryExpiration' element={<HqInventoryExpiration />} />
        <Route path='/hq/HqDisposalList' element={<HqDisposalList />} />
        <Route path='/hq/HqIngredientSetting' element={<HqIngredientSetting />} />
        <Route path='/hq/HqInventoryRecord' element={<HqInventoryRecord />} />

        <Route path='/store/StoreInventoryList' element={<StoreInventoryList />} />
        <Route path='/store/StoreInventoryExpiration' element={<StoreInventoryExpiration />} />
        <Route path='/store/StoreDisposalList' element={<StoreDisposalList />} />
        <Route path='/store/StoreIngredientSetting' element={<StoreIngredientSetting />} />
        <Route path='/store/StoreInventoryRecord' element={<StoreInventoryRecord />} />

        <Route path='/hq/HqNoticeList' element={<HqNoticeList />} />
        <Route path='/hq/HqNoticeDetail' element={<HqNoticeDetail />} />

        <Route path='/store/StoreNoticeList' element={<StoreNoticeList />} />
        <Route path='/store/StoreNoticeDetail' element={<StoreNoticeDetail />} />

        <Route path='/hq/HqComplaintList' element={<HqComplaintList />} />
        <Route path='/hq/HqComplaintDetail' element={<HqComplaintDetail />} />

        <Route path='/store/StoreComplaintList' element={<StoreComplaintList />} />
        <Route path='/store/StoreComplaintDetail' element={<StoreComplaintDetail />} /> 

        <Route path="/mainPage" element={<MainPage />} />

        <Route path="/brandIntro" element={<BrandIntro />} />
        <Route path="/sloganIntro" element={<SloganIntro />} />
        <Route path="/menuPage" element={<MenuPage />} />
        <Route path="/nutritionPage" element={<Nutrition />} />
        <Route path="/findStore" element={<FindStorePage />} />

        <Route path="/MainPage" element={<MainPage />} />
        <Route path="/BrandIntro" element={<BrandIntro />} />
        <Route path="/SloganIntro" element={<SloganIntro />} />
        <Route path="/MenuPage" element={<MenuPage />} />
        <Route path="/NutritionPage" element={<Nutrition />} />
        <Route path="/FindStore" element={<FindStorePage />} />
        <Route path="/News" element={<NewsPage />} />
        <Route path="/NewsDetail" element={<NewsDetailPage />} />
        <Route path="/PraiseStore" element={<PraiseStorePage />} />
        <Route path="/Event" element={<EventPage />} />
        <Route path="/FindStore" element={<FindStorePage />} />
        <Route path="/Kiosk" element={<KioskPage />} />
        <Route path="/KioskMenu" element={<KioskMenuPage />} />

        {/*본사 매장관리 */}
        <Route path="/hq/storeRegister" element={<StoreRegister />} />
        <Route path="/hq/storeAccount" element={<StoreAccountList />} />
        <Route path="/hq/empRegister" element={<EmployeeRegister />} />
        <Route path="/hq/empList" element={<EmployeeList />} />
        {/*매장 매장관리*/}
        <Route path="/store/empSchedule" element={<EmpSchedule />} />

        {/*본사 발주*/}
        <Route path="/hq/orderRequest" element={<OrderRequestList />} />
        <Route path="/hq/orderRequestDetail" element={<OrderRequestDetail />} />
        <Route path="/hq/orderItemManage" element={<OrderItemManage />} />
        {/*매장 발주*/}
        <Route path="/store/orderList" element={<OrderList />} />
        <Route path="/store/orderApply" element={<OrderApply />} />
        <Route path="/store/orderDetail" element={<OrderDetail />} />
        <Route path="/store/stockInspection" element={<StockInspection />} />
        <Route path="/store/orderSettings" element={<OrderSettings />} />
        <Route path="/store/stockLog" element={<StockLog />} />

        <Route element={<HqLayout />}>
          {/* 메뉴 */}
          <Route path='/hq/allMenus' element={<HqAllMenus />} />
          <Route path='/hq/updateMenu' element={<HqUpdateMenu />} />
          <Route path='/hq/recipe' element={<HqRecipe />} />
          {/* 매출 */}
          <Route path='/hq/totalSales' element={<HqTotalSales />} />
          <Route path='/hq/storeSales' element={<HqStoreSales />} />
          <Route path='/hq/storeStock' element={<HqStoreStock />} />
          {/* 공지사항 */}
          <Route path='/hq/notification' element={<HqNotification />} />
        </Route>
        <Route element={<StoreLayout/>}>
          <Route path='/store/allMenus' element={<AllMenus/>}/>
          <Route path='/store/menuStatus' element={<MenuStatus/>}/>
          <Route path='/store/recipe' element={<Recipe/>}/>
          <Route path='/store/findOtherStore' element={<FindOtherStore/>}/>
          <Route path='/store/otherStoreInven' element={<OtherStoreInven/>}/>
          <Route path='/store/notification' element={<Notification/>}/>
        </Route>

        <Route path='/' element={<Login />} />

      </Routes>
    </>
  )
}

export default App
