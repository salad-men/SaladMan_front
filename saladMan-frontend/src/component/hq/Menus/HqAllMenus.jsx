import './HqAllMenus.css'
import HqSidebarMenus from './HqSidebarMenus'

const HqAllMenus = () => {
    const dummyMenus = [
    { id: 1, name: '치킨 시저 샐러드', price: '12,000원', imageUrl: '/img1.png', badge: '신메뉴' },
    { id: 2, name: '그릴드 스테이크 샐러드', price: '12,000원', imageUrl: '/img2.png' },
    { id: 3, name: '연어 아보카도 샐러드', price: '12,000원', imageUrl: '/img2.png' },
    { id: 4, name: '단호박 닭가슴살 샐러드', price: '12,000원', imageUrl: '/img2.png' },
    { id: 5, name: '리코타 치즈 샐러드', price: '12,000원', imageUrl: '/img1.png' },
    { id: 6, name: '참치 곡물 샐러드', price: '12,000원', imageUrl: '/img2.png' },
    { id: 7, name: '훈제 오리 샐러드', price: '12,000원', imageUrl: '/img3.png' },
    { id: 8, name: '두부 아보카도 샐러드', price: '12,000원', imageUrl: '/img1.png' },
    { id: 9, name: '닭가슴살 퀴노아 샐러드', price: '12,000원', imageUrl: '/img2.png' },
    ];

    return (
        <>
            <div className="wrapper">
                <HqSidebarMenus />
                <div className="content">
                    <header className="page-header">
                        <h2>전체 메뉴 조회</h2>
                        <div className="controls">
                            <input type="text" id="searchInput" placeholder="메뉴명을 검색하세요" />
                            <select id="sortSelect">
                                <option value="release_desc">출시일 순 (최신순)</option>
                                <option value="release_asc">출시일 순 (오래된순)</option>
                                <option value="name_asc">이름순 (가나다)</option>
                                <option value="name_desc">이름순 (역순)</option>
                                <option value="price_asc">가격순 (낮은 가격)</option>
                                <option value="price_desc">가격순 (높은 가격)</option>
                            </select>
                            <button>검색</button>
                        </div>
                    </header>

                    <section className="menu-grid">
                        {dummyMenus.map(menu => (
                            <div className="menu-card" key={menu.id}>
                            <div className="image-wrapper">
                                <img src={menu.imageUrl} alt={menu.name} />
                                {menu.badge && <span className="badge">{menu.badge}</span>}
                            </div>
                            <h3>{menu.name}</h3>
                            <p>{menu.price}</p>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </>
    )
}

export default HqAllMenus;