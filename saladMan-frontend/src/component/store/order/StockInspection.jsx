import { useState, useEffect } from "react";
import styles from "./StockInspection.module.css";
import OrderSidebar from "./OrderSidebar";
import { myAxios } from "/src/config";
import { useAtomValue } from 'jotai';
import { accessTokenAtom } from "/src/atoms";
import { useNavigate } from "react-router";


export default function StockInspection() {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const token = useAtomValue(accessTokenAtom);
    const [orderDate,setOrderDate] = useState(0);
    const id = new URLSearchParams(location.search).get("id");
    useEffect(() => {
        if (!token) return;

        console.log(id);
        if (!id) return;
        const fetchDetail = async () => {
            try {
                const res = await myAxios(token).get(`/store/stockInspection/${id}`);
                console.log(res.data);
                setItems(res.data);
                setOrderDate(res.data[0]?.orderDateTime)

            } catch (err) {
                console.error("검수 조회 실패", err);
            }
        }
        fetchDetail();

    }, [id, token]);

    const handleInputChange = (index, field, value) => {
        const updated = [...items];
        updated[index][field] = value;
        setItems(updated);
    };
    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const yyyy = date.getFullYear();
        const mm = date.getMonth() + 1;
        const dd = date.getDate();
        const hh = date.getHours();
        const min = date.getMinutes().toString().padStart(2, '0');
        return `${yyyy}년 ${mm}월 ${dd}일 ${hh}시 ${min}분`;

    };
    return (
        <>
            <div className={styles.stockInspectionContainer}>
                <OrderSidebar />

                <div className={styles.stockInspectionContent}>
                    <h2 className={styles.title}>입고검수</h2>

                    <div className={styles.infoBox}>
                        <p>발주번호: No.{id} </p>
                        <p>발주일자:{formatDate(orderDate)}</p>
                        <p>주문자: </p>
                    </div>
                    <div className={styles.inspectorBox}>
                        <span> <span style={{ width: 100 }}>검수자:</span> <select> <option></option></select></span>
                    </div>

                    <table className={styles.inspectionTable}>
                        <thead>
                            <tr>
                                <th>품명</th>
                                <th>구분</th>
                                <th>발주량</th>
                                <th>실제 입고량</th>
                                <th>입고 처리</th>
                                <th>비고</th>
                                <th>단가</th>
                                <th>합계</th>
                            </tr>
                        </thead>
                        <tbody>
                            {items.map((item, index) => (
                                <tr key={item.id}>
                                    <td>{item.ingredientName}</td>
                                    <td>{item.categoryName}</td>
                                    <td>{item.orderedQuantity} {item.unit}</td>

                                    <td>
                                        <input
                                            type="text"
                                            value={item.receivedQuantity}
                                            className={styles.inputBox}
                                            onChange={(e) => handleInputChange(index, "receivedQuantity", e.target.value)}
                                        />
                                    </td>
                                    <td>
                                        <select value={item.inspection} className={styles.selectBox} onChange={(e) => handleInputChange(index, "inspection", e.target.value)}
                                        >
                                            <option value="검수완료">검수완료</option>
                                            <option value="파손">파손</option>
                                        </select>
                                    </td>
                                    <td>
                                        <input type="text"
                                            defaultValue={item.inspectionNote} className={styles.textArea}
                                            onChange={(e) => handleInputChange(index, "inspectionNote", e.target.value)}
                                        />
                                    </td>
                                    <td>{item.unitCost.toLocaleString()} 원</td>
                                    <td>{item.totalPrice.toLocaleString()} 원</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className={styles.footerSection}>
                        <button className={styles.completeButton}>검수 완료</button>
                    </div>
                </div>
            </div>
        </>
    );
}
