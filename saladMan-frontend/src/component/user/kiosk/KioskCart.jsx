import React from 'react';
import styles from './KioskCart.module.css';

const KioskCart = ({ cartItems = [], onUpdateQuantity, onRemoveItem }) => {
  const totalPrice = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className={styles.cartBar}>
      <div className={styles.cartItems}>
        {cartItems.length === 0 ? (
          <p className={styles.empty}>장바구니가 비어 있습니다.</p>
        ) : (
          cartItems.map((item, index) => (
            <div key={index} className={styles.item}>
              <span className={styles.name}>{item.name}</span>
              <div className={styles.controls}>
                <button onClick={() => onUpdateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>-</button>
                <span>{item.quantity}개</span>
                <button onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}>+</button>
              </div>
              <span>{item.price * item.quantity}원</span>
              <button className={styles.removeBtn} onClick={() => onRemoveItem(item.id)}>삭제</button>
            </div>
          ))
        )}
      </div>

      {cartItems.length > 0 && (
        <div className={styles.summary}>
          <span>총 {totalPrice.toLocaleString()}원</span>
          
          <button className={styles.orderButton}>주문하기</button>
        </div>
      )}
    </div>
  );
};

export default KioskCart;
