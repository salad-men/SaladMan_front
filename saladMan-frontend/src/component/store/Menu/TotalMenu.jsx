import { useEffect, useState } from 'react';
import { useAtom } from 'jotai';
import { accessTokenAtom } from '/src/atoms';
import { myAxios } from '/src/config.jsx';
import styles from './TotalMenu.module.css';
import SidebarMenu from './SidebarMenu';

const TotalMenu = () => {
    const [menus, setMenus] = useState([]);
    const [pageInfo, setPageInfo] = useState({curPage:1, allPage:1, startPage:1, endPage:1});
    const [sort, setSort] = useState('release_desc');
    const [pageNums, setPageNums] = useState([]);
    const [token] = useAtom(accessTokenAtom);

    useEffect(() => {
        if (token) {
            submit(1);
        }
    }, [token, sort]);

    const handleSortChange = (e) => {
        setSort(e.target.value);
    };

    const submit = (page) => {
        if (!token) return;
        const axios = myAxios(token);

        axios.get(`/store/totalMenu?page=${page}&sort=${sort}`)
            .then(res => {
                console.log(res);
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

                <section className={styles.menuGrid}>
                    {menus.map(menu => (
                        <div className={styles.menuCard} key={menu.id}>
                            <div className={styles.imageWrapper}>
                                <img src={`/${menu.name}.png`} alt={menu.name} />
                            </div>
                            <h3>{menu.name}</h3>
                            <p>{menu.salePrice.toLocaleString()}원</p>
                        </div>
                    ))}
                </section>

                <div className={styles.pagination}>
                    <button onClick={() => submit(pageInfo.curPage - 1)} disabled={pageInfo.curPage === 1}>
                        &lt;
                    </button>
                    {pageNums.map(p => (
                        <button key={p} onClick={() => submit(p)} className={p === pageInfo.curPage ? styles.active : ''}>
                            {p}
                        </button>
                    ))}
                    <button onClick={() => submit(pageInfo.curPage + 1)} disabled={pageInfo.curPage >= pageInfo.allPage}>
                        &gt;
                    </button>
                </div>
            </div>
        </div>
    );
};

export default TotalMenu;
