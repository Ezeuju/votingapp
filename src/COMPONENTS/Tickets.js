import React from 'react';
import styles from '../CSS-MODULES/Tickety.module.css';


const Tickets = () => {
  const ticketTiers = [
    {
      name: "Event Entry",
      price: "₦2,000",
      type: "regular",
      benefits: ["Live Show Entry", "Standard Seating", "General Access"],
      buttonText: "Purchase Ticket"
    },
    {
      name: "Standard Entry",
      price: "₦5,000",
      type: "regular",
      benefits: ["Priority Entry", "Improved Seating", "Digital Program"],
      buttonText: "Purchase Ticket"
    },
    {
      name: "Couple Regular",
      price: "₦5,000",
      type: "regular",
      badge: "Best Value",
      benefits: ["Entry for Two", "Side-by-Side Seating", "Event Access"],
      buttonText: "Get Couple Pass"
    },
    {
      name: "Single Silver Pass",
      price: "₦5,000",
      type: "silver",
      benefits: ["Silver Row Seating", "Souvenir Tag", "Fast-track Entry"],
      buttonText: "Get Silver Pass"
    },
    {
      name: "Gold Audition Pass",
      price: "₦10,000",
      type: "gold",
      benefits: ["Audition Entry", "Performance Slot", "Mentor Feedback"],
      buttonText: "Get Gold Pass"
    },
    {
      name: "VIP Audition Pass",
      price: "₦10,000",
      type: "vip",
      badge: "Most Popular",
      benefits: ["Priority Audition", "VIP Lounge Access", "Judge Meet & Greet"],
      buttonText: "Get VIP Pass"
    },
    {
      name: "VIP with Security",
      price: "₦50,000",
      type: "vvip",
      benefits: ["Premium VVIP Seating", "Dedicated Security Detail", "Backstage Access", "Refreshments"],
      buttonText: "Secure VVIP Access"
    }
  ];

  return (
    <>
  
    <section className={styles.ticketSection} id="tickets">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Naija to the World 2026</span>
          <h2>Secure Your <span className={styles.greenText}>Event Tickets</span></h2>
          <p>
            Join the movement. Choose the experience that fits your style, 
            from standard entry to premium VIP protection.
          </p>
        </div>

        <div className={styles.ticketContainer}>
          {ticketTiers.map((tier, index) => (
            <div 
              key={index} 
              className={`${styles.ticketCard} ${tier.type === 'vip' ? styles.vipCard : ''} ${tier.type === 'vvip' ? styles.vvipCard : ''}`}
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

              <a href="/ticketform" target="_blank" rel="noopener noreferrer">
                <button className={
                  tier.type === 'vip' || tier.type === 'vvip' || tier.type === 'gold' 
                  ? styles.buyBtnGold 
                  : styles.buyBtn
                }>
                  {tier.buttonText}
                </button>
              </a>
            </div>
          ))}
        </div>

        <div className={styles.footerNote}>
          <p>Tickets are non-refundable. For corporate bookings and bulk tickets, contact our USA or Nigeria support teams.</p>
        </div>
      </div>
    </section>
 
    </>
  );
};

export default Tickets;