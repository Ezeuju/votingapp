import React, { useState } from 'react';
import styles from '../CSS-MODULES/Ticketform.module.css';

const TICKET_TYPES = [
  {
    id: 'event-entry',
    label: 'Event Entry',
    price: 2000,
    priceLabel: '₦2,000',
    icon: '🎟️',
    desc: 'General admission to the event',
    tier: 'basic',
  },
  {
    id: 'standard-entry',
    label: 'Standard Entry',
    price: 5000,
    priceLabel: '₦5,000',
    icon: '🎫',
    desc: 'Standard access with reserved seating',
    tier: 'basic',
  },
  {
    id: 'couple-regular',
    label: 'Couple Regular',
    price: 5000,
    priceLabel: '₦5,000',
    icon: '👫',
    desc: 'Entry for two — general admission',
    tier: 'basic',
  },
  {
    id: 'single-silver',
    label: 'Single Silver Pass',
    price: 5000,
    priceLabel: '₦5,000',
    icon: '🥈',
    desc: 'Silver-tier individual access pass',
    tier: 'silver',
  },
  {
    id: 'gold-audition',
    label: 'Gold Audition Pass',
    price: 10000,
    priceLabel: '₦10,000',
    icon: '🥇',
    desc: 'Priority audition slot with gold perks',
    tier: 'gold',
  },
  {
    id: 'vip-audition',
    label: 'VIP Audition Pass',
    price: 10000,
    priceLabel: '₦10,000',
    icon: '⭐',
    desc: 'VIP audition access with security escort',
    tier: 'vip',
    tag: '★ VIP with Security',
  },
  {
    id: 'vvip-access',
    label: 'Secure VVIP Access',
    price: null,
    priceLabel: 'Contact Us',
    icon: '💎',
    desc: 'Exclusive VVIP experience — fully secured',
    tier: 'vvip',
    tag: '👑 Most Exclusive',
  },
];

const TIER_STYLES = {
  basic:  styles.tierBasic,
  silver: styles.tierSilver,
  gold:   styles.tierGold,
  vip:    styles.tierVip,
  vvip:   styles.tierVvip,
};

const EMPTY_FORM = { name: '', email: '', ticketId: '' };

const TicketForm = ({ onSubmit }) => {
  const [form, setForm]         = useState(EMPTY_FORM);
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors]     = useState({});

  const field = (key, val) => {
    setForm(p => ({ ...p, [key]: val }));
    if (errors[key]) setErrors(p => ({ ...p, [key]: '' }));
  };

  const selected = TICKET_TYPES.find(t => t.id === form.ticketId);

  const validate = () => {
    const e = {};
    if (!form.name.trim())    e.name    = 'Please enter your full name';
    if (!form.email.trim())   e.email   = 'Please enter your email address';
    else if (!/\S+@\S+\.\S+/.test(form.email)) e.email = 'Please enter a valid email';
    if (!form.ticketId)       e.ticketId = 'Please select a ticket type';
    return e;
  };

  const handleSubmit = () => {
    const e = validate();
    if (Object.keys(e).length > 0) { setErrors(e); return; }
    if (onSubmit) onSubmit({ ...form, ticket: selected });
    setSubmitted(true);
  };

  const handleReset = () => {
    setForm(EMPTY_FORM);
    setErrors({});
    setSubmitted(false);
  };

  if (submitted) {
    return (
      <div className={styles.successWrap}>
        <div className={styles.successGlow} />
        <div className={styles.successIcon}>🎉</div>
        <h2 className={styles.successTitle}>You're In!</h2>
        <p className={styles.successMsg}>
          Your <strong>{selected?.label}</strong> ticket request has been received.<br />
          A confirmation will be sent to <strong>{form.email}</strong>.
        </p>
        <div className={styles.successTicket}>
          <div className={styles.successTicketRow}>
            <span className={styles.successTicketLabel}>Name</span>
            <span className={styles.successTicketVal}>{form.name}</span>
          </div>
          <div className={styles.successTicketDivider} />
          <div className={styles.successTicketRow}>
            <span className={styles.successTicketLabel}>Ticket</span>
            <span className={styles.successTicketVal}>{selected?.icon} {selected?.label}</span>
          </div>
          <div className={styles.successTicketDivider} />
          <div className={styles.successTicketRow}>
            <span className={styles.successTicketLabel}>Price</span>
            <span className={styles.successTicketVal} style={{ color: '#FFD700', fontWeight: 700 }}>
              {selected?.priceLabel}
            </span>
          </div>
        </div>
        <button className={styles.resetBtn} onClick={handleReset}>
          Get Another Ticket
        </button>
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
            <div className={styles.ticketGrid}>
              {TICKET_TYPES.map(t => (
                <div
                  key={t.id}
                  className={`${styles.ticketCard} ${TIER_STYLES[t.tier]} ${form.ticketId === t.id ? styles.ticketCardSelected : ''}`}
                  onClick={() => field('ticketId', t.id)}
                >
                  {t.tag && <div className={styles.ticketTag}>{t.tag}</div>}
                  <div className={styles.ticketIcon}>{t.icon}</div>
                  <div className={styles.ticketLabel}>{t.label}</div>
                  <div className={styles.ticketDesc}>{t.desc}</div>
                  <div className={styles.ticketPrice}>{t.priceLabel}</div>
                  {form.ticketId === t.id && (
                    <div className={styles.ticketCheck}>✓</div>
                  )}
                </div>
              ))}
            </div>
          </div>

         
          {selected && (
            <div className={styles.summary}>
              <div className={styles.summaryLeft}>
                <span className={styles.summaryIcon}>{selected.icon}</span>
                <div>
                  <div className={styles.summaryLabel}>{selected.label}</div>
                  <div className={styles.summaryDesc}>{selected.desc}</div>
                </div>
              </div>
              <div className={styles.summaryPrice}>{selected.priceLabel}</div>
            </div>
          )}

        
          <a href="https://selar.com/57744hc123">
          <button className={styles.submitBtn} onClick={handleSubmit}>
            <span>Secure My Ticket</span>
            <span className={styles.submitArrow}>→</span>
          </button>
          </a>

          <p className={styles.footerNote}>
            🔒 Payments are secure. Ticket confirmation sent via email.
          </p>
        </div>
      </div>
    </div>
  );
};

export default TicketForm;



