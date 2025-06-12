import React from 'react';
import { atom, useAtom } from 'jotai';
import HqInventorySidebar from './HqInventorySidebar';
import styles from './HqInventoryList.module.css';

const inventoryAtom = atom([
  { store: '본사', name: '로메인', category: '베이스채소', unit: 'kg', stock: 200, min: 100, price: 180 },
]);

const filtersAtom = atom({ store: 'all', category: 'all', name: '' });
const isEditModeAtom = atom(false);
const addModalOpenAtom = atom(false);
const addRowsAtom = atom([{ name: '', category: '', unit: 'g', stock: '', min: '', price: '' }]);

const stores = ['all', '본사', '강남점', '홍대점', '건대점'];
const categories = ['all', '베이스채소', '단백질', '토핑', '드레싱'];
const units = ['g', 'kg', 'ml', 'ea'];

export default function HqInventoryList() {
  const [inventory, setInventory] = useAtom(inventoryAtom);
  const [filters, setFilters] = useAtom(filtersAtom);
  const [isEditMode, setIsEditMode] = useAtom(isEditModeAtom);
  const [addModalOpen, setAddModalOpen] = useAtom(addModalOpenAtom);
  const [addRows, setAddRows] = useAtom(addRowsAtom);

  const filtered = inventory.filter(
    row =>
      (filters.store === 'all' || row.store === filters.store) &&
      (filters.category === 'all' || row.category === filters.category) &&
      (filters.name === '' || row.name.toLowerCase().includes(filters.name.toLowerCase()))
  );

  const sortedInventory = [...filtered].sort((a, b) => (a.stock - a.min) - (b.stock - b.min));

  const handleFilterChange = e => {
    const { name, value } = e.target;
    setFilters(prev => ({ ...prev, [name]: value }));
  };

  const handleEditMode = () => setIsEditMode(true);
  const handleCancelEdit = () => setIsEditMode(false);
  const handleSaveEdit = () => {
    setIsEditMode(false);
    alert('저장되었습니다.');
  };

  const handleInventoryInput = (idx, field, value) => {
    setInventory(cur =>
      cur.map((row, i) => (i === idx ? { ...row, [field]: value === '' ? '' : Number(value) } : row))
    );
  };

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
        price: Number(r.price) || 0
      })),
    ]);
    setAddRows([{ name: '', category: '', unit: 'g', stock: '', min: '', price: '' }]);
    setAddModalOpen(false);
    alert('등록되었습니다.');
  };

  return (
    <>
      <HqInventorySidebar />
      <div className={styles.inventoryContainer}>
        <h2 className={styles.title}>전체 재고 조회 (부족 순 정렬)</h2>

        <div className={`${styles.filterBar} ${styles.searchBar}`}>
          <select
            name="store"
            value={filters.store}
            onChange={handleFilterChange}
            className={styles.select}
          >
            {stores.map(s => (
              <option key={s} value={s}>
                {s === 'all' ? '전체 지점' : s}
              </option>
            ))}
          </select>
          <select
            name="category"
            value={filters.category}
            onChange={handleFilterChange}
            className={styles.select}
          >
            {categories.map(c => (
              <option key={c} value={c}>
                {c === 'all' ? '전체' : c}
              </option>
            ))}
          </select>
          <input
            name="name"
            type="text"
            placeholder="재료명을 입력하세요"
            value={filters.name}
            onChange={handleFilterChange}
            className={styles.inputText}
          />
          <button className={styles.btnSearch}>검색</button>
          <button className={styles.btnAdd} onClick={() => setAddModalOpen(true)}>
            + 재료 추가
          </button>
          {!isEditMode && (
            <button className={styles.btnEdit} onClick={handleEditMode}>
              수정입력
            </button>
          )}
          {isEditMode && (
            <>
              <button className={styles.btnSave} onClick={handleSaveEdit}>
                등록하기
              </button>
              <button className={styles.btnCancel} onClick={handleCancelEdit}>
                취소하기
              </button>
            </>
          )}
        </div>

        <table className={styles.inventoryTable}>
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
              <tr>
                <td colSpan={7} className={styles.noData}>
                  데이터가 없습니다.
                </td>
              </tr>
            ) : (
              sortedInventory.map((row, idx) => (
                <tr key={idx}>
                  <td>{row.store}</td>
                  <td>{row.name}</td>
                  <td>{row.category}</td>
                  <td>{row.unit}</td>
                  <td>
                    <input
                      type="number"
                      value={row.stock}
                      disabled={!isEditMode}
                      className={isEditMode ? styles.editableInput : ""}
                      onChange={e => handleInventoryInput(idx, "stock", e.target.value)}
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      value={row.min}
                      disabled={!isEditMode}
                      className={isEditMode ? styles.editableInput : ""}
                      onChange={e => handleInventoryInput(idx, "min", e.target.value)}
                    />
                  </td>
                  <td>{row.price}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {addModalOpen && (
          <div className={styles.modal}>
            <div className={styles.modalContent}>
              <h3>재료 추가</h3>
              <table className={styles.inventoryTable}>
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
                          onChange={e => handleAddRowChange(idx, "name", e.target.value)}
                        />
                      </td>
                      <td>
                        <select
                          value={row.category}
                          onChange={e => handleAddRowChange(idx, "category", e.target.value)}
                        >
                          <option value="">선택</option>
                          {categories.map(c => (
                            <option key={c} value={c}>
                              {c}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          value={row.unit}
                          onChange={e => handleAddRowChange(idx, "unit", e.target.value)}
                        >
                          {units.map(u => (
                            <option key={u} value={u}>
                              {u}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.stock}
                          onChange={e => handleAddRowChange(idx, "stock", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.min}
                          onChange={e => handleAddRowChange(idx, "min", e.target.value)}
                        />
                      </td>
                      <td>
                        <input
                          type="number"
                          value={row.price}
                          onChange={e => handleAddRowChange(idx, "price", e.target.value)}
                        />
                      </td>
                      <td>
                        <button className={styles.btnRemove} onClick={() => removeAddRow(idx)}>
                          삭제
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              <div className={styles.modalActions}>
                <button className={styles.btnAddRow} onClick={addAddRow}>
                  + 행 추가
                </button>
                <button className={styles.btnSave} onClick={handleAddSubmit}>
                  등록
                </button>
                <button className={styles.btnCancel} onClick={() => setAddModalOpen(false)}>
                  취소
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
