import React from 'react';
import styles from '../CSS-MODULES/Sponsors.module.css';
import Navbar from '../COMPONENTS/Navbar';
import Footer from '../COMPONENTS/Footer';

const Sponsors = () => {
  const tiers = [
    { name: "Bronze Partner", price: "Entry Level", benefits: ["Logo placement", "Event passes", "Social mentions"] },
    { name: "Silver Sponsor", price: "Mid Tier", benefits: ["VIP booth", "Media shout-outs", "Co-branded merchandise"] },
    { name: "Gold Sponsor", price: "Top Tier", benefits: ["Full brand integration", "Branding zones", "Speaking opportunities"] },
    { name: "Platinum Partner", price: "Elite Level", benefits: ["Naming rights", "Press coverage", "National promotion"] }
  ];

  return (
    <>
    <Navbar />
    <div className={styles.sponsorWrapper}>
      {/* HERO SECTION */}
      <header className={styles.hero}>
        <div className={styles.container}>
          <span className={styles.eyebrow}> 🤝   Partner With Us</span>
          <h1>Naija Talent Show <span className={styles.greenText}>2025</span></h1>
          <p>A nationwide movement that uplifts, inspires, and connects. Join us as a visionary brand and make a real impact on a global stage.</p>
          <div className={styles.heroBtns}>
            <a href="#apply" className={styles.primaryBtn}>Apply to Sponsor</a>
            <a href="#contact" className={styles.secondaryBtn}>Contact Us</a>
          </div>
        </div>
      </header>

      {/* WHY SPONSOR SECTION */}
      
      <section className={styles.benefitsSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🎯 Why Sponsor Us?</h2>
          <div className={styles.benefitsGrid}>
            <div className={styles.benefitCard}>
              <h4>Massive Exposure</h4>
              <p>Showcase your brand to thousands live and millions online.</p>
            </div>
            <div className={styles.benefitCard}>
              <h4>Targeted Visibility</h4>
              <p>Reach Nigeria's vibrant youth and creative economy.</p>
            </div>
            <div className={styles.benefitCard}>
              <h4>Brand Alignment</h4>
              <p>Connect with innovation, empowerment, and development.</p>
            </div>
            <div className={styles.benefitCard}>
              <h4>Flexible Packages</h4>
              <p>Bronze to Platinum tiers designed to fit your brand goals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* TIER TABLE */}
      <section className={styles.tierSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🧩 Sponsorship Opportunities</h2>
          <div className={styles.tableResponsive}>
            <table className={styles.tierTable}>
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Includes</th>
                </tr>
              </thead>
              <tbody>
                {tiers.map((tier, index) => (
                  <tr key={index}>
                    <td><strong>{tier.name}</strong></td>
                    <td>{tier.benefits.join(" • ")}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section className={styles.formSection} id="apply">
        <div className={styles.container}>
          <div className={styles.formCard}>
            <h2>📥 Become a Sponsor – Apply Now</h2>
            <form className={styles.sponsorForm}>
              <div className={styles.formGrid}>
                <div className={styles.field}><label>Organization Name</label><input type="text" required /></div>
                <div className={styles.field}><label>Contact Person</label><input type="text" required /></div>
                <div className={styles.field}><label>Email Address</label><input type="email" required /></div>
                <div className={styles.field}><label>Phone Number</label><input type="tel" required /></div>
              </div>
              <div className={styles.field}>
                <label>Sponsorship Tier Interested In</label>
                <select>
                  <option>Bronze</option>
                  <option>Silver</option>
                  <option>Gold</option>
                  <option>Platinum</option>
                </select>
              </div>
              <div className={styles.field}><label>Company Website / Social Media Link</label><input type="url" /></div>
              <div className={styles.field}><label>Brief Message / Partnership Goal</label><textarea rows="4"></textarea></div>
              <button type="submit" className={styles.submitBtn}>Submit Application</button>
            </form>
          </div>
        </div>
      </section>

 
    </div>
    <Footer />
    </>
  );
};

export default Sponsors;