import React, { useState } from "react";
import Header from "../common/Header";
import MenuHeroSection from "../herosection/MenuHeroSection";
import Menu from "../menu/menu";
import Footer from "@user/common/Footer";

const MenuPage = () => {
  const [categoryId, setCategoryId] = useState(1); // 기본값: 샐러볼
  return (
    <>
      <Header
        staticScrolled={true}
        onSelectCategory={(id) => setCategoryId(id)}
      />
      <MenuHeroSection selectedId={categoryId} onChange={setCategoryId} />
      <Menu categoryId={categoryId} />
      <Footer />
    </>
  );
};
export default MenuPage;
