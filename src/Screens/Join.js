import React, { useState } from 'react';
import styles from '../CSS-MODULES/Join.module.css';
import Navbar from '../COMPONENTS/Navbar';
import Footer from '../COMPONENTS/Footer';

const Join = () => {
  const [formData, setFormData] = useState({
    role: 'Volunteer',
  });

  const roles = [
    "Event Coordinator",
    "Social Media Manager",
    "Technical Crew (Sound/Light)",
    "Contestant Manager",
    "Security & Logistics",
    "Media & Content Creator",
    "Volunteer"
  ];

  return (
    <>
    <Navbar />
    <div className={styles.joinPage}>
      {/* HERO SECTION */}
      <header className={styles.hero}>
        <div className={styles.container}>
          <span className={styles.badge}>Career & Volunteer Opportunities</span>
          <h1>Build the Future of <span className={styles.greenText}>Entertainment</span></h1>
          <p>Join a global team dedicated to discovering and empowering Nigeria's next generation of superstars.</p>
        </div>
      </header>

      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.flexLayout}>
            
            {/* WHY JOIN INFO */}
            <div className={styles.infoColumn}>
              <h2>Why Join the NTS Team?</h2>
              <p>Be part of a cross-continental movement bridging Nigeria and the USA.</p>
              
              <div className={styles.perks}>
                <div className={styles.perkItem}>
                  <h4>Global Networking</h4>
                  <p>Work alongside industry veterans from NTR Inc USA and NTS Ltd Nigeria.</p>
                </div>
                <div className={styles.perkItem}>
                  <h4>Skill Development</h4>
                  <p>Gain hands-on experience in large-scale event production and media management.</p>
                </div>
                <div className={styles.perkItem}>
                  <h4>Social Impact</h4>
                  <p>Directly contribute to a platform that changes lives and restores hope through talent.</p>
                </div>
              </div>
            </div>

            {/* APPLICATION FORM */}
            <div className={styles.formColumn}>
              <div className={styles.formCard}>
                <h3>Apply to Join</h3>
                <form className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label>Full Name</label>
                    <input type="text" placeholder="Your Name" required />
                  </div>

                  <div className={styles.row}>
                    <div className={styles.inputGroup}>
                      <label>Email Address</label>
                      <input type="email" placeholder="email@example.com" required />
                    </div>
                    <div className={styles.inputGroup}>
                      <label>Phone Number</label>
                      <input type="tel" placeholder="+234..." required />
                    </div>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Position Interested In</label>
                    <select value={formData.role} onChange={(e) => setFormData({...formData, role: e.target.value})}>
                      {roles.map(role => (
                        <option key={role} value={role}>{role}</option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Briefly describe your experience</label>
                    <textarea rows="4" placeholder="How can you add value to the NTS team?"></textarea>
                  </div>

                  <div className={styles.inputGroup}>
                    <label>Upload CV / Portfolio (Link)</label>
                    <input type="url" placeholder="Google Drive or LinkedIn Link" />
                  </div>

                  <button type="submit" className={styles.submitBtn}>Submit Application</button>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default Join;