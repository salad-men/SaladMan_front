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

import Header from './component/hq/Header'
import AllMenus from './component/hq/AllMenus';
import InventoryList from './component/hq/Inventory/InventoryList';
import InventoryExpiration from './component/hq/Inventory/InventoryExpiration';
import DisposalList from './component/hq/Inventory/DisposalList';
import HqIngredientSetting from './component/hq/Inventory/HqIngredientSetting';
import IngredientInventoryRecord from './component/hq/Inventory/IngredientInventoryRecord';

import StoreInventoryList from './component/store/Inventory/StoreInventoryList';
import StoreInventoryExpiration from './component/store/Inventory/StoreInventoryExpiration';
import StoreDisposalList from './component/store/Inventory/StoreDisposalList';
import StoreIngredientSetting from './component/store/Inventory/StoreIngredientSetting';
import StoreIngredientInventoryRecord from './component/store/Inventory/StoreIngredientInventoryRecord';

import HqNoticeList from './component/hq/Notice/HqNoticeList';
import HqNoticeDetail from './component/hq/Notice/HqNoticeDetail';




function App() {

  return (
    <>
     {/* <Header/> */}
     <Routes>
        <Route path='/AllMenus' element={<AllMenus/>}/>

        <Route path='/hq/InventoryList' element={<InventoryList/>}/>
        <Route path='/hq/InventoryExpiration' element={<InventoryExpiration/>}/>
        <Route path='/hq/DisposalList' element={<DisposalList/>}/>
        <Route path='/hq/HqIngredientSetting' element={<HqIngredientSetting/>}/>
        <Route path='/hq/IngredientInventoryRecord' element={<IngredientInventoryRecord/>}/>


        <Route path='/store/StoreInventoryList' element={<StoreInventoryList/>}/>
        <Route path='/store/StoreInventoryExpiration' element={<StoreInventoryExpiration/>}/>
        <Route path='/store/StoreDisposalList' element={<StoreDisposalList/>}/>
        <Route path='/store/StoreIngredientSetting' element={<StoreIngredientSetting/>}/>
        <Route path='/store/StoreIngredientInventoryRecord' element={<StoreIngredientInventoryRecord/>}/>
        

        <Route path='/hq/HqNoticeList' element ={<HqNoticeList/>}/>
        <Route path='/hq/HqNoticeDetail' element ={<HqNoticeDetail/>}/>

        <Route path="/mainPage" element={<MainPage />} />
        <Route path="/brandIntro" element={<BrandIntro />}/>
        <Route path="/sloganIntro" element={<SloganIntro/>}/>
        <Route path="/menuPage" element={<MenuPage/>}/>
        <Route path="/nutritionPage" element={<Nutrition />}/>
        <Route path="/findStore" element={<FindStorePage/>}/>
        <Route path="/News" element={<NewsPage/>}/>
        <Route path="/PraiseStore" element={<PraiseStorePage/>}/>
        <Route path="/Event" element={<EventPage/>}/>
        <Route path="FindStore" element={<FindStorePage/>}/>

     </Routes>
    </>
  )
}

export default App
