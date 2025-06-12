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


import HqInventoryList from './component/hq/Inventory/HqInventoryList';
import HqInventoryExpiration from './component/hq/Inventory/HqInventoryExpiration';
import HqDisposalList from './component/hq/Inventory/HqDisposalList';
import HqIngredientSetting from './component/hq/Inventory/HqIngredientSetting';
import HqInventoryRecord from './component/hq/Inventory/HqInventoryRecord';

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

import HqComplaintList from './component/hq/Complaint/HqComplaintList';
import HqComplaintDetail from './component/hq/Complaint/HqComplaintDetail';

function App() {

  return (
    <>
     <Header/>
     <Routes>
        <Route path='/AllMenus' element={<AllMenus/>}/>

        <Route path='/hq/HqInventoryList' element={<HqInventoryList/>}/>
        <Route path='/hq/HqInventoryExpiration' element={<HqInventoryExpiration/>}/>
        <Route path='/hq/HqDisposalList' element={<HqDisposalList/>}/>
        <Route path='/hq/HqIngredientSetting' element={<HqIngredientSetting/>}/>
        <Route path='/hq/HqInventoryRecord' element={<HqInventoryRecord/>}/>

        <Route path='/hq/HqNoticeList' element ={<HqNoticeList/>}/>
        <Route path='/hq/HqNoticeDetail' element ={<HqNoticeDetail/>}/>
        <Route path='/hq/HqComplaintList' element ={<HqComplaintList/>}/>
        <Route path='/hq/HqComplaintDetail' element ={<HqComplaintDetail/>}/>

        <Route path='/store/StoreInventoryList' element={<StoreInventoryList/>}/>
        <Route path='/store/StoreInventoryExpiration' element={<StoreInventoryExpiration/>}/>
        <Route path='/store/StoreDisposalList' element={<StoreDisposalList/>}/>
        <Route path='/store/StoreIngredientSetting' element={<StoreIngredientSetting/>}/>
        <Route path='/store/StoreInventoryRecord' element={<StoreInventoryRecord/>}/>
        


        <Route path="/MainPage" element={<MainPage />} />
        <Route path="/BrandIntro" element={<BrandIntro />}/>
        <Route path="/SloganIntro" element={<SloganIntro/>}/>
        <Route path="/MenuPage" element={<MenuPage/>}/>
        <Route path="/NutritionPage" element={<Nutrition />}/>
        <Route path="/FindStore" element={<FindStorePage/>}/>
        <Route path="/News" element={<NewsPage/>}/>
        <Route path="/NewsDetail" element={<NewsDetailPage/>}/>
        <Route path="/PraiseStore" element={<PraiseStorePage/>}/>
        <Route path="/Event" element={<EventPage/>}/>
        <Route path="/FindStore" element={<FindStorePage/>}/>
        <Route path="/Kiosk" element={<KioskPage/>}/>
        <Route path="/KioskMenu" element={<KioskMenuPage/>}/>

     </Routes>
    </>
  )
}

export default App
