import { useEffect, useState } from 'react';
import { useAtomValue } from 'jotai';
import { tokenAtom } from '/src/atoms';
import { myAxios } from '/src/config';
import styles from './LowStockList.module.css';


export default function LowStockList() {
    const token = useAtomValue(tokenAtom);
    const [shortages, setShortages] = useState([]);

    useEffect(() => {
        const fetchShortages = async () => {
            try {
                const res = await myAxios(token).get('/store/orderApply/lowStock');
                setShortages(res.data);
            } catch (err) {
                console.error('수량미달 품목 조회 실패:', err);
            }
        };

        fetchShortages();
    }, [token]);
    return (
        <>

            <div className={styles.shortageBox}>
                <h4>수량미달품목 <span>(총 {shortages.length}개)</span></h4>
                <table className={styles.shortageTable}>
                    <thead>
                        <tr><th>품명</th><th>구분</th><th>매장보유량</th></tr>
                    </thead>
                    <tbody>
                        {shortages.map((item, i) => (
                            <tr key={i}>
                                <td>{item.name}</td>
                                <td>{item.category}</td>
                                <td>{item.quantity}{item.unit}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </>
    )
}