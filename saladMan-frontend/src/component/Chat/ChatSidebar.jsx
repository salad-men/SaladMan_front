// src/component/Chat/ChatSidebar.jsx
import { useState } from "react";
import ChatRoomList from "./ChatRoomList";
import StoreList from "./StoreList";
import GroupChatList from "./GroupChatList";
import styles from "./ChatSidebar.module.css";

export default function ChatSidebar({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("mychat");

  if (!isOpen) return null;

  return (
    <div className={styles.sidebar}>
      <button className={styles.closeBtn} onClick={onClose}>×</button>
      <div className={styles.tabs}>
        <button onClick={()=>setActiveTab("mychat")} className={activeTab==="mychat"?styles.active:""}>내 채팅목록</button>
        <button onClick={()=>setActiveTab("group")} className={activeTab==="group"?styles.active:""}>그룹채팅목록</button>
        <button onClick={()=>setActiveTab("store")} className={activeTab==="store"?styles.active:""}>Store 목록</button>
      </div>
      <div className={styles.tabContent}>
        {activeTab==="mychat" && <ChatRoomList />}
        {activeTab==="group" && <GroupChatList />}
        {activeTab==="store" && <StoreList />}
      </div>
    </div>
  );
}
