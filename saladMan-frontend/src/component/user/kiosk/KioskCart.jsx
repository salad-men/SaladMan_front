import React from 'react';
import styles from './KioskCart.module.css';
import { useNavigate } from "react-router-dom";

const KioskCart = ({ cartItems = [], onUpdateQuantity, onRemoveItem, onClearCart, className = "staticCart" }) => {
  const totalPrice = cartItems.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
  const navigate = useNavigate();
  return (
    <div className={`${styles.cartBar} ${styles[className] || ''}`}>
      <div className={styles.tableWrapper}>
        <table className={styles.cartTable}>
          <thead>
            {/* (필요하면 헤더 넣기) */}
          </thead>
        </table>
        <div className={styles.bodyWrapper}>
          <table className={styles.cartTable}>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.id}>
                  <td className={styles.nameCell}>{item.name}</td>
                  <td>
                    <div className={styles.controls}>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity - 1)}
                        disabled={item.quantity <= 1}
                      >
                        -
                      </button>
                      <span>{item.quantity}개</span>
                      <button
                        onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                      >
                        +
                      </button>
                    </div>
                  </td>
                  <td className={styles.priceCell}>
                    {item.salePrice != null
                      ? `${(item.salePrice * item.quantity).toLocaleString()}원`
                      : "- 원"}
                  </td>
                  <td>
                    <button
                      className={styles.removeBtn}
                      onClick={() => onRemoveItem(item.id)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <table className={styles.cartTable}>
          <tfoot>
            <tr>
              <td colSpan={2}></td>
              <td>
                {cartItems.length > 0 && (
                  <span>총 {totalPrice.toLocaleString()}원</span>
                )}
              </td>
              <td>
                {cartItems.length > 0 && (
                  <button
                    className={styles.removeBtn}
                    onClick={onClearCart}
                  >
                    전체<br />삭제
                  </button>
                )}
              </td>
            </tr>
          </tfoot>
        </table>
      </div>

      <div className={styles.summary}>
        <button
          className={styles.orderButton}
          onClick={() => navigate("/kiosk/main")}
        >
          홈으로
        </button>

        <button className={styles.orderButton}>주문하기</button>
      </div>
    </div>
  );
};

export default KioskCart;
