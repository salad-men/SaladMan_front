import { useEffect, useState } from "react";
import { myAxios } from "/src/config";
import { accessTokenAtom } from "/src/atoms";
import { useAtomValue } from "jotai";
import styles from "./ChatRoomList.module.css";
import ChatRoomPage from "./ChatRoomPage";
import useChatSSE from "./useChatSSE";

export default function ChatRoomList() {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const token = useAtomValue(accessTokenAtom);

  useEffect(() => {
    if (!token) return;

    myAxios(token).get("/chat/my/rooms").then(res=>setRooms(res.data));
  }, [token]);

  // 실시간 반영 + 모달/뱃지 연동
  useChatSSE({
    enabled: true, // 연결은 항상 유지 (안읽은 카운트 위해)
    onNewMessage: (msg) => {
      setRooms(rs => {
        const next = rs.map(room =>
          room.roomId === msg.roomId
            ? { ...room, unReadCount: (room.unReadCount || 0) + 1 }
            : room
        );
        // 안읽은 총합 갱신
        setUnreadTotal(next.reduce((sum, r) => sum + (r.unReadCount || 0), 0));
        // 모달
        if (alertOn && showModal) {
          // roomName 찾아서 전달
          const targetRoom = next.find(r => r.roomId === msg.roomId);
          showModal({
            ...msg,
            roomName: targetRoom?.roomName || `방번호 ${msg.roomId}`
          });
        }
        return next;
      });
    },
    onReadMessage: (data) => {
      setRooms(rs => {
        const next = rs.map(room =>
          room.roomId === data.roomId
            ? { ...room, unReadCount: 0 }
            : room
        );
        setUnreadTotal(next.reduce((sum, r) => sum + (r.unReadCount || 0), 0));
        return next;
      });
    }
  });

  if (activeRoom)
    return (
      <ChatRoomPage roomId={activeRoom} onClose={()=>setActiveRoom(null)} />
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
          {rooms.map(room=>(
            <tr key={room.roomId}>
              <td>{room.roomName}</td>
              <td>{room.unReadCount || 0}</td>
              <td>
              <button className={styles.enterBtn} onClick={()=>setActiveRoom(room.roomId)}>입장</button>
              {room.isGroupChat==="Y" && (
                <button className={styles.leaveBtn} onClick={async()=>{
                  await myAxios(token).delete(`/chat/room/group/${room.roomId}/leave`);
                  setRooms(r=>r.filter(a=>a.roomId!==room.roomId));
                }}>나가기</button>
              )}
              {room.isGroupChat==="N" && (
                <button className={styles.leaveBtn} onClick={async()=>{
                  await myAxios(token).delete(`/chat/room/private/${room.roomId}/leave`);
                  setRooms(r=>r.filter(a=>a.roomId!==room.roomId));
                }}>나가기</button>
              )}
            </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
