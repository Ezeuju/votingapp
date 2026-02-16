import React from 'react';
import Navbar from '../COMPONENTS/Navbar';
import styles from '../CSS-MODULES/Home.module.css';
import Hero from '../COMPONENTS/Hero';
import Gallery  from '../COMPONENTS/Gallery';
import Tickets from '../COMPONENTS/Tickets';
import Judges from '../COMPONENTS/Judges';
import Audition from '../COMPONENTS/Audition';
import Partners from '../COMPONENTS/Partners';
import Contact from '../COMPONENTS/Contact';
import Footer from "../COMPONENTS/Footer"


const Home = () => {
  return (
    <>
    <Navbar />
    <Hero />
   
  
       <div className={styles.aboutPage}>
      {/* SECTION 1: HERO HEADER */}
      {/* <header className={styles.headerSection}>
        <div className={styles.headerContent}>
          <h1 className={styles.mainTitle}>
            From United States Roots to a <span className={styles.greenText}>Global Stage</span>
          </h1>
          <p className={styles.tagline}>The Evolution of Talent Recovery</p>
        </div>
      </header> */}

      {/* SECTION 2: THE EVOLUTION (Flexbox Row) */}
      <section className={styles.evolutionSection}>
        <div className={styles.flexRow}>
          <div className={styles.evolutionText}>
            <h2>🎤 About Us</h2>
            <p>
              Born from the legacy of <strong>Akwa Ibom Talent Show</strong>, NAIJA TALENT SHOW Season 4 marks a bold transition from a regional celebration to the biggest global talent-recovery platform Nigeria has ever seen.
            
        
              What started as a local showcase of raw, authentic skill has now grown into an international movement that scouts, nurtures, and propels undiscovered voices into worldwide stardom.
            </p>
          </div>
          <div className={styles.rewardCard}>
            <h3>Massive Reward</h3>
            <div className={styles.amount}>₦20,000,000.00</div>
            <p>Twenty Million Naira worth of prizes with lots of consolation prizes.</p>
          </div>
        </div>
      </section>
           {/* SECTION 3: WHAT WE ARE ABOUT (Flexbox Cards) */}
            <section className={styles.aboutCards}>
              <div className={styles.cardFlex}>
                <div className={styles.infoCard}>
                  <div className={styles.icon}>🌍</div>
                  <h3>Global Talent Recovery</h3>
                  <p>A 3-month journey (Sept-Nov 2026) where experts in production, choreography, and media turn raw talent into market-ready artistry.</p>
                </div>
                <div className={styles.infoCard}>
                  <div className={styles.icon}>⭐</div>
                  <h3>From Nobody to Superstar</h3>
                  <p>We believe every community hides a future icon. We offer training, mentorship, and brand building for unprecedented exposure.</p>
                </div>
                <div className={styles.infoCard}>
                  <div className={styles.icon}>🚀</div>
                  <h3>Scouting Powerhouse</h3>
                  <p>With teams in Nigeria and the USA, we identify and empower artists with the potential to shine globally.</p>
                </div>
              </div>
            </section>
      
      </div>
       <Gallery />
       <Tickets />
       <Judges />
       <Audition />
       <Partners />
       <Contact />
       <Footer />

     



      {/* 4. LIVE UPDATE TICKER */}
      <div className={styles.liveTicker}>
        <div className={styles.tickerLabel}>LIVE UPDATES</div>
        <div className={styles.tickerContent}>
          <marquee scrollamount="8">
            Next Live Audition: FECA Eket Chapter Auditorium - Feb 20th | 
            Breaking: "The Comedian" advances to Semi-Finals! | 
            Standard Tickets now available from ₦25,000! — Join the movement today!
          </marquee>
        </div>
      </div> 
      
      {/* Spacer for ticker */}
      <div style={{height: '50px'}}></div>
    
    </>
  );
};

export default Home;