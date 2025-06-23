import React from 'react';
import '../brand/BrandIntro.module.css'
import '../common/Header.module.css';
import '../herosection/HeroSection.module.css'
import '../common/Footer.css';


import BrandIntro from "../brand/BrandIntro";
import Header from '../common/Header';
import BrandHeroSection from '../herosection/BrandHeroSection';
import Footer from '../common/Footer';
import Chatbot from '@user/common/Chatbot';
import { useState } from "react";

const BrandIntroPage = () => {
  
    const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Header staticScrolled={true} />
      <BrandHeroSection />
      <Chatbot isOpen={isOpen} setIsOpen={setIsOpen} />
      <BrandIntro />
      <Footer />
    </>
  );
};

export default BrandIntroPage;