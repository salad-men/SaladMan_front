import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { accessTokenAtom } from '/src/atoms';
import { myAxios } from '/src/config.jsx';
import styles from './HqTotalMenu.module.css';
import HqSidebarMenu from './HqSidebarMenu';

const CATEGORY_LIST = [
  { id: 1, name: '샐러볼' },
  { id: 2, name: '포케볼' },
  { id: 3, name: '비건볼' }
];

const HqTotalMenu = () => {
  const [menus, setMenus] = useState([]);
  const [pageInfo, setPageInfo] = useState({ curPage: 1, allPage: 1, startPage: 1, endPage: 1 });
  const [sort, setSort] = useState('release_desc');
  const [pageNums, setPageNums] = useState([]);
  const [token] = useAtom(accessTokenAtom);

  // 탭: 카테고리 상태
  const [activeCategory, setActiveCategory] = useState(1);

  // 메뉴 목록 불러오기 함수
  const fetchMenus = (page = 1, category = activeCategory, sortOrder = sort) => {
    if (!token) return;
    const axios = myAxios(token);

    axios
      .get(`/totalMenu?page=${page}&sort=${sortOrder}&category_id=${category}`)
      .then((res) => {
        setMenus(res.data.menus);
        setPageInfo(res.data.pageInfo);

        const pages = [];
        for (let i = res.data.pageInfo.startPage; i <= res.data.pageInfo.endPage; i++) {
          pages.push(i);
        }
        setPageNums(pages);
      })
      .catch((err) => console.error(err));
  };

  // 최초 마운트, 토큰/카테고리/정렬 변경 시 메뉴 재조회
  useEffect(() => {
    if (token) {
      fetchMenus(1, activeCategory, sort);
    }
    // eslint-disable-next-line
  }, [token, activeCategory, sort]);

  // "NEW" 뱃지 조건 (생성월이 현재월과 동일)
  const isNewMenu = (createdAt) => {
    if (!createdAt) return false;
    const now = new Date();
    const created = new Date(createdAt);
    return created.getFullYear() === now.getFullYear() && created.getMonth() === now.getMonth();
  };

  return (
    <div className={styles.wrapper}>
      <HqSidebarMenu />
      <div className={styles.content}>
        <header className={styles.pageHeader}>
          <h2>전체 메뉴</h2>

          {/* 탭 메뉴 */}
          <nav className={styles.tabNav}>
            {CATEGORY_LIST.map((cat) => (
              <button
                key={cat.id}
                className={`${styles.tabBtn} ${activeCategory === cat.id ? styles.activeTab : ''}`}
                onClick={() => setActiveCategory(cat.id)}
                type="button"
                aria-current={activeCategory === cat.id ? "page" : undefined}
              >
                {cat.name}
              </button>
            ))}
          </nav>

          <div className={styles.controls}>
            <select id="sortSelect" value={sort} onChange={e => setSort(e.target.value)}>
              <option value="release_desc">출시일 순 (최신순)</option>
              <option value="release_asc">출시일 순 (오래된순)</option>
              <option value="name_desc">이름순 (가나다)</option>
              <option value="name_asc">이름순 (역순)</option>
              <option value="price_asc">가격순 (낮은 가격)</option>
              <option value="price_desc">가격순 (높은 가격)</option>
            </select>
          </div>
        </header>

        <section className={styles.menuGrid}>
          {menus.length === 0 ? (
            <div className={styles.emptyMsg}>등록된 메뉴가 없습니다.</div>
          ) : (
            menus.map((menu) => (
              <div className={styles.menuCard} key={menu.id}>
                <div className={styles.imageWrapper}>
                  <img src={`/${menu.name}.png`} alt={menu.name} />
                  {isNewMenu(menu.createdAt) && <span className={styles.badge}>new</span>}
                </div>
                <h3>{menu.name}</h3>
                <p>{Number(menu.salePrice).toLocaleString()}원</p>
              </div>
            ))
          )}
        </section>

        <div className={styles.pagination}>
          <button
            onClick={() => fetchMenus(pageInfo.curPage - 1, activeCategory, sort)}
            disabled={pageInfo.curPage === 1}
          >
            &lt;
          </button>
          {pageNums.map((p) => (
            <button
              key={p}
              onClick={() => fetchMenus(p, activeCategory, sort)}
              className={p === pageInfo.curPage ? styles.active : ''}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => fetchMenus(pageInfo.curPage + 1, activeCategory, sort)}
            disabled={pageInfo.curPage >= pageInfo.allPage}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default HqTotalMenu;
