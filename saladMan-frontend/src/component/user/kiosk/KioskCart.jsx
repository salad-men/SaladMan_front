import React from 'react';
import styles from './KioskCart.module.css';
import { useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "/src/atoms";
import { userAtom } from "/src/atoms";

import { myAxios } from "/src/config";


const KioskCart = ({ cartItems = [], onUpdateQuantity, onRemoveItem, onClearCart, className = "staticCart" }) => {

  const totalPrice = cartItems.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
  const navigate = useNavigate();
  const token = useAtomValue(accessTokenAtom);
  const store = useAtomValue(userAtom);

const handleOrder = async () => {
  if (cartItems.length === 0) {
    alert("장바구니에 담긴 상품이 없습니다.");
    return;
  }
  if (!store || !store.id) {
    alert("매장 정보가 없습니다.");
    return;
  }
  try {
    const res = await myAxios(token).post("/kiosk/prepare", {
      storeId: store.id,
      items: cartItems.map((item) => ({
        menuId: item.menuId,
        quantity: item.quantity,
        price: item.salePrice
      }))
    });

    const { orderId, amount } = res.data;

    // 결제 페이지로 이동 + 데이터 전달
    navigate("/kiosk/paymentPage", {
      state: {
        orderId,
        amount
      }
    });

  } catch (err) {
    console.error("결제 준비 오류", err);
    alert("결제를 준비할 수 없습니다.");
  }
};

  return (
    <div className={`${styles.cartBar} ${styles[className] || ''}`}>
      <h2><svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" class="bi bi-cart3" viewBox="0 0 16 16">
  <path d="M0 1.5A.5.5 0 0 1 .5 1H2a.5.5 0 0 1 .485.379L2.89 3H14.5a.5.5 0 0 1 .49.598l-1 5a.5.5 0 0 1-.465.401l-9.397.472L4.415 11H13a.5.5 0 0 1 0 1H4a.5.5 0 0 1-.491-.408L2.01 3.607 1.61 2H.5a.5.5 0 0 1-.5-.5M3.102 4l.84 4.479 9.144-.459L13.89 4zM5 12a2 2 0 1 0 0 4 2 2 0 0 0 0-4m7 0a2 2 0 1 0 0 4 2 2 0 0 0 0-4m-7 1a1 1 0 1 1 0 2 1 1 0 0 1 0-2m7 0a1 1 0 1 1 0 2 1 1 0 0 1 0-2"/>
</svg> &nbsp; 카트</h2>
      <div className={styles.tableWrapper}>
        
        <div className={styles.bodyWrapper}>
          <table className={styles.cartTable}>
            <tbody>
              {cartItems.map((item) => (
                <tr key={item.menuId}>
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

        <button className={styles.orderButton} onClick={handleOrder}>주문하기</button>
      </div>
    </div>
  );
};

export default KioskCart;
