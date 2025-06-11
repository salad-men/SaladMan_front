import './AllMenus.css'
import MenusSidebar from './MenusSidebar'
import { Input } from 'reactstrap';

export default function AllMenus() {
    return (
        <>
            <div className="wrapper">
                <MenusSidebar />
                <div className="content">
                    <header className="page-header">
                        <h2>전체 메뉴 조회</h2>
                        <div className="controls">
                            <Input type="text" id="searchInput" placeholder="메뉴명을 검색하세요" />
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

                        <div className="menu-card">
                            <div className="image-wrapper">
                                <img src="img1.png" alt="샐러드" />
                                <span className="badge">신메뉴</span>
                            </div>
                            <h3>치킨 시저 샐러드</h3>
                            <p>12,000원</p>
                        </div>

                        <div className="menu-card">
                            <div className="image-wrapper">
                                <img src="img2.png" alt="샐러드" />
                            </div>
                            <h3>그릴드 스테이크 샐러드</h3>
                            <p>12,000원</p>
                        </div>

                        <div className="menu-card">
                            <div className="image-wrapper">
                                <img src="img2.png" alt="샐러드" />
                            </div>
                            <h3>연어 아보카도 샐러드</h3>
                            <p>12,000원</p>
                        </div>

                        <div className="menu-card">
                            <div className="image-wrapper">
                                <img src="img2.png" alt="샐러드" />
                            </div>
                            <h3>단호박 닭가슴살 샐러드</h3>
                            <p>12,000원</p>
                        </div>

                        <div className="menu-card">
                            <div className="image-wrapper">
                                <img src="img1.png" alt="샐러드" />
                            </div>
                            <h3>리코타 치즈 샐러드</h3>
                            <p>12,000원</p>
                        </div>

                        <div className="menu-card">
                            <div className="image-wrapper">
                                <img src="img2.png" alt="샐러드" />
                            </div>
                            <h3>참치 곡물 샐러드</h3>
                            <p>12,000원</p>
                        </div>

                        <div className="menu-card">
                            <div className="image-wrapper">
                                <img src="img3.png" alt="샐러드" />
                            </div>
                            <h3>훈제 오리 샐러드</h3>
                            <p>12,000원</p>
                        </div>

                        <div className="menu-card">
                            <div className="image-wrapper">
                                <img src="img1.png" alt="샐러드" />
                            </div>
                            <h3>두부 아보카도 샐러드</h3>
                            <p>12,000원</p>
                        </div>

                        <div className="menu-card">
                            <div className="image-wrapper">
                                <img src="img2.png" alt="샐러드" />
                            </div>
                            <h3>닭가슴살 퀴노아 샐러드</h3>
                            <p>12,000원</p>
                        </div>
                    </section>
                </div>
            </div>
        </>
    )
}