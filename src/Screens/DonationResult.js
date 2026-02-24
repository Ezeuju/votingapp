import React, { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import styles from '../CSS-MODULES/DonationResult.module.css';
import { paymentApi } from '../services/paymentApi';

/* ── Inline SVG checkmark (same style as screenshot) ── */
const CheckIcon = () => (
  <svg viewBox="0 0 52 52">
    <circle cx="26" cy="26" r="25" />
    <path d="M14.1 27.2l7.1 7.2 16.7-16.8" />
  </svg>
);

/* ── Inline SVG X mark ── */
const XIcon = () => (
  <svg viewBox="0 0 52 52">
    <line x1="16" y1="16" x2="36" y2="36" />
    <line x1="36" y1="16" x2="16" y2="36" />
  </svg>
);

const DonationResult = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [status, setStatus] = useState(null);
  const [reference, setReference] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const ref = searchParams.get('ref') || searchParams.get('reference') || '';
    setReference(ref);

    const verify = async () => {
      if (!ref) {
        setStatus('failed');
        setLoading(false);
        return;
      }
      try {
        const response = await paymentApi.donations.verify(ref);
        const payStatus =
          response?.data?.data?.status ||
          response?.data?.status ||
          response?.status;
        setStatus(payStatus === 'success' ? 'success' : 'failed');
      } catch {
        setStatus('failed');
      } finally {
        setLoading(false);
      }
    };

    verify();
  }, [searchParams]);

  /* ── Verifying splash ── */
  if (loading) {
    return (
      <div className={styles.splash}>
        <div className={styles.splashInner}>
          <div style={{ fontSize: '52px', marginBottom: '20px' }}>⏳</div>
          <h2>Verifying your donation…</h2>
        </div>
      </div>
    );
  }

  const isSuccess = status === 'success';

  return (
    <div className={styles.page}>
      <div className={styles.card}>

        {isSuccess ? (
          /* ── SUCCESS ── */
          <>
            <div className={`${styles.iconWrap} ${styles.iconWrapSuccess}`}>
              <CheckIcon />
            </div>

            <h1 className={styles.title}>Donation Successful!</h1>
            <p className={styles.subtitle}>
              Thank you for your generous support. Your contribution helps us
              discover and empower Nigeria's next generation of superstars. 🎤
            </p>

            <button className={styles.btnPrimary} onClick={() => navigate('/')}>
              Go to Homepage
            </button>
            <button className={styles.btnSecondary} onClick={() => navigate('/donate')}>
              Donate Again
            </button>
          </>
        ) : (
          /* ── FAILURE ── */
          <>
            <div className={`${styles.iconWrap} ${styles.iconWrapFail}`}>
              <XIcon />
            </div>

            <h1 className={styles.title}>Donation Failed</h1>
            <p className={styles.subtitle}>
              We couldn't process your donation at this time. This may be due to
              insufficient funds or a temporary issue with your bank. Please try again.
            </p>

            <button className={styles.btnPrimary} onClick={() => navigate('/donate')}>
              Try Again
            </button>
            <button className={styles.btnSecondary} onClick={() => navigate('/contact')}>
              Contact Support
            </button>
          </>
        )}

      </div>
    </div>
  );
};

export default DonationResult;
