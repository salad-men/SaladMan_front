import '../Sidebar.css';

export default function SidebarMenus() {
  return (
    <div className="sidebar">
      <h1 className="title">메뉴</h1>
      <ul className="list">
        <li className="listItem">
          <a href="/store/totalMenu" className="link">전체 메뉴</a>
        </li>
        <li className="listItem">
          <a href="/store/menuStatus" className="link">판매 메뉴</a>
        </li>
        <li className="listItem">
          <a href="/store/recipe" className="link">레시피 조회</a>
        </li>
      </ul>
    </div>
  );
}
