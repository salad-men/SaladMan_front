import React from 'react';
import '../brand/BrandIntro.module.css'
import '../mainPage/Header.css';

import BrandIntro from "../brand/brandIntro";
import Header from '../mainPage/Header';


const BrandIntroPage = () => {
  return (
    <>
      <Header/>
      <BrandIntro />
    </>
  );
};

export default BrandIntroPage;