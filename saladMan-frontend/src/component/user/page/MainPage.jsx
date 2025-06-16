import React from 'react';

import Layout from '../mainPage/Layout';
import Header from '../common/Header';
import Herosection from '../mainPage/Herosection';
import IntroSection1 from '../mainPage/IntroSection1';
import IntroSection2 from '../mainPage/IntroSection2';
import SearchStore from '../mainPage/SearchStore';
import BestMenuSection from '../mainPage/BestMenuSection';
import Footer from '../common/Footer';

const MainPage = () => {
  return (
    <>
    <Header />
    <Herosection />
      <Layout>
      <main>
        <IntroSection1 />
        <IntroSection2 />
        <SearchStore />
        <BestMenuSection />
      </main>
      </Layout>
      <Footer />
    </>
  );
};

export default MainPage;
