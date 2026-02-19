import React from 'react';
import styles from '../CSS-MODULES/Footer.module.css';
import { FaInstagram, FaTwitter, FaFacebook, FaTiktok } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          
          {/* Brand & Mission */}
          <div className={styles.brandSection}>
            <img src="/talentlogo.jpeg" alt="Naija Talent Show" className={styles.footerLogo} />
            <p className={styles.mission}>
              Nigeria’s biggest global talent platform discovering and launching extraordinary 
              talents onto the world stage.
            </p>
            <div className={styles.socialIcons}>
              <a href="/"><FaInstagram /></a>
              <a href="/"><FaTwitter /></a>
              <a href="/"><FaFacebook /></a>
              <a href="/"><FaTiktok /></a>
            </div>
          </div>

          {/* Quick Links */}
          <div className={styles.linkSection}>
            <h4>Quick Links</h4>
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/contestants">Contestants</a></li>
              <li><a href="/auditiony">Audition Roadmap</a></li>
              <li><a href="/tickets">Buy Tickets</a></li>
              <li><a href="/sponsors">Become a Partner</a></li>
              <li><a href="/mentors">Mentors</a></li>
            </ul>
          </div>

          {/* Contact & Support */}
          <div className={styles.linkSection}>
            <h4>Support</h4>
            <ul>
              <li><a href="/send">Contact Support</a></li>
              <li><a href="/rules">Rules & Regulations</a></li>
              <li><a href="/donate">Donate</a></li>
              <li><a href="/join">Join our Team</a></li>
              <li><a href="/gallery">Gallery</a></li>
              <li><a href="/faq">FAQ</a></li>
              <li><a href="/privacy">Privacy Policy</a></li>
            </ul>
          </div>

          {/* Global Presence */}
          <div className={styles.presenceSection}>
            <h4>Global Presence</h4>
            <p><strong>NTR INC USA:</strong> North Carolina, Raleigh, USA</p>
            <p><strong>NTS LTD:</strong> CAC Registered, Abuja, Nigeria</p>
            <p className={styles.office}>Uyo Office: No 19A Utang Street, Uyo</p>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>&copy; {currentYear} NAIJA TALENT SHOW LIMITED & NAIJA TALENT RECOVERY INC USA.</p>
          <p className={styles.producer}>Executive Producer: Bishop Dr. Daniel Jack</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;