import React, { useEffect, useRef } from 'react';
import styles from './BlobHeader.module.css';

const BlobHeader = () => {
  const pathRef = useRef(null);
  const width = window.innerWidth;
  const height = 120;
  let x = width / 2;
  let curveX = x;
  let xIter = 0;

  useEffect(() => {
    const easeOutExpo = (t, b, c, d) =>
      c * (-Math.pow(2, (-10 * t) / d) + 1) + b;

    const updatePath = () => {
      if (Math.abs(curveX - x) > 1) {
        xIter++;
        curveX = easeOutExpo(xIter, curveX, x - curveX, 100);
      } else {
        xIter = 0;
      }

      const anchorDistance = 40;
      const curviness = 60;

      const d = `
        M0,0 
        H${width} 
        V${height - anchorDistance} 
        C${curveX + 100},${height + curviness}, ${curveX - 100},${height + curviness}, 0,${height - anchorDistance} 
        V0 Z
      `;

      if (pathRef.current) {
        pathRef.current.setAttribute('d', d);
      }

      requestAnimationFrame(updatePath);
    };

    document.addEventListener('mousemove', (e) => {
      x = e.pageX;
    });

    requestAnimationFrame(updatePath);
  }, []);

  return (
    <div className={styles.headerWrapper}>
      <header className={styles.header}>
        <a href="/" className={styles.logo}>Saladman</a>
        <nav className={styles.nav}>
          <a href="/brandIntro">브랜드</a>
          <a href="/menuPage">메뉴</a>
          <a href="/nutritionPage">영양표</a>
          <a href="/findStore">매장</a>
          <a href="/news">소식</a>
        </nav>
      </header>

      <svg className={styles.blobSvg} viewBox={`0 0 ${width} ${height}`} preserveAspectRatio="none">
        <path ref={pathRef} fill="#4D774E" />
      </svg>
    </div>
  );
};

export default BlobHeader;