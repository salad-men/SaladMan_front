import { useState } from 'react'
import { Route,Routes } from 'react-router-dom';
import HqLayout from './component/hq/HqLayout';
import AllMenus from './component/hq/AllMenus';
import UpdateMenu from './component/hq/UpdateMenu';
import Recipe from './component/hq/Recipe';
import Login from './component/common/Login';
import TotalSales from './component/hq/Totalsales';
import StoreSales from './component/hq/Storesales';
import StoreStock from './component/hq/StoreStock';

function App() {

  return (
    <>
     <Routes>
      <Route element={<HqLayout/>}>
        <Route path='/hq/allMenus' element={<AllMenus/>}/>
        <Route path='/hq/updateMenu' element={<UpdateMenu/>}/>
        <Route path='/hq/recipe' element={<Recipe/>}/>
        <Route path='/hq/totalSales' element={<TotalSales/>}/>
        <Route path='/hq/storeSales' element={<StoreSales/>}/>
        <Route path='/hq/storeStock' element={<StoreStock/>}/>
      </Route>
      <Route path='/' element={<Login/>}/>
     </Routes>
    </>
  )
}

export default App
