import { useEffect } from "react";
import { API_BASE } from "/src/config";

export default function useChatSSE({
  enabled = true,
  user,
  token,          
  rooms,
  setRooms,
  onUnreadTotal,
  onModal,
}) {
  useEffect(() => {
    if (!token || !enabled) {
      console.log("[SSE] 연결 안함: token 없음 또는 enabled=false");
      return;
    }
    const url = `${API_BASE}/chat/sse?token=${token}`;
    const sse = new EventSource(url);

    sse.addEventListener("open", () => {
      console.log("[SSE] 연결 성공!");
    });

    sse.addEventListener("newMessage", (e) => {
      try {
        const msg = JSON.parse(e.data);
        if (msg.senderUsername === user?.username) return;
        
        setRooms(prevRooms => {
          // 항상 배열로 보장
          const safeRooms = Array.isArray(prevRooms) ? prevRooms : [];
          let updated = false;
          const next = safeRooms.map(r => {
            if (r.roomId === msg.roomId) {
              updated = true;
              return { ...r, unReadCount: (r.unReadCount || 0) + 1 };
            }
            return r;
          });
          if (!updated && msg.roomId) {
            next.push({ roomId: msg.roomId, roomName: msg.roomName, unReadCount: 1 });
          }
          
          const safeNext = Array.isArray(next) ? next : [];
          const totalUnread = safeNext.reduce((sum, r) => sum + (r.unReadCount || 0), 0);
          onUnreadTotal && onUnreadTotal(totalUnread);
          onModal && onModal({
            ...msg,
            roomName: safeNext.find(r => r.roomId === msg.roomId)?.roomName || `방번호 ${msg.roomId}`
          });
          return safeNext;
        });

      } catch (err) {
        console.error("[SSE] newMessage 파싱 오류:", err, e.data);
      }
    });

    // 읽음처리(방 들어가서 읽음 시)
    sse.addEventListener("readMessage", (e) => {
      try {
        const data = JSON.parse(e.data);
        setRooms(prevRooms => {
          const next = prevRooms.map(r =>
            r.roomId === data.roomId ? { ...r, unReadCount: 0 } : r
          );
          onUnreadTotal && onUnreadTotal(next.reduce((sum, r) => sum + (r.unReadCount || 0), 0));
          return next;
        });
      } catch (err) {
        console.error("[SSE] readMessage 파싱 오류:", err, e.data);
      }
    });

    sse.onerror = (err) => {
      console.error("[SSE] 연결 오류 or 서버측 종료", err);
    };

    return () => {
      console.log("[SSE] 연결 해제!");
      sse.close();
    };
  }, [token, enabled, user?.username]);
}
