import React from 'react';
import styles from '../CSS-MODULES/About.module.css';
import Navbar from './Navbar';
import Footer from './Footer';

const About = () => {
  return (
    <>
    <Navbar />
    <div className={styles.aboutPage}>

      {/* SECTION 1: HERO HEADER */}
      <header className={styles.headerSection}>
        <div className={styles.headerContent}>
          <h1 className={styles.mainTitle}>
            From Lagos to the <span className={styles.greenText}>World Stage</span>
          </h1>
          <p className={styles.tagline}>
            Naija Talent Show × The Three Biggest Talent Organizations in the USA
          </p>
        </div>
      </header>

      {/* SECTION 2: THE EVOLUTION */}
      <section className={styles.evolutionSection}>
        <div className={styles.flexRow}>
          <div className={styles.evolutionText}>
            <h2>🎤 About Us</h2>
            <p>
              Born from the legacy of <strong>Akwa Ibom Talent Show</strong>, NAIJA TALENT SHOW has
              evolved far beyond a regional celebration. Season 4 marks a historic milestone — a
              sealed collaboration between <strong>Global Mega Show USA Inc.</strong>,{' '}
              <strong>American Mega Star Challenge</strong>, and{' '}
              <strong>African American Talent Recovery Inc.</strong> to create the biggest
              global talent-recovery platform Nigeria has ever seen.
            </p>
            <p>
              This is no longer a Nigerian show. This is no longer an American contest.{' '}
              <strong>This is a world movement.</strong> What started as a local showcase of raw,
              authentic skill has grown into an international platform that scouts, nurtures, and
              propels undiscovered voices onto the world's biggest stage.
            </p>
          </div>
          <div className={styles.rewardCard}>
            <h3>Massive Reward</h3>
            <div className={styles.amount}>₦20,000,000.00</div>
            <p>Twenty Million Naira worth of prizes with consideration prizes.</p>
          </div>
        </div>
      </section>

      {/* SECTION 3: WHAT WE ARE ABOUT */}
      <section className={styles.aboutCards}>
        <div className={styles.cardFlex}>
          <div className={styles.infoCard}>
            <div className={styles.icon}>🌍</div>
            <h3>Global Talent Recovery</h3>
            <p>
              A 3-month journey (Sept–Nov 2026) where experts in production, choreography, and
              media transform raw talent into market-ready artistry — because no gift should be
              left buried by poverty, war, or policy.
            </p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.icon}>⭐</div>
            <h3>From Nobody to Superstar</h3>
            <p>
              We believe every community hides a future icon. Every finalist — not just the Top 3
              — travels, performs, and competes. Because Talent Recovery means no one gets left
              behind.
            </p>
          </div>
          <div className={styles.infoCard}>
            <div className={styles.icon}>🚀</div>
            <h3>Scouting Powerhouse</h3>
            <p>
              With teams in Nigeria and the USA, we identify and empower artists with the
              potential to shine globally — backed by the infrastructure of three of America's
              most powerful talent organizations.
            </p>
          </div>
        </div>
      </section>

      {/* SECTION 4: THE 2027 WORLD TOUR */}
      <section className={styles.presenceSection}>
        <h2>The 2027 American Mega Star World Tour</h2>
        <p>
          Six cities. Five nations. One stage. All Naija Talent Show finalists travel and compete
          across three continents as part of the American Mega Star 2027 World Tour.
        </p>
        <div className={styles.presenceFlex}>
          {[
            { city: 'Bridgetown, Barbados', detail: 'Kensington Oval — Caribbean Kickoff', flag: '🇧🇧' },
            { city: 'Ottawa, Canada', detail: 'National Arts Centre — North American Welcome', flag: '🇨🇦' },
            { city: 'London, UK', detail: 'O2 Arena — European Command Performance (20,000 seats)', flag: '🇬🇧' },
            { city: 'Washington DC, USA', detail: "The Kennedy Center — Grand America's Mega Star Crowned", flag: '🇺🇸' },
            { city: 'Lagos, Nigeria', detail: 'Eko Convention Centre — The Homecoming (12,000 seats)', flag: '🇳🇬' },
            { city: 'Raleigh, NC, USA', detail: 'Global Mega Show HQ — Bootcamp, Media Week & Contracts', flag: '🇺🇸' },
          ].map(({ city, detail, flag }) => (
            <div className={styles.presenceBox} key={city}>
              <h4>{flag} {city}</h4>
              <p>{detail}</p>
            </div>
          ))}
        </div>
      </section>

      {/* SECTION 5: OUR GOALS & BENEFITS */}
      <section className={styles.goalsSection}>
        <div className={styles.flexRow}>
          <div className={styles.goalsBox}>
            <h3>Our Goals</h3>
            <ul>
              <li>Discover and nurture exceptional talent globally.</li>
              <li>Provide a world stage for undiscovered artists to shine.</li>
              <li>Foster cultural exchange between Nigeria and the world.</li>
              <li>Create economic opportunities through structured talent recovery.</li>
              <li>Open doors for talent organizations across every continent by 2030.</li>
            </ul>
          </div>
          <div className={styles.benefitsBox}>
            <h3>What Every Finalist Gets</h3>
            <ul>
              <li>100% Masters Ownership after recoupment</li>
              <li>Mental health support — not just vocal coaching</li>
              <li>90-day Recovery Residency Program</li>
              <li>Financial literacy training</li>
              <li>U.S. O-1 Visa sponsorship (Grand winner)</li>
              <li>Family visa support for immediate family</li>
              <li>$1M Recording & Development Fund (Grand winner)</li>
              <li>Global distribution deal & 2028 headline slot</li>
            </ul>
          </div>
        </div>
      </section>

      {/* SECTION 6: GLOBAL PRESENCE & OWNERSHIP */}
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
          <div className={styles.presenceBox}>
            <h4>GLOBAL MEGA SHOW USA INC.</h4>
            <p>Co-organizer of the American Mega Star 2027 World Tour. Corporate HQ: Raleigh, NC.</p>
          </div>
        </div>
        <div className={styles.ownerInfo}>
          <p>
            Both Naija companies are proudly owned by <strong>Bishop Dr. Daniel Jack</strong>, a
            visionary leader passionate about talent development, who declared:{' '}
            <em>
              "We signed this contract so a girl from Makoko doesn't have to choose between food
              and her dream. We're taking Naija to Mega, and Mega to the world."
            </em>
          </p>
        </div>
      </section>

      {/* SECTION 7: OPEN DOOR POLICY */}
      <section className={styles.openDoorSection}>
        <div className={styles.openDoorInner}>
          <h2>🌐 The Open Door Policy</h2>
          <p>
            The collaboration opens doors for <strong>all Talent Recovery Organizations worldwide</strong> to
            register, partner, and bring their stars to the world's biggest stage. This is not an
            exclusive club — it is an open covenant.
          </p>
          <p>
            Whether you're in <strong>Ghana, Jamaica, South Africa, the Philippines, Brazil</strong>, or
            any nation where gifts are buried — register with us. Gain access to tour slots,
            funding, visa support, and production resources.
          </p>
          <p className={styles.openDoorLink}>
            Register your organization:{' '}
            <a href="http://TalentRecoveryAlliance.org">TalentRecoveryAlliance.org</a>
          </p>
        </div>
      </section>

      {/* FOOTER: CALL TO ACTION */}
      <footer className={styles.ctaFooter}>
        <h2>Join the Global Talent Movement</h2>
        <p>
          Whether you're an aspiring artist or an industry organization be part of NAIJA TALENT
          SHOW. The contract is signed. The tour is booked. The doors are open.
        </p>
        <div className={styles.ctaButtons}>
          <button className={styles.applyBtn}>Become a Global Star</button>
          <a href="http://TalentRecoveryAlliance.org" className={styles.partnerBtn}>
            Partner With Us
          </a>
        </div>
      </footer>

    </div>
    <Footer />
    </>
  );
};

export default About;