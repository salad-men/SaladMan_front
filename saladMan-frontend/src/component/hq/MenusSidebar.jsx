import './Sidebar.css'

export default function MenusSidebar() {
    return(
        <>
            <div className="sidebar">
                <h1>메뉴</h1>
                <ul>
                    <li><a href="#">전메뉴 조회</a></li>
                    <li><a href="#">메뉴 등록</a></li>
                    <li><a href="#">레시피 조회</a></li>
                </ul>
            </div>
        </>
    )
}