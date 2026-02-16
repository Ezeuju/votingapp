import React from 'react';
import styles from '../CSS-MODULES/About.module.css';

const About = () => {
  return (
    <>
    <div className={styles.aboutPage}>
      {/* SECTION 1: HERO HEADER */}
      <header className={styles.headerSection}>
        <div className={styles.headerContent}>
          <h1 className={styles.mainTitle}>
            From United States Roots to a <span className={styles.greenText}>Global Stage</span>
          </h1>
          <p className={styles.tagline}>The Evolution of Talent Recovery</p>
        </div>
      </header>

      {/* SECTION 2: THE EVOLUTION (Flexbox Row) */}
      <section className={styles.evolutionSection}>
        <div className={styles.flexRow}>
          <div className={styles.evolutionText}>
            <h2>🎤 About Us</h2>
            <p>
              Born from the legacy of <strong>Akwa Ibom Talent Show</strong>, NAIJA TALENT SHOW Season 4 marks a bold transition—from a regional celebration to the biggest global talent-recovery platform Nigeria has ever seen.
            </p>
            <p>
              What started as a local showcase of raw, authentic skill has now grown into an international movement that scouts, nurtures, and propels undiscovered voices into worldwide stardom.
            </p>
          </div>
          <div className={styles.rewardCard}>
            <h3>Massive Reward</h3>
            <div className={styles.amount}>₦20,000,000.00</div>
            <p>Twenty Million Naira worth of prizes with consideration prizes.</p>
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

      {/* SECTION 4: GLOBAL PRESENCE & OWNERSHIP */}
      <section className={styles.presenceSection}>
        <h2>Global Presence & Ownership</h2>
        <div className={styles.presenceFlex}>
          <div className={styles.presenceBox}>
            <h4>NAIJA TALENT RECOVERY INC USA</h4>
            <p>Registered with the Secretary of State of North Carolina, Raleigh, USA.</p>
          </div>
          <div className={styles.presenceBox}>
            <h4>NAIJA TALENT SHOW LIMITED</h4>
            <p>Registered with Corporate Affairs Commission, Abuja, Nigeria (Trademarked Dec 2024).</p>
          </div>
        </div>
        <div className={styles.ownerInfo}>
          <p>Both companies are proudly owned by <strong>Bishop Dr. Daniel Jack</strong>, a visionary leader passionate about talent development.</p>
        </div>
      </section>

      {/* SECTION 5: GOALS & BENEFITS (Flexbox List) */}
      <section className={styles.goalsSection}>
        <div className={styles.flexRow}>
          <div className={styles.goalsBox}>
            <h3>Our Goals</h3>
            <ul>
              <li>Discover and nurture exceptional talents globally.</li>
              <li>Provide a platform for artists to showcase skills.</li>
              <li>Foster cultural exchange between Nigeria and the world.</li>
              <li>Create economic opportunities for talented individuals.</li>
            </ul>
          </div>
          <div className={styles.benefitsBox}>
            <h3>Program Benefits</h3>
            <ul>
              <li>Expert mentorship and training</li>
              <li>Global exposure and networking</li>
              <li>Career guidance and support</li>
              <li>Access to international platforms</li>
            </ul>
          </div>
        </div>
      </section>

      {/* CALL TO ACTION */}
      <footer className={styles.ctaFooter}>
        <h2>Join the Global Talent Movement</h2>
        <p>Whether you're an aspiring artist or industry pro, be part of NAIJA TALENT SHOW. Let's unlock global opportunities together!</p>
        <button className={styles.applyBtn}>Become a Global Star</button>
      </footer>
    </div>
    </>
  );
};

export default About;