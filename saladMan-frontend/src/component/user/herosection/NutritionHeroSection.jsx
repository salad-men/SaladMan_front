import React from "react"; 
import styles from './HeroSection.module.css';

const NutritionHeroSection = () => {
    return (
        <div className={styles.heroSection}>
            <h1 className={styles.title}><b>영양표</b></h1>

            <div className={styles.imageBanner}>
                <img src="/Nutrition.jpg" alt="영양표" />
                <span className={styles.Overlay}>Nutrition</span>
            </div>



        </div>


    )


}
export default NutritionHeroSection;