import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { accessTokenAtom } from '/src/atoms';
import { myAxios } from '/src/config.jsx';
import styles from './TotalMenu.module.css';
import SidebarMenu from './SidebarMenu';

const CATEGORY_LIST = [
  { id: 1, name: '샐러볼' },
  { id: 2, name: '포케볼' },
  { id: 3, name: '비건볼' }
];

const TotalMenu = () => {
  const [menus, setMenus] = useState([]);
  const [pageInfo, setPageInfo] = useState({ curPage:1, allPage:1, startPage:1, endPage:1 });
  const [sort, setSort] = useState('release_desc');
  const [pageNums, setPageNums] = useState([]);
  const [activeCategory, setActiveCategory] = useState(1);
  const [token] = useAtom(accessTokenAtom);

  useEffect(() => {
    if (token) {
      submit(1, activeCategory);
    }
  }, [token, sort, activeCategory]);

  const handleSortChange = (e) => {
    setSort(e.target.value);
  };

  const submit = (page, category = activeCategory) => {
    if (!token) return;
    const axios = myAxios(token);

    axios.get(`/totalMenu?page=${page}&sort=${sort}&category_id=${category}`)
      .then(res => {
        setMenus(res.data.menus);
        setPageInfo(res.data.pageInfo);

        const pages = [];
        for (let i = res.data.pageInfo.startPage; i <= res.data.pageInfo.endPage; i++) {
          pages.push(i);
        }
        setPageNums(pages);
      })
      .catch(err => console.error(err));
  };

  return (
    <div className={styles.wrapper}>
      <SidebarMenu />
      <div className={styles.content}>
        <header className={styles.pageHeader}>
          <h2>전체 메뉴 조회</h2>

          {/* ✅ 탭 메뉴 */}
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

          {/* ✅ 정렬 */}
          <div className={styles.controls}>
            <select id="sortSelect" value={sort} onChange={handleSortChange}>
              <option value="release_desc">출시일 순 (최신순)</option>
              <option value="release_asc">출시일 순 (오래된순)</option>
              <option value="name_asc">이름순 (가나다)</option>
              <option value="name_desc">이름순 (역순)</option>
              <option value="price_asc">가격순 (낮은 가격)</option>
              <option value="price_desc">가격순 (높은 가격)</option>
            </select>
          </div>
        </header>

        {/* ✅ 메뉴 목록 */}
        <section className={styles.menuGrid}>
          {menus.length === 0 ? (
            <div className={styles.emptyMsg}>등록된 메뉴가 없습니다.</div>
          ) : (
            menus.map(menu => (
              <div className={styles.menuCard} key={menu.id}>
                <div className={styles.imageWrapper}>
                  <img src={`/${menu.name}.png`} alt={menu.name} />
                </div>
                <h3>{menu.name}</h3>
                <p>{Number(menu.salePrice).toLocaleString()}원</p>
              </div>
            ))
          )}
        </section>

        {/* ✅ 페이지네이션 */}
        <div className={styles.pagination}>
          <button
            onClick={() => submit(pageInfo.curPage - 1)}
            disabled={pageInfo.curPage === 1}
          >
            &lt;
          </button>
          {pageNums.map(p => (
            <button
              key={p}
              onClick={() => submit(p)}
              className={p === pageInfo.curPage ? styles.active : ''}
            >
              {p}
            </button>
          ))}
          <button
            onClick={() => submit(pageInfo.curPage + 1)}
            disabled={pageInfo.curPage >= pageInfo.allPage}
          >
            &gt;
          </button>
        </div>
      </div>
    </div>
  );
};

export default TotalMenu;
