import Header from "../common/Header";
import NewsDetail from "../news/NewsDetail";
import Chatbot from "@user/common/Chatbot";

import React, { useState } from "react";

const NewsDetailPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Header staticScrolled={true} />
      <Chatbot isOpen={isOpen} setIsOpen={setIsOpen} />
      <NewsDetail />
    </>
  );
};
export default NewsDetailPage;
