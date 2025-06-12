import './HqInventorySidebar.module.css';

export default function InventorySidebar() {
  return (
    <div className="sidebar">
      <h1>재고 관리</h1>
      <ul>
        <li><a href="/hq/inventoryList">전체 재고 조회</a></li>
        <li><a href="/hq/addInventory">재고 추가</a></li>
        <li><a href="/hq/inventoryReport">재고 리포트</a></li>
      </ul>
    </div>
  );
}
