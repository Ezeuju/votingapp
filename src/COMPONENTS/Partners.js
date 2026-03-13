import React from 'react';
import styles from '../CSS-MODULES/Partners.module.css';
import sponsor1 from "../assets/sponsor1.png"
import sponsor2 from "../assets/sponsor2.png" 
import sponsor3 from "../assets/sponsor3.png"
import sponsor5 from "../assets/sponsor5.png"

const Partners = () => {
  const logos = [
    { id: 1, name: "NTS Limited", url: sponsor1 },
    { id: 2, name: "NTR Inc USA", url: sponsor2 },
    { id: 3, name: "Brand 3", url: sponsor3 },
    { id: 4, name: "Brand 4", url: sponsor5 }
  ];

  return (
    <section className={styles.partnersSection} id="partner">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Global Reach, Local Touch</span>
          <h2>Our Proud <span className={styles.greenText}>Partners & Sponsors</span></h2>
        </div>

        <div className={styles.marqueeWrapper}>
          <div className={styles.marqueeContent}>
            {/* We map twice to create a seamless infinite loop */}
            {[...logos, ...logos].map((logo, index) => (
              <div key={index} className={styles.logoBox}>
                <img src={logo.url} alt={logo.name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;