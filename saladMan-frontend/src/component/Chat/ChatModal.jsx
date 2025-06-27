// src/component/Chat/ChatModal.jsx
import styles from "./ChatModal.module.css";

export default function ChatModal({ message, onClose }) {
  // message: {roomId, roomName, sender, message 등}
  return (
    <div className={styles.modal}>
      <div className={styles.title}>{message.roomName}</div>
      <div className={styles.body}>
        <b>{message.senderUsername || "알림"}</b>: {message.message}
      </div>
      <button className={styles.close} onClick={onClose}>닫기</button>
    </div>
  );
}
