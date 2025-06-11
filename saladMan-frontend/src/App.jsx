import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './component/user/page/MainPage';
import BrandIntro from './component/user/page/BrandIntro';
import SloganIntro from './component/user/page/SloganIntro';
import MenuPage from './component/user/page/Menu';
import Nutrition from './component/user/page/Nutrition';
import FindStorePage from './component/user/page/FindStore';
import NewsPage from './component/user/page/News';

import Header from './component/hq/Header'
import InventoryList from './component/hq/Inventory/InventoryList';
import InventoryExpiration from './component/hq/Inventory/InventoryExpiration';
import DisposalList from './component/hq/Inventory/DisposalList';
import HqIngredientSetting from './component/hq/Inventory/HqIngredientSetting';
import IngredientInventoryRecord from './component/hq/Inventory/IngredientInventoryRecord';


import HqLayout from './component/hq/HqLayout';
import AllMenus from './component/hq/AllMenus';
import UpdateMenu from './component/hq/UpdateMenu';
import Recipe from './component/hq/Recipe';
import Login from './component/common/Login';
import TotalSales from './component/hq/Totalsales';
import StoreSales from './component/hq/Storesales';
import StoreStock from './component/hq/StoreStock';


import StoreInventoryList from './component/store/Inventory/StoreInventoryList';
import StoreInventoryExpiration from './component/store/Inventory/StoreInventoryExpiration';
import StoreDisposalList from './component/store/Inventory/StoreDisposalList';
import StoreIngredientSetting from './component/store/Inventory/StoreIngredientSetting';
import StoreIngredientInventoryRecord from './component/store/Inventory/StoreIngredientInventoryRecord';

import HqNoticeList from './component/hq/Notice/HqNoticeList';
import HqNoticeDetail from './component/hq/Notice/HqNoticeDetail';

import StoreRegister from './component/hq/storeManagement/StoreRegister'
import EmpSidebar from './component/hq/storeManagement/EmpSidebar'
import EmployeeRegister from './component/hq/storeManagement/EmployeeRegister'
import EmployeeList from './component/hq/storeManagement/EmployeeList'
import StoreAccountList from './component/hq/storeManagement/StoreAccountList'
import OrderSidebar from './component/hq/order/OrderSidebar'
import OrderRequestList from './component/hq/order/OrderRequestList'
import OrderRequestDetail from './component/hq/order/OrderRequestDetail'
function App() {

  return (
    <>


      <Header />
      <Routes>

        <Route path='/hq/InventoryList' element={<InventoryList />} />
        <Route path='/hq/InventoryExpiration' element={<InventoryExpiration />} />
        <Route path='/hq/DisposalList' element={<DisposalList />} />
        <Route path='/hq/HqIngredientSetting' element={<HqIngredientSetting />} />
        <Route path='/hq/IngredientInventoryRecord' element={<IngredientInventoryRecord />} />

        <Route path='/store/StoreInventoryList' element={<StoreInventoryList />} />
        <Route path='/store/StoreInventoryExpiration' element={<StoreInventoryExpiration />} />
        <Route path='/store/StoreDisposalList' element={<StoreDisposalList />} />
        <Route path='/store/StoreIngredientSetting' element={<StoreIngredientSetting />} />
        <Route path='/store/StoreIngredientInventoryRecord' element={<StoreIngredientInventoryRecord />} />


        <Route path='/hq/HqNoticeList' element={<HqNoticeList />} />
        <Route path='/hq/HqNoticeDetail' element={<HqNoticeDetail />} />

        <Route path="/mainPage" element={<MainPage />} />
        <Route path="/brandIntro" element={<BrandIntro />} />
        <Route path="/sloganIntro" element={<SloganIntro />} />
        <Route path="/menuPage" element={<MenuPage />} />
        <Route path="/nutritionPage" element={<Nutrition />} />
        <Route path="/findStore" element={<FindStorePage />} />
        <Route path="/News" element={<NewsPage />} />

        <Route path="/hq/empSidebar/*" element={<EmpSidebar />}>
          <Route path="storeRegister" element={<StoreRegister />} />
          <Route path="storeAccount" element={<StoreAccountList />} />
          <Route path="empRegister" element={<EmployeeRegister />} />
          <Route path="empList" element={<EmployeeList />} />
        </Route>

        <Route path="/hq/orderSidebar/*" element={<OrderSidebar />}>
          <Route path="orderRequest" element={<OrderRequestList />} />
          <Route path="orderRequestDetail" element={<OrderRequestDetail />} />
        </Route>

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
