import React from "react";
import styles from "./OrderConfirmModal.module.css";
import ModalPortal from "./ModalPortal";

const OrderConfirmModal = ({ isOpen, onClose, onConfirm, cartItems, totalPrice, orderType, orderTime }) => {
    if (!isOpen) return null;

    return (
        <ModalPortal>
            <div className={styles.overlay}>
                <div className={styles.modal}>
                    <div className={styles.header}>SaladMan 주문서</div>
                    <div className={styles.orderType}>주문 방식: {orderType}</div>

                    <div className={styles.itemList}>
                        {cartItems.length === 0 ? (
                            <p>장바구니가 비어 있습니다.</p>
                        ) : (
                            cartItems.map(item => (
                                <div key={item.id} className={styles.item}>
                                    <span>{item.name} x{item.quantity}</span>
                                    <span>{(item.salePrice * item.quantity).toLocaleString()}원</span>
                                </div>
                            ))
                        )}
                    </div>

                    <div className={styles.summary}>
                        총 결제 금액: {totalPrice.toLocaleString()}원
                    </div>
                    {orderTime && (
                        <div className={styles.receiptTime}>
                            결제일시: {orderTime}
                        </div>
                    )}
                    <div className={styles.actions}>
                        <button className={styles.cancelBtn} onClick={onClose}>취소</button>
                        <button className={styles.confirmBtn} onClick={onConfirm}>결제 진행</button>
                    </div>
                </div>
            </div>
        </ModalPortal>
    );
};

export default OrderConfirmModal;
