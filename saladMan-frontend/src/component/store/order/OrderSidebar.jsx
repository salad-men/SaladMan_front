import '../Sidebar.css';

export default function OrderSidebar() {
    return (
        <div className="sidebar">
            <h1 className="title">발주</h1>
            <ul className="list">
                <li className="listItem">
                    <a href="/store/orderList" className="link">발주 목록</a>
                </li>
                <li className="listItem">
                    <a href="/store/orderApply" className="link">발주 신청</a>
                </li>
                <li className="listItem">
                    <a href="/store/stockInspection" className="link">발주입고 검수</a>
                </li>
                <li className="listItem">
                    <a href="/store/orderSettings" className="link">발주 설정</a>
                </li>
            </ul>
        </div>
    );
}
