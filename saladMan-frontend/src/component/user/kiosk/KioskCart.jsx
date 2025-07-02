import React from 'react';
import styles from './KioskCart.module.css';
import { useNavigate } from "react-router-dom";
import { useAtomValue } from "jotai";
import { accessTokenAtom } from "/src/atoms";
import { myAxios } from "/src/config";


const KioskCart = ({ cartItems = [], onUpdateQuantity, onRemoveItem, onClearCart, className = "staticCart" }) => {

  const totalPrice = cartItems.reduce((sum, item) => sum + item.salePrice * item.quantity, 0);
  const navigate = useNavigate();
  const token = useAtomValue(accessTokenAtom);

const handleOrder = async () => {
  if (cartItems.length === 0) {
    alert("장바구니에 담긴 상품이 없습니다.");
    return;
  }

  try {
    const res = await myAxios(token).post("/kiosk/prepare", {
      storeId: 9,
      items: cartItems.map((item) => ({
        menuId: item.id,
        quantity: item.quantity,
        price: item.salePrice
      }))
    });

    const { orderId, amount } = res.data;

    // 결제 페이지로 이동 + 데이터 전달
    navigate("/kiosk/paymentTest", {
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
      <div className={styles.tableWrapper}>
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

        <button className={styles.orderButton} onClick={handleOrder}>주문하기</button>
      </div>
    </div>
  );
};

export default KioskCart;
