import { useEffect, useState } from 'react';
import styles from './Notification.module.css';
import { accessTokenAtom } from '/src/atoms';
import { myAxios } from '/src/config';
import { useAtomValue } from 'jotai';
import NoticeSidebar from './NoticeSidebar';

function Notification() {
  const [notification, setNotification] = useState([]);
  const [pageInfo, setPageInfo] = useState({ curPage: 1, allPage: 1, startPage: 1, endPage: 1 });
  const [selected, setSelected] = useState([]);
  const [pageNums, setPageNums] = useState([]);
  const token = useAtomValue(accessTokenAtom);

  useEffect(() => {
    if (token) {
      submit(1);
    }
  }, [token]);

  const toggleSelectAll = (checked) => {
    setSelected(checked ? notification.map(n => n.id) : []);
  };

  const toggleSelect = (id) => {
    setSelected(prev =>
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  const markAsReadSelected = () => {
  // 선택된 알림이 없으면 함수 종료
  if (selected.length === 0) return;

  // 선택된 각각의 id에 대해 읽음 처리 요청
  Promise.all(
    selected.map(id =>
      myAxios(token).get(`/store/notification/${id}`)
        .then(res => {
          if (res.data === true) {
            // 프론트 상태값 업데이트
            setNotification(prev =>
              prev.map(n => (n.id === id ? { ...n, isRead: true } : n))
            );
          } else {
            console.warn(`${id} 읽음 처리 실패`);
          }
        })
        .catch(err => console.error(`${id} 읽음 처리 에러:`, err))
    )
  ).then(() => {
    setSelected([]); // 선택 초기화
  });
};

const deleteSelected = () => {
  Promise.all(selected.map(id => 
    myAxios(token).delete(`/store/notification/${id}`)
  ))
  .then(() => {
    setSelected([]);
    submit(pageInfo.curPage);  // 삭제 후 다시 목록 요청
  })
  .catch(err => console.error('삭제 실패:', err));
};



  const submit = (page) => {
    myAxios(token).get(`/store/notification?page=${page}`)
      .then(res => {
        setNotification(res.data.data);
        setPageInfo(res.data.pageInfo);
        const pages = [];
        for (let i = res.data.pageInfo.startPage; i <= res.data.pageInfo.endPage; i++) {
          pages.push(i);
        }
        setPageNums(pages);
      })
      .catch(err => console.error('알림 목록 가져오기 실패:', err));
  };

  

  return (
    <div className={styles.wrapper}>
      <NoticeSidebar />
      <div className={styles.content}>
        <div className={styles.pageHeader}>
          <h2>알림 목록</h2>
        </div>
      <div className={styles.inboxControls}>
        <div>
          <button onClick={markAsReadSelected}>읽음 처리</button>
          <button onClick={deleteSelected}>삭제</button>
        </div>
        <div>
          읽지 않음 {notification.filter(n => !n.isRead).length}개 / 총 {notification.length}개
        </div>
      </div>

      <table className={styles.inboxTable}>
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={selected.length === notification.length}
                onChange={e => toggleSelectAll(e.target.checked)}
              />
            </th>
            <th>제목</th>
            <th>내용</th>
            <th>수신일시</th>
          </tr>
        </thead>
        <tbody>
          {notification.length === 0 ? (
            <tr>
              <td colSpan="4" className={styles.noData}>알림이 없습니다.</td>
            </tr>
          ) : (
            notification.map(noti => (
              <tr key={noti.id} className={noti.isRead ? '' : styles.unread}>
                <td>
                  <input
                    type="checkbox"
                    checked={selected.includes(noti.id)}
                    onChange={() => toggleSelect(noti.id)}
                  />
                </td>
                <td>{noti.title}</td>
                <td>{noti.content}</td>
                <td>{noti.sentAt}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      <div className={styles.pagination}>
        <button onClick={() => submit(pageInfo.curPage - 1)} disabled={pageInfo.curPage === 1}>
          &lt;
        </button>
        {pageNums.map(p => (
          <button key={p} onClick={() => submit(p)} className={p === pageInfo.curPage ? styles.active : ''}>
            {p}
          </button>
        ))}
        <button onClick={() => submit(pageInfo.curPage + 1)} disabled={pageInfo.curPage >= pageInfo.allPage}>
          &gt;
        </button>
      </div>
      </div>
    </div>
  );
}

export default Notification;