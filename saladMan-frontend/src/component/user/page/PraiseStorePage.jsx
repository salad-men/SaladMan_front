import Footer from "@user/common/Footer";
import Header from "../common/Header";
import NewsHeroSection from "../herosection/NewsHeroSection";
import PraiseStore from "../news/PraiseStore";
import Chatbot from "@user/common/Chatbot";

import React, { useState } from "react";

const PraiseStorePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Header staticScrolled={true} />
      <NewsHeroSection />
      <Chatbot isOpen={isOpen} setIsOpen={setIsOpen} />
      <PraiseStore />
      <Footer />
    </>
  );
};
export default PraiseStorePage;
