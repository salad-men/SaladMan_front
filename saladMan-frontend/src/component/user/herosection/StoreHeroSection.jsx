import React from "react";
import styles from './HeroSection.module.css';

const StoreHeroSection= () =>{
    return (
    <div className= {styles.heroSection}>
        <h1 className= {styles.title}>매장찾기</h1>
        <div className={styles.imageBanner}>
            <img src="/FindStore.jpg" alt="매장찾기" />
            <span className={styles.Overlay}>FindStore</span>
        </div>
    </div>




    );
}

export default StoreHeroSection;