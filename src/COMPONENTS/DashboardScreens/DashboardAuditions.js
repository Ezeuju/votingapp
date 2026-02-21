import React, { useState } from 'react';
import styles from '../DashboardScreens/Dashboardshared.module.css';
import DashboardModal from './Dashboardmodal';
import { STATUS_MAP } from './Dashboarddata';

const PLANS = [
  { id: 'silver-pass', label: 'Silver Audition Pass' },
  { id: 'gold-pass',   label: 'Gold Audition Pass'   },
  { id: 'vip-pass',    label: 'VIP Audition Pass'    },
];

const PLAN_LABEL = {
  'silver-pass': 'Silver Pass',
  'gold-pass':   'Gold Pass',
  'vip-pass':    'VIP Pass',
};

const PLAN_BADGE = {
  'silver-pass': 'badgeInfo',
  'gold-pass':   'badgeWarning',
  'vip-pass':    'badgeGreen',
};

const EMPTY_FORM = {
  firstName: '', lastName: '', email: '',
  country: '', phone: '', location: '',
  date: '', time: '', planId: 'silver-pass',
};

const DashboardAuditions = ({ data, setData }) => {
  const [modal, setModal]       = useState(false);
  const [viewEntry, setViewEntry] = useState(null);
  const [search, setSearch]     = useState('');
  const [form, setForm]         = useState(EMPTY_FORM);

  const field = (key, e) => setForm(p => ({ ...p, [key]: e.target.value }));

  const handleAdd = () => {
    if (!form.firstName || !form.lastName || !form.email) return;
    const entry = { id: Date.now(), ...form, status: 'Pending' };
    setData(prev => ({ ...prev, auditions: [entry, ...prev.auditions] }));
    setForm(EMPTY_FORM);
    setModal(false);
  };

  const handleRemove = id =>
    setData(prev => ({ ...prev, auditions: prev.auditions.filter(a => a.id !== id) }));

  const handleStatus = (id, status) =>
    setData(prev => ({
      ...prev,
      auditions: prev.auditions.map(a => a.id === id ? { ...a, status } : a),
    }));

  const filtered = data.auditions.filter(a => {
    const q = search.toLowerCase();
    return (
      `${a.firstName} ${a.lastName}`.toLowerCase().includes(q) ||
      a.email.toLowerCase().includes(q) ||
      a.country.toLowerCase().includes(q) ||
      PLAN_LABEL[a.planId]?.toLowerCase().includes(q)
    );
  });

  const counts = {
    total:     data.auditions.length,
    silver:    data.auditions.filter(a => a.planId === 'silver-pass').length,
    gold:      data.auditions.filter(a => a.planId === 'gold-pass').length,
    vip:       data.auditions.filter(a => a.planId === 'vip-pass').length,
    confirmed: data.auditions.filter(a => a.status === 'Confirmed').length,
    pending:   data.auditions.filter(a => a.status === 'Pending').length,
  };

  return (
    <div>
      {/* ── Summary Stats ── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎤</div>
          <div className={styles.statValue}>{counts.total}</div>
          <div className={styles.statLabel}>Total Registrations</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🥈</div>
          <div className={styles.statValue}>{counts.silver}</div>
          <div className={styles.statLabel}>Silver Pass</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🥇</div>
          <div className={styles.statValue}>{counts.gold}</div>
          <div className={styles.statLabel}>Gold Pass</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💎</div>
          <div className={styles.statValue}>{counts.vip}</div>
          <div className={styles.statLabel}>VIP Pass</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statValue}>{counts.confirmed}</div>
          <div className={styles.statLabel}>Confirmed</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏳</div>
          <div className={styles.statValue}>{counts.pending}</div>
          <div className={styles.statLabel}>Pending</div>
        </div>
      </div>

      {/* ── Header ── */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>🎤 <span>Audition Registrations</span></span>
        {/* <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setModal(true)}>
          + Add Registration
        </button> */}
      </div>

      {/* ── Search ── */}
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          placeholder="Search by name, email, country or plan..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Country / Location</th>
              <th>Date & Time</th>
              <th>Plan</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(a => (
              <tr key={a.id}>
                <td className={styles.tdBold}>{a.firstName} {a.lastName}</td>
                <td className={styles.tdMuted}>{a.email}</td>
                <td className={styles.tdMuted}>{a.phone}</td>
                <td>{a.country}{a.location ? `, ${a.location}` : ''}</td>
                <td className={styles.tdMuted}>
                  {a.date}
                  <br />
                  <span style={{ color: '#FFD700', fontSize: 11 }}>{a.time}</span>
                </td>
                <td>
                  <span className={`${styles.badge} ${styles[PLAN_BADGE[a.planId]]}`}>
                    {PLAN_LABEL[a.planId]}
                  </span>
                </td>
                <td>
                  <span className={`${styles.badge} ${styles[STATUS_MAP[a.status]]}`}>
                    {a.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                      onClick={() => setViewEntry(a)}
                    >
                      View
                    </button>
                    {a.status === 'Pending' && (
                      <button
                        className={`${styles.btn} ${styles.btnGreen} ${styles.btnSm}`}
                        onClick={() => handleStatus(a.id, 'Confirmed')}
                      >
                        Confirm
                      </button>
                    )}
                    <button
                      className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                      onClick={() => handleRemove(a.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className={styles.emptyRow}>No audition registrations found</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Add Registration Modal ── */}
      {modal && (
        <DashboardModal
          title="Add Audition Registration"
          onClose={() => { setModal(false); setForm(EMPTY_FORM); }}
        >
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>First Name</label>
              <input className={styles.input} placeholder="e.g. Amara"
                value={form.firstName} onChange={e => field('firstName', e)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Last Name</label>
              <input className={styles.input} placeholder="e.g. Joy"
                value={form.lastName} onChange={e => field('lastName', e)} />
            </div>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.label}>Email Address</label>
              <input className={styles.input} type="email" placeholder="e.g. amara@email.com"
                value={form.email} onChange={e => field('email', e)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Country</label>
              <input className={styles.input} placeholder="e.g. Nigeria"
                value={form.country} onChange={e => field('country', e)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number</label>
              <input className={styles.input} placeholder="e.g. +234 801 234 5678"
                value={form.phone} onChange={e => field('phone', e)} />
            </div>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.label}>Location / City</label>
              <input className={styles.input} placeholder="e.g. Lagos"
                value={form.location} onChange={e => field('location', e)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Audition Date</label>
              <input className={styles.input} type="date"
                value={form.date} onChange={e => field('date', e)} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Audition Time</label>
              <input className={styles.input} type="time"
                value={form.time} onChange={e => field('time', e)} />
            </div>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.label}>Audition Plan</label>
              <select className={styles.select}
                value={form.planId} onChange={e => field('planId', e)}>
                {PLANS.map(p => (
                  <option key={p.id} value={p.id}>{p.label}</option>
                ))}
              </select>
            </div>
          </div>
          <div className={styles.modalActions}>
            <button
              className={`${styles.btn} ${styles.btnOutline}`}
              onClick={() => { setModal(false); setForm(EMPTY_FORM); }}
            >
              Cancel
            </button>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdd}>
              Add Registration
            </button>
          </div>
        </DashboardModal>
      )}

      {/* ── View Entry Modal ── */}
      {viewEntry && (
        <DashboardModal title="Registrant Details" onClose={() => setViewEntry(null)}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
            {[
              { label: 'First Name',  value: viewEntry.firstName },
              { label: 'Last Name',   value: viewEntry.lastName  },
              { label: 'Email',       value: viewEntry.email     },
              { label: 'Phone',       value: viewEntry.phone     },
              { label: 'Country',     value: viewEntry.country   },
              { label: 'Location',    value: viewEntry.location  },
              { label: 'Date',        value: viewEntry.date      },
              { label: 'Time',        value: viewEntry.time      },
            ].map(row => (
              <div key={row.label}>
                <div className={styles.label} style={{ marginBottom: 4 }}>{row.label}</div>
                <div style={{ color: '#e8f5e8', fontSize: 14, fontWeight: 500 }}>{row.value || '—'}</div>
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1' }}>
              <div className={styles.label} style={{ marginBottom: 6 }}>Audition Plan</div>
              <span className={`${styles.badge} ${styles[PLAN_BADGE[viewEntry.planId]]}`}>
                {PLANS.find(p => p.id === viewEntry.planId)?.label}
              </span>
            </div>
            <div style={{ gridColumn: '1 / -1' }}>
              <div className={styles.label} style={{ marginBottom: 6 }}>Status</div>
              <span className={`${styles.badge} ${styles[STATUS_MAP[viewEntry.status]]}`}>
                {viewEntry.status}
              </span>
            </div>
          </div>
          <div className={styles.modalActions}>
            {viewEntry.status === 'Pending' && (
              <button
                className={`${styles.btn} ${styles.btnGreen}`}
                onClick={() => { handleStatus(viewEntry.id, 'Confirmed'); setViewEntry(null); }}
              >
                ✓ Confirm Registration
              </button>
            )}
            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setViewEntry(null)}>
              Close
            </button>
          </div>
        </DashboardModal>
      )}
    </div>
  );
};

export default DashboardAuditions;