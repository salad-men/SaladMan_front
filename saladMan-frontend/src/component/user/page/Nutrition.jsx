import '../common/Header.module.css';
import '../common/Footer.css';
import '../herosection/HeroSection.module.css'

import Header from "../common/Header"
import NutritionHeroSection from "../herosection/NutritionHeroSection";
import Footer from '../common/Footer';
import Nutrition from '../nutrition/Nutrition';

const NutritionPage = () => {

    return(

        <>
        <Header staticScrolled={true} />
        <NutritionHeroSection />
        <Nutrition/>
        <Footer />

        </>
    )
}
export default NutritionPage;