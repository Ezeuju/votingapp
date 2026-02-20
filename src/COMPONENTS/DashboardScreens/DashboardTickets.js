// src/COMPONENTS/DashboardScreens/DashboardTickets.jsx
import React, { useState } from 'react';
import styles from '../DashboardScreens/Dashboardshared.module.css';
import DashboardModal from './Dashboardmodal';
import { STATUS_MAP } from './Dashboarddata';

const TICKET_TYPE_BADGE = { VVIP: 'badgeWarning', VIP: 'badgeGreen', Regular: 'badgeInfo' };

const DashboardTickets = ({ data, setData }) => {
  const [modal, setModal]   = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState({ holder: '', type: 'Regular', event: '', seat: '' });

  const filtered = data.tickets.filter(t =>
    t.holder.toLowerCase().includes(search.toLowerCase()) ||
    t.event.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.holder || !form.event) return;
    const entry = {
      id: `TKT-${String(Date.now()).slice(-3)}`,
      ...form,
      date: 'Mar 2026',
      status: 'Active',
    };
    setData(p => ({ ...p, tickets: [entry, ...p.tickets] }));
    setForm({ holder: '', type: 'Regular', event: '', seat: '' });
    setModal(false);
  };

  const handleRevoke = id =>
    setData(p => ({ ...p, tickets: p.tickets.filter(t => t.id !== id) }));

  return (
    <div>
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
          placeholder="Search by holder or event..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Ticket ID</th><th>Holder</th><th>Type</th><th>Event</th>
              <th>Seat</th><th>Date</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(t => (
              <tr key={t.id}>
                <td className={`${styles.tdMono} ${styles.tdGold}`}>{t.id}</td>
                <td className={styles.tdBold}>{t.holder}</td>
                <td>
                  <span className={`${styles.badge} ${styles[TICKET_TYPE_BADGE[t.type] || 'badgeInfo']}`}>
                    {t.type}
                  </span>
                </td>
                <td>{t.event}</td>
                <td className={styles.tdMono}>{t.seat}</td>
                <td className={styles.tdMuted}>{t.date}</td>
                <td>
                  <span className={`${styles.badge} ${styles[STATUS_MAP[t.status]]}`}>{t.status}</span>
                </td>
                <td>
                  <button
                    className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                    onClick={() => handleRevoke(t.id)}
                  >
                    Revoke
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className={styles.emptyRow}>No tickets found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modal ── */}
      {modal && (
        <DashboardModal title="Issue New Ticket" onClose={() => setModal(false)}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Ticket Holder</label>
              <input className={styles.input} placeholder="Full name"
                value={form.holder} onChange={e => setForm(p => ({ ...p, holder: e.target.value }))} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Ticket Type</label>
              <select className={styles.select}
                value={form.type} onChange={e => setForm(p => ({ ...p, type: e.target.value }))}>
                <option>Regular</option>
                <option>VIP</option>
                <option>VVIP</option>
              </select>
            </div>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.label}>Event</label>
              <input className={styles.input} placeholder="e.g. Auditions – Day 1"
                value={form.event} onChange={e => setForm(p => ({ ...p, event: e.target.value }))} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Seat Number</label>
              <input className={styles.input} placeholder="e.g. A12"
                value={form.seat} onChange={e => setForm(p => ({ ...p, seat: e.target.value }))} />
            </div>
          </div>
          <div className={styles.modalActions}>
            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setModal(false)}>Cancel</button>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdd}>Issue Ticket</button>
          </div>
        </DashboardModal>
      )}
    </div>
  );
};

export default DashboardTickets;