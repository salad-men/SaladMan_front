import styles from "./ChatSidebar.module.css";
import { FiBell, FiBellOff } from "react-icons/fi";
import { useEffect, useState } from "react";
import ChatRoomList from "./ChatRoomList";
import StoreList from "./StoreList";
import GroupChatList from "./GroupChatList";

export default function ChatSidebar({
  isOpen, onClose,
  chatAlarmOn = true,
  setChatAlarmOn = () => {},
  rooms = [],
  setRooms = () => {},
  setActiveRoomId,
  activeRoomId
}) {
  const [activeTab, setActiveTab] = useState("mychat");

  useEffect(() => {
    if (!isOpen && setActiveRoomId) setActiveRoomId(null);
  }, [isOpen, setActiveRoomId]);

  if (!isOpen) return null;

  return (
    <div className={styles.sidebar}>
      <button className={styles.closeBtn} onClick={onClose} aria-label="닫기">×</button>

      {/* 벨 ON/OFF 토글 */}
      <div className={styles.bellArea}>
        <button
          className={styles.bellBtn}
          onClick={() => setChatAlarmOn(prev => !prev)}
          title={chatAlarmOn ? "실시간 알림 끄기" : "실시간 알림 켜기"}
        >
          {chatAlarmOn ? <FiBell size={24} color="#4d774e" /> : <FiBellOff size={24} color="#bbb" />}
        </button>
        <span className={styles.bellLabel}>
          실시간 채팅알림 {chatAlarmOn ? "ON" : "OFF"}
        </span>
      </div>

      <div className={styles.tabs}>
        <button onClick={() => setActiveTab("mychat")} className={activeTab === "mychat" ? styles.active : ""}>
          내 채팅목록
        </button>
        <button onClick={() => setActiveTab("group")} className={activeTab === "group" ? styles.active : ""}>
          그룹채팅목록
        </button>
        <button onClick={() => setActiveTab("store")} className={activeTab === "store" ? styles.active : ""}>
          Store 목록
        </button>
      </div>
      <div className={styles.tabContent}>
        {activeTab === "mychat" && <ChatRoomList 
            rooms={rooms} 
            setRooms={setRooms} 
            forceActiveRoom={activeRoomId}
            setForceActiveRoom={setActiveRoomId} />}
        {activeTab === "group" && <GroupChatList />}
        {activeTab === "store" && <StoreList />}
      </div>
    </div>
  );
}
