// src/component/Chat/ChatSidebar.jsx
import { useState, useRef } from "react";
import ChatRoomList from "./ChatRoomList";
import StoreList from "./StoreList";
import GroupChatList from "./GroupChatList";
import styles from "./ChatSidebar.module.css";
import { FiBell, FiBellOff } from "react-icons/fi"; // npm i react-icons
import ChatModal from "./ChatModal"; // 아래에서 생성

export default function ChatSidebar({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("mychat");
  const [alertOn, setAlertOn] = useState(true); // 실시간알림 on/off
  const [modalQueue, setModalQueue] = useState([]); // 모달 큐
  const [unreadTotal, setUnreadTotal] = useState(0);

  // 모달 자동 사라짐 처리
  const modalTimeout = useRef(null);
  const showModal = (msg) => {
    setModalQueue(q => [...q, msg]);
    if (modalTimeout.current) clearTimeout(modalTimeout.current);
    modalTimeout.current = setTimeout(() => {
      setModalQueue(q => q.slice(1));
    }, 3200); // 3초 후 사라짐
  };

  // ===== ChatRoomList에 unreadTotal, 모달 띄우는 함수 전달 =====
  // (코드 아래 참조)
  if (!isOpen) return null;

  return (
    <div className={styles.sidebar}>
      <button className={styles.closeBtn} onClick={onClose}>×</button>
      {/* 알림 아이콘 & 뱃지 */}
      <div style={{
        position: "absolute", bottom: 14, left: 20, zIndex: 100
      }}>
        <button
          style={{ background: "none", border: "none", cursor: "pointer", position: "relative" }}
          onClick={() => setAlertOn(a => !a)}
          title={alertOn ? "실시간 알림 끄기" : "실시간 알림 켜기"}
        >
          {alertOn ? <FiBell size={28} color="#4d774e" /> : <FiBellOff size={28} color="#bbb" />}
          {/* 안읽은 전체 개수 뱃지 */}
          {unreadTotal > 0 && !alertOn && (
            <span style={{
              position: "absolute",
              top: -3, left: 19,
              background: "red",
              color: "white",
              borderRadius: "50%",
              fontSize: "11px",
              minWidth: "20px",
              textAlign: "center",
              padding: "0 5px",
              fontWeight: "bold"
            }}>
              {unreadTotal}
            </span>
          )}
        </button>
      </div>
      {/* 모달 알림 */}
      {alertOn && modalQueue.length > 0 &&
        <ChatModal message={modalQueue[0]} onClose={() => setModalQueue(q => q.slice(1))} />
      }
      <div className={styles.tabs}>
        <button onClick={()=>setActiveTab("mychat")} className={activeTab==="mychat"?styles.active:""}>내 채팅목록</button>
        <button onClick={()=>setActiveTab("group")} className={activeTab==="group"?styles.active:""}>그룹채팅목록</button>
        <button onClick={()=>setActiveTab("store")} className={activeTab==="store"?styles.active:""}>Store 목록</button>
      </div>
      <div className={styles.tabContent}>
        {activeTab==="mychat" &&
          <ChatRoomList
            alertOn={alertOn}
            showModal={showModal}
            setUnreadTotal={setUnreadTotal}
          />}
        {activeTab==="group" && <GroupChatList />}
        {activeTab==="store" && <StoreList />}
      </div>
    </div>
  );
}
