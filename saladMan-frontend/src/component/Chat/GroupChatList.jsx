import { useEffect, useState } from "react";
import { myAxios } from "/src/config";
import { accessTokenAtom } from "/src/atoms";
import { useAtomValue } from "jotai";
import styles from "./GroupChatList.module.css";
import ChatRoomPage from "./ChatRoomPage";

export default function GroupChatList() {
  const [groups, setGroups] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [newRoomTitle, setNewRoomTitle] = useState("");
  const token = useAtomValue(accessTokenAtom);

  // 그룹채팅 목록 불러오기
  const loadGroupRooms = () => {
    if (!token) return;
    myAxios(token).get("/chat/room/group/list")
      .then(res => setGroups(res.data))
      .catch(() => setGroups([]));
  };

  useEffect(() => {
    loadGroupRooms();
    // eslint-disable-next-line
  }, [token]);

  // 그룹채팅방 생성
  const createGroupRoom = async () => {
    if (!newRoomTitle.trim()) return alert("방 제목을 입력하세요!");
    try {
      await myAxios(token).post(`/chat/room/group/create?roomName=${encodeURIComponent(newRoomTitle)}`);
      setShowCreateModal(false);
      setNewRoomTitle("");
      loadGroupRooms();
    } catch (e) {
      alert("방 생성 실패");
    }
  };

  // 방 참여
  const joinGroupRoom = async (roomId) => {
    try {
      await myAxios(token).post(`/chat/room/group/${roomId}/join`);
      setActiveRoom(roomId);
    } catch (e) {
      alert("참여 실패");
    }
  };

  // 방 나가기
  const leaveGroupRoom = async (roomId) => {
    if (!window.confirm("정말 이 방을 나가시겠습니까?")) return;
    try {
      await myAxios(token).post(`/chat/room/group/${roomId}/leave`);
      setActiveRoom(null);
      loadGroupRooms();
    } catch (e) {
      alert("나가기 실패");
    }
  };

  // 채팅방 페이지 보여주기
  if (activeRoom)
    return (
      <ChatRoomPage
        roomId={activeRoom}
        onClose={() => {
          leaveGroupRoom(activeRoom);
        }}
      />
    );

  // 목록/생성모달
  return (
    <div className={styles.groupList}>
      <h4 className={styles.title}>그룹채팅 목록
        <button
          className={styles.createBtn}
          style={{ float: "right" }}
          onClick={() => setShowCreateModal(true)}
        >채팅방 생성</button>
      </h4>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>방번호</th>
            <th>방이름</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {groups.map(room => (
            <tr key={room.roomId}>
              <td>{room.roomId}</td>
              <td>{room.roomName}</td>
              <td>
                <button className={styles.joinBtn} onClick={() => joinGroupRoom(room.roomId)}>
                  참여
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 채팅방 생성 모달 */}
      {showCreateModal && (
        <div className={styles.modalBack}>
          <div className={styles.modalBox}>
            <h4>채팅방 생성</h4>
            <input
              className={styles.input}
              placeholder="방제목 입력"
              value={newRoomTitle}
              onChange={e => setNewRoomTitle(e.target.value)}
            />
            <div className={styles.modalBtns}>
              <button onClick={createGroupRoom}>생성</button>
              <button onClick={() => setShowCreateModal(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
