import React from "react";
import styles from './HeroSection.module.css';

const NewsHeroSection= () =>{
    return (
    <div className= {styles.heroSection}>
        <h1 className= {styles.title}>새소식</h1>
        <br />
            <p className={styles.subtitle}>
                <a href='/News' className={styles.atag}>공지사항</a> 
                <span className={styles.divider}>ㅣ</span> 
                <a href='/Event' className={styles.atag}>이벤트</a>
                <span className={styles.divider}>ㅣ</span>
                <a href='/PraiseStore' className={styles.atag}>칭찬매장</a>
            </p>
        <div className={styles.imageBanner}>
            <img src="/News.jpg" alt="새소식" />
            <span className={styles.Overlay}>News</span>
        </div>
    </div>




    );
}

export default NewsHeroSection;