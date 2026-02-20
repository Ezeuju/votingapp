import React, { useState } from 'react';
import styles from '../DashboardScreens/Dashboardshared.module.css';
import pageStyles from '../DashboardScreens/Dashboardpages.module.css';
import DashboardModal from './Dashboardmodal';
import { STATUS_MAP } from './Dashboarddata';

const DashboardDonations = ({ data, setData }) => {
  const [modal, setModal]   = useState(false);
  const [search, setSearch] = useState('');
  const [form, setForm]     = useState({ donor: '', amount: '', contestant: '', method: 'Bank Transfer' });

  const filtered = data.donations.filter(d =>
    d.donor.toLowerCase().includes(search.toLowerCase()) ||
    d.contestant.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.donor || !form.amount) return;
    const entry = { id: Date.now(), ...form, date: 'Feb 20, 2026', status: 'Pending' };
    setData(p => ({ ...p, donations: [entry, ...p.donations] }));
    setForm({ donor: '', amount: '', contestant: '', method: 'Bank Transfer' });
    setModal(false);
  };

  const handleDelete = id =>
    setData(p => ({ ...p, donations: p.donations.filter(d => d.id !== id) }));

  const summaryStats = [
    { icon: '✅', label: 'Confirmed', count: data.donations.filter(d => d.status === 'Confirmed').length },
    { icon: '⏳', label: 'Pending',   count: data.donations.filter(d => d.status === 'Pending').length   },
    { icon: '↩️', label: 'Refunded', count: data.donations.filter(d => d.status === 'Refunded').length  },
  ];

  return (
    <div>
      {/* ── Summary Stats ── */}
      <div className={pageStyles.statsGrid3}>
        {summaryStats.map(st => (
          <div className={styles.statCard} key={st.label}>
            <div className={styles.statIcon}>{st.icon}</div>
            <div className={styles.statValue}>{st.count}</div>
            <div className={styles.statLabel}>{st.label} Donations</div>
          </div>
        ))}
      </div>

      {/* ── Header ── */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>All <span>Donations</span></span>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setModal(true)}>
          + Add Donation
        </button>
      </div>

      {/* ── Search ── */}
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          placeholder="Search donor or contestant..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Table ── */}
      <div className={styles.tableWrap}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>#</th><th>Donor</th><th>Amount</th><th>Contestant</th>
              <th>Method</th><th>Date</th><th>Status</th><th>Action</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id}>
                <td className={styles.tdMuted}>{d.id}</td>
                <td className={styles.tdBold}>{d.donor}</td>
                <td className={styles.tdGold}>{d.amount}</td>
                <td>{d.contestant}</td>
                <td>{d.method}</td>
                <td className={styles.tdMuted}>{d.date}</td>
                <td>
                  <span className={`${styles.badge} ${styles[STATUS_MAP[d.status]]}`}>{d.status}</span>
                </td>
                <td>
                  <button
                    className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                    onClick={() => handleDelete(d.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className={styles.emptyRow}>No donations found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Modal ── */}
      {modal && (
        <DashboardModal title="Record Donation" onClose={() => setModal(false)}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Donor Name</label>
              <input className={styles.input} placeholder="e.g. Emeka Okafor"
                value={form.donor} onChange={e => setForm(p => ({ ...p, donor: e.target.value }))} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Amount (₦)</label>
              <input className={styles.input} placeholder="e.g. 50,000"
                value={form.amount} onChange={e => setForm(p => ({ ...p, amount: e.target.value }))} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>For Contestant</label>
              <input className={styles.input} placeholder="Contestant name"
                value={form.contestant} onChange={e => setForm(p => ({ ...p, contestant: e.target.value }))} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Payment Method</label>
              <select className={styles.select}
                value={form.method} onChange={e => setForm(p => ({ ...p, method: e.target.value }))}>
                <option>Bank Transfer</option>
                <option>Card</option>
                <option>USSD</option>
                <option>Cash</option>
              </select>
            </div>
          </div>
          <div className={styles.modalActions}>
            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setModal(false)}>Cancel</button>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdd}>Record Donation</button>
          </div>
        </DashboardModal>
      )}
    </div>
  );
};

export default DashboardDonations;