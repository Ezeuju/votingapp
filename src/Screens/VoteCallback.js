import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import styles from '../CSS-MODULES/Contestantprofile.module.css';
import Navbar from '../COMPONENTS/Navbar';
import Footer from '../COMPONENTS/Footer';
import { paymentApi } from '../services/paymentApi';

const VoteCallback = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [loading, setLoading] = useState(true);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const verifyPayment = useCallback(async () => {
    const reference = searchParams.get('reference');

    if (!reference) {
      setError('No payment reference found');
      setLoading(false);
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await paymentApi.vote.verify(reference);
      const data = response.data || response;
      setResult(data);
    } catch (err) {
      setError(err.response?.data?.message || err.message || 'Payment verification failed');
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    verifyPayment();
  }, [verifyPayment]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', background: '#000e05', padding: '40px 20px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: 32, marginBottom: 16 }}>⏳</div>
            <div style={{ color: '#FFD700', fontSize: 16, fontWeight: 600 }}>Verifying payment...</div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const isSuccess = result?.payment_status === 'success' || result?.status === 'success';
  const votesAdded = result?.votes_added || 0;
  const contestantId = result?.contestant_id || result?.user_id;

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#000e05', padding: '40px 20px' }}>
        <div style={{ maxWidth: 700, margin: '0 auto' }}>
          <div className={styles.successBox}>
            <div className={styles.successIcon}>
              {isSuccess ? '✓' : '✗'}
            </div>
            <div className={styles.successTitle}>
              {isSuccess ? 'Payment Successful!' : 'Payment Failed'}
            </div>
            <div className={styles.successMsg}>
              {isSuccess ? (
                <>
                  Your <strong style={{ color: '#FFD700' }}>{votesAdded} vote{votesAdded > 1 ? 's' : ''}</strong> have been added successfully!<br />
                  Thank you for supporting your favourite contestant!
                </>
              ) : (
                <>
                  {error || 'Unable to process your payment. Please try again.'}
                </>
              )}
            </div>
            <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
              {isSuccess ? (
                <>
                  <button
                    className={styles.backBtn}
                    onClick={() => navigate('/contestants')}
                    style={{ marginBottom: 0 }}
                    type="button"
                  >
                    ← Back to Contestants
                  </button>
                </>
              ) : (
                <>
                  <button
                    className={styles.paystackBtn}
                    style={{ width: 'auto', padding: '12px 24px' }}
                    onClick={verifyPayment}
                    type="button"
                  >
                    🔄 Try Again
                  </button>
                  <button
                    className={styles.backBtn}
                    onClick={() => navigate('/contestants')}
                    style={{ marginBottom: 0 }}
                    type="button"
                  >
                    ← Back to Contestants
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default VoteCallback;
