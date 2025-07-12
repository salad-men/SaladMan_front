import '../common/Header.module.css';
import '../common/Footer.css';
import '../herosection/HeroSection.module.css'

import Header from "../common/Header"
import NutritionHeroSection from "../herosection/NutritionHeroSection";
import Footer from '../common/Footer';
import Nutrition from '../nutrition/Nutrition';
import Chatbot from '@user/common/Chatbot';

import React, { useState } from "react";

const NutritionPage = () => {

  const [isOpen, setIsOpen] = useState(false);
    return(

        <>
        <Header staticScrolled={true} />
        <NutritionHeroSection />
              <Chatbot isOpen={isOpen} setIsOpen={setIsOpen} />
        <Nutrition/>
        <Footer />

        </>
    )
}
export default NutritionPage;