import React, { useState, useEffect } from "react";
import { useAtomValue } from "jotai";
import StoreInventorySidebar from "./StoreInventorySidebar";
import { myAxios } from "../../../config";
import styles from "./StoreInventoryExpiration.module.css";
import { userAtom, accessTokenAtom } from "/src/atoms";

export default function StoreInventoryExpiration() {
  const token = useAtomValue(accessTokenAtom);
  const user = useAtomValue(userAtom);

  const [category, setCategory] = useState("all");
  const [keyword, setKeyword] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");

  const [inventory, setInventory] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [disposalAmounts, setDisposalAmounts] = useState({});
  const [isModalOpen, setIsModalOpen] = useState(false);

  const [categories, setCategories] = useState([]);
  const [pageInfo, setPageInfo] = useState({
    curPage: 1,
    allPage: 1,
    startPage: 1,
    endPage: 1,
  });
  const [pageNums, setPageNums] = useState([]);

  // 날짜 차이 계산
  const calcDday = (expiry) => {
    if (!expiry) return "";
    const today = new Date();
    const expDate = new Date(expiry);
    const diff = Math.floor((expDate - today) / (1000 * 60 * 60 * 24));
    if (diff < 0) return `D+${-diff}`;
    return `D-${diff}`;
  };

  const storeId = user.id;

  useEffect(() => {
    myAxios(token)
      .get("/store/inventory/categories")
      .then((res) => setCategories(res.data.categories || []))
      .catch(() => setCategories([]));
  }, [token]);

  // 재고 조회 (자기 매장만)
  const fetchInventory = (page = 1) => {
    if (!storeId) return;

    const params = {
      store: storeId,
      category: category === "all" ? "all" : Number(category),
      keyword: keyword || "",
      startDate: startDate || "",
      endDate: endDate || "",
      page,
    };

    myAxios(token)
      .post("/store/inventory/expiration-list", params)
      .then((res) => {
        const storeList = res.data.storeInventory || [];

        const transformed = storeList.map((item) => ({
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
          receivedDate: item.receivedDate ? item.receivedDate.slice(0, 10) : "",
          dday: calcDday(item.expiredDate ? item.expiredDate.slice(0, 10) : ""),
        }));

        setInventory(transformed);
        setSelectedIds([]);
        setDisposalAmounts({});

        const pi = res.data.pageInfo;
        if (pi) {
          setPageInfo(pi);
          const nums = [];
          for (let i = pi.startPage; i <= pi.endPage; i++) {
            nums.push(i);
          }
          setPageNums(nums);
        }
      })
      .catch((err) => {
        console.error("재고 조회 실패:", err);
        setInventory([]);
      });
  };

  useEffect(() => {
    fetchInventory(1);
  }, [token, storeId, category, keyword, startDate, endDate]);

  // 선택 토글 (제한 없음, 매장 품목 모두 선택 가능)
  const toggleSelect = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  // 전체 선택/해제
  const toggleAll = () => {
    const avail = inventory.map((x) => x.id);
    const allSelected = avail.length > 0 && avail.every((id) => selectedIds.includes(id));
    setSelectedIds(allSelected ? [] : avail);
  };

  // 폐기량 변경
  const onAmount = (id, val) => {
    const num = Math.max(
      0,
      Math.min(Number(val) || 0, inventory.find((i) => i.id === id)?.quantity || 0)
    );
    setDisposalAmounts((prev) => ({ ...prev, [id]: num }));
  };

  // 모달 열기 (선택 없음 경고 없음)
  const openModal = () => {
    if (selectedIds.length === 0) return alert("품목을 하나 이상 선택하세요.");
    setIsModalOpen(true);
  };

  const closeModal = () => setIsModalOpen(false);

  // 폐기 신청 제출 (선택한 매장 품목 전부 처리)
  const submit = () => {
    const items = selectedIds
      .map((id) => {
        const it = inventory.find((x) => x.id === id);
        return {
          id,
          quantity: disposalAmounts[id] || 0,
          storeId,
        };
      })
      .filter((i) => i && i.quantity > 0);

    if (items.length === 0) return alert("폐기량을 입력하세요.");

    myAxios(token)
      .post("/store/inventory/disposal-request", items)
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
      <StoreInventorySidebar />
      <div className={styles.content}>
        <h2 className={styles.title}>유통기한 조회</h2>

        {/* 필터 영역 */}
        <div
          className={styles.row}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <label>분류</label>
            <select value={category} onChange={(e) => setCategory(e.target.value)}>
              <option value="all">전체</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>

            <input
              type="text"
              placeholder="재료명 검색"
              value={keyword}
              onChange={(e) => setKeyword(e.target.value)}
            />

            <label>유통기한 시작</label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
            />
            <label>유통기한 종료</label>
            <input type="date" value={endDate} onChange={(e) => setEndDate(e.target.value)} />

            <button className={styles.search} onClick={() => fetchInventory(1)}>
              검색
            </button>
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
                  checked={inventory.length > 0 && inventory.every((i) => selectedIds.includes(i.id))}
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
                <td colSpan={10} className={styles.noData}>
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              inventory.map((it) => (
                <tr
                  key={it.id}
                  className={typeof it.dday === "string" && it.dday.includes("D+") ? styles.expired : ""}
                >
                  <td className={styles.checkbox}>
                    <input
                      type="checkbox"
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
