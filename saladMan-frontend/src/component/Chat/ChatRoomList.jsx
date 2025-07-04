import { useEffect, useState } from "react";
import { myAxios } from "/src/config";
import { accessTokenAtom } from "/src/atoms";
import { useAtomValue } from "jotai";
import styles from "./ChatRoomList.module.css";
import ChatRoomPage from "./ChatRoomPage";

export default function ChatRoomList({
  rooms = [],
  setRooms = () => {},
  forceActiveRoom,
  setForceActiveRoom,
  currentStoreId,      // ← 추가: 본사면 1, 매장이면 각 매장 ID
}) {
  const [activeRoom, setActiveRoom] = useState(null);
  const token = useAtomValue(accessTokenAtom);

  const safeRooms = Array.isArray(rooms) ? rooms : [];

  // 자신의 방(자기 매장·본사)에 해당하는 room은 필터링
  const displayRooms = safeRooms.filter(room => room.storeId !== currentStoreId);

  // 최초 방목록 로딩
  useEffect(() => {
    if (!token || safeRooms.length > 0) return;
    myAxios(token)
      .get("/chat/my/rooms")
      .then(res => setRooms(res.data || []))
      .catch(() => setRooms([]));
  }, [token, setRooms, safeRooms.length]);

  // forceActiveRoom 값이 변경될 때 해당 방으로 자동입장
  useEffect(() => {
    if (forceActiveRoom && safeRooms.some(r => r.roomId === forceActiveRoom)) {
      setActiveRoom(forceActiveRoom);
      setForceActiveRoom && setForceActiveRoom(null);
    }
  }, [forceActiveRoom, safeRooms, setForceActiveRoom]);

  // 채팅방 나가기 후 실시간 반영
  const handleLeaveRoom = async (roomId, isGroup) => {
    try {
      if (isGroup === "Y") {
        await myAxios(token).delete(`/chat/room/group/${roomId}/leave`);
      } else {
        await myAxios(token).delete(`/chat/room/private/${roomId}/leave`);
      }
      const res = await myAxios(token).get("/chat/my/rooms");
      setRooms(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      alert("방 나가기에 실패했습니다.");
    }
  };

  if (activeRoom)
    return (
      <ChatRoomPage
        roomId={activeRoom}
        onClose={() => setActiveRoom(null)}
        setRooms={setRooms}
      />
    );

  return (
    <div className={styles.roomList}>
      <h4 className={styles.title}>내 채팅목록</h4>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>방이름</th>
            <th>읽지 않은</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {displayRooms.length === 0 ? (
            <tr>
              <td colSpan={3} style={{ color: "#888" }}>
                채팅방이 없습니다.
              </td>
            </tr>
          ) : (
            displayRooms.map(room => (
              <tr key={room.roomId}>
                <td>{room.roomName}</td>
                <td>{room.unReadCount || 0}</td>
                <td>
                  <button
                    className={styles.enterBtn}
                    onClick={() => setActiveRoom(room.roomId)}
                  >
                    입장
                  </button>
                  <button
                    className={styles.leaveBtn}
                    onClick={() =>
                      handleLeaveRoom(room.roomId, room.isGroupChat)
                    }
                  >
                    나가기
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
