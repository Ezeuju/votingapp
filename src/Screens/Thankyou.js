import React from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../CSS-MODULES/Thankyou.module.css';

const ThankYou = () => {
  const navigate = useNavigate();

  return (
    <div className={styles.thankYouPage}>
      <div className={styles.container}>
        <div className={styles.thankYouCard}>
          {/* SUCCESS ICON */}
          <div className={styles.iconCircle}>
            <span className={styles.checkMark}>✓</span>
          </div>

          <h1 className={styles.title}>Thank You!</h1>
          <p className={styles.subTitle}>Your purchase was successful.</p>
          
          <div className={styles.divider}></div>

          <div className={styles.messageBox}>
            <p>
              We’ve sent a confirmation email with your receipt and order details. 
              If you purchased an audition pass, your **Audition ID** is now active in your dashboard.
            </p>
          </div>

          {/* ACTION BUTTONS */}
          <div className={styles.buttonGroup}>
            <button 
              className={styles.homeBtn} 
              onClick={() => navigate('/')}
            >
              Back to Home
            </button>
            <button 
              className={styles.dashboardBtn} 
              onClick={() => navigate('/dashboard')}
            >
              Go to Dashboard
            </button>
          </div>

          <p className={styles.supportText}>
            Need help? Contact us at <span className={styles.greenText}>info@naijatalentshow.com</span>
          </p>
        </div>
      </div>
      
      {/* DECORATIVE ELEMENTS */}
      <div className={styles.goldBlob}></div>
      <div className={styles.greenBlob}></div>
    </div>
  );
};

export default ThankYou;