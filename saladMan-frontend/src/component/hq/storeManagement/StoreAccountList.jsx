// StoreAccountList.jsx
import EmpSidebar from "./EmpSidebar";
import "./StoreAccountList.css";
import { useState } from "react";

export default function StoreAccountList() {
    const [region, setRegion] = useState("전체 지역");
    const [status, setStatus] = useState("전체 상태");
    const [keyword, setKeyword] = useState("");

    const stores = [
        { id: "001", name: "강남점", region: "서울", location: "", phone: "02-123-4567", account: "gangnam01", createdAt: "2022-05-01", status: "활성" },
        { id: "002", name: "홍대점", region: "서울", location: "", phone: "02-234-5678", account: "hongdae01", createdAt: "2023-01-15", status: "활성" },
        { id: "003", name: "수원점", region: "경기", location: "", phone: "031-345-6789", account: "suwon01", createdAt: "2023-07-22", status: "비활성" },
        { id: "004", name: "부산점", region: "부산", location: "", phone: "051-456-7890", account: "busan01", createdAt: "2024-03-10", status: "활성" }
    ];

    return (
        <>
            <EmpSidebar />

            <div className="storeAccountContainer">
                <div className="storeAccountContent">
                    <h2>매장/계정 목록</h2>

                    <div className="storeAccTopBar">
                        <button className="registerButton">매장등록</button>
                        <div className="searchGroup">
                            <select value={region} onChange={(e) => setRegion(e.target.value)}>
                                <option>전체 지역</option>
                                <option>서울</option>
                                <option>경기</option>
                                <option>부산</option>
                            </select>
                            <select value={status} onChange={(e) => setStatus(e.target.value)}>
                                <option>전체 상태</option>
                                <option>활성</option>
                                <option>비활성</option>
                            </select>
                            <input type="text" placeholder="검색어 입력" value={keyword} onChange={(e) => setKeyword(e.target.value)} />
                            <button className="searchButton">검색</button>
                        </div>
                    </div>

                    <table className="storeAccountTable">
                        <thead>
                            <tr>
                                <th>매장번호</th>
                                <th>매장명</th>
                                <th>매장위치</th>
                                <th>지역</th>
                                <th>전화번호</th>
                                <th>계정</th>
                                <th>계정 생성일</th>
                                <th>상태</th>
                                <th>수정</th>
                            </tr>
                        </thead>
                        <tbody>
                            {stores.map((store) => (
                                <tr key={store.id}>
                                    <td>{store.id}</td>
                                    <td>{store.name}</td>
                                    <td>{store.region}</td>
                                    <td>{store.location}</td>

                                    <td>{store.phone}</td>
                                    <td>{store.account}</td>
                                    <td>{store.createdAt}</td>
                                    <td>{store.status}</td>
                                    <td>
                                        <button className="editButton">수정</button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </>
    );
}
