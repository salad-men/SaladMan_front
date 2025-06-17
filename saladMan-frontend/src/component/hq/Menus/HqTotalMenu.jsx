import { useEffect, useState } from 'react';
import styles from './HqTotalMenu.module.css';
import { myAxios } from '/src/config.jsx';
import HqSidebarMenus from './HqSidebarMenus';

const HqAllMenus = () => {
    const [menus, setMenus] = useState([]);
    const [sort, setSort] = useState('release_desc');

    useEffect(() => {
        const axios = myAxios();

        axios.get(`/hq/allMenus?sort=${sort}`)
            .then(res => {
                console.log(res);
                setMenus(res.data);
            })
            .catch(err => console.error(err));
    }, [sort]);

    return (
        <>
            <div className={styles.wrapper}>
                <HqSidebarMenus />
                <div className={styles.content}>
                    <header className={styles.pageHeader}>
                        <h2>전체 메뉴 조회</h2>
                        <div className={styles.controls}>
                            <select id="sortSelect" value={sort} onChange={(e) => setSort(e.target.value)}>
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
                                    {/* {menu.badge && <span className="badge">{menu.badge}</span>} */}
                                    <img src='/img1.png' alt={menu.name} />
                                </div>
                                <h3>{menu.name}</h3>
                                <p>{menu.salePrice.toLocaleString()}원</p>
                            </div>
                        ))}
                    </section>
                </div>
            </div>
        </>
    );
};

export default HqAllMenus;
