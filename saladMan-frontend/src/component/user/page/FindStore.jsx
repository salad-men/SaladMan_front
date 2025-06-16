
import Header from "../common/Header";
import StoreHeroSection from "../herosection/StoreHeroSection"
import FindStore from "../findStore/FindStore";
import Footer from "@user/common/Footer";
const FindStorePage = () => {
    return (
        <>
        <Header staticScrolled={true}/>
        <StoreHeroSection/>
        <FindStore />
        <Footer/>
        </>


    )



}
export default FindStorePage;