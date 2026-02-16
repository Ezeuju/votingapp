import React from 'react';
import styles from '../CSS-MODULES/Partners.module.css';

const Partners = () => {
  // Replace these with actual partner/sponsor logos
  const logos = [
    { id: 1, name: "NTS Limited", src: "/talentlogo.jpeg" },
    { id: 2, name: "NTR Inc USA", src: "/path-to-usa-logo.png" },
    { id: 3, name: "Brand 3", src: "https://via.placeholder.com/150x80?text=Sponsor+1" },
    { id: 4, name: "Brand 4", src: "https://via.placeholder.com/150x80?text=Sponsor+2" },
    { id: 5, name: "Brand 5", src: "https://via.placeholder.com/150x80?text=Sponsor+3" },
    { id: 6, name: "Brand 6", src: "https://via.placeholder.com/150x80?text=Sponsor+4" },
  ];

  return (
    <section className={styles.partnersSection} id="partner">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Global Reach, Local Touch</span>
          <h2>Our Proud <span className={styles.greenText}>Partners & Sponsors</span></h2>
          <p>Partnering with big businesses, entrepreneurs, and NGOs to empower youth skill development.</p>
        </div>

        <div className={styles.marqueeWrapper}>
          <div className={styles.marqueeContent}>
            {/* First set of logos */}
            {logos.map((logo) => (
              <div key={`logo-1-${logo.id}`} className={styles.logoBox}>
                <img src={logo.src} alt={logo.name} title={logo.name} />
              </div>
            ))}
            {/* Second identical set for infinite loop effect */}
            {logos.map((logo) => (
              <div key={`logo-2-${logo.id}`} className={styles.logoBox}>
                <img src={logo.src} alt={logo.name} title={logo.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;