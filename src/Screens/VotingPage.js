// src/Screens/VotingPage.jsx
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../CSS-MODULES/Contestantprofile.module.css';
import Navbar from '../COMPONENTS/Navbar';
import Footer from '../COMPONENTS/Footer';
import api from '../services/api';

// ── Vote packages — votes, amount in kobo (Paystack), display label
const PACKAGES = [
  { id: 'p1', votes: 1,  amount: 10000,  label: '₦100',   note: '1 vote'    },
  { id: 'p2', votes: 2,  amount: 20000,  label: '₦200',   note: '2 votes'   },
  { id: 'p3', votes: 5,  amount: 50000,  label: '₦500',   note: '5 votes'   },
  { id: 'p4', votes: 10, amount: 100000, label: '₦1,000', note: '10 votes'  },
];

// ── Replace with your actual Paystack public key
const PAYSTACK_PUBLIC_KEY = 'pk_test_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx';

const VotingPage = () => {
  const navigate = useNavigate();

  const [contestants,        setContestants]        = useState([]);
  const [selectedPackage,    setSelectedPackage]    = useState(null);
  const [selectedContestant, setSelectedContestant] = useState(null);
  const [voterName,          setVoterName]          = useState('');
  const [voterEmail,         setVoterEmail]         = useState('');
  const [loading,            setLoading]            = useState(false);
  const [fetching,           setFetching]           = useState(true);
  const [success,            setSuccess]            = useState(false);
  const [paystackReady,      setPaystackReady]      = useState(false);

  // ── Read ?id=... from URL to pre-select a contestant
  const preselectedId = new URLSearchParams(window.location.search).get('id');

  // ── Load Paystack inline script
  useEffect(() => {
    if (window.PaystackPop) { setPaystackReady(true); return; }
    const script = document.createElement('script');
    script.src = 'https://js.paystack.co/v1/inline.js';
    script.onload = () => setPaystackReady(true);
    document.head.appendChild(script);
  }, []);

  const fetchContestants = useCallback(async () => {
    setFetching(true);
    try {
      const response = await api.get('/users/contestants');
      let data = response.data || response;
      if (Array.isArray(data) && data.length > 0 && data[0].data) data = data[0].data;
      else if (data.data && Array.isArray(data.data)) data = data.data;

      const active = Array.isArray(data)
        ? data.filter(c => c.contestant_status === 'Active')
        : [];

      setContestants(active);

      // Pre-select contestant if ?id= was passed
      if (preselectedId) {
        const match = active.find(c => c._id === preselectedId);
        if (match) setSelectedContestant(match);
      }
    } catch (err) {
      console.error('Failed to fetch contestants:', err);
    } finally {
      setFetching(false);
    }
  }, [preselectedId]);

  useEffect(() => { fetchContestants(); }, [fetchContestants]);

  const canPay = selectedPackage && selectedContestant && voterEmail && voterName && paystackReady;

  const handlePaystack = () => {
    if (!canPay) return;
    setLoading(true);

    const handler = window.PaystackPop.setup({
      key:      PAYSTACK_PUBLIC_KEY,
      email:    voterEmail,
      amount:   selectedPackage.amount,
      currency: 'NGN',
      ref:      `VOTE-${Date.now()}-${Math.random().toString(36).slice(2, 8).toUpperCase()}`,
      metadata: {
        custom_fields: [
          { display_name: 'Voter Name',     variable_name: 'voter_name',      value: voterName },
          { display_name: 'Contestant',     variable_name: 'contestant_name', value: `${selectedContestant.first_name} ${selectedContestant.last_name}` },
          { display_name: 'Contestant ID',  variable_name: 'contestant_id',   value: selectedContestant._id },
          { display_name: 'Votes Purchased',variable_name: 'votes_purchased', value: selectedPackage.votes },
        ],
      },
      onClose: () => setLoading(false),
      callback: async (response) => {
        setLoading(false);
        // Notify your backend about the successful vote payment
        try {
          await api.post('/votes/record', {
            contestant_id: selectedContestant._id,
            votes:         selectedPackage.votes,
            reference:     response.reference,
            voter_name:    voterName,
            voter_email:   voterEmail,
          });
        } catch (err) {
          console.error('Vote record error:', err);
          // Payment succeeded even if recording fails — still show success
        }
        setSuccess(true);
      },
    });

    handler.openIframe();
  };

  // ── Success screen
  if (success) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '100vh', background: '#000e05', padding: '40px 20px' }}>
          <div style={{ maxWidth: 700, margin: '0 auto' }}>
            <div className={styles.successBox}>
              <div className={styles.successIcon}>🎉</div>
              <div className={styles.successTitle}>Votes Submitted!</div>
              <div className={styles.successMsg}>
                You successfully cast{' '}
                <strong style={{ color: '#FFD700' }}>
                  {selectedPackage.votes} vote{selectedPackage.votes > 1 ? 's' : ''}
                </strong>{' '}
                for{' '}
                <strong style={{ color: '#FFD700' }}>
                  {selectedContestant.first_name} {selectedContestant.last_name}
                </strong>.
                <br />Thank you for supporting your favourite contestant!
              </div>
              <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
                <button
                  className={styles.paystackBtn}
                  style={{ width: 'auto', padding: '12px 24px' }}
                  onClick={() => {
                    setSuccess(false);
                    setSelectedPackage(null);
                    setVoterName('');
                    setVoterEmail('');
                  }}
                >
                  🗳️ Vote Again
                </button>
                <button
                  className={styles.backBtn}
                  onClick={() => navigate('/contestants')}
                  style={{ marginBottom: 0 }}
                >
                  ← Back to Contestants
                </button>
              </div>
            </div>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#000e05', padding: '32px 20px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          <button
            className={styles.backBtn}
            onClick={() => navigate('/contestants')}
          >
            ← Back to Contestants
          </button>

          <div className={styles.votingTitle}>🗳️ Cast Your Vote</div>
          <div className={styles.votingSubtitle}>
            Choose a vote package, select your contestant and pay securely via Paystack.
          </div>

          {/* ── Step 1 — Vote Package ── */}
          <div style={{ marginBottom: 28 }}>
            <div className={styles.contestantSelectorTitle}>Step 1 — Choose a Vote Package</div>
            <div className={styles.packagesGrid}>
              {PACKAGES.map(pkg => (
                <div
                  key={pkg.id}
                  className={`${styles.packageCard} ${selectedPackage?.id === pkg.id ? styles.packageCardSelected : ''}`}
                  onClick={() => setSelectedPackage(pkg)}
                >
                  <div className={styles.packageVotes}>{pkg.votes}</div>
                  <div className={styles.packageVotesLabel}>
                    Vote{pkg.votes > 1 ? 's' : ''}
                  </div>
                  <div className={styles.packagePrice}>{pkg.label}</div>
                  <div className={styles.packagePriceNote}>₦100 per vote</div>
                </div>
              ))}
            </div>
          </div>

          {/* ── Step 2 — Choose Contestant ── */}
          <div className={styles.contestantSelector}>
            <div className={styles.contestantSelectorTitle}>
              Step 2 — Who are you voting for?
            </div>
            {fetching ? (
              <div style={{ color: '#FFD700', fontSize: 13, padding: '10px 0' }}>
                Loading contestants...
              </div>
            ) : (
              <div className={styles.contestantOptions}>
                {contestants.map(c => (
                  <div
                    key={c._id}
                    className={`${styles.contestantOption} ${selectedContestant?._id === c._id ? styles.contestantOptionSelected : ''}`}
                    onClick={() => setSelectedContestant(c)}
                  >
                    <div className={styles.contestantOptionAvatar}>
                      {c.photo
                        ? <img src={c.photo} alt={c.first_name} />
                        : (c.first_name?.[0] || 'C')
                      }
                    </div>
                    <div>
                      <div className={styles.contestantOptionName}>
                        {c.first_name} {c.last_name}
                      </div>
                      <div className={styles.contestantOptionCat}>
                        {c.talent_category || 'N/A'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* ── Step 3 — Voter Details ── */}
          <div className={styles.voterForm}>
            <div className={styles.voterFormTitle}>Step 3 — Your Details</div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,215,0,0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Full Name
                </label>
                <input
                  style={{ background: 'rgba(0,30,15,0.8)', border: '1px solid rgba(0,135,81,0.3)', borderRadius: 8, padding: '10px 14px', color: '#e8f5e8', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none' }}
                  placeholder="e.g. Emeka Okafor"
                  value={voterName}
                  onChange={e => setVoterName(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
                <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,215,0,0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Email Address
                </label>
                <input
                  style={{ background: 'rgba(0,30,15,0.8)', border: '1px solid rgba(0,135,81,0.3)', borderRadius: 8, padding: '10px 14px', color: '#e8f5e8', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none' }}
                  type="email"
                  placeholder="e.g. emeka@email.com"
                  value={voterEmail}
                  onChange={e => setVoterEmail(e.target.value)}
                />
              </div>
            </div>
          </div>

          {/* ── Order Summary ── */}
          {(selectedPackage || selectedContestant) && (
            <div className={styles.orderSummary}>
              <div className={styles.orderSummaryTitle}>Order Summary</div>
              <div className={styles.orderRow}>
                <span className={styles.orderLabel}>Contestant</span>
                <span className={styles.orderValue}>
                  {selectedContestant
                    ? `${selectedContestant.first_name} ${selectedContestant.last_name}`
                    : '—'}
                </span>
              </div>
              <div className={styles.orderRow}>
                <span className={styles.orderLabel}>Vote Package</span>
                <span className={styles.orderValue}>
                  {selectedPackage
                    ? `${selectedPackage.votes} vote${selectedPackage.votes > 1 ? 's' : ''}`
                    : '—'}
                </span>
              </div>
              <div className={styles.orderRow}>
                <span className={styles.orderLabel}>Rate</span>
                <span className={styles.orderValue}>₦100 per vote</span>
              </div>
              <div className={styles.orderTotal}>
                <span className={styles.orderTotalLabel}>Total</span>
                <span className={styles.orderTotalValue}>
                  {selectedPackage ? selectedPackage.label : '₦0'}
                </span>
              </div>
            </div>
          )}

          {/* ── Pay Button ── */}
          <button
            className={styles.paystackBtn}
            onClick={handlePaystack}
            disabled={!canPay || loading}
          >
            {loading
              ? '⏳ Processing...'
              : canPay
                ? `💳 Pay ${selectedPackage.label} via Paystack`
                : '💳 Complete steps above to pay'
            }
          </button>

          <div className={styles.secureNote}>
            🔒 Secured by Paystack · SSL encrypted · No card details stored
          </div>

        </div>
      </div>
      <Footer />
    </>
  );
};

export default VotingPage;