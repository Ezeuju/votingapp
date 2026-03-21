import React, { useState, useEffect, useRef } from 'react';
import styles from '../CSS-MODULES/Ticketform.module.css';
import { ticketApi } from '../services/ticketApi';

const TIER_ICON = { vip: '⭐', gold: '🥇', silver: '🥈', basic: '🎟️', vvip: '💎' };
const TIER_BY_TITLE = (title = '') => {
  const t = title.toLowerCase();
  if (t.includes('vvip') || t.includes('secure vvip')) return 'vvip';
  if (t.includes('vip')) return 'vip';
  if (t.includes('gold')) return 'gold';
  if (t.includes('silver')) return 'silver';
  return 'basic';
};

const TIER_STYLES = {
  basic:  styles.tierBasic,
  silver: styles.tierSilver,
  gold:   styles.tierGold,
  vip:    styles.tierVip,
  vvip:   styles.tierVvip,
};

const EMPTY_FORM = { name: '', email: '', ticketId: '' };

const SELAR_URL = 'https://selar.com/57744hc123';
const REDIRECT_DELAY = 5; // seconds

const TicketForm = ({ onSubmit }) => {
  const [form, setForm]             = useState(EMPTY_FORM);
  const [submitted, setSubmitted]   = useState(false);
  const [errors, setErrors]         = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [ticketPlans, setTicketPlans] = useState([]);
  const [plansLoading, setPlansLoading] = useState(true);
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [countdown, setCountdown]     = useState(REDIRECT_DELAY);
  const countdownRef                  = useRef(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await ticketApi.getTicketPlans();
        setTicketPlans(res?.data?.data || []);
      } catch (e) {
        console.error('Failed to load ticket plans', e);
      } finally {
        setPlansLoading(false);
      }
    };
    load();
  }, []);

  const field = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: '' }));
  };

  useEffect(() => {
    const plan = ticketPlans.find(p => p._id === form.ticketId) || null;
    setSelectedPlan(plan);
  }, [form.ticketId, ticketPlans]);

  const validate = () => {
    const e = {};
    if (!form.name.trim())   e.name    = 'Please enter your full name';
    if (!form.email.trim())  e.email   = 'Please enter your email address';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Please enter a valid email';
    if (!form.ticketId)      e.ticketId = 'Please select a ticket type';
    return e;
  };

  const startCountdown = () => {
    setCountdown(REDIRECT_DELAY);
    countdownRef.current = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(countdownRef.current);
          window.location.href = SELAR_URL;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }

    setSubmitting(true);
    setSubmitError('');
    try {
      await ticketApi.submitTicket({
        full_name: form.name,
        email: form.email,
        ticket_plan_id: form.ticketId,
      });
      if (onSubmit) onSubmit({ ...form, ticket: selectedPlan });
      setSubmitted(true);
      startCountdown();
    } catch (err) {
      setSubmitError(err?.message || 'Something went wrong. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // Clean up interval on unmount
  useEffect(() => () => clearInterval(countdownRef.current), []);

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitted(false);
    setSubmitError('');
    setSelectedPlan(null);
  };

  // ── Success screen ──
  if (submitted) {
    return (
      <div className={styles.successWrap}>
        <div className={styles.successGlow} />
        <div className={styles.successIcon}>🎉</div>
        <h2 className={styles.successTitle}>Ticket Request Initiated!</h2>
        <p className={styles.successMsg}>
          Your <strong>{selectedPlan?.title}</strong> ticket request has been received.<br />
          Further information and your ticket details will be sent to{' '}
          <strong>{form.email}</strong> via email.
        </p>

        <div className={styles.successTicket}>
          <div className={styles.successTicketRow}>
            <span className={styles.successTicketLabel}>Name</span>
            <span className={styles.successTicketVal}>{form.name}</span>
          </div>
          <div className={styles.successTicketDivider} />
          <div className={styles.successTicketRow}>
            <span className={styles.successTicketLabel}>Ticket</span>
            <span className={styles.successTicketVal}>
              {TIER_ICON[TIER_BY_TITLE(selectedPlan?.title)] || '🎟️'} {selectedPlan?.title}
            </span>
          </div>
          <div className={styles.successTicketDivider} />
          <div className={styles.successTicketRow}>
            <span className={styles.successTicketLabel}>Amount</span>
            <span className={styles.successTicketVal} style={{ color: '#FFD700', fontWeight: 700 }}>
              ₦{Number(selectedPlan?.amount).toLocaleString()}
            </span>
          </div>
        </div>

        {/* ── Payment redirect notice ── */}
        <div style={{
          background: 'rgba(255,215,0,0.07)',
          border: '1px solid rgba(255,215,0,0.25)',
          borderRadius: 14,
          padding: '16px 24px',
          marginBottom: 24,
          maxWidth: 360,
          width: '100%',
          textAlign: 'center',
        }}>
          <p style={{ color: 'rgba(232,245,232,0.7)', fontSize: 13, margin: '0 0 6px' }}>
            💳 Redirecting you to complete payment in
          </p>
          <div style={{
            fontSize: 40,
            fontWeight: 900,
            color: '#FFD700',
            lineHeight: 1,
            marginBottom: 10,
            fontFamily: "'Playfair Display', serif",
          }}>
            {countdown > 0 ? countdown : '🚀'}
          </div>
          <p style={{ color: 'rgba(232,245,232,0.4)', fontSize: 11, margin: 0 }}>
            You will be redirected automatically
          </p>
        </div>

        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: 'center' }}>
          <a href={SELAR_URL} target="_blank" rel="noopener noreferrer">
            <button className={styles.submitBtn} style={{ minWidth: 200, marginTop: 0 }}>
              <span>Proceed to Payment</span>
              <span className={styles.submitArrow}>→</span>
            </button>
          </a>
          <button className={styles.resetBtn} onClick={handleReset}>
            Get Another Ticket
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className={styles.wrapper}>
      <div className={styles.orb1} />
      <div className={styles.orb2} />

      <div className={styles.card}>
        <div className={styles.header}>
          <div className={styles.headerBadge}>🎤 StarStage Season 3</div>
          <h1 className={styles.title}>Get Your Ticket</h1>
          <p className={styles.subtitle}>
            Secure your spot at the most electrifying talent showcase in Africa
          </p>
        </div>

        <div className={styles.formBody}>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Full Name</label>
            <div className={`${styles.inputWrap} ${errors.name ? styles.inputError : ''}`}>
              <span className={styles.inputIcon}>👤</span>
              <input
                className={styles.input}
                placeholder="e.g. Emeka Okafor"
                value={form.name}
                onChange={e => field('name', e.target.value)}
              />
            </div>
            {errors.name && <span className={styles.errorMsg}>{errors.name}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Email Address</label>
            <div className={`${styles.inputWrap} ${errors.email ? styles.inputError : ''}`}>
              <span className={styles.inputIcon}>📧</span>
              <input
                className={styles.input}
                type="email"
                placeholder="e.g. emeka@email.com"
                value={form.email}
                onChange={e => field('email', e.target.value)}
              />
            </div>
            {errors.email && <span className={styles.errorMsg}>{errors.email}</span>}
          </div>

          <div className={styles.fieldGroup}>
            <label className={styles.label}>Select Ticket Type</label>
            {errors.ticketId && <span className={styles.errorMsg}>{errors.ticketId}</span>}
            {plansLoading ? (
              <p style={{ color: '#a8c4a8', fontSize: 13, marginTop: 8 }}>Loading ticket plans…</p>
            ) : (
              <div className={styles.ticketGrid}>
                {ticketPlans.map(plan => {
                  const tier = TIER_BY_TITLE(plan.title);
                  const icon = TIER_ICON[tier] || '🎟️';
                  const isVVIP = tier === 'vvip';
                  return (
                    <div
                      key={plan._id}
                      className={`${styles.ticketCard} ${TIER_STYLES[tier] || ''} ${form.ticketId === plan._id ? styles.ticketCardSelected : ''}`}
                      onClick={() => !isVVIP && field('ticketId', plan._id)}
                      style={isVVIP ? { cursor: 'default', opacity: 0.85 } : {}}
                    >
                      {tier === 'vip' && <div className={styles.ticketTag}>★ VIP with Security</div>}
                      {tier === 'vvip' && <div className={styles.ticketTag}>👑 Most Exclusive</div>}
                      <div className={styles.ticketIcon}>{icon}</div>
                      <div className={styles.ticketLabel}>{plan.title}</div>
                      <div className={styles.ticketDesc}>{(plan.features || []).join(', ')}</div>
                      {isVVIP ? (
                        <div className={styles.ticketPrice}>Contact Us</div>
                      ) : (
                        <div className={styles.ticketPrice}>₦{Number(plan.amount).toLocaleString()}</div>
                      )}
                      {form.ticketId === plan._id && (
                        <div className={styles.ticketCheck}>✓</div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          {selectedPlan && (
            <div className={styles.summary}>
              <div className={styles.summaryLeft}>
                <span className={styles.summaryIcon}>{TIER_ICON[TIER_BY_TITLE(selectedPlan.title)] || '🎟️'}</span>
                <div>
                  <div className={styles.summaryLabel}>{selectedPlan.title}</div>
                  <div className={styles.summaryDesc}>{(selectedPlan.features || []).slice(0, 2).join(', ')}</div>
                </div>
              </div>
              <div className={styles.summaryPrice}>₦{Number(selectedPlan.amount).toLocaleString()}</div>
            </div>
          )}

          {submitError && (
            <p style={{ color: '#f87171', fontSize: 13, marginTop: 8, textAlign: 'center' }}>{submitError}</p>
          )}

          <button
            className={styles.submitBtn}
            onClick={handleSubmit}
            disabled={submitting}
            style={submitting ? { opacity: 0.7, cursor: 'not-allowed' } : {}}
          >
            <span>{submitting ? 'Submitting…' : 'Secure My Ticket'}</span>
            {!submitting && <span className={styles.submitArrow}>→</span>}
          </button>

          <p className={styles.footerNote}>
            🔒 Payments are secure. Ticket confirmation sent via email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;
