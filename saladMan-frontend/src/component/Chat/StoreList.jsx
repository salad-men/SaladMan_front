// StoreList.jsx
import { useEffect, useState } from "react";
import { useAtom } from "jotai";
import { myAxios } from "/src/config";
import { accessTokenAtom } from "/src/atoms";
import styles from "./StoreList.module.css";
import ChatRoomPage from "./ChatRoomPage";

export default function StoreList() {
  const [stores, setStores] = useState([]);
  const [myStoreId, setMyStoreId] = useState(null); // 자신의 id 저장
  const [activeRoom, setActiveRoom] = useState(null);
  const [token] = useAtom(accessTokenAtom);
const [myUsername, setMyUsername] = useState(null);

  const fetchMyStoreId = async () => {
    if (!token) return;
    try {
      const res = await myAxios(token).get("/chat/me"); // 자신 정보 조회 
      setMyStoreId(res.data.id); // 자신의 id 세팅
    } catch (err) {
      console.error("내 정보 불러오기 실패:", err);
    }
  };

  const fetchStores = () => {
    if (!token) return;
    const axios = myAxios(token);

    axios.get("/chat/stores")
      .then(res => {
        setStores(res.data.stores || []);
      })
      .catch(err => {
        setStores([]);
      });
  };

  useEffect(() => {
    fetchMyStoreId();
    fetchStores();
  }, [token]);

  const startChat = async (storeId) => {
    if (!token) return;
    try {
      const res = await myAxios(token).post(`/chat/room/private/create?otherStoreId=${storeId}`);
      setActiveRoom(res.data);
    } catch (err) {
      alert("채팅방 생성 실패");
    }
  };

  

  // 자기 자신이 아닌 매장만 필터링
const filteredStores = stores.filter(
  store => store.id !== myStoreId && store.username !== myUsername
);

  if (activeRoom)
    return <ChatRoomPage roomId={activeRoom} onClose={() => setActiveRoom(null)} />;

  return (
    <div className={styles.storeList}>
      <h4 className={styles.title}>매장 목록</h4>
          <div className={styles.tableWrap}>

      <table className={styles.table}>
        <thead>
          <tr>
            <th>지점명</th>
            <th>아이디</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {filteredStores.map(store => (
            <tr key={store.id}>
              <td>{store.name}</td>
              <td>{store.username}</td>
              <td>
                <button className={styles.chatBtn}
                        onClick={() => startChat(Number(store.id))}> 
                  채팅
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      </div>
    </div>
  );
}
