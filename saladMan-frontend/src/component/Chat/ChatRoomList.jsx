import { useEffect, useState } from "react";
import { myAxios } from "/src/config";
import { accessTokenAtom } from "/src/atoms";
import { useAtomValue } from "jotai";
import styles from "./ChatRoomList.module.css";
import ChatRoomPage from "./ChatRoomPage";

export default function ChatRoomList() {
  const [rooms, setRooms] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const token = useAtomValue(accessTokenAtom);

  useEffect(() => {
    if (!token) return;

    myAxios(token).get("/chat/my/rooms").then(res=>setRooms(res.data));
  }, [token]);

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
