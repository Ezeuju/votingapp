import React from 'react';
import styles from '../CSS-MODULES/TwitchStream.module.css';

const TwitchStream = () => {

  const channelName = "naijatalentshow"; 
  
  const websiteDomain = window.location.hostname;

  return (
    <section className={styles.streamSection}>
      <div className={styles.container}>
        <header className={styles.streamHeader}>
          <div className={styles.liveIndicator}>
            <span className={styles.dot}></span> LIVE STREAM
          </div>
          <h2>Experience the <span className={styles.goldText}>Magic Live</span></h2>
          <p>Don't miss a beat. Watch the Naija Talent Show Season 4 broadcast directly from Twitch.</p>
        </header>

        <div className={styles.videoContainer}>
          <div className={styles.responsivePlayer}>
            <iframe
              src={`https://player.twitch.tv/?channel=${channelName}&parent=${websiteDomain}&autoplay=false&muted=false`}
              height="100%"
              width="100%"
              allowFullScreen
              title="NTS Official Live Stream"
            ></iframe>
          </div>
        </div>

        <div className={styles.actionArea}>
          <a 
            href={`https://www.twitch.tv/${channelName}`} 
            target="_blank" 
            rel="noopener noreferrer"
            className={styles.twitchLink}
          >
            <span className={styles.twitchIcon}></span> Open in Twitch App
          </a>
        </div>
      </div>
    </section>
  );
};

export default TwitchStream;