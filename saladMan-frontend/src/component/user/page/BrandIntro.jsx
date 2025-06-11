import React from 'react';
import '../brand/BrandIntro.module.css'
import '../common/Header.css';
import '../herosection/Herosection.module.css'
import '../common/Footer.css';


import BrandIntro from "../brand/BrandIntro";
import Header from '../common/Header';
import BrandHeroSection from '../herosection/BrandHeroSection';
import Footer from '../common/Footer';

const BrandIntroPage = () => {
  return (
    <>
      <Header staticScrolled={true} />
      <BrandHeroSection />
      <BrandIntro />
      <Footer />
    </>
  );
};

export default BrandIntroPage;