import '../Sidebar.css';

export default function NoticeSidebar() {
    return (
        <div className="sidebar">
            <h1 className="title">공지사항</h1>
            <ul className="list">
                <li className="listItem">
                    <a href="/store/StoreNoticeList" className="link">공지사항</a>
                </li>
                <li className="listItem">
                    <a href="/store/StoreComplaintList" className="link">불편사항</a>
                </li>
                <li className="listItem">
                    <a href="/store/alarmList" className="link">알림 목록</a>
                </li>
            </ul>
        </div>
    );
}
