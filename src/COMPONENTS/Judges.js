import React from 'react';
import styles from '../CSS-MODULES/Judges.module.css';

const Judges = () => {
  const judgeSeats = [
    { id: 1, category: "Industry Veteran" },
    { id: 2, category: "Creative Director" },
    { id: 3, category: "Global Superstar" },
    { id: 4, category: "Vocal Powerhouse" }
  ];

  return (
    <section className={styles.judgeSection} id="judges">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Season 4 Panel</span>
          <h2>The <span className={styles.greenText}>Mystery</span> <span className={styles.goldText}>Judges</span></h2>
          <p>Four industry giants. One stage. The identities remain top secret!</p>
        </div>

        <div className={styles.judgeGrid}>
          {judgeSeats.map((seat) => (
            <div key={seat.id} className={styles.judgeCard}>
              <div className={styles.imageWrapper}>
                <div className={styles.mysteryFrame}>
                  <div className={styles.silhouette}>
                    <span className={styles.questionMark}>?</span>
                  </div>
                  <div className={styles.frameGlow}></div>
                </div>
                
                {/* Social Overlay kept from your original code for future use */}
                <div className={styles.socialOverlay}>
                  <a href="/">𝕏</a>
                  <a href="#
                  /">📸</a>
                </div>
              </div>

              <div className={styles.info}>
                <h3 className={styles.revealText}>To Be Revealed</h3>
                <p className={styles.title}>{seat.category}</p>
                <div className={styles.categoryBadge}>Mystery</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Judges;