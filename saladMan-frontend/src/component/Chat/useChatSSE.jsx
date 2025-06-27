import { useEffect } from "react";
import { API_BASE } from "/src/config";
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "/src/atoms";

export default function useChatSSE({
  onNewMessage,
  onReadMessage,
  enabled = true,
}) {
  const token = useAtomValue(accessTokenAtom)?.replace("Bearer ", "");

  useEffect(() => {
    if (!token || !enabled) return;
    const sse = new EventSource(`${API_BASE}/chat/sse?token=${token}`);

    sse.addEventListener("newMessage", e => {
      const msg = JSON.parse(e.data);
      onNewMessage && onNewMessage(msg);
    });
    sse.addEventListener("readMessage", e => {
      const data = JSON.parse(e.data);
      onReadMessage && onReadMessage(data);
    });
    sse.onerror = () => {  };
    return () => sse.close();
  }, [token, enabled]);
}
