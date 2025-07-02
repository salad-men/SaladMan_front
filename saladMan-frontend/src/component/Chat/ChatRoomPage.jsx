import { useEffect, useRef, useState } from "react";
import { myAxios, API_BASE } from "/src/config";
import { accessTokenAtom, userAtom } from "/src/atoms";
import { useAtomValue} from "jotai";
import SockJS from "sockjs-client";
import { Client as StompClient } from "@stomp/stompjs";
import styles from "./ChatRoomPage.module.css";

export default function ChatRoomPage({ roomId, onClose, setRooms }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [connected, setConnected] = useState(false);
  const stompClientRef = useRef(null);

  const accessToken = useAtomValue(accessTokenAtom);
  const user = useAtomValue(userAtom);

  // 1) 메시지 로딩 & 읽음처리
  useEffect(() => {
    if (!accessToken) return;
    myAxios(accessToken)
      .get(`/chat/history/${roomId}`)
      .then(res => {
        setMessages(res.data || []);
      });

    // **채팅방 입장시 읽음처리**
    myAxios(accessToken).post(`/chat/room/${roomId}/read`).then(() => {
      setRooms && setRooms(prevRooms => prevRooms.map(r => r.roomId === roomId ? { ...r, unReadCount: 0 } : r));
    });
  }, [roomId, accessToken, setRooms]);


  // 웹소켓 연결 & 구독
  useEffect(() => {
    if (!accessToken) return;
    console.log("[ChatRoomPage] WebSocket 연결 시도");

    const sock = new SockJS(`${API_BASE}/connect`);
    const stomp = new StompClient({
      webSocketFactory: () => sock,
      connectHeaders: {
        Authorization: accessToken,
      },
      onConnect: () => {
        console.log("[ChatRoomPage] WebSocket 연결 성공!");
        setConnected(true);
        stomp.subscribe(
          `/topic/${roomId}`,
          (msg) => {
            const payload = JSON.parse(msg.body);
            console.log("[ChatRoomPage] 메시지 수신:", payload);
            setMessages(msgs => [...msgs, payload]);
          },
          { Authorization: accessToken }
        );
      },
      onDisconnect: () => {
        setConnected(false);
        console.log("[ChatRoomPage] WebSocket 연결 끊김");
      },
      onWebSocketClose: () => {
        setConnected(false);
        console.log("[ChatRoomPage] WebSocket 세션 종료");
      },
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
    console.log("[ChatRoomPage] 메시지 전송:", input);
    stompClientRef.current.publish({
      destination: `/publish/${roomId}`,
      body: JSON.stringify({ message: input, senderUsername: user.username })
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
