import React, { useState } from 'react';
import judge1 from '../assets/judge1.webp';
import styles from '../CSS-MODULES/PublicProfile.module.css';

const PublicProfile = () => {
  const [votes, setVotes] = useState(1600);
  const profileLink = window.location.href;

  const handleCopy = () => {
    navigator.clipboard.writeText(profileLink);
    alert("Profile link copied! Share it with your fans.");
  };

  return (
    <div className={styles.profilePage}>
      {/* 1. BRANDED HERO BANNER */}
      <div className={styles.heroSection}>
        <div className={styles.banner}>
          <div className={styles.profileImageWrapper}>
            <img src= {judge1} alt="Bose Olisa" />
          </div>
        </div>
      </div>

      <div className={styles.container}>
        <div className={styles.mainGrid}>
          
          {/* 2. LEFT COLUMN: IDENTITY & PERFORMANCE */}
          <div className={styles.leftCol}>
            <div className={styles.headerInfo}>
              <h1>Bose Olisa</h1>
              <p className={styles.subText}>Vocalist | Lagos, Nigeria</p>
              
              {/* COPY LINK BAR */}
              <div className={styles.copyContainer}>
                <button className={styles.copyLabel} onClick={handleCopy}>
                  <span className={styles.icon}>📋</span> COPY PROFILE LINK
                </button>
                <div className={styles.linkText}>{profileLink}</div>
              </div>
            </div>

            <div className={styles.videoBox}>
              <h3 className={styles.sectionTitle}>Audition Performance</h3>
              <div className={styles.videoPlayer}>
                <iframe 
                  src="https://www.youtube.com/embed/dQw4w9WgXcQ" 
                  title="Audition" frameBorder="0" allowFullScreen>
                </iframe>
              </div>
            </div>

            <div className={styles.aboutBox}>
              <h3 className={styles.sectionTitle}>About the Star</h3>
              <p>I am a passionate singer dedicated to restoring hope through music. Join me on my journey as I take Naija to the World!</p>
            </div>
          </div>

          {/* 3. RIGHT COLUMN: PRESTIGE VOTING PANEL */}
          <div className={styles.rightCol}>
            <div className={styles.voteCard}>
              <div className={styles.voteHeader}>
                <span className={styles.standingLabel}>CURRENT STANDING</span>
                <h2 className={styles.totalVotes}>{votes.toLocaleString()}</h2>
                <p>Total Votes</p>
              </div>

              <div className={styles.voteActions}>
                <h3>Support Bose Olisa</h3>
                <p className={styles.priceHint}>1 Vote = ₦50</p>
                
                <div className={styles.tierButtons}>
                  <button className={styles.standardBtn}>Buy 10 Votes (₦500)</button>
                  <button className={styles.standardBtn}>Buy 50 Votes (₦2,500)</button>
                  <button className={styles.goldBtn}>Buy 200 Votes (₦10,000)</button>
                </div>
                
                <button className={styles.outlineBtn}>Custom Amount</button>
              </div>

              <div className={styles.secureBadge}>
                🔒 Secure Payment via Paystack
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
};

export default PublicProfile;