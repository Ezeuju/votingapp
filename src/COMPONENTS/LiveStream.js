import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../CSS-MODULES/LiveNotice.module.css';

const LiveStream = ({ isLive = true }) => {
  const navigate = useNavigate();

  if (!isLive) return null;

  return (
    <div className={styles.noticeBar} onClick={() => navigate('/live')}>
      <div className={styles.container}>
        <div className={styles.content}>
          <span className={styles.pulseDot}></span>
          <p><strong>HAPPENING NOW:</strong> NTS Season 4 Auditions are Live on Twitch!</p>
        </div>
        <button className={styles.watchBtn}>WATCH LIVE ❯</button>
      </div>
    </div>
  );
};

export default LiveStream;