import Layout from '../mainPage/Layout';
import Header from '../common/Header';
import Herosection from '../mainPage/Herosection';
import IntroSection1 from '../mainPage/IntroSection1';
import IntroSection2 from '../mainPage/IntroSection2';
import SearchStore from '../mainPage/SearchStore';
import BestMenuSection from '../mainPage/BestMenuSection';
import Footer from '../common/Footer';
import Chatbot from '@user/common/Chatbot';

import React, { useState } from "react";

const MainPage = () => {

  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
    <Header />
    <Herosection />
      <Chatbot isOpen={isOpen} setIsOpen={setIsOpen} />
      <Layout>
      <main>
        <IntroSection1 />
        <IntroSection2 />
      </main>
      </Layout>
        <SearchStore />

        <BestMenuSection />

      <Footer />
    </>
  );
};

export default MainPage;
