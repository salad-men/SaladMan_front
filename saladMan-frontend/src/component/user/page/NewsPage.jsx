
import Footer from "@user/common/Footer";
import Header from "../common/Header";
import NewsHeroSection from "../herosection/NewsHeroSection"
import News from "../news/News"

const NewsPage = () => {
    return (
        <>
        <Header staticScrolled={true}/>
        <NewsHeroSection/>
        <News/>
        <Footer/>
        
        </>


    )



}
export default NewsPage;