import { useState, useEffect } from "react";
import styles from "./OrderDetail.module.css";
import OrderSidebar from "./OrderSidebar";
import { useNavigate } from "react-router";
import { myAxios } from "/src/config";
import { useAtomValue } from 'jotai';
import { accessTokenAtom } from "/src/atoms";

export default function OrderDetail() {
    const [items, setItems] = useState([]);
    const navigate = useNavigate();
    const token = useAtomValue(accessTokenAtom);
    const id = new URLSearchParams(location.search).get("id");
    const [info, setInfo] = useState({ oStatus: '', oDate: '', progress: 0 });
    const totalAmount = items.reduce((acc, item) => acc + item.totalPrice, 0);

    const formatDate = (isoString) => {
        const date = new Date(isoString);
        const yyyy = date.getFullYear();
        const mm = date.getMonth() + 1;
        const dd = date.getDate();
        const hh = date.getHours();
        const min = date.getMinutes().toString().padStart(2, '0');
        return `${yyyy}년 ${mm}월 ${dd}일 ${hh}시 ${min}분`;

    };

    useEffect(() => {
        if (!token) return;

        if (!id) return;

        const fetchDetail = async () => {
            try {
                const res = await myAxios(token).get(`/store/orderDetail/${id}`);
                setItems(res.data);
                console.log(res.data);

                const inspectedCount = res.data.filter(item => item.inspection === "검수완료").length;
                console.log(inspectedCount)

                const progress = Math.round((inspectedCount / res.data.length) * 100);
                console.log(progress)

                setInfo({
                    oStatus: res.data[0]?.orderStatus || '',
                    oDate: res.data[0]?.orderDateTime || '',
                    progress: progress,
                });


                console.log(info)
            } catch (err) {
                console.error("상세 조회 실패", err);
            }
        };

        fetchDetail();
    }, [id, token]);


    return (
        <>
            <div className={styles.orderDetailContainer}>
                <OrderSidebar />

                <div className={styles.orderDetailContent}>
                    <h2 className={styles.title}>발주상세</h2>

                    <div className={styles.infoSection}>
                        <div className={styles.status}>{info.oStatus}</div>
                        <div className={styles.orderNumber}>No: {id}</div>
                        <progress value={info.progress} max="100" className={styles.progressBar} />
                        <div className={styles.orderDate}>발주일: {formatDate(info.oDate)}</div>
                        {/* <div className={styles.requester}>주문자: {items.requester}</div> */}
                    </div>

                    <div className={styles.tableSection}>
                        <div className={styles.tableButtonSection}>
                            {/* {info.oStatus === "대기중" && (
                            <button className={styles.editButton}>수정</button>
                        )} */}
                        </div>
                        <table className={styles.detailTable}>
                            <thead>
                                <tr>
                                    <th>품명</th>
                                    <th>구분</th>
                                    <th>발주량</th>
                                    <th>발주승인여부</th>
                                    <th>입고 여부</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map((item, index) => (
                                    <tr key={item.id}>
                                        <td>{item.ingredientName}</td>
                                        <td>{item.categoryName}</td>
                                        <td>{item.orderedQuantity} {item.unit}</td>
                                        <td>
                                            {item.approvalStatus === "반려"
                                                ? `반려 (${item.rejectionReason || "-"})`
                                                : item.approvalStatus}
                                        </td>
                                        <td>{item.inspection}</td>
                                    </tr>
                                ))}                                
                            </tbody>
                        </table>
                    </div>
                    <div className={styles.footerSection}>
                        <button className={styles.completeButton} onClick={() => navigate(`/store/orderList`)}>목록</button>
                    </div>
                </div>
            </div>
        </>
    );
}
