import { useState } from 'react'
import { Route,Routes } from 'react-router-dom';
import Header from './component/hq/Header'
import AllMenus from './component/hq/AllMenus';
import InventoryList from './component/hq/Inventory/InventoryList';
import InventoryExpiration from './component/hq/Inventory/InventoryExpiration';
import DisposalList from './component/hq/Inventory/DisposalList';
import StoreIngredientSetting from './component/hq/Inventory/StoreIngredientSetting';
import IngredientInventoryRecord from './component/hq/Inventory/IngredientInventoryRecord';

function App() {

  return (
    <>
     <Header/>
     <Routes>
        <Route path='/AllMenus' element={<AllMenus/>}/>
        <Route path='/hq/InventoryList' element={<InventoryList/>}/>
        <Route path='/hq/InventoryExpiration' element={<InventoryExpiration/>}/>
        <Route path='/hq/DisposalList' element={<DisposalList/>}/>
        <Route path='/hq/StoreIngredientSetting' element={<StoreIngredientSetting/>}/>
        <Route path='/hq/IngredientInventoryRecord' element={<IngredientInventoryRecord/>}/>
        
     </Routes>
    </>
  )
}

export default App