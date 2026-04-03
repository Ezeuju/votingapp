import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import styles from '../CSS-MODULES/Contestantprofile.module.css';
import Navbar from '../COMPONENTS/Navbar';
import Footer from '../COMPONENTS/Footer';
import api from '../services/api';
import { paymentApi } from '../services/paymentApi';
import { planApi } from '../services/planApi';

const VotingPage = () => {
  const navigate = useNavigate();
  const { contestant_id } = useParams();

  const [contestants, setContestants] = useState([]);
  const [plans, setPlans] = useState([]);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [selectedContestant, setSelectedContestant] = useState(null);
  const [voterName, setVoterName] = useState('');
  const [voterEmail, setVoterEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);

  // Fetch contestants
  const fetchContestants = useCallback(async () => {
    try {
      const response = await api.get('/users/contestants');
      let data = response.data || response;
      if (Array.isArray(data) && data.length > 0 && data[0].data) data = data[0].data;
      else if (data.data && Array.isArray(data.data)) data = data.data;

      const active = Array.isArray(data)
        ? data.filter(c => c.contestant_status === 'Active')
        : [];

      setContestants(active);

      // Pre-select contestant if contestant_id from URL
      if (contestant_id) {
        const match = active.find(c => c._id === contestant_id);
        if (match) setSelectedContestant(match);
      }
    } catch (err) {
      console.error('Failed to fetch contestants:', err);
    }
  }, [contestant_id]);

  // Fetch vote plans
  const fetchPlans = useCallback(async () => {
    try {
      const response = await planApi.getAll('vote');
      const data = response.data || response;
      const plansList = data.data || data;
      setPlans(Array.isArray(plansList) ? plansList : []);
    } catch (err) {
      console.error('Failed to fetch plans:', err);
    }
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setFetching(true);
      await Promise.all([fetchContestants(), fetchPlans()]);
      setFetching(false);
    };
    loadData();
  }, [fetchContestants, fetchPlans]);

  const canPay = selectedPlan && selectedContestant && voterEmail && voterName;

  const handlePayment = async () => {
    if (!canPay) return;
    setLoading(true);

    try {
      const response = await paymentApi.vote.initialize({
        user_id: selectedContestant._id,
        vote_plan_id: selectedPlan._id,
        amount: selectedPlan.amount,
        full_name: voterName,
        email: voterEmail,
        callback_url: `${window.location.origin}/contestants/vote/callback`,
      });

      const authUrl = response?.data?.authorization_url || response?.authorization_url;

      if (authUrl) {
        window.location.href = authUrl;
      } else {
        alert('Failed to initialize payment');
        setLoading(false);
      }
    } catch (err) {
      console.error('Payment initialization failed:', err);
      alert(err.response?.data?.message || 'Payment initialization failed');
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div style={{ minHeight: '100vh', background: '#000e05', padding: '32px 20px' }}>
        <div style={{ maxWidth: 860, margin: '0 auto' }}>

          <button
            className={styles.backBtn}
            onClick={() => navigate('/contestants')}
            type="button"
          >
            ← Back to Contestants
          </button>

          <div className={styles.votingTitle}>🗳️ Cast Your Vote</div>
          <div className={styles.votingSubtitle}>
            Choose a vote package, select your contestant and pay securely via Paystack.
          </div>

          {/* Step 1 — Vote Package */}
          <div style={{ marginBottom: 28 }}>
            <div className={styles.contestantSelectorTitle}>Step 1 — Choose a Vote Package</div>
            {fetching ? (
              <div style={{ color: '#FFD700', fontSize: 13, padding: '10px 0' }}>
                Loading vote packages...
              </div>
            ) : (
              <div className={styles.packagesGrid}>
                {plans.map(plan => (
                  <div
                    key={plan._id}
                    className={`${styles.packageCard} ${selectedPlan?._id === plan._id ? styles.packageCardSelected : ''}`}
                    onClick={() => setSelectedPlan(plan)}
                  >
                    <div className={styles.packageVotes}>{plan.title.split(' ')[0]}</div>
                    <div className={styles.packageVotesLabel}>
                      {plan.title.split(' ').slice(1).join(' ')}
                    </div>
                    <div className={styles.packagePrice}>₦{plan.amount.toLocaleString()}</div>
                    <div className={styles.packagePriceNote}>{plan.description}</div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Step 2 — Choose Contestant */}
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
                    style={contestant_id && c._id === contestant_id ? { pointerEvents: 'none', opacity: 1 } : {}}
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

          {/* Step 3 — Voter Details */}
          <div className={styles.voterForm}>
  <div className={styles.voterFormTitle}>Step 3 — Your Details</div>
  <div style={{
    display: 'flex',
    flexDirection: 'column',
    gap: 20,
    background: 'rgba(0,30,15,0.8)',
    border: '1px solid rgba(0,135,81,0.3)',
    borderRadius: 12,
    padding: 20,
  }}>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,215,0,0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Full Name
      </label>
      <input
        style={{ background: 'rgba(0,30,15,0.8)', border: '1px solid rgba(0,135,81,0.3)', borderRadius: 8, padding: '10px 14px', color: '#e8f5e8', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none', width: '100%', boxSizing: 'border-box' }}
        placeholder="e.g. Emeka Okafor"
        value={voterName}
        onChange={e => setVoterName(e.target.value)}
      />
    </div>
    <br/>
    <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
      <label style={{ fontSize: 12, fontWeight: 600, color: 'rgba(255,215,0,0.7)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
        Email Address
      </label>
      <input
        style={{ background: 'rgba(0,30,15,0.8)', border: '1px solid rgba(0,135,81,0.3)', borderRadius: 8, padding: '10px 14px', color: '#e8f5e8', fontSize: 14, fontFamily: 'DM Sans, sans-serif', outline: 'none', width: '100%', boxSizing: 'border-box' }}
        type="email"
        placeholder="e.g. emeka@email.com"
        value={voterEmail}
        onChange={e => setVoterEmail(e.target.value)}
      />
    </div>
  </div>
</div>

          {/* Order Summary */}
          {(selectedPlan || selectedContestant) && (
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
                  {selectedPlan ? selectedPlan.title : '—'}
                </span>
              </div>
              <div className={styles.orderRow}>
                <span className={styles.orderLabel}>Rate</span>
                <span className={styles.orderValue}>{selectedPlan?.description || '—'}</span>
              </div>
              <div className={styles.orderTotal}>
                <span className={styles.orderTotalLabel}>Total</span>
                <span className={styles.orderTotalValue}>
                  {selectedPlan ? `₦${selectedPlan.amount.toLocaleString()}` : '₦0'}
                </span>
              </div>
            </div>
          )}

          {/* Pay Button */}
          <button
            className={styles.paystackBtn}
            onClick={handlePayment}
            disabled={!canPay || loading}
            type="button"
          >
            {loading
              ? '⏳ Processing...'
              : canPay
                ? `💳 Continue to Payment`
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
