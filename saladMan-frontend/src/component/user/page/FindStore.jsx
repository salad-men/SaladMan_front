
import Header from "../common/Header";
import StoreHeroSection from "../herosection/StoreHeroSection"
import FindStore from "../findStore/FindStore";
import Footer from "@user/common/Footer";
import Chatbot from '@user/common/Chatbot';

import React, { useState } from "react";
const FindStorePage = () => {
  const [isOpen, setIsOpen] = useState(false);
    return (
        <>
        <Header staticScrolled={true}/>
        <StoreHeroSection/>
              <Chatbot isOpen={isOpen} setIsOpen={setIsOpen} />
        <FindStore />
        <Footer/>
        </>


    )



}
export default FindStorePage;