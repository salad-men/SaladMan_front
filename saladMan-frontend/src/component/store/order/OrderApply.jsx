import React, { useState } from "react";
import styles from "./OrderApply.module.css";
import OrderSidebar from "./OrderSidebar";
import LowStockList from "./LowStockList";
import OrderItemTable from "./OrderItemTable";

export default function OrderApply() {


    return (
        <>
            <div className={styles.orderApplyContainer}>
            <OrderSidebar />

                <div className={styles.orderApplyContent}>

                    <h2>발주신청</h2>
                    <div className={styles.contentBox}>

                    <LowStockList />
                    <OrderItemTable/>

                        

                    </div>
                </div>
            </div>
            

        </>
    );
}
