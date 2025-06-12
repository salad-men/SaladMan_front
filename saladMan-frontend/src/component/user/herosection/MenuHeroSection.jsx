import React from "react";
import styles from './HeroSection.module.css';

const MenuHeroSection= () =>{
    return (
    <div className= {styles.heroSection}>
        <h1 className= {styles.title}>메뉴</h1>
            <p className={styles.subtitle}>
                <a href='/brandIntro'>샐러볼</a> 
                <span className={styles.divider}>ㅣ</span> 
                <a href='/sloganIntro'>포케볼</a>
                <span className={styles.divider}>ㅣ</span> 
                <a href='/sloganIntro'>비건볼</a>
            </p>
        <div className={styles.imageBanner}>
            <img src="/Menu.jpg" alt="메뉴" />
            <span className={styles.Overlay}>Signature</span>
        </div>
    </div>




    );
}

export default MenuHeroSection;