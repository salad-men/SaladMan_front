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


import HqLayout from './component/hq/HqLayout';
import AllMenus from './component/hq/Menus/AllMenus';
import UpdateMenu from './component/hq/Menus/UpdateMenu';
import Recipe from './component/hq/Menus/Recipe';
import Login from './component/common/Login';
import TotalSales from './component/hq/Sales/TotalSales';
import StoreSales from './component/hq/Sales/Storesales';
import StoreStock from './component/hq/StoreInquiry/StoreStock';


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
import Header from './component/hq/Header';

function App() {

  return (
    <>

      <Header/>

      <Routes>
        <Route path='/AllMenus' element={<AllMenus />} />

        <Route path='/hq/HqInventoryList' element={<HqInventoryList />} />
        <Route path='/hq/HqInventoryExpiration' element={<HqInventoryExpiration />} />
        <Route path='/hq/HqDisposalList' element={<HqDisposalList />} />
        <Route path='/hq/HqIngredientSetting' element={<HqIngredientSetting />} />
        <Route path='/hq/HqInventoryRecord' element={<HqInventoryRecord />} />

        <Route path='/store/StoreInventoryList' element={<StoreInventoryList />} />
        <Route path='/store/StoreInventoryExpiration' element={<StoreInventoryExpiration />} />
        <Route path='/store/StoreDisposalList' element={<StoreDisposalList />} />
        <Route path='/store/StoreIngredientSetting' element={<StoreIngredientSetting />} />

        <Route path='/hq/HqNoticeList' element={<HqNoticeList />} />
        <Route path='/hq/HqNoticeDetail' element={<HqNoticeDetail />} />

        <Route path="/mainPage" element={<MainPage />} />


        <Route path="/brandIntro" element={<BrandIntro />} />
        <Route path="/sloganIntro" element={<SloganIntro />} />
        <Route path="/menuPage" element={<MenuPage />} />
        <Route path="/nutritionPage" element={<Nutrition />} />
        <Route path="/findStore" element={<FindStorePage />} />
        <Route path='/hq/HqNoticeList' element={<HqNoticeList />} />
        <Route path='/hq/HqNoticeDetail' element={<HqNoticeDetail />} />
        <Route path='/hq/HqComplaintList' element={<HqComplaintList />} />
        <Route path='/hq/HqComplaintDetail' element={<HqComplaintDetail />} />

        <Route path='/store/StoreInventoryList' element={<StoreInventoryList />} />
        <Route path='/store/StoreInventoryExpiration' element={<StoreInventoryExpiration />} />
        <Route path='/store/StoreDisposalList' element={<StoreDisposalList />} />
        <Route path='/store/StoreIngredientSetting' element={<StoreIngredientSetting />} />
        <Route path='/store/StoreInventoryRecord' element={<StoreInventoryRecord />} />



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
          <Route path='/hq/allMenus' element={<AllMenus />} />
          <Route path='/hq/updateMenu' element={<UpdateMenu />} />
          <Route path='/hq/recipe' element={<Recipe />} />
          <Route path='/hq/totalSales' element={<TotalSales />} />
          <Route path='/hq/storeSales' element={<StoreSales />} />
          <Route path='/hq/storeStock' element={<StoreStock />} />
        </Route>

        <Route path='/' element={<Login />} />

      </Routes>
    </>
  )
}

export default App
