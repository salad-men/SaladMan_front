import './NoticeSidebar.module.css';

export default function NoticeSidebar() {
  return (
    <div className="sidebar">
      <h1>공지사항</h1>
      <ul>
        <li><a href="/hq/HqNoticeList">공지사항 목록</a></li>
        <li><a href="/hq/HqComplaintList">불편사항 목록</a></li>
      </ul>
    </div>
  );
}
