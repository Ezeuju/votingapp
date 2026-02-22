// src/COMPONENTS/DashboardScreens/DashboardTickets.jsx
import React, { useState } from 'react';
import styles from '../DashboardScreens/Dashboardshared.module.css';
import DashboardModal from './Dashboardmodal';
import { STATUS_MAP } from './Dashboarddata';

const TICKET_TYPES = [
  'Standard Access',
  'VIP Access',
  'All Access Gold Pass',
];

const TICKET_TYPE_BADGE = {
  'Standard Access':     'badgeInfo',
  'VIP Access':          'badgeGreen',
  'All Access Gold Pass':'badgeWarning',
};

const EMPTY_FORM = {
  fullName: '',
  email: '',
  type: 'Standard Access',
  status: 'Active',
};

const DashboardTickets = ({ data, setData }) => {
  const [modal, setModal]         = useState(false);
  const [search, setSearch]       = useState('');
  const [viewEntry, setViewEntry] = useState(null);
  const [form, setForm]           = useState(EMPTY_FORM);

  const field = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const filtered = data.tickets.filter(t =>
    (t.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.email    || '').toLowerCase().includes(search.toLowerCase()) ||
    (t.id       || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.fullName || !form.email) return;
    const entry = {
      id: `TKT-${String(Date.now()).slice(-4)}`,
      ...form,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setData(p => ({ ...p, tickets: [entry, ...p.tickets] }));
    setForm(EMPTY_FORM);
    setModal(false);
  };

  const handleRevoke = id =>
    setData(p => ({ ...p, tickets: p.tickets.filter(t => t.id !== id) }));

  const handleMarkUsed = id =>
    setData(p => ({
      ...p,
      tickets: p.tickets.map(t => t.id === id ? { ...t, status: 'Used' } : t),
    }));

  const summaryStats = [
    { icon: '🎫', label: 'Total Tickets', count: data.tickets.length },
    { icon: '✅', label: 'Active',        count: data.tickets.filter(t => t.status === 'Active').length },
    { icon: '🔵', label: 'Used',          count: data.tickets.filter(t => t.status === 'Used').length   },
    { icon: '🥇', label: 'Gold Pass',     count: data.tickets.filter(t => t.type === 'All Access Gold Pass').length },
  ];

  return (
    <div>
      {/* ── Summary Stats ── */}
      <div className={styles.statsGrid}>
        {summaryStats.map(st => (
          <div className={styles.statCard} key={st.label}>
            <div className={styles.statIcon}>{st.icon}</div>
            <div className={styles.statValue}>{st.count}</div>
            <div className={styles.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* ── Header ── */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Issued <span>Tickets</span></span>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setModal(true)}>
          + Issue Ticket
        </button>
      </div>

      {/* ── Search ── */}
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          placeholder="Search by name, email or ticket ID..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Table ── */}
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ticket ID</th>
              <th>Full Name</th>
              <th>Email</th>
              <th>Ticket Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id}>
                <td className={`${styles.tdMono} ${styles.tdGold}`}>{t.id}</td>
                <td className={styles.tdBold}>{t.fullName}</td>
                <td className={styles.tdMuted}>{t.email}</td>
                <td>
                  <span className={`${styles.badge} ${styles[TICKET_TYPE_BADGE[t.type] || 'badgeInfo']}`}>
                    {t.type}
                  </span>
                </td>
                <td className={styles.tdMuted}>{t.date}</td>
                <td>
                  <span className={`${styles.badge} ${styles[STATUS_MAP[t.status]]}`}>
                    {t.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                      onClick={() => setViewEntry(t)}
                    >
                      View
                    </button>
                    {t.status === 'Active' && (
                      <button
                        className={`${styles.btn} ${styles.btnGreen} ${styles.btnSm}`}
                        onClick={() => handleMarkUsed(t.id)}
                      >
                        Mark Used
                      </button>
                    )}
                    <button
                      className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                      onClick={() => handleRevoke(t.id)}
                    >
                      Revoke
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={7} className={styles.emptyRow}>No tickets found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Issue Ticket Modal ── */}
      {modal && (
        <DashboardModal title="Issue New Ticket" onClose={() => { setModal(false); setForm(EMPTY_FORM); }}>
          <div className={styles.formGrid}>

            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.label}>Full Name</label>
              <input
                className={styles.input}
                placeholder="e.g. Ada Nwosu"
                value={form.fullName}
                onChange={e => field('fullName', e.target.value)}
              />
            </div>

            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.label}>Email Address</label>
              <input
                className={styles.input}
                type="email"
                placeholder="e.g. ada@email.com"
                value={form.email}
                onChange={e => field('email', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Ticket Type</label>
              <select
                className={styles.select}
                value={form.type}
                onChange={e => field('type', e.target.value)}
              >
                {TICKET_TYPES.map(t => (
                  <option key={t} value={t}>{t}</option>
                ))}
              </select>
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Status</label>
              <select
                className={styles.select}
                value={form.status}
                onChange={e => field('status', e.target.value)}
              >
                <option value="Active">Active</option>
                <option value="Used">Used</option>
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
              Issue Ticket
            </button>
          </div>
        </DashboardModal>
      )}

      {/* ── View Ticket Modal ── */}
      {viewEntry && (
        <DashboardModal title="Ticket Details" onClose={() => setViewEntry(null)}>
          <div className={styles.formGrid}>
            {[
              { label: 'Ticket ID',  value: viewEntry.id       },
              { label: 'Full Name',  value: viewEntry.fullName },
              { label: 'Email',      value: viewEntry.email    },
              { label: 'Date',       value: viewEntry.date     },
            ].map(row => (
              <div className={styles.formGroup} key={row.label}>
                <span className={styles.label}>{row.label}</span>
                <span style={{ color: '#e8f5e8', fontSize: 14, fontWeight: 500 }}>{row.value || '—'}</span>
              </div>
            ))}

            <div className={styles.formGroup}>
              <span className={styles.label}>Ticket Type</span>
              <div style={{ marginTop: 4 }}>
                <span className={`${styles.badge} ${styles[TICKET_TYPE_BADGE[viewEntry.type] || 'badgeInfo']}`}>
                  {viewEntry.type}
                </span>
              </div>
            </div>

            <div className={styles.formGroup}>
              <span className={styles.label}>Status</span>
              <div style={{ marginTop: 4 }}>
                <span className={`${styles.badge} ${styles[STATUS_MAP[viewEntry.status]]}`}>
                  {viewEntry.status}
                </span>
              </div>
            </div>
          </div>

          <div className={styles.modalActions}>
            {viewEntry.status === 'Active' && (
              <button
                className={`${styles.btn} ${styles.btnGreen}`}
                onClick={() => { handleMarkUsed(viewEntry.id); setViewEntry(null); }}
              >
                ✓ Mark as Used
              </button>
            )}
            <button
              className={`${styles.btn} ${styles.btnDanger}`}
              onClick={() => { handleRevoke(viewEntry.id); setViewEntry(null); }}
            >
              Revoke Ticket
            </button>
            
            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setViewEntry(null)}>
              Close
            </button>
          </div>
        </DashboardModal>
      )}
    </div>
  );
};

export default DashboardTickets;