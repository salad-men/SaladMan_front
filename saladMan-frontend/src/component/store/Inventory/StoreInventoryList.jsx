import React, { useState } from 'react';
import { atom, useAtom } from 'jotai';
import './StoreInventoryList.css';

// --- Jotai atoms ---
const inventoryAtom = atom([
  { store: '본사', name: '로메인', category: '베이스채소', unit: 'kg', stock: 200, min: 100, price: 180 },
]);

const filtersAtom = atom({ store: '', category: '', name: '' });
const isEditModeAtom = atom(false);
const addModalOpenAtom = atom(false);
const addRowsAtom = atom([{ name: '', category: '', unit: 'g', stock: '', min: '', price: '' }]);

// --- 상수 ---
const stores = ['본사', '강남점', '홍대점', '건대점'];
const categories = ['베이스채소', '단백질', '토핑', '드레싱'];
const units = ['g', 'kg', 'ml', 'ea'];

// --- 컴포넌트 ---
export default function StoreInventoryList() {
  const [inventory, setInventory] = useAtom(inventoryAtom);
  const [filters, setFilters] = useAtom(filtersAtom);
  const [isEditMode, setIsEditMode] = useAtom(isEditModeAtom);
  const [addModalOpen, setAddModalOpen] = useAtom(addModalOpenAtom);
  const [addRows, setAddRows] = useAtom(addRowsAtom);

  // 필터링 + 부족순 정렬
  const filtered = inventory.filter(
    row =>
      (!filters.store || row.store === filters.store) &&
      (!filters.category || row.category === filters.category) &&
      (!filters.name || row.name.toLowerCase().includes(filters.name.toLowerCase()))
  );
  const sortedInventory = [...filtered].sort((a, b) => (a.stock - a.min) - (b.stock - b.min));

  // 필터 변경 핸들러
  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  // 수정모드 토글
  const handleEditMode = () => setIsEditMode(true);
  const handleCancelEdit = () => setIsEditMode(false);
  const handleSaveEdit = () => {
    setIsEditMode(false);
    alert('저장되었습니다.');
  };

  // 재고, 최소수량 인풋 변경
  const handleInventoryInput = (idx, field, value) => {
    setInventory(cur =>
      cur.map((row, i) => (i === idx ? { ...row, [field]: value === '' ? '' : Number(value) } : row))
    );
  };

  // 추가 모달 관련
  const handleAddRowChange = (idx, field, value) => {
    setAddRows(cur =>
      cur.map((row, i) => (i === idx ? { ...row, [field]: value } : row))
    );
  };
  const addAddRow = () => {
    setAddRows(cur => [...cur, { name: '', category: '', unit: 'g', stock: '', min: '', price: '' }]);
  };
  const removeAddRow = idx => {
    setAddRows(cur => cur.filter((_, i) => i !== idx));
  };

  const handleAddSubmit = () => {
    const validRows = addRows.filter(r => r.name && r.category && r.unit);
    if (validRows.length === 0) {
      alert('추가할 재료를 입력하세요.');
      return;
    }
    setInventory(cur => [
      ...cur,
      ...validRows.map(r => ({
        store: '본사',
        name: r.name,
        category: r.category,
        unit: r.unit,
        stock: Number(r.stock) || 0,
        min: Number(r.min) || 0,
        price: Number(r.price) || 0,
      })),
    ]);
    setAddRows([{ name: '', category: '', unit: 'g', stock: '', min: '', price: '' }]);
    setAddModalOpen(false);
    alert('등록되었습니다.');
  };

  return (
    <div className="inventory-wrap">
      <h2>전체 재고 조회 (부족 순 정렬)</h2>

      {/* 검색바 */}
      <div className="search-bar">
        <div className="search-left">
          <select name="store" value={filters.store} onChange={handleFilterChange}>
            <option value="">전체 지점</option>
            {stores.map(s => <option key={s} value={s}>{s}</option>)}
          </select>

          <select name="category" value={filters.category} onChange={handleFilterChange}>
            <option value="">전체</option>
            {categories.map(c => <option key={c} value={c}>{c}</option>)}
          </select>

          <input
            type="text"
            name="name"
            placeholder="재료명을 입력하세요"
            value={filters.name}
            onChange={handleFilterChange}
          />

          <button className="btn btn-search" onClick={() => {}}>검색</button>
        </div>

        <div className="search-right">
          <button className="btn btn-add" onClick={() => setAddModalOpen(true)}>+ 재료 추가</button>

          {!isEditMode && (
            <button className="btn btn-edit" onClick={handleEditMode}>수정입력</button>
          )}
          {isEditMode && (
            <>
              <button className="btn save" onClick={handleSaveEdit}>등록하기</button>
              <button className="btn cancel" onClick={handleCancelEdit}>취소하기</button>
            </>
          )}
        </div>
      </div>

      {/* 재고 테이블 */}
      <table className="inventory-table">
        <thead>
          <tr>
            <th>지점</th>
            <th>재료명</th>
            <th>분류</th>
            <th>단위</th>
            <th>재고량</th>
            <th>최소수량</th>
            <th>단위가격</th>
          </tr>
        </thead>
        <tbody>
          {sortedInventory.length === 0 ? (
            <tr><td colSpan={7}>데이터가 없습니다.</td></tr>
          ) : (
            sortedInventory.map((row, idx) => (
              <tr key={idx} data-store={row.store} data-category={row.category}>
                <td>{row.store}</td>
                <td>{row.name}</td>
                <td>{row.category}</td>
                <td>{row.unit}</td>
                <td>
                  <input
                    type="number"
                    value={row.stock}
                    disabled={!isEditMode}
                    className={isEditMode ? 'editable' : ''}
                    onChange={e => handleInventoryInput(idx, 'stock', e.target.value)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    value={row.min}
                    disabled={!isEditMode}
                    className={isEditMode ? 'editable' : ''}
                    onChange={e => handleInventoryInput(idx, 'min', e.target.value)}
                  />
                </td>
                <td>{row.price}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* 추가 모달 */}
      {addModalOpen && (
        <div className="modal" id="addModal">
          <div className="modal-content">
            <h3>재료 추가</h3>
            <table className="inventory-table">
              <thead>
                <tr>
                  <th>품목명</th>
                  <th>구분</th>
                  <th>단위</th>
                  <th>재고량</th>
                  <th>최소수량</th>
                  <th>단위가격</th>
                  <th>액션</th>
                </tr>
              </thead>
              <tbody>
                {addRows.map((row, idx) => (
                  <tr key={idx}>
                    <td>
                      <input
                        type="text"
                        value={row.name}
                        onChange={e => handleAddRowChange(idx, 'name', e.target.value)}
                      />
                    </td>
                    <td>
                      <select
                        value={row.category}
                        onChange={e => handleAddRowChange(idx, 'category', e.target.value)}
                      >
                        <option value="">선택</option>
                        {categories.map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </td>
                    <td>
                      <select
                        value={row.unit}
                        onChange={e => handleAddRowChange(idx, 'unit', e.target.value)}
                      >
                        {units.map(u => <option key={u} value={u}>{u}</option>)}
                      </select>
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.stock}
                        onChange={e => handleAddRowChange(idx, 'stock', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.min}
                        onChange={e => handleAddRowChange(idx, 'min', e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="number"
                        value={row.price}
                        onChange={e => handleAddRowChange(idx, 'price', e.target.value)}
                      />
                    </td>
                    <td>
                      <button className="btn btn-remove" onClick={() => removeAddRow(idx)}>삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="modal-actions">
              <button className="btn btn-add-row" onClick={addAddRow}>+ 행 추가</button>
              <button className="btn btn-save" onClick={handleAddSubmit}>등록</button>
              <button className="btn btn-cancel" onClick={() => setAddModalOpen(false)}>취소</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
