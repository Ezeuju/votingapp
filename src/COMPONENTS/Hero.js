import React, { useState, useEffect } from 'react';
import styles from '../CSS-MODULES/Hero.module.css';

const Hero = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      image: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?q=80&w=1470',
      tag: 'SEASON 4 - NOW LIVE',
      title: "Nigeria’s Biggest <span class='highlight'>Global Talent</span> Platform",
      description: "Born from the legacy of Akwa Ibom Talent Show, NAIJA TALENT SHOW – Season 4 is a global talent-recovery movement."
    },
    {
      image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?q=80&w=1469',
      tag: 'AUDITIONS ONGOING',
      title: "Your Journey to the <span class='highlight'>World Stage</span> Starts Here",
      description: "Discovering, grooming, and launching extraordinary talents from Nigeria and beyond into the global spotlight."
    },
    {
      image: 'https://images.unsplash.com/photo-1535525153412-5a42439a210d?q=80&w=1470',
      tag: 'THE LEGACY CONTINUES',
      title: "Thousands of Talents, <span class='highlight'>One Global</span> Stage",
      description: "Join the movement that turns local stars into international icons. Registration for Season 4 is now open!"
    }
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev === slides.length - 1 ? 0 : prev + 1));
    }, 6000); // 6 seconds per slide for better readability
    return () => clearInterval(timer);
  }, [slides.length]);

  return (
    <>
    <div className={styles.heroAll}>
    
    
    <section className={styles.heroContainer}>
      {slides.map((slide, index) => (
        <div
          key={index}
          className={`${styles.slide} ${index === currentSlide ? styles.active : ''}`}
          style={{ backgroundImage: `linear-gradient(rgba(0,0,0,0.65), rgba(0,0,0,0.9)), url(${slide.image})` }}
        >
          <div className={styles.content}>
            <div className={styles.badge}>● {slide.tag}</div>
            <h4 className={styles.seasonTitle}>NAIJA TALENT SHOW – SEASON 4</h4>
            
            {/* Using dangerouslySetInnerHTML to allow the <span> for green text */}
            <h1 
              className={styles.mainTitle} 
              dangerouslySetInnerHTML={{ __html: slide.title }} 
            />
            
            <p className={styles.description}>{slide.description}</p>
            
            

            <div className={styles.ctaGroup}>
              <button className={styles.primaryBtn}><a href="/audition" >Register for Auditions</a></button>
              <button className={styles.secondaryBtn}>Get Your Tickets</button>
              <button className={styles.secondaryBtn}>Vote Now</button>
            </div>
          </div>
        </div>
      ))}

      <div className={styles.indicators}>
        {slides.map((_, i) => (
          <div 
            key={i} 
            className={`${styles.dotIndicator} ${i === currentSlide ? styles.activeDot : ''}`}
            onClick={() => setCurrentSlide(i)}
          />
        ))}
      </div>
    </section>
    </div>
    </>
  );
};

export default Hero;