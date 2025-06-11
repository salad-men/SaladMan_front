import '../Slogan/SloganIntro.module.css'
import '../common/Header.css';
import '../herosection/Herosection.module.css'
import '../common/Footer.css'

import BrandHeroSection from "../herosection/BrandHeroSection"
import Header from '../common/Header';
import SloganIntro from '../slogan/SloganIntro';
import Footer from '../common/Footer';

const SloganIntroPage = () =>{
    return (
        <>
        <Header staticScrolled={true}/>
        <BrandHeroSection/>
        <SloganIntro/>
        <Footer/>
        
        
        </>


    )
}

export default SloganIntroPage;