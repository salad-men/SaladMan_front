import React, { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import HqInventorySidebar from "./HqInventorySidebar";
import { myAxios } from "../../../config";
import styles from "./HqInventoryExpiration.module.css";
import { accessTokenAtom } from "/src/atoms";

export default function HqInventoryExpiration() {
  const token = useAtomValue(accessTokenAtom);

  const [store, setStore] = useState("all");
  const [category, setCategory] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [inventory, setInventory] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]); 
  const [disposalAmounts, setDisposalAmounts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [scope, setScope] = useState("all"); // hq, store, all

  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pageInfo, setPageInfo] = useState({ curPage: 1, allPage: 1, startPage: 1, endPage: 1 });
  const [pageNums, setPageNums] = useState([]);

  // Escape 키로 모달 닫기
  useEffect(() => {
    const onKey = (e) => {
      if (e.key === "Escape") setIsModalOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  // 지점, 카테고리 리스트 API 호출
  useEffect(() => {
    myAxios(token)
      .get("/hq/inventory/stores")
      .then((res) => setStores(res.data.stores || []))
      .catch(console.error);

    myAxios(token)
      .get("/hq/inventory/categories")
      .then((res) => setCategories(res.data.categories || []))
      .catch(console.error);
  }, [token]);

  // 남은 날짜 계산 함수
  const calcDday = (expiry) => {
    if (!expiry) return "";
    const today = new Date();
    const expDate = new Date(expiry);
    const diff = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return `D+${-diff}`;
    return `D-${diff}`;
  };

  // 재고 데이터 불러오기 (페이징 포함)
  const fetchInventory = (page = 1) => {
    const params = {
      scope,
      store: store !== "all" ? Number(store) : "all",
      category: category === "all" ? "all" : Number(category),
      keyword: keyword || "",
      startDate: startDate || "",
      endDate: endDate || "",
      page,
    };
    myAxios(token)
      .post("/hq/inventory/expiration-list", params)
      .then((res) => {
        const hqList = res.data.hqInventory || [];
        const storeList = res.data.storeInventory || [];
        let combined = [];
        if (scope === "hq") combined = hqList;
        else if (scope === "store") combined = storeList;
        else combined = [...hqList, ...storeList];

        const transformed = combined.map((item) => ({
          id: item.id,
          store: item.storeName || "",
          storeId: item.storeId,
          storeName: item.storeName,
          name: item.ingredientName || "",
          category: item.categoryName || "",
          unit: item.unit || "",
          quantity: item.quantity || 0,
          price: item.unitCost || 0,
          expiry: item.expiredDate ? item.expiredDate.slice(0, 10) : "",
          receivedDate: item.receivedDate || "",
          dday: calcDday(item.expiredDate ? item.expiredDate.slice(0, 10) : ""),
        }));

        setInventory(transformed);
        setSelectedIds([]);
        setDisposalAmounts({});

        const pi = res.data.pageInfo;
        if (pi) {
          setPageInfo(pi);
          setPageNums(Array.from({ length: pi.endPage - pi.startPage + 1 }, (_, i) => pi.startPage + i));
        }
      })
      .catch((err) => {
        console.error("재고 조회 실패:", err);
        setInventory([]);
      });
  };

  // 초기 및 필터 변경 시 재고 불러오기
  useEffect(() => {
    fetchInventory(1);
    // eslint-disable-next-line
  }, [token, store, category, keyword, startDate, endDate, scope]);

  // 본사 품목 판별 함수
  function isHq(item) {
    return (
      item.store === "본사" ||
      item.storeName === "본사계정" ||
      item.storeId === 1
    );
  }

  // 단일 선택 토글 (본사 품목만)
  const toggleSelect = (id) => {
    const it = inventory.find((x) => x.id === id);
    if (!it || !isHq(it)) return;
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 전체 선택/해제 (본사 품목만)
  const toggleAll = () => {
    const avail = inventory.filter(isHq).map((x) => x.id);
    const allSel = avail.length > 0 && avail.every((id) => selectedIds.includes(id));
    setSelectedIds(allSel ? [] : avail);
  };

  // 폐기량 변경 처리 (0 ~ 재고수량 사이로 제한)
  const onAmount = (id, val) => {
    const num = Math.max(
      0,
      Math.min(Number(val) || 0, inventory.find((i) => i.id === id)?.quantity || 0)
    );
    setDisposalAmounts((prev) => ({ ...prev, [id]: num }));
  };

  // 모달 열기 (선택 품목이 없으면 경고)
  const openModal = () => {
    if (selectedIds.length === 0) return alert("본사 품목을 하나 이상 선택하세요.");
    setIsModalOpen(true);
  };
  const closeModal = () => setIsModalOpen(false);

  // 폐기 신청 제출 (본사 품목만 보내기)
  const submit = () => {
    const items = selectedIds
      .map((id) => {
        const it = inventory.find((x) => x.id === id);
        if (!isHq(it)) return null;
        return {
          id,
          quantity: disposalAmounts[id] || 0,
          storeId: 1,
        };
      })
      .filter((i) => i && i.quantity > 0);

    if (items.length === 0) return alert("폐기량을 입력하세요.");

    myAxios(token)
      .post("/hq/inventory/disposal-request", items)
      .then(() => {
        alert(`총 ${items.length}건 폐기 신청 완료!`);
        setIsModalOpen(false);
        setSelectedIds([]);
        setDisposalAmounts({});
        fetchInventory(pageInfo.curPage);
      })
      .catch((err) => {
        console.error("폐기 신청 실패:", err);
        alert("폐기 신청에 실패했습니다.");
      });
  };

  return (
    <div className={styles.container}>
      <HqInventorySidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>유통기한 조회</h2>

        {/* 필터 영역 */}
        <div
          className={styles.row}
          style={{
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
            marginBottom: 10,
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            {/* 대상, 지점, 분류, 재료명, 검색 버튼 */}
            <label>대상</label>
            <select value={scope} onChange={(e) => setScope(e.target.value)}>
              <option value="all">전체</option>
              <option value="hq">본사</option>
              <option value="store">지점</option>
            </select>

            {scope === "store" && (
              <>
                <label>지점</label>
                <select value={store} onChange={(e) => setStore(e.target.value)}>
                  <option value="all">전체지점</option>
                  {stores.map((s) => (
                    <option key={s.id} value={s.id}>{s.name}</option>
                  ))}
                </select>
              </>
            )}

            <label>분류</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">전체</option>
              {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option> 
              ))}
            </select>

            <input
              type="text"
              placeholder="재료명 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <button className={styles.search} onClick={() => fetchInventory(1)}>검색</button>
          </div>

          <button className={styles.disposalBtn} onClick={openModal}>
            폐기 신청
          </button>
        </div>

        {/* 목록 테이블 */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={
                    inventory.filter(isHq).length > 0 &&
                    inventory.filter(isHq).every((i) => selectedIds.includes(i.id))
                  }
                  onChange={toggleAll}
                />
              </th>
              <th>지점</th>
              <th>품목명</th>
              <th>분류</th>
              <th>단위</th>
              <th>재고량</th>
              <th>단가</th>
              <th>유통기한</th>
              <th>남은 날짜</th>
            </tr>
          </thead>
          <tbody>
            {inventory.length === 0 ? (
              <tr>
                <td colSpan={10} className={styles.noData}>데이터가 없습니다.</td>
              </tr>
            ) : (
              inventory.map((it) => (
                <tr key={it.id} className={typeof it.dday === "string" && it.dday.includes("D+") ? styles.expired : ""}>
                  <td className={styles.checkbox}>
                    {isHq(it) ? (
                      <input
                        type="checkbox"
                        checked={selectedIds.includes(it.id)}
                        onChange={() => toggleSelect(it.id)}
                      />
                    ) : null}
                  </td>
                  <td>{it.store}</td>
                  <td>{it.name}</td>
                  <td>{it.category}</td>
                  <td>{it.unit}</td>
                  <td>{it.quantity}</td>
                  <td>{it.price}</td>
                  <td>{it.expiry}</td>
                  <td>{it.dday}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {/* 페이지네이션 */}
        <div className={styles.pagination}>
          <button onClick={() => fetchInventory(pageInfo.curPage - 1)} disabled={pageInfo.curPage === 1}>
            &lt;
          </button>
          {pageNums.map((p) => (
            <button
              key={p}
              className={p === pageInfo.curPage ? styles.active : ""}
              onClick={() => fetchInventory(p)}
            >
              {p}
            </button>
          ))}
          <button onClick={() => fetchInventory(pageInfo.curPage + 1)} disabled={pageInfo.curPage >= pageInfo.allPage}>
            &gt;
          </button>
        </div>

        {/* 폐기 신청 모달 */}
        {isModalOpen && (
          <div className={styles.modal} onClick={closeModal}>
            <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
              <button className={styles.modalClose} onClick={closeModal}>
                &times;
              </button>
              <h3>폐기 신청</h3>
              <div className={styles.modalTopActions}>
                <button className={styles.save} onClick={submit}>
                  신청
                </button>
              </div>
              <div className={styles.modalTableWrapper}>
                <table className={styles.table}>
                  <thead>
                    <tr>
                      <th>품목명</th>
                      <th>분류</th>
                      <th>단위</th>
                      <th>재고량</th>
                      <th>단가</th>
                      <th>폐기량</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedIds.map((id) => {
                      const it = inventory.find((x) => x.id === id);
                      return (
                        <tr key={id}>
                          <td>{it?.name}</td>
                          <td>{it?.category}</td>
                          <td>{it?.unit}</td>
                          <td>{it?.quantity}</td>
                          <td>{it?.price}</td>
                          <td>
                            <input
                              type="number"
                              min={0}
                              max={it?.quantity}
                              value={disposalAmounts[id] || 0}
                              onChange={(e) => onAmount(id, e.target.value)}
                              className={styles.editable}
                            />
                          </td>
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
  );
}
