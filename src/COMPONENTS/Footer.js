import React from 'react';
import styles from '../CSS-MODULES/Footer.module.css';
import talentlogo from "../assets/talentlogo.jpeg"
import { FaInstagram, FaTwitter, FaFacebook, FaTiktok, FaTwitch, FaYoutube } from 'react-icons/fa';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerGrid}>
          
          {/* Brand & Mission */}
          <div className={styles.brandSection}>
            <img src={talentlogo} alt="Naija Talent Show" className={styles.footerLogo} />
            <p className={styles.mission}>
              Nigeria’s biggest global talent platform discovering and launching extraordinary 
              talents onto the world stage.
            </p>
            <div className={styles.socialIcons}>
              {/* Updated with your specific URLs */}
              <a href="https://www.instagram.com/naijatalentshows" target="_blank" rel="noopener noreferrer" title="Instagram">
                <FaInstagram />
              </a>
              <a href="https://x.com/naijat_show" target="_blank" rel="noopener noreferrer" title="X (Twitter)">
                <FaTwitter />
              </a>
              <a href="https://web.facebook.com/profile.php?id=61554695642366" target="_blank" rel="noopener noreferrer" title="Facebook">
                <FaFacebook />
              </a>
              <a href="https://www.tiktok.com/@naijatalentshow" target="_blank" rel="noopener noreferrer" title="TikTok">
                <FaTiktok />
              </a>
              <a href="https://www.youtube.com/@naijatalentshow" target="_blank" rel="noopener noreferrer" title="YouTube">
                <FaYoutube />
              </a>
              <a href="https://www.twitch.tv/naijatalentshow" target="_blank" rel="noopener noreferrer" title="Twitch">
                <FaTwitch />
              </a>
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
              <li><a href="/sponsor">Become a Sponsor</a></li>
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
            <p className={styles.office}>Opposite Apo ShopRite Mall/AYM Shafa Filling Station FCT, Abuja, Nigeria</p>
          </div>
        </div>

        <div className={styles.bottomBar}>
          <p>&copy; {currentYear} NAIJA TALENT SHOW LIMITED & NAIJA TALENT RECOVERY INC USA.</p>
          <p className={styles.producer}>Developed by Identifymore</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;