
import Footer from "@user/common/Footer";
import Header from "../common/Header";
import NewsHeroSection from "../herosection/NewsHeroSection"
import Event from "../news/Event"

const EventPage = () => {
    return (
        <>
        <Header staticScrolled={true}/>
        <NewsHeroSection/>
        <Event/>
        <Footer/>
        </>


    )



}
export default EventPage;