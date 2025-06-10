import React, { useState } from 'react';
import { atom, useAtom } from 'jotai';
import './StoreIngredientSetting.css';  

const inventoryAtom = atom([
  { store: '본사', name: '로메인', category: '베이스채소', unit: 'kg', min: 100, max: 500, price: 180 },
  { store: '본사', name: '닭가슴살', category: '단백질', unit: 'kg', min: 50, max: 300, price: 450 },
  { store: '본사', name: '퀴노아', category: '탄수화물', unit: 'g', min: 300, max: 800, price: 250 },
]);

const isEditModeAtom = atom(false);

export default function StoreIngredientSetting() {
  const [inventory, setInventory] = useAtom(inventoryAtom);
  const [isEditMode, setIsEditMode] = useAtom(isEditModeAtom);

  const [selectedCategory, setSelectedCategory] = useState('전체');
  const [searchName, setSearchName] = useState('');

  const categories = ['전체', ...Array.from(new Set(inventory.map(item => item.category)))];

  const handleInventoryInput = (idx, field, value) => {
    setInventory(cur =>
      cur.map((row, i) => (i === idx ? { ...row, [field]: value === '' ? '' : Number(value) } : row))
    );
  };

  const handleEditMode = () => setIsEditMode(true);
  const handleCancelEdit = () => setIsEditMode(false);
  const handleSaveEdit = () => {
    setIsEditMode(false);
    alert('매장 재료 설정이 저장되었습니다.');
  };

  const filteredInventory = inventory.filter(item => {
    const categoryMatch = selectedCategory === '전체' || item.category === selectedCategory;
    const nameMatch = item.name.toLowerCase().includes(searchName.toLowerCase());
    return categoryMatch && nameMatch;
  });

  return (
    <div className="inventory-wrap">
      <h2>매장 재료 설정</h2>

      <div className="filter-row">
        <select
          value={selectedCategory}
          onChange={e => setSelectedCategory(e.target.value)}
          className="category-select"
        >
          {categories.map(cat => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>

        <input
          type="text"
          placeholder="재료명 검색"
          value={searchName}
          onChange={e => setSearchName(e.target.value)}
          className="name-search"
        />
      </div>

      {!isEditMode && (
        <div className="button-row">
          <button className="btn btn-edit" onClick={handleEditMode}>
            수정모드
          </button>
        </div>
      )}
      {isEditMode && (
        <div className="button-row cancel-save-row">
          <button className="btn cancel" onClick={handleCancelEdit}>
            취소
          </button>
          <button className="btn save" onClick={handleSaveEdit}>
            저장
          </button>
        </div>
      )}

      <table className="inventory-table">
        <thead>
          <tr>
            <th>재료명</th>
            <th>분류</th>
            <th>단위</th>
            <th>최소수량</th>
            <th>최대수량</th>
            <th>단가</th>
          </tr>
        </thead>
        <tbody>
          {filteredInventory.map((row, idx) => (
            <tr key={idx}>
              <td>{row.name}</td>
              <td>{row.category}</td>
              <td>{row.unit}</td>
              <td>
                <input
                  type="number"
                  value={row.min}
                  disabled={!isEditMode}
                  className={isEditMode ? 'editable' : ''}
                  onChange={e => handleInventoryInput(idx, 'min', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  value={row.max}
                  disabled={!isEditMode}
                  className={isEditMode ? 'editable' : ''}
                  onChange={e => handleInventoryInput(idx, 'max', e.target.value)}
                />
              </td>
              <td>{row.price}</td>
            </tr>
          ))}
          {filteredInventory.length === 0 && (
            <tr>
              <td colSpan="6" style={{ textAlign: 'center', color: '#999' }}>
                조건에 맞는 재료가 없습니다.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
