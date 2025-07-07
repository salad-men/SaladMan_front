import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { myAxios } from "/src/config";
import { accessTokenAtom } from "/src/atoms";
import styles from "./StoreList.module.css";
import ChatRoomPage from "./ChatRoomPage";

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [activeRoom, setActiveRoom] = useState(null);
  const [token] = useAtom(accessTokenAtom);

  const fetchStores = () => {
    if (!token) return;
    const axios = myAxios(token);

    axios.get("/chat/stores")
      .then(res => {
        console.log(res.data);
        setStores(res.data.stores);
      })
      .catch(err => {
        console.error("매장 목록 불러오기 실패:", err);
        setStores([]);
      });
  };

  useEffect(() => {
    fetchStores();
  }, [token]);

  const startChat = async (storeId) => {
  if (!token) {
    console.error("토큰 없음!");
    alert("로그인 다시 해주세요");
    return;
  }
  try {
    console.log("startChat: storeId", storeId, "token", token);
    const res = await myAxios(token).post(`/chat/room/private/create?otherStoreId=${storeId}`);
    setActiveRoom(res.data);
  } catch (err) {
    if (err.response) {
      console.error("채팅방 생성 실패! 서버 응답:", err.response);
      alert("채팅방 생성 실패: " + (err.response.data?.message || err.response.status));
    } else {
      console.error("채팅방 생성 실패! 네트워크 또는 코드 오류:", err);
      alert("채팅방 생성 실패(프론트): " + err.message);
    }
  }
};



  if (activeRoom)
    return <ChatRoomPage roomId={activeRoom} onClose={() => setActiveRoom(null)} />;

  return (
    <div className={styles.storeList}>
      <h4 className={styles.title}>Store(매장) 목록</h4>
      <table className={styles.table}>
        <thead>
          <tr>
            <th>지점명</th>
            <th>아이디</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {stores.map(store => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.username}</td>
              <td>
                <button   className={styles.chatBtn}
                        onClick={() => startChat(Number(store.id))}> 
                  채팅
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
