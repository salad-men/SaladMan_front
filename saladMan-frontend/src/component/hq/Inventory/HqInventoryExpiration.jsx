import React, { useState, useEffect } from "react";
import HqInventorySidebar from "./HqInventorySidebar";
import { myAxios } from "../../../config";
import styles from "./HqInventoryExpiration.module.css";

export default function HqInventoryExpiration() {
  const [store, setStore] = useState("all");
  const [category, setCategory] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [inventory, setInventory] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [disposalAmounts, setDisposalAmounts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [stores, setStores] = useState([]);
  const [categories, setCategories] = useState([]);

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
    myAxios()
      .get("/hq/inventory/stores")
      .then((res) => setStores(res.data.stores || []))
      .catch(console.error);

    myAxios()
      .get("/hq/inventory/categories")
      .then((res) => setCategories(res.data.categories || []))
      .catch(console.error);
  }, []);

  // 날짜 문자열을 Date 객체로 변환
  const parseDate = (str) => {
    if (!str) return null;
    const [y, m, d] = str.split("-");
    return new Date(y, m - 1, d);
  };

  // 기간 설정 (days: 0=오늘, 7=1주일 등)
  const setPeriod = (days) => {
    const today = new Date();
    const end = today.toISOString().slice(0, 10);
    const startObj = days === 0 ? null : new Date(today.getTime() - days * 86400000);
    setStartDate(startObj ? startObj.toISOString().slice(0, 10) : "");
    setEndDate(end);
  };

  // 남은 날짜 계산 함수
  const calcDday = (expiry) => {
    if (!expiry) return "";
    const today = new Date();
    const expDate = new Date(expiry);
    const diff = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return `D+${-diff}`;
    return `D-${diff}`;
  };

  // 백엔드에서 재고 데이터 불러오기
  const fetchInventory = () => {
    const params = {
      store: store === "all" ? "all" : store,
      category: category === "all" ? "" : category,
      keyword: keyword || "",
      startDate: startDate || "",
      endDate: endDate || "",
    };

    myAxios()
      .post("/hq/inventory/expiration-list", params)
      .then((res) => {
        const hqList = res.data.hqInventory || [];
        const storeList = res.data.storeInventory || [];
        const combined = [...hqList, ...storeList];

        const transformed = combined.map((item) => ({
          id: item.id,
          store: item.storeName || "",
          name: item.ingredientName || "",
          category: item.categoryName || "",
          unit: item.unit || "",
          quantity: item.quantity || 0,
          price: item.unitCost || 0,
          expiry: item.expiredDate ? item.expiredDate.slice(0, 10) : "",
          dday: calcDday(item.expiredDate ? item.expiredDate.slice(0, 10) : ""),
        }));

        setInventory(transformed);
        setSelectedIds([]);
        setDisposalAmounts({});
      })
      .catch((err) => {
        console.error("재고 조회 실패:", err);
        setInventory([]);
      });
  };

  // 초기 및 필터 변경 시 재고 불러오기
  useEffect(() => {
    fetchInventory();
  }, [store, category, keyword, startDate, endDate]);

  // 필터별 재고 필터링 및 정렬 (백엔드 필터 중복일 수 있음)
  const filteredSorted = inventory
    .filter((it) => {
      const mStore = store === "all" || it.store === store;
      const mCat = category === "all" || it.category === category;
      const mKey = (it.name || "").toLowerCase().includes((keyword || "").toLowerCase());
      const exp = parseDate(it.expiry);
      const mStart = !startDate || !exp || exp >= parseDate(startDate);
      const mEnd = !endDate || !exp || exp <= parseDate(endDate);
      return mStore && mCat && mKey && mStart && mEnd;
    })
    .sort((a, b) => {
      if (a.store === "본사" && b.store !== "본사") return -1;
      if (a.store !== "본사" && b.store === "본사") return 1;
      return parseDate(a.expiry) - parseDate(b.expiry);
    });

  // 단일 선택 토글 (본사 품목만)
  const toggleSelect = (id) => {
    const it = inventory.find((x) => x.id === id);
    if (!it || it.store !== "본사") return;

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 전체 선택/해제
  const toggleAll = () => {
    const avail = filteredSorted.filter((x) => x.store === "본사").map((x) => x.id);
    const allSel = avail.every((id) => selectedIds.includes(id));

    setSelectedIds((prev) =>
      allSel ? prev.filter((id) => !avail.includes(id)) : Array.from(new Set([...prev, ...avail]))
    );
  };

  // 폐기량 변경 처리 (0 ~ 재고수량 사이로 제한)
  const onAmount = (id, val) => {
    const num = Math.max(0, Math.min(Number(val) || 0, inventory.find((i) => i.id === id)?.quantity || 0));
    setDisposalAmounts((prev) => ({ ...prev, [id]: num }));
  };

  // 모달 열기 (선택 품목이 없으면 경고)
  const openModal = () => {
    if (selectedIds.length === 0) return alert("본사 품목을 하나 이상 선택하세요.");
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // 폐기 신청 제출
  const submit = () => {
    const items = selectedIds
      .map((id) => ({
        id,
        quantity: disposalAmounts[id] || 0,
      }))
      .filter((i) => i.quantity > 0);

    if (items.length === 0) return alert("폐기량을 입력하세요.");

    myAxios()
      .post("/hq/inventory/disposal-request", items)
      .then(() => {
        alert(`총 ${items.length}건 폐기 신청 완료!`);
        setIsModalOpen(false);
        setSelectedIds([]);
        setDisposalAmounts({});
        fetchInventory();
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

        {/* 기간 입력 + 버튼 */}
        <div className={styles.row} style={{ justifyContent: "flex-start", alignItems: "center", gap: 12, marginBottom: 10 }}>
          <label>기간</label>
          <input type="date" value={startDate} onChange={(e) => setStartDate(e.target.value)} />
          <span>~</span>
          <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

          <div className={styles.periodButtons}>
            <button onClick={() => { setStartDate(""); setEndDate(""); }}>전체</button>
            <button onClick={() => setPeriod(0)}>오늘</button>
            <button onClick={() => setPeriod(7)}>1주</button>
            <button onClick={() => setPeriod(14)}>2주</button>
            <button onClick={() => setPeriod(30)}>1달</button>
          </div>
        </div>

        {/* 지점, 분류, 검색 + 폐기 신청 버튼 */}
        <div className={styles.row} style={{ justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label>지점</label>
            <select value={store} onChange={(e) => setStore(e.target.value)}>
              <option value="all">전체지점</option>
              {stores.map((s) => (
                <option key={s.id} value={s.name}>{s.name}</option>
              ))}
            </select>

            <label>분류</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">전체</option>
              {categories.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>

            <input
              type="text"
              placeholder="재료명 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <button className={styles.search} onClick={fetchInventory}>검색</button>
          </div>

          <button className={styles.disposalBtn} onClick={openModal}>폐기 신청</button>
        </div>

        {/* 목록 테이블 */}
        <table className={styles.table}>
          <thead>
            <tr>
              <th className={styles.checkbox}>
                <input
                  type="checkbox"
                  checked={filteredSorted.filter((i) => i.store === "본사").every((i) => selectedIds.includes(i.id)) && filteredSorted.some((i) => i.store === "본사")}
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
            {filteredSorted.length === 0 ? (
              <tr>
                <td colSpan={10} className={styles.noData}>데이터가 없습니다.</td>
              </tr>
            ) : (
              filteredSorted.map((it) => (
                <tr key={it.id} className={typeof it.dday === "string" && it.dday.includes("D+") ? styles.expired : ""}>
                  <td className={styles.checkbox}>
                    <input
                      type="checkbox"
                      disabled={it.store !== "본사"}
                      checked={selectedIds.includes(it.id)}
                      onChange={() => toggleSelect(it.id)}
                    />
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

        {/* 모달 */}
        {isModalOpen && (
          <div className={styles.modal} onClick={closeModal}>
            <div className={styles.modalBox} onClick={(e) => e.stopPropagation()}>
              <button className={styles.modalClose} onClick={closeModal}>&times;</button>
              <h3>폐기 신청</h3>
              <div className={styles.modalTopActions}>
                <button className={styles.save} onClick={submit}>신청</button>
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
                          <td>{it.name}</td>
                          <td>{it.category}</td>
                          <td>{it.unit}</td>
                          <td>{it.quantity}</td>
                          <td>{it.price}</td>
                          <td>
                            <input
                              type="number"
                              min={0}
                              max={it.quantity}
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
