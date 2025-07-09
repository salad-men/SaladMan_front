
import Footer from "@user/common/Footer";
import Header from "../common/Header";
import NewsHeroSection from "../herosection/NewsHeroSection"
import News from "../news/News"
import Chatbot from '@user/common/Chatbot';

import React, { useState } from "react";

const NewsPage = () => {
  const [isOpen, setIsOpen] = useState(false);
    return (
        <>
        <Header staticScrolled={true}/>
        <NewsHeroSection/>
              <Chatbot isOpen={isOpen} setIsOpen={setIsOpen} />
        <News/>
        <Footer/>
        
        </>


    )



}
export default NewsPage;