import React, { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import HqInventorySidebar from "./HqInventorySidebar";
import { myAxios } from "/src/config";
import styles from "./HqInventoryExpiration.module.css";
import { accessTokenAtom } from "/src/atoms";

function formatDate(d) {
  if (!d) return "";
  const dt = typeof d === "string" ? new Date(d) : d;
  const yyyy = dt.getFullYear();
  const mm = String(dt.getMonth() + 1).padStart(2, "0");
  const dd = String(dt.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}

function getPeriod(type) {
  const today = new Date();
  if (type === "today") {
    const d = formatDate(today);
    return { start: d, end: d };
  }
  if (type === "week") {
    const t = new Date(today);
    t.setDate(t.getDate() - 6);
    return { start: formatDate(t), end: formatDate(today) };
  }
  if (type === "month") {
    const t = new Date(today);
    t.setMonth(t.getMonth() - 1);
    t.setDate(t.getDate() + 1);
    return { start: formatDate(t), end: formatDate(today) };
  }
  return { start: "", end: "" };
}

function calcDiffDays(expiry) {
  if (!expiry) return null;
  const today = new Date();
  const exp = new Date(expiry);
  return Math.floor((exp - today) / (1000 * 60 * 60 * 24));
}

function formatDday(diff) {
  if (diff == null) return "";
  return diff < 0 ? `D+${-diff}` : `D-${diff}`;
}

export default function HqInventoryExpiration() {
  const token = useAtomValue(accessTokenAtom);

  // 필터 상태
  const [scope, setScope] = useState("hq");       // hq | store | all
  const [store, setStore] = useState("all");     // 지점 선택
  const [category, setCategory] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [sortOption, setSortOption] = useState("default");

  // 옵션 리스트
  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);

  // 서버 데이터
  const [data, setData] = useState([]);
  const [pageInfo, setPageInfo] = useState({ curPage:1, startPage:1, endPage:1, allPage:1 });

  // 선택 + 모달
  const [selectedIds, setSelectedIds] = useState([]);
  const [disposalAmounts, setDisposalAmounts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 옵션 로드
  useEffect(() => {
    if (!token) return;
    const ax = myAxios(token);
    ax.get("/hq/inventory/stores")
      .then(r => setStores(r.data.stores.filter(s => s.id !== 1)))
      .catch(() => setStores([]));
    ax.get("/hq/inventory/categories")
      .then(r => setCategories(r.data.categories || []))
      .catch(() => setCategories([]));
  }, [token]);

  // 데이터 조회
  const fetchInventory = (page=1) => {
    if (!token) return;
    const param = { scope, store: scope==="store"&&store!="all"?Number(store):"all", category: category==="all"?"all":Number(category), keyword, startDate, endDate, page, sortOption };
    myAxios(token)
      .post("/hq/inventory/expiration-list", param)
      .then(res => {
        const hqInv = res.data.hqInventory||[];
        const stInv = res.data.storeInventory||[];
        const list = scope==="hq"?hqInv:scope==="store"?stInv:[...hqInv,...stInv];
        const flat = list.map(x=>({
          id:x.id, store:x.storeName,
          storeId:x.storeId||(x.storeName==='본사'?1:null), category:x.categoryName,
          name:x.ingredientName, unit:x.unit, quantity:x.quantity,
          price:x.unitCost, expiry:x.expiredDate?.slice(0,10)||"",
          diff:calcDiffDays(x.expiredDate?.slice(0,10)),
          dday:formatDday(calcDiffDays(x.expiredDate?.slice(0,10)))
        }));
        setData(flat);
        setPageInfo(res.data.pageInfo||pageInfo);
        setSelectedIds([]);
        setDisposalAmounts({});
      })
      .catch(()=>setData([]));
  };

  // 초기 및 상태 변경 시 호출
  useEffect(()=>{ fetchInventory(pageInfo.curPage); }, [token,scope,store,category,keyword,startDate,endDate,sortOption,pageInfo.curPage]);

  // 선택 함수
  const isHqItem = it=>it.storeId===1;
  const showHeaderCheckbox = scope==="hq"||scope==="all";
  const toggleSelect = id=> setSelectedIds(ids=> ids.includes(id)?ids.filter(x=>x!==id):[...ids,id]);
  const toggleAll = ()=>{
    const avail=data.filter(isHqItem).map(x=>x.id);
    const allSel=avail.length>0&&avail.every(id=>selectedIds.includes(id));
    setSelectedIds(allSel?[]:avail);
  };

  // 모달
  const openModalSingle = idList=>{
    if(!idList.length) return;
    const init={}; idList.forEach(id=>{ const it=data.find(r=>r.id===id); if(it) init[id]=it.quantity; });
    setSelectedIds(idList); setDisposalAmounts(init); setIsModalOpen(true);
  };
  const openModalBulk = ()=>{
    if(!selectedIds.length) return alert('본사 품목을 하나 이상 선택하세요.');
    openModalSingle(selectedIds);
  };
  const closeModal = ()=>setIsModalOpen(false);
  const onAmount=(id,val)=>{ const maxQ=data.find(i=>i.id===id)?.quantity||0; const num=Math.max(0,Math.min(Number(val)||0,maxQ)); setDisposalAmounts(d=>({...d,[id]:num})); };
  const submit=()=>{
    const items=selectedIds.map(id=>{ const it=data.find(r=>r.id===id); if(!isHqItem(it))return null; return {id,quantity:disposalAmounts[id]||0,storeId:1}; }).filter(i=>i&&i.quantity>0);
    if(!items.length) return alert('폐기량을 입력하세요.');
    myAxios(token).post('/hq/inventory/disposal-request',items)
      .then(()=>{ alert(`총 ${items.length}건 폐기 신청 완료!`); closeModal(); fetchInventory(pageInfo.curPage); })
      .catch(()=>alert('폐기 신청 실패'));
  };

  // 페이지네이션
  const movePage=p=>{ if(p<1||p>pageInfo.allPage)return; setPageInfo(pi=>({...pi,curPage:p})); };
  const {curPage,startPage,endPage,allPage}=pageInfo;
  const pages=Array.from({length:endPage-startPage+1},(_,i)=>startPage+i);

  return (
    <div className={styles.container}>
      <HqInventorySidebar />
      <div className={styles.content}>
        <div className={styles.innerContainer}>
          <h2 className={styles.title}>유통기한 목록</h2>

          {/* 필터 */}
          <div className={styles.filters}>
            <div className={styles.row}>
              <span className={styles.label}>기간</span>
              <input type="date" value={startDate} onChange={onFilterChange(setStartDate)} />
              <span>~</span>
              <input type="date" value={endDate} onChange={onFilterChange(setEndDate)} />
              <div className={styles.periodButtons}>
                <button onClick={() => setPeriodFn("all")}>전체</button>
                <button onClick={() => setPeriodFn("today")}>오늘</button>
                <button onClick={() => setPeriodFn("week")}>한 주</button>
                <button onClick={() => setPeriodFn("month")}>한 달</button>
              </div>
            </div>
            <div className={styles.row}>
              <select value={scope} onChange={onFilterChange(setScope)}>
                <option value="hq">본사</option>
                <option value="store">지점</option>
                <option value="all">전체</option>
              </select>
              {scope === "store" && (
                <>
                  <label>지점</label>
                  <select value={store} onChange={onFilterChange(setStore)} className={styles.storeSelect}>
                    <option value="all">전체지점</option>
                    {stores.map(s => (
                      <option key={s.id} value={s.id}>{s.name}</option>
                    ))}
                  </select>
                </>
              )}
              <select value={category} onChange={onFilterChange(setCategory)}>
                <option value="all">전체 분류</option>
                {categories.map(c => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="재료명 검색"
                value={keyword}
                onChange={onFilterChange(setKeyword)}
                className={styles.keywordInput}
              />
              <button className={styles.searchBtn} onClick={() => movePage(1)}>검색</button>

              <div className={styles.rightActions}>
                {(scope === "hq" || scope === "all") && (
                  <button className={styles.disposalBtn} onClick={openModal}>
                    폐기
                  </button>
                )}
                <select
                  className={styles.sortSelect}
                  value={sortOption}
                  onChange={e => {
                    setSortOption(e.target.value);
                    setPageInfo(pi => ({ ...pi, curPage: 1 }));
                  }}
                >
                  <option value="default">기본(분류-재료-유통기한)</option>
                  <option value="expiryAsc">유통기한↑-분류-재료</option>
                  <option value="expiryDesc">유통기한↓-분류-재료</option>
                </select>
              </div>
            </div>
          </div>
          {/* 테이블 */}
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {showHeaderCheckbox && <th className={styles.checkbox}><input type="checkbox" checked={data.filter(isHqItem).length>0&&data.filter(isHqItem).every(i=>selectedIds.includes(i.id))} onChange={toggleAll} /></th>}
                  <th>지점</th><th>분류</th><th>품목명</th><th>단위</th><th>재고량</th><th>단가</th><th>유통기한</th><th>남은 날짜</th><th>폐기</th>
                </tr>
              </thead>
              <tbody>
                {data.length===0? (
                  <tr><td colSpan={showHeaderCheckbox?10:9} className={styles.noData}>데이터가 없습니다.</td></tr>
                ):(
                  data.map(it=>(
                    <tr key={it.id} className={it.dday.includes('D+')?styles.expired:''}>
                      {showHeaderCheckbox&&<td className={styles.checkbox}>{isHqItem(it)&&<input type="checkbox" checked={selectedIds.includes(it.id)} onChange={()=>toggleSelect(it.id)} />}</td>}
                      <td>{it.store}</td><td>{it.category}</td><td>{it.name}</td><td>{it.unit}</td><td>{it.quantity}</td><td>{it.price}</td><td>{it.expiry}</td><td>{it.dday}</td>
                      <td>{isHqItem(it)&&<button className={styles.rowDisposalBtn} onClick={()=>openModalSingle([it.id])}>폐기</button>}</td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* 페이지네이션 */}
          <div className={styles.pagination}>
            <button onClick={()=>movePage(1)} disabled={curPage===1}>&lt;&lt;</button>
            <button onClick={()=>movePage(curPage-1)} disabled={curPage===1}>&lt;</button>
            {pages.map(p=>(<button key={p} onClick={()=>movePage(p)} className={p===curPage?styles.active:''}>{p}</button>))}
            <button onClick={()=>movePage(curPage+1)} disabled={curPage===allPage}>&gt;</button>
            <button onClick={()=>movePage(allPage)} disabled={curPage===allPage}>&gt;&gt;</button>
          </div>

          {/* 모달 */}
          {isModalOpen&&(
            <div className={styles.modal} onClick={closeModal}>
              <div className={styles.modalBox} onClick={e=>e.stopPropagation()}>
                <button className={styles.modalClose} onClick={closeModal}>&times;</button>
                <h3>폐기 신청</h3>
                <div className={styles.modalTopActions}>
                  <button className={styles.save} onClick={submit}>신청</button>
                </div>
                <div className={styles.modalTableWrapper}>
                  <table className={styles.table}>
                    <thead>
                      <tr><th>품목명</th><th>단위</th><th>폐기량</th></tr>
                    </thead>
                    <tbody>
                      {selectedIds.map(id=>{
                        const it=data.find(r=>r.id===id);
                        return (
                          <tr key={id}>
                            <td>{it.name}</td>
                            <td>{it.unit}</td>
                            <td><input type="number" min={0} max={it.quantity} value={disposalAmounts[id]||0} onChange={e=>onAmount(id,e.target.value)} className={styles.editable} /></td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
