import '../slogan/SloganIntro.module.css'
import '../common/Header.module.css';
import '../herosection/HeroSection.module.css'
import '../common/Footer.css'

import BrandHeroSection from "../herosection/BrandHeroSection"
import Header from '../common/Header';
import SloganIntro from '../slogan/SloganIntro';
import Footer from '../common/Footer';
import Chatbot from '@user/common/Chatbot';

import React, { useState } from "react";

const SloganIntroPage = () =>{
  const [isOpen, setIsOpen] = useState(false);
    return (
        <>
        <Header staticScrolled={true}/>
        <BrandHeroSection/>
              <Chatbot isOpen={isOpen} setIsOpen={setIsOpen} />
        <SloganIntro/>
        <Footer/>
        
        
        </>


    )
}

export default SloganIntroPage;