import React, { useState } from 'react';
import styles from '../DashboardScreens/Dashboardshared.module.css';
import pageStyles from '../DashboardScreens/Dashboardpages.module.css';
import DashboardModal from './Dashboardmodal';
import { STATUS_MAP } from './Dashboarddata';

const EMPTY_FORM = {
  fullName: '',
  email: '',
  phone: '',
  amount: '',
  monthly: false,
  date: '',
  status: 'Pending',
};

const DashboardDonations = ({ data, setData }) => {
  const [modal, setModal]         = useState(false);
  const [search, setSearch]       = useState('');
  const [form, setForm]           = useState(EMPTY_FORM);
  const [viewEntry, setViewEntry] = useState(null);

  const field = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const filtered = data.donations.filter(d =>
    (d.fullName || '').toLowerCase().includes(search.toLowerCase()) ||
    (d.email || '').toLowerCase().includes(search.toLowerCase()) ||
    (d.phone || '').toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = () => {
    if (!form.fullName || !form.amount || !form.email) return;
    const entry = { id: Date.now(), ...form };
    setData(p => ({ ...p, donations: [entry, ...p.donations] }));
    setForm(EMPTY_FORM);
    setModal(false);
  };

  const handleDelete = id =>
    setData(p => ({ ...p, donations: p.donations.filter(d => d.id !== id) }));

  const handleStatusChange = (id, status) =>
    setData(p => ({
      ...p,
      donations: p.donations.map(d => d.id === id ? { ...d, status } : d),
    }));

  const summaryStats = [
    { icon: '💰', label: 'Total',     count: data.donations.length },
    { icon: '✅', label: 'Confirmed', count: data.donations.filter(d => d.status === 'Confirmed').length },
    { icon: '⏳', label: 'Pending',   count: data.donations.filter(d => d.status === 'Pending').length   },
    { icon: '🔁', label: 'Monthly',   count: data.donations.filter(d => d.monthly).length                },
  ];

  return (
    <div>
      {/* ── Summary Stats ── */}
      <div className={styles.statsGrid}>
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
        {/* <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setModal(true)}>
          + Add Donation
        </button> */}
      </div>

      {/* ── Search ── */}
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Table ── */}
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Full Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Amount</th>
              <th>Type</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map(d => (
              <tr key={d.id}>
                <td className={styles.tdBold}>{d.fullName}</td>
                <td className={styles.tdMuted}>{d.email}</td>
                <td className={styles.tdMuted}>{d.phone}</td>
                <td className={styles.tdGold}>{d.amount}</td>
                <td>
                  <span className={`${styles.badge} ${d.monthly ? styles.badgeSuccess : styles.badgeInfo}`}>
                    {d.monthly ? '🔁 Monthly' : 'One-time'}
                  </span>
                </td>
                <td className={styles.tdMuted}>{d.date}</td>
                <td>
                  <span className={`${styles.badge} ${styles[STATUS_MAP[d.status]]}`}>{d.status}</span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }}>
                    <button
                      className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                      onClick={() => setViewEntry(d)}
                    >
                      View
                    </button>
                    {d.status === 'Pending' && (
                      <button
                        className={`${styles.btn} ${styles.btnGreen} ${styles.btnSm}`}
                        onClick={() => handleStatusChange(d.id, 'Confirmed')}
                      >
                        Confirm
                      </button>
                    )}
                    <button
                      className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                      onClick={() => handleDelete(d.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={8} className={styles.emptyRow}>No donations found</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* ── Add Donation Modal ── */}
      {modal && (
        <DashboardModal title="Record Donation" onClose={() => { setModal(false); setForm(EMPTY_FORM); }}>
          <div className={styles.formGrid}>

            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.label}>Full Name</label>
              <input
                className={styles.input}
                placeholder="e.g. Emeka Okafor"
                value={form.fullName}
                onChange={e => field('fullName', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Email Address</label>
              <input
                className={styles.input}
                type="email"
                placeholder="e.g. emeka@email.com"
                value={form.email}
                onChange={e => field('email', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Phone Number</label>
              <input
                className={styles.input}
                placeholder="e.g. +234 801 234 5678"
                value={form.phone}
                onChange={e => field('phone', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Amount Donated (₦)</label>
              <input
                className={styles.input}
                placeholder="e.g. 50,000"
                value={form.amount}
                onChange={e => field('amount', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Date</label>
              <input
                className={styles.input}
                type="date"
                value={form.date}
                onChange={e => field('date', e.target.value)}
              />
            </div>

            <div className={styles.formGroup}>
              <label className={styles.label}>Status</label>
              <select
                className={styles.select}
                value={form.status}
                onChange={e => field('status', e.target.value)}
              >
                <option value="Pending">Pending</option>
                <option value="Confirmed">Confirmed</option>
              </select>
            </div>

            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 10, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.monthly}
                  onChange={e => field('monthly', e.target.checked)}
                  style={{ width: 16, height: 16, accentColor: '#FFD700', cursor: 'pointer' }}
                />
                <span className={styles.label} style={{ marginBottom: 0 }}>
                  🔁 Make this a monthly donation
                </span>
              </label>
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
              Record Donation
            </button>
          </div>
        </DashboardModal>
      )}

      {/* ── View Donation Modal ── */}
      {viewEntry && (
        <DashboardModal title="Donation Details" onClose={() => setViewEntry(null)}>
          <div className={styles.formGrid}>
            {[
              { label: 'Full Name',  value: viewEntry.fullName },
              { label: 'Email',      value: viewEntry.email    },
              { label: 'Phone',      value: viewEntry.phone    },
              { label: 'Amount',     value: viewEntry.amount   },
              { label: 'Date',       value: viewEntry.date     },
            ].map(row => (
              <div className={styles.formGroup} key={row.label}>
                <span className={styles.label}>{row.label}</span>
                <span style={{ color: '#e8f5e8', fontSize: 14, fontWeight: 500 }}>{row.value || '—'}</span>
              </div>
            ))}
            <div className={styles.formGroup}>
              <span className={styles.label}>Donation Type</span>
              <div style={{ marginTop: 4 }}>
                <span className={`${styles.badge} ${viewEntry.monthly ? styles.badgeSuccess : styles.badgeInfo}`}>
                  {viewEntry.monthly ? '🔁 Monthly' : 'One-time'}
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
            {viewEntry.status === 'Pending' && (
              <button
                className={`${styles.btn} ${styles.btnGreen}`}
                onClick={() => { handleStatusChange(viewEntry.id, 'Confirmed'); setViewEntry(null); }}
              >
                ✓ Confirm Donation
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

export default DashboardDonations;