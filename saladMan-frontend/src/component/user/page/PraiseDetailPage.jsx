import Header from "../common/Header";
import PraiseDetail from "../news/PraiseDetail";
import Chatbot from "@user/common/Chatbot";

import React, { useState } from "react";

const PraiseDetailPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Header staticScrolled={true} />
      <Chatbot isOpen={isOpen} setIsOpen={setIsOpen} />
      <PraiseDetail />
    </>
  );
};
export default PraiseDetailPage;
