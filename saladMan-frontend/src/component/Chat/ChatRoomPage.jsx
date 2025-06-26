import { useEffect, useRef, useState } from "react";
import { myAxios, API_BASE } from "/src/config";
import { accessTokenAtom, userAtom } from "/src/atoms";
import { useAtomValue } from "jotai";
import SockJS from "sockjs-client";
import { Client as StompClient } from "@stomp/stompjs";
import styles from "./ChatRoomPage.module.css";

export default function ChatRoomPage({ roomId, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef(null);

  // 👇 StoreList와 똑같이 token 사용
  const accessToken = useAtomValue(accessTokenAtom);
  const user = useAtomValue(userAtom);

  // 메시지 로딩
  useEffect(() => {
    if (!accessToken) return;
    myAxios(accessToken)
      .get(`/chat/history/${roomId}`)
      .then(res => setMessages(res.data || []));
  }, [roomId, accessToken]);

  // 웹소켓 연결 & 구독
  useEffect(() => {
    if (!accessToken) return;

    // **항상 Bearer가 한 번만 붙어있는지 확인**
    // 콘솔로 한 번 찍어보면 좋음
    // console.log("WebSocket connectHeader:", accessToken);

    const sock = new SockJS(`${API_BASE}/connect`);
    const stomp = new StompClient({
      webSocketFactory: () => sock,
      connectHeaders: {
        Authorization: accessToken, // Bearer ey... (한번만 붙이기!)
      },
      onConnect: () => {
        setConnected(true);
        stomp.subscribe(
          `/topic/${roomId}`,
          (msg) => {
            setMessages(msgs => [...msgs, JSON.parse(msg.body)]);
          },
          { Authorization: accessToken } // 대부분 서버에서는 CONNECT에만 검사, subscribe에는 없어도 무방
        );
      },
      onDisconnect: () => setConnected(false),
      onWebSocketClose: () => setConnected(false),
      debug: () => {}
    });
    stomp.activate();
    stompClientRef.current = stomp;

    return () => {
      myAxios(accessToken).post(`/chat/room/${roomId}/read`).catch(() => {});
      stomp.deactivate();
      setConnected(false);
    };
  }, [roomId, accessToken]);

  // 메시지 전송
  const sendMessage = () => {
    if (!connected) {
      alert("아직 채팅 서버와 연결 중입니다. 잠시만 기다려주세요!");
      return;
    }
    if (!input.trim()) return;
    stompClientRef.current.publish({
      destination: `/publish/${roomId}`,
      body: JSON.stringify({ message: input, senderUsername: user.username })
      // 일반적으로 메시지 publish에는 헤더 안 보내도 됨 (서버가 CONNECT에서 세션 인증했기 때문)
    });
    setInput("");
  };

  return (
    <div className={styles.roomWrap}>
      <button className={styles.closeBtn} onClick={onClose}>×</button>
      <div className={styles.chatBox}>
        {messages.map((msg, i) => (
          <div key={i}
            className={msg.senderUsername === user.username ? styles.sent : styles.received}
          >
            <b>{msg.senderUsername}:</b> {msg.message}
          </div>
        ))}
      </div>
      <div className={styles.inputBox}>
        <input
          className={styles.input}
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === "Enter" && sendMessage()}
          placeholder={connected ? "메시지 입력" : "서버 연결 중..."}
          disabled={!connected}
        />
        <button className={styles.sendBtn} onClick={sendMessage} disabled={!connected}>
          전송
        </button>
      </div>
      {!connected &&
        <div style={{ color: "#aaa", marginTop: 8, textAlign: "center" }}>
          서버 연결 중...
        </div>
      }
    </div>
  );
}
