import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../CSS-MODULES/Audition.module.css';

const Audition = () => {
  const navigate = useNavigate();

  return (
    <section className={styles.auditionSection} id="auditions">
      <div className={styles.container}>

        {/* COUNTDOWN BLOCK */}
        <div className={styles.countdownWrapper}>
          <span className={styles.eyebrow}>Don't Wait!</span>
          <h2>Auditions Are Approaching</h2>
          <p className={styles.description}>
            Registration for NAIJA TALENT SHOW – Season 4 is now open. Don't miss your chance to audition,
            get mentored by industry professionals, and compete for life-changing rewards on a global stage.
          </p>

          <div className={styles.comingSoon}>COMING SOON</div>

          <div className={styles.actionRow}>
            <div className={styles.priceBadge}>
              Audition Fee: <strong>₦10,000</strong>
            </div>
            <button className={styles.mainRegisterBtn} onClick={() => navigate('/auditiony')}>Register for Auditions</button>
          </div>
        </div>

      </div>
    </section>
  );
};

export default Audition;