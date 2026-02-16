import React, { useState } from 'react';
import styles from '../CSS-MODULES/Navbar.module.css';
import talentlogo from "../assets/talentlogo.jpeg"; // Ensure you have this image in your assets folder

const Navbar = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <div className={styles.navContainer}>
        {/* Logo */}
        <a href='/home'> <div className={styles.logoBox}>
         <img src={talentlogo} alt="Naija Talent Show" className={styles.logo} />
        </div>
        </a>

        {/* Hamburger Icon for Mobile */}
        <div className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)}>
          <span className={menuOpen ? styles.barOpen : ''}></span>
          <span className={menuOpen ? styles.barOpen : ''}></span>
          <span className={menuOpen ? styles.barOpen : ''}></span>
        </div>

        {/* Navigation Links & Buttons */}
        <div className={`${styles.navContent} ${menuOpen ? styles.showMenu : ''}`}>
          <ul className={styles.navLinks}>
            <li><a href="/" onClick={() => setMenuOpen(false)}>Home</a></li>
            <li><a href="#feed" onClick={() => setMenuOpen(false)}>Timeline</a></li>
            <li><a href="/auditiony" onClick={() => setMenuOpen(false)}>Auditions</a></li>
            <li><a href="/contestants" onClick={() => setMenuOpen(false)}>Contestants</a></li>
            <li><a href="/tickets" onClick={() => setMenuOpen(false)}>Tickets</a></li>
            <li><a href="/sponsor" className={styles.goldLink} onClick={() => setMenuOpen(false)}>Become a Partner</a></li>
          </ul>

          <div className={styles.authBox}>
            <button className={styles.signInBtn}>Sign In</button>
            <button className={styles.joinBtn}>Join as Talent</button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;