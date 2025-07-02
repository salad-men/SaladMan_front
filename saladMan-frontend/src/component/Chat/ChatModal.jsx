import styles from "./ChatModal.module.css";

export default function ChatModal({ message, onClose, onGoRoom }) {
  return (
    <div
      className={styles.modal}
      onClick={() => onGoRoom && onGoRoom(message.roomId)}
      style={{ cursor: onGoRoom ? "pointer" : undefined }}
    >
      <div className={styles.title}>{message.roomName}</div>
      <div className={styles.body}>
        <b>{message.senderUsername || "알림"}</b>: {message.message}
      </div>
      <button
        className={styles.close}
        onClick={e => {
          e.stopPropagation(); // 버튼 클릭 시 부모 클릭 막기
          onClose && onClose();
        }}
      >
        닫기
      </button>
    </div>
  );
}
