import '../common/Header.module.css';
import '../common/Footer.css';
import '../herosection/Herosection.module.css'

import Header from "../common/Header"
import NutritionHeroSection from "../herosection/NutritionHeroSection";
import Footer from '../common/Footer';

const NutritionPage = () => {

    return(

        <>
        <Header staticScrolled={true} />
        <NutritionHeroSection />
        <Footer />

        </>
    )
}
export default NutritionPage;