import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import styles from '../CSS-MODULES/PaymentResult.module.css';

const PaymentResult = () => {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Logic: Check if the payment was successful via state or URL query
  const isSuccess = location.state?.status === 'success' || true; // Set to true for preview

  return (
    <div className={styles.resultPage}>
      <div className={styles.container}>
        <div className={`${styles.card} ${isSuccess ? styles.successBorder : styles.failBorder}`}>
          
          {isSuccess ? (
            /* --- SUCCESS VIEW --- */
            <div className={styles.content}>
              <div className={styles.iconCircleSuccess}>✓</div>
              <h1 className={styles.successText}>Payment Successful!</h1>
              <p>Thank you for your payment. Your transaction was processed successfully.</p>
              
              <div className={styles.detailsBox}>
                <div className={styles.row}><span>Transaction ID:</span> <strong>NTS-TXN-88291</strong></div>
                <div className={styles.row}><span>Amount Paid:</span> <strong>₦10,000.00</strong></div>
              </div>

              <div className={styles.nextSteps}>
                <h4>What's Next?</h4>
                <p>Check your email for your receipt and audition details. Our team will contact you shortly.</p>
              </div>

              <button className={styles.btnHome} onClick={() => navigate('/')}>
                Back to Home
              </button>
            </div>
          ) : (
            /* --- FAILURE VIEW --- */
            <div className={styles.content}>
              <div className={styles.iconCircleFail}>✕</div>
              <h1 className={styles.failText}>Payment Failed</h1>
              <p>We're sorry, but your transaction could not be processed at this time.</p>
              
              <div className={styles.errorBox}>
                <p><strong>Reason:</strong> Insufficient funds or bank downtime. Please try again or use a different card.</p>
              </div>

              <div className={styles.btnGroup}>
                <button className={styles.btnRetry} onClick={() => navigate('/registration')}>
                  Retry Payment
                </button>
                <button className={styles.btnSupport} onClick={() => navigate('/contact')}>
                  Contact Support
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PaymentResult;