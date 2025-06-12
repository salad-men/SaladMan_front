import React, { useState } from "react";
import { atom, useAtom } from "jotai";
import "./StoreInventoryExpiration.css";

const storeAtom = atom("all");
const categoryAtom = atom("all");
const keywordAtom = atom("");
const startDateAtom = atom("");
const endDateAtom = atom("");

const inventoryAtom = atom([
  {
    id: 1,
    store: "본사",
    name: "렌틸콩",
    category: "탄수화물",
    unit: "g",
    quantity: 600,
    price: 270,
    expiry: "2025-05-25",
    usage: 450,
    dday: "D+0",
  },
  {
    id: 2,
    store: "본사",
    name: "두부",
    category: "단백질",
    unit: "kg",
    quantity: 130,
    price: 500,
    expiry: "2025-05-29",
    usage: 100,
    dday: "D-4",
  },
  {
    id: 3,
    store: "강남점",
    name: "귀리밥",
    category: "탄수화물",
    unit: "g",
    quantity: 980,
    price: 150,
    expiry: "2025-05-23",
    usage: 850,
    dday: "D+1",
  },
  {
    id: 4,
    store: "강남점",
    name: "로메인",
    category: "베이스채소",
    unit: "kg",
    quantity: 120,
    price: 200,
    expiry: "2025-05-26",
    usage: 200,
    dday: "D-2",
  },
  {
    id: 5,
    store: "홍대점",
    name: "케일",
    category: "베이스채소",
    unit: "kg",
    quantity: 110,
    price: 210,
    expiry: "2025-05-27",
    usage: 180,
    dday: "D-3",
  },
  {
    id: 6,
    store: "건대점",
    name: "닭가슴살",
    category: "단백질",
    unit: "g",
    quantity: 700,
    price: 400,
    expiry: "2025-05-22",
    usage: 600,
    dday: "D+2",
  },
  {
    id: 7,
    store: "강남점",
    name: "퀴노아",
    category: "탄수화물",
    unit: "g",
    quantity: 450,
    price: 300,
    expiry: "2025-05-30",
    usage: 300,
    dday: "D-5",
  },
]);

const selectedIdsAtom = atom([]);

export default function StoreInventoryExpiration() {
  const [store, setStore] = useAtom(storeAtom);
  const [category, setCategory] = useAtom(categoryAtom);
  const [keyword, setKeyword] = useAtom(keywordAtom);
  const [startDate, setStartDate] = useAtom(startDateAtom);
  const [endDate, setEndDate] = useAtom(endDateAtom);
  const [inventory] = useAtom(inventoryAtom);
  const [selectedIds, setSelectedIds] = useAtom(selectedIdsAtom);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [disposalAmounts, setDisposalAmounts] = useState({});

  const parseDate = (str) => {
    const [y, m, d] = str.split("-");
    return new Date(y, m - 1, d);
  };

  // 필터 + 기간 필터 + 유통기한 가까운순 정렬
  const filteredSorted = inventory
    .filter((item) => {
      const matchStore = store === "all" || item.store === store;
      const matchCategory = category === "all" || item.category === category;
      const matchKeyword = item.name.includes(keyword);
      const itemExpiryDate = parseDate(item.expiry);
      const matchStart = !startDate || itemExpiryDate >= parseDate(startDate);
      const matchEnd = !endDate || itemExpiryDate <= parseDate(endDate);
      return matchStore && matchCategory && matchKeyword && matchStart && matchEnd;
    })
    .sort((a, b) => parseDate(a.expiry) - parseDate(b.expiry));

  // 체크박스 선택 토글 (본사만 선택 가능)
  const toggleSelect = (id) => {
    const item = inventory.find((i) => i.id === id);
    if (!item || item.store !== "본사") return;

    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((i) => i !== id) : [...prev, id]
    );
  };

  // 전체 선택/해제 (본사 품목만)
  const toggleAll = () => {
    const selectable = filteredSorted.filter((i) => i.store === "본사").map((i) => i.id);
    const allSelected = selectable.every((id) => selectedIds.includes(id));
    if (allSelected) {
      setSelectedIds((prev) => prev.filter((id) => !selectable.includes(id)));
    } else {
      setSelectedIds((prev) => Array.from(new Set([...prev, ...selectable])));
    }
  };

  const openDisposalModal = () => {
    const filteredSelected = selectedIds.filter((id) => {
      const item = inventory.find((i) => i.id === id);
      return item?.store === "본사";
    });

    if (filteredSelected.length === 0) {
      alert("본사 지점 품목만 폐기 가능합니다. 본사 품목을 선택해주세요.");
      return;
    }

    setSelectedIds(filteredSelected);
    setIsModalOpen(true);

    const initialAmounts = {};
    filteredSelected.forEach((id) => {
      initialAmounts[id] = 0;
    });
    setDisposalAmounts(initialAmounts);
  };

  const closeDisposalModal = () => {
    setIsModalOpen(false);
  };

  const onChangeDisposalAmount = (id, value) => {
    const numberValue = Math.max(
      0,
      Math.min(Number(value) || 0, inventory.find((item) => item.id === id)?.quantity || 0)
    );
    setDisposalAmounts((prev) => ({ ...prev, [id]: numberValue }));
  };

  const submitDisposal = () => {
    const disposingItems = selectedIds
      .map((id) => ({
        ...inventory.find((item) => item.id === id),
        disposalAmount: disposalAmounts[id] || 0,
      }))
      .filter((item) => item.disposalAmount > 0);

    if (disposingItems.length === 0) {
      alert("폐기량을 1 이상 입력하세요.");
      return;
    }

    alert(`총 ${disposingItems.length}개 품목 폐기 신청 완료!`);

    setIsModalOpen(false);
    setSelectedIds([]);
  };

  // 임시 필터 상태 관리 (검색 버튼 클릭 시 적용)
  const [tempStore, setTempStore] = useState(store);
  const [tempCategory, setTempCategory] = useState(category);
  const [tempKeyword, setTempKeyword] = useState(keyword);
  const [tempStartDate, setTempStartDate] = useState(startDate);
  const [tempEndDate, setTempEndDate] = useState(endDate);

  const onSearchClick = () => {
    setStore(tempStore);
    setCategory(tempCategory);
    setKeyword(tempKeyword);
    setStartDate(tempStartDate);
    setEndDate(tempEndDate);
  };

  return (
    <div className="content">
      <h2>유통기한 조회</h2>

      {/* 필터 첫 줄 */}
      <div className="search-bar" style={{ marginBottom: 8 }}>
        <div className="search-left" style={{ alignItems: "center", gap: "24px" }}>
          <label>
            시작일
            <input
              type="date"
              value={tempStartDate}
              onChange={(e) => setTempStartDate(e.target.value)}
              style={{ marginLeft: 4 }}
            />
          </label>

          <label>
            종료일
            <input
              type="date"
              value={tempEndDate}
              onChange={(e) => setTempEndDate(e.target.value)}
              style={{ marginLeft: 4 }}
            />
          </label>
        </div>
      </div>

      {/* 필터 두 번째 줄 (지점, 분류, 재료명, 검색 버튼) */}
      <div className="search-bar" style={{ marginBottom: 24 }}>
        <div className="search-left" style={{ alignItems: "center", gap: "12px" }}>
          <select value={tempStore} onChange={(e) => setTempStore(e.target.value)}>
            <option value="all">전체 지점</option>
            <option value="본사">본사</option>
            <option value="강남점">강남점</option>
            <option value="홍대점">홍대점</option>
            <option value="건대점">건대점</option>
          </select>

          <select value={tempCategory} onChange={(e) => setTempCategory(e.target.value)}>
            <option value="all">전체</option>
            <option value="베이스채소">베이스채소</option>
            <option value="단백질">단백질</option>
            <option value="토핑">토핑</option>
            <option value="드레싱">드레싱</option>
            <option value="탄수화물">탄수화물</option>
          </select>

          <input
            type="text"
            placeholder="재료명을 입력하세요"
            value={tempKeyword}
            onChange={(e) => setTempKeyword(e.target.value)}
          />

          <button className="btn-disposal" onClick={onSearchClick}>
            검색
          </button>
        </div>
      </div>

      {/* 재고 테이블 */}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>
              <input
                type="checkbox"
                checked={
                  filteredSorted.filter((i) => i.store === "본사").every((i) => selectedIds.includes(i.id)) &&
                  filteredSorted.some((i) => i.store === "본사")
                }
                onChange={toggleAll}
              />
            </th>
            <th>지점명</th>
            <th>품목명</th>
            <th>분류</th>
            <th>단위</th>
            <th>재고량</th>
            <th>단위가격</th>
            <th>유통기한</th>
            <th>기한 내 소비량</th>
            <th>남은 날짜</th>
          </tr>
        </thead>
        <tbody>
          {filteredSorted.length === 0 ? (
            <tr>
              <td colSpan={10}>데이터가 없습니다.</td>
            </tr>
          ) : (
            filteredSorted.map((item) => (
              <tr
                key={item.id}
                className={item.dday.includes("D+") || item.dday.includes("D+0") ? "expired" : ""}
              >
                <td>
                  <input
                    type="checkbox"
                    checked={selectedIds.includes(item.id)}
                    disabled={item.store !== "본사"}
                    onChange={() => toggleSelect(item.id)}
                  />
                </td>
                <td>{item.store}</td>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.unit}</td>
                <td>{item.quantity}</td>
                <td>{item.price}</td>
                <td>{item.expiry}</td>
                <td>{item.usage}</td>
                <td>{item.dday}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 폐기 신청 모달 */}
      {isModalOpen && (
        <div className="modal" style={{ display: "flex" }}>
          <div className="modal-content">
            <h3>폐기 신청</h3>
            <table className="inventory-table">
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
                  const item = inventory.find((i) => i.id === id);
                  if (!item) return null;
                  return (
                    <tr key={id}>
                      <td>{item.name}</td>
                      <td>{item.category}</td>
                      <td>{item.unit}</td>
                      <td>{item.quantity}</td>
                      <td>{item.price}</td>
                      <td>
                        <input
                          type="number"
                          min={0}
                          max={item.quantity}
                          value={disposalAmounts[id] || 0}
                          onChange={(e) => onChangeDisposalAmount(id, e.target.value)}
                          style={{ width: "60px" }}
                        />
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div className="modal-actions">
              <button className="btn-disposal" onClick={closeDisposalModal}>
                취소
              </button>
              <button className="btn-disposal" onClick={submitDisposal}>
                신청
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
