import { BrowserRouter, Routes, Route } from 'react-router-dom';
import MainPage from './component/user/page/MainPage';
import BrandIntro from './component/user/page/BrandIntro';
import SloganIntro from './component/user/page/SloganIntro';
import MenuPage from './component/user/page/Menu';
import Nutrition from './component/user/page/Nutrition';
import FindStorePage from './component/user/page/FindStore';
import NewsPage from './component/user/page/News';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/mainPage" element={<MainPage />} />
        <Route path="/brandIntro" element={<BrandIntro />}/>
        <Route path="/sloganIntro" element={<SloganIntro/>}/>
        <Route path="/menuPage" element={<MenuPage/>}/>
        <Route path="/nutritionPage" element={<Nutrition />}/>
        <Route path="/findStore" element={<FindStorePage/>}/>
        <Route path="/News" element={<NewsPage/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;