import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './component/user/page/MainPage';
import BrandIntro from './component/user/page/BrandIntro';
import SloganIntro from './component/user/page/SloganIntro';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/MainPage" element={<MainPage />} />
        <Route path="/BrandIntro" element={<BrandIntro />}/>
        <Route path="/SloganIntro" element={<SloganIntro/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;