import React, { useEffect, useState } from "react";
import { useAtomValue } from "jotai";
import { useNavigate } from "react-router-dom";
import NoticeSidebar from "../Notice/NoticeSidebar";
import styles from "./HqComplaintList.module.css";
import { myAxios } from "../../../config";
import { accessTokenAtom } from "/src/atoms";

export default function HqComplaintList() {
  const token = useAtomValue(accessTokenAtom);
  const navigate = useNavigate();
  const [complaints, setComplaints] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [searchKeyword, setSearchKeyword] = useState("");

  const [readStatus, setReadStatus] = useState(""); // 전체, unread, read, relayed


  const [location, setLocation] = useState("전체 지역");
  const [storeList, setStoreList] = useState([]);

  const [selectedRegion, setSelectedRegion] = useState("");
  const [selectedStoreId, setSelectedStoreId] = useState("");

  const size = 10;

  // HQ 목록 (isRelay=false)
  const fetchComplaintList = (pageParam = 1, keywordParam = searchKeyword) => {
    if (!token) return;
    myAxios(token)
      .post("/hq/complaint/list", {
        page: pageParam,
        size,
        keyword: keywordParam,
        status: readStatus,
        storeId: selectedStoreId
      })
      .then(res => {
        const pi = res.data.pageInfo || {};
        setComplaints((res.data.complaintList || []).map(c => ({
          ...c,
          status: c.isRelay ? "전달완료" : (c.isHqRead ? "열람" : "미열람"),
        })));
        setPage(pi.curPage || pageParam);
        setTotalPages(pi.allPage || 1);
      });
  };

  useEffect(() => {
    if (!token || !location || location === "전체 지역") {
      setStoreList([]);
      return;
    }

    myAxios(token)
      .get("/hq/storeNamesByLocation", { params: { location } })
      .then(res => {
        setStoreList(res.data); // [{ id: ..., name: ... }]
      });
  }, [location, token]);

  useEffect(() => { fetchComplaintList(1, ""); }, [token]);

  // 검색
  const handleSearch = () => fetchComplaintList(1, searchKeyword);

  const getPageNumbers = () => {
    let start = Math.max(1, page - 2);
    let end = Math.min(totalPages, start + 4);
    if (end - start < 4) start = Math.max(1, end - 4);
    let arr = [];
    for (let i = start; i <= end; i++) arr.push(i);
    return arr;
  };


  // 페이지 이동
  const handlePageChange = (newPage) => {
    fetchComplaintList(newPage, searchKeyword);
  };

  return (
    <div className={styles.container}>
      <NoticeSidebar />
      <main className={styles.content}>
        <h2 className={styles.title}>불편사항 목록</h2>
        <div className={styles.filters}>
          <select value={location} onChange={e => setLocation(e.target.value)}>
            <option>전체 지역</option>
            <option>서울</option>
            <option>경기</option>
            <option>광주</option>
            <option>대구</option>
            <option>대전</option>
            <option>부산</option>
            <option>울산</option>
            <option>인천</option>
            <option>강원</option>
            <option>경남</option>
            <option>경북</option>
            <option>전남</option>
            <option>전북</option>
            <option>충남</option>
            <option>충북</option>
            <option>제주</option>
            <option>세종</option>
          </select>

          <select value={selectedStoreId} onChange={e => setSelectedStoreId(e.target.value)} disabled={!storeList.length}>
            <option value="">전체 매장</option>
            {storeList.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
          </select>

          <select value={readStatus} onChange={e => setReadStatus(e.target.value)}>
            <option value="">전체</option>
            <option value="false">미열람</option>
            <option value="true">열람</option>
          </select>

          <input
            type="text"
            placeholder="제목+내용 검색"
            value={searchKeyword}
            onChange={e => setSearchKeyword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSearch()}
          />
          <button onClick={handleSearch}>검색</button>
        </div>

        <table className={styles.detailTable}>
          <thead>
            <tr>
              <th>번호</th>
              <th>제목</th>
              <th>내용</th>
              <th>작성자</th>
              <th>작성일</th>
              <th>지점명</th>
              <th>비고</th>
            </tr>
          </thead>
          <tbody>
            {complaints.length === 0 ? (
              <tr>
                <td colSpan={7} className={styles.noData}>데이터가 없습니다.</td>
              </tr>
            ) : (
              complaints.map((c, idx) => (
                <tr key={c.id} className={!c.isHqRead ? styles.unread : ""}>
                  <td>{(page - 1) * size + idx + 1}</td>
                  <td className={styles.clickable}
                    onClick={() => navigate(`/hq/HqComplaintDetail/${c.id}`)}>
                    {c.title}
                  </td>
                  <td className={styles.preview}
                    onClick={() => navigate(`/hq/HqComplaintDetail/${c.id}`)}>
                    {c.content?.length > 40 ? c.content.slice(0, 40) + "..." : c.content}
                  </td>
                  <td>{c.writerNickname ?? "고객"}</td>
                  <td>{c.writerDate}</td>
                  <td>{c.storeName ?? "알 수 없음"}</td>
                  <td className={styles.statusCell}>{c.status}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        
        <div className={styles.pagination}>
          <button
            onClick={() => handlePageChange(1)}
            disabled={page === 1}
          >&lt;&lt;</button>
          <button
            onClick={() => handlePageChange(page - 1)}
            disabled={page === 1}
          >&lt;</button>
          {getPageNumbers().map(pn => (
            <button
              key={pn}
              className={pn === page ? styles.active : ""}
              onClick={() => handlePageChange(pn)}
              disabled={pn === page}
            >{pn}</button>
          ))}
          <button
            onClick={() => handlePageChange(page + 1)}
            disabled={page === totalPages}
          >&gt;</button>
          <button
            onClick={() => handlePageChange(totalPages)}
            disabled={page === totalPages}
          >&gt;&gt;</button>
        </div>

      </main>
    </div>
  );
}
