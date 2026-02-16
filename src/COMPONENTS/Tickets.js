import React from 'react';
import styles from '../CSS-MODULES/Tickets.module.css';

const Tickets = () => {
  return (
    <section className={styles.ticketSection} id="ticket">
      <div className={styles.header}>
        <span className={styles.eyebrow}>Experience the Magic Live</span>
        <h2>Get Your Show Tickets</h2>
        <p>Secure your seat at the most anticipated event of the year. From standard entry to VVIP red-carpet treatment.</p>
      </div>

      <div className={styles.ticketContainer}>
        {/* Tier 1: Standard */}
        <div className={styles.ticketCard}>
          <div className={styles.tierName}>Standard Access</div>
          <div className={styles.price}>₦25,000</div>
          <ul className={styles.benefits}>
            <li>✓ Live Show Entry</li>
            <li>✓ 10 Voting Points</li>
            <li>✓ Standard Seating</li>
            <li>✓ Digital Program Guide</li>
          </ul>
          <button className={styles.buyBtn}>Purchase Ticket</button>
        </div>

        {/* Tier 2: VIP - Featured */}
        <div className={`${styles.ticketCard} ${styles.vip}`}>
          <div className={styles.popularBadge}>Most Requested</div>
          <div className={styles.tierName}>VIP Experience</div>
          <div className={styles.price}>₦100,000</div>
          <ul className={styles.benefits}>
            <li>✓ Premium Front-Row Seating</li>
            <li>✓ 50 Voting Points</li>
            <li>✓ VIP Lounge Access</li>
            <li>✓ Refreshments & Hors d'oeuvres</li>
            <li>✓ Meet & Greet with Judges</li>
          </ul>
          <button className={styles.buyBtnGold}>Get VIP Access</button>
        </div>

        {/* Tier 3: VVIP Table */}
        <div className={styles.ticketCard}>
          <div className={styles.tierName}>VVIP Table (8 Guests)</div>
          <div className={styles.price}>₦1,500,000</div>
          <ul className={styles.benefits}>
            <li>✓ Private Table Service</li>
            <li>✓ 500 Voting Points</li>
            <li>✓ Red Carpet Photo-Op</li>
            <li>✓ Luxury Gift Hampers</li>
            <li>✓ Branding Opportunity for Sponsors</li>
          </ul>
          <button className={styles.buyBtn}>Inquire for Table</button>
        </div>
      </div>
    </section>
  );
};

export default Tickets;