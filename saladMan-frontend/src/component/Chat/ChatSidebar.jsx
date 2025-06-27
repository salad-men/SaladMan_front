import { useState, useRef } from "react";
import ChatRoomList from "./ChatRoomList";
import StoreList from "./StoreList";
import GroupChatList from "./GroupChatList";
import styles from "./ChatSidebar.module.css";
import { FiBell, FiBellOff } from "react-icons/fi";
import ChatModal from "./ChatModal.jsx";

export default function ChatSidebar({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState("mychat");

  // 💡 알림(모달/벨/뱃지) 전부 ChatSidebar에서만!
  const [alertOn, setAlertOn] = useState(true);
  const [modalQueue, setModalQueue] = useState([]);
  const [unreadTotal, setUnreadTotal] = useState(0);
  const modalTimeout = useRef(null);

  // 모달 띄우기
  const showModal = (msg) => {
    setModalQueue(q => [...q, msg]);
    if (modalTimeout.current) clearTimeout(modalTimeout.current);
    modalTimeout.current = setTimeout(() => {
      setModalQueue(q => q.slice(1));
    }, 3200);
  };

  if (!isOpen) return null;

  return (
    <div className={styles.sidebar}>
      <button className={styles.closeBtn} onClick={onClose}>×</button>
      {/* 좌상단 벨 & 뱃지 */}
      <div style={{
        position: "absolute", top: 16, left: 18, zIndex: 100
      }}>
        <button
          style={{
            background: "none", border: "none",
            cursor: "pointer", position: "relative", outline: "none"
          }}
          onClick={() => setAlertOn(a => !a)}
          title={alertOn ? "실시간 알림 끄기" : "실시간 알림 켜기"}
        >
          {alertOn
            ? <FiBell size={26} color="#4d774e" />
            : <FiBellOff size={26} color="#bbb" />}
          {/* 전체 안읽음 뱃지 */}
          {unreadTotal > 0 && !alertOn && (
            <span style={{
              position: "absolute", top: -8, left: 16,
              background: "red", color: "white",
              borderRadius: "50%", fontSize: "11px",
              minWidth: "19px", textAlign: "center",
              padding: "0 5px", fontWeight: "bold", boxShadow: "0 1px 3px #0003"
            }}>
              {unreadTotal}
            </span>
          )}
        </button>
      </div>
      {/* 알림 모달 */}
      {alertOn && modalQueue.length > 0 &&
        <ChatModal message={modalQueue[0]} onClose={() => setModalQueue(q => q.slice(1))} />
      }
      <div className={styles.tabs}>
        <button onClick={() => setActiveTab("mychat")}
                className={activeTab === "mychat" ? styles.active : ""}>
          내 채팅목록
        </button>
        <button onClick={() => setActiveTab("group")}
                className={activeTab === "group" ? styles.active : ""}>
          그룹채팅목록
        </button>
        <button onClick={() => setActiveTab("store")}
                className={activeTab === "store" ? styles.active : ""}>
          Store 목록
        </button>
      </div>
      <div className={styles.tabContent}>
        {activeTab === "mychat" &&
          <ChatRoomList
            alertOn={alertOn}
            showModal={showModal}
            setUnreadTotal={setUnreadTotal}
          />}
        {activeTab === "group" && <GroupChatList />}
        {activeTab === "store" && <StoreList />}
      </div>
    </div>
  );
}
