import React, { useRef, useEffect, useState } from 'react';
import './IntroSection2.css';

const WorkingSolutionSection = () => {
  const sectionRef = useRef(null);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsVisible(entry.isIntersecting);
      },
      { threshold: 0.5 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className={`working-section ${isVisible ? 'slide-in' : ''}`}
    >
      <div className="textBox">
        <h2>Salad Solution for Working You</h2>
        <p>당신의 바쁜 하루에 작은 위로가 되는 한 끼를 준비했어요</p>
        <button>자세히 보기</button>
      </div>
      <div className="imageBox">
        <img src="./store.jpg" alt="매장 사진" />
      </div>
    </section>
  );
};

export default WorkingSolutionSection;
