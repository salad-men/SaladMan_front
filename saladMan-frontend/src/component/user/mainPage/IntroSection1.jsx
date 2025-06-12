import React, { useRef, useEffect, useState } from 'react';
import './IntroSection1.css';

const IntroSection = () => {
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
      className={`section ${isVisible ? 'slide-in' : 'slide-out'}`}
      ref={sectionRef}
    >
      <div className="imageBox">
        <img src="/introSalad.jpg" alt="샐러드" />
      </div>
      <div className="textBox">
        <h2>당신을 위한 가장 작은 배려, 한 끼 샐러드</h2>
        <p>
          바쁜 하루 속, 나를 챙기는 가장 간단한 방법<br />
          작은 선택이 하루의 균형을 만듭니다.
        </p>
        <button>자세히 보기</button>
      </div>
    </section>
  );
};

export default IntroSection;
