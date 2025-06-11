import { useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import Header from './component/hq/Header'
import { Routes, Route } from 'react-router'
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
        <Route path="/hq/empSidebar/*" element={<EmpSidebar />}>
          <Route path="storeRegister" element={<StoreRegister />} />
          <Route path="storeAccount" element={<StoreAccountList />} />
          <Route path="empRegister" element={<EmployeeRegister />} />
          <Route path="empList" element={<EmployeeList />} />
        </Route>
        <Route path="/hq/orderSidebar/*" element={<OrderSidebar />}>
          <Route path="orderRequest" element={<OrderRequestList />} />
          <Route path="orderRequestDetail" element={<OrderRequestDetail/>}/>
        </Route>


      </Routes>
    </>
  )
}

export default App
