import { useEffect, useState } from "react";
import { myAxios } from "/src/config";
import { accessTokenAtom } from "/src/atoms";
import { useAtomValue } from "jotai";
import styles from "./ChatRoomList.module.css";
import ChatRoomPage from "./ChatRoomPage";

/**
 * @param {Array} rooms - 방 목록 (App.js 전역에서 내려옴, 방별 unreadCount 등 포함)
 * @param {Function} setRooms - 방 목록 setter (실시간 unread/나가기 등에서 갱신)
 */
export default function ChatRoomList({ rooms = [], setRooms = () => {} }) {
  const [activeRoom, setActiveRoom] = useState(null);
  const token = useAtomValue(accessTokenAtom);

  // 최초 방목록 로딩 (App.js에서 이미 가져오면 이 부분은 거의 실행 안 됨)
  useEffect(() => {
    // token 있어야 하고, rooms가 아예 없을 때만 fetch
    if (!token || (rooms && rooms.length > 0)) return;
    myAxios(token).get("/chat/my/rooms")
      .then(res => setRooms(res.data || []))
      .catch(() => setRooms([]));
  }, [token, rooms, setRooms]);

  if (activeRoom)
    return (
      <ChatRoomPage
        roomId={activeRoom}
        onClose={() => setActiveRoom(null)}
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
          {(rooms || []).length === 0 ? (
            <tr>
              <td colSpan={3} style={{ color: "#888" }}>채팅방이 없습니다.</td>
            </tr>
          ) : (
            (rooms || []).map(room => (
              <tr key={room.roomId}>
                <td>{room.roomName}</td>
                <td>{room.unReadCount || 0}</td>
                <td>
                  <button
                    className={styles.enterBtn}
                    onClick={() => setActiveRoom(room.roomId)}
                  >입장</button>
                  {room.isGroupChat === "Y" && (
                    <button
                      className={styles.leaveBtn}
                      onClick={async () => {
                        await myAxios(token).delete(`/chat/room/group/${room.roomId}/leave`);
                        setRooms(r => (r || []).filter(a => a.roomId !== room.roomId));
                      }}
                    >나가기</button>
                  )}
                  {room.isGroupChat === "N" && (
                    <button
                      className={styles.leaveBtn}
                      onClick={async () => {
                        await myAxios(token).delete(`/chat/room/private/${room.roomId}/leave`);
                        setRooms(r => (r || []).filter(a => a.roomId !== room.roomId));
                      }}
                    >나가기</button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
