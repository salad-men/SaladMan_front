import Footer from "@user/common/Footer";
import Header from "../common/Header";
import NewsHeroSection from "../herosection/NewsHeroSection";
import Event from "../news/Event";
import Chatbot from '@user/common/Chatbot';

import React, { useState } from "react";

const EventPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Header staticScrolled={true} />
      <NewsHeroSection />
      <Chatbot isOpen={isOpen} setIsOpen={setIsOpen} />
      <Event />
      <Footer />
    </>
  );
};
export default EventPage;
