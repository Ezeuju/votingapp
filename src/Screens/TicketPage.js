import React from 'react';
import styles from '../CSS-MODULES/Tickety.module.css';
import Navbar from  "../COMPONENTS/Navbar";
import Footer from "../COMPONENTS/Footer";

const Tickets = () => {
  const ticketTiers = [
    {
      name: "Standard Access",
      price: "₦25,000",
      type: "regular",
      benefits: [
        "Live Show Entry",
        "10 Voting Points",
        "Standard Seating",
        "Digital Program Guide"
      ],
      buttonText: "Purchase Ticket"
    },
    {
      name: "VIP Experience",
      price: "₦100,000",
      type: "vip",
      badge: "Most Requested",
      benefits: [
        "Premium Front-Row Seating",
        "50 Voting Points",
        "VIP Lounge Access",
        "Refreshments & Hors d'oeuvres",
        "Meet & Greet with Judges"
      ],
      buttonText: "Get VIP Access"
    },
    {
      name: "VVIP Table (8 Guests)",
      price: "₦1,500,000",
      type: "vvip",
      benefits: [
        "Private Table Service",
        "500 Voting Points",
        "Red Carpet Photo-Op",
        "Luxury Gift Hampers",
        "Branding Opportunity for Sponsors"
      ],
      buttonText: "Inquire for Table"
    }
  ];

  return (
    <>
    <Navbar />
    <section className={styles.ticketSection} id="tickets">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Experience the Magic Live</span>
          <h2>Get Your <span className={styles.greenText}>Show Tickets</span></h2>
          <p>
            Secure your seat at the most anticipated event of the year. 
            From standard entry to VVIP red-carpet treatment.
          </p>
        </div>

        <div className={styles.ticketContainer}>
          {ticketTiers.map((tier, index) => (
            <div 
              key={index} 
              className={`${styles.ticketCard} ${tier.type === 'vip' ? styles.vipCard : ''}`}
            >
              {tier.badge && <div className={styles.popularBadge}>{tier.badge}</div>}
              
              <div className={styles.tierInfo}>
                <h3 className={styles.tierName}>{tier.name}</h3>
                <div className={styles.price}>{tier.price}</div>
              </div>

              <ul className={styles.benefitsList}>
                {tier.benefits.map((benefit, i) => (
                  <li key={i}>✓ {benefit}</li>
                ))}
              </ul>

              <button className={tier.type === 'vip' ? styles.buyBtnGold : styles.buyBtn}>
                {tier.buttonText}
              </button>
            </div>
          ))}
        </div>

        <div className={styles.footerNote}>
          <p>Tickets are non-refundable. For corporate bookings and bulk tickets, contact our USA or Nigeria support teams.</p>
        </div>
      </div>
    </section>
    <Footer />
    </>
  );
};

export default Tickets;