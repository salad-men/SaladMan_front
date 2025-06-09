import { useState } from 'react'
import { Route,Routes } from 'react-router-dom';
import Header from './component/hq/Header'
import AllMenus from './component/hq/AllMenus';

function App() {

  return (
    <>
     <Header/>
     <Routes>
        <Route path='/AllMenus' element={<AllMenus/>}/>
     </Routes>
    </>
  )
}

export default App