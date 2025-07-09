import Header from "../common/Header";
import EventDetail from "../news/EventDetail";
import Chatbot from '@user/common/Chatbot';

import React, { useState } from "react";

const EventDetailPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  return (
    <>
      <Header staticScrolled={true} />
      <Chatbot isOpen={isOpen} setIsOpen={setIsOpen} />
      <EventDetail />
    </>
  );
};
export default EventDetailPage;
