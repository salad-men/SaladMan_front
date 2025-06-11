import { useState } from 'react'
import { Route,Routes } from 'react-router-dom';
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
     <Header/>
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

     </Routes>
    </>
  )
}

export default App