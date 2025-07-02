import React from "react";
import EmpSidebar from "./StoreEmpSidebar";
import styles from "./EmpSchedule.module.css";
import ScheduleCalendar from "./ScheduleCalendar";

export default function EmpSchedule() {
    return (
        <div className={styles.layout}>
            <EmpSidebar />
            <div className={styles.contentArea}>
                <ScheduleCalendar />
            </div>
        </div>
    );
}
