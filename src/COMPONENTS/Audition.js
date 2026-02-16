import React from 'react';
import styles from '../CSS-MODULES/Audition.module.css';

const Audition = () => {
  return (
    <section className={styles.auditionSection} id="auditions">
      <div className={styles.container}>
        
        {/* 1. COUNTDOWN BLOCK */}
        <div className={styles.countdownWrapper}>
          <span className={styles.eyebrow}>Don't Wait!</span>
          <h2>Auditions Are Approaching</h2>
          <p className={styles.description}>
            Registration for NAIJA TALENT SHOW – Season 4 is now open. Don’t miss your chance to audition, 
            get mentored by industry professionals, and compete for life-changing rewards on a global stage.
          </p>
          
          <div className={styles.timer}>
            <div className={styles.timeUnit}><span>206</span><p>Days</p></div>
            <div className={styles.timeUnit}><span>22</span><p>Hours</p></div>
            <div className={styles.timeUnit}><span>06</span><p>Minutes</p></div>
            <div className={styles.timeUnit}><span>40</span><p>Seconds</p></div>
          </div>
          <button className={styles.mainRegisterBtn}>Register for Auditions</button>
        </div>

        {/* 2. REGISTRATION PLANS */}
        <div className={styles.plansHeader}>
          <h2>Choose Your Audition Plan</h2>
          <p>Register for NAIJA TALENT SHOW – Season 4 and take the first step toward global recognition.</p>
        </div>

        <div className={styles.planContainer}>
          {/* Silver Pass */}
          <div className={styles.planCard}>
            <h3>Silver Audition Pass</h3>
            <p>Standard audition access for individuals ready to showcase their talent on the NAIJA TALENT SHOW stage.</p>
            <div className={styles.price}>₦2,000</div>
            <button className={styles.planBtn}>Register Now</button>
          </div>

          {/* Gold Pass - Featured */}
          <div className={`${styles.planCard} ${styles.featured}`}>
            <div className={styles.popularTag}>Priority Screening</div>
            <h3>Gold Audition Pass</h3>
            <p>Premium audition access with priority screening and added exposure opportunities.</p>
            <div className={styles.price}>₦10,000</div>
            <button className={styles.goldBtn}>Get Gold Pass</button>
          </div>

          {/* VVIP Pass */}
          <div className={styles.planCard}>
            <h3>VIP Audition Pass</h3>
            <p>Exclusive access designed for serious talents seeking maximum visibility and professional advantage.</p>
            <div className={styles.price}>₦50,000</div>
            <button className={styles.planBtn}>Apply as VIP</button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Audition;