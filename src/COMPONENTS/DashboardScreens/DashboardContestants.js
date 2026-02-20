// src/COMPONENTS/DashboardScreens/DashboardContestants.jsx
import React, { useState } from 'react';
import styles from '../DashboardScreens/Dashboardshared.module.css';
import pageStyles from '../DashboardScreens/Dashboardpages.module.css';
import DashboardModal from './Dashboardmodal';
import { STATUS_MAP } from './Dashboarddata';

const MEDALS = ['🥇', '🥈', '🥉'];

const DashboardContestants = ({ data, setData }) => {
  const [modal, setModal] = useState(false);
  const [form, setForm]   = useState({ name: '', nickname: '', category: 'Vocals' });

  const handleAdd = () => {
    if (!form.name) return;
    const entry = { id: Date.now(), ...form, votes: 0, max: 10000, status: 'Active' };
    setData(prev => ({ ...prev, contestants: [...prev.contestants, entry] }));
    setForm({ name: '', nickname: '', category: 'Vocals' });
    setModal(false);
  };

  const handleRemove = id =>
    setData(prev => ({ ...prev, contestants: prev.contestants.filter(c => c.id !== id) }));

  const handleStatus = (id, status) =>
    setData(prev => ({
      ...prev,
      contestants: prev.contestants.map(c => c.id === id ? { ...c, status } : c),
    }));

  const sorted = [...data.contestants].sort((a, b) => b.votes - a.votes);

  return (
    <div>
      {/* ── Header ── */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>🏆 <span>Contestants</span></span>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setModal(true)}>
          + Add Contestant
        </button>
      </div>

      {/* ── Cards Grid ── */}
      <div className={pageStyles.contestantsGrid}>
        {sorted.map((c, i) => (
          <div key={c.id} className={pageStyles.contestantCard}>
            {i < 3 && <div className={pageStyles.medal}>{MEDALS[i]}</div>}

            <div className={pageStyles.contestantAvatar}>{c.name[0]}</div>
            <div className={pageStyles.contestantName}>{c.name}</div>
            <div className={pageStyles.contestantTag}>{c.nickname} · {c.category}</div>

            <span className={`${styles.badge} ${styles[STATUS_MAP[c.status]]}`}>{c.status}</span>

            <div className={pageStyles.contestantVoteSection}>
              <div className={pageStyles.contestantVotes}>{c.votes.toLocaleString()}</div>
              <div className={pageStyles.contestantVotesLabel}>Votes</div>
              <div className={pageStyles.voteBarWrap}>
                <div
                  className={pageStyles.voteBar}
                  style={{ width: `${(c.votes / c.max) * 100}%` }}
                />
              </div>
            </div>

            <div className={pageStyles.contestantActions}>
              {c.status === 'Active' && (
                <button
                  className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                  onClick={() => handleStatus(c.id, 'Eliminated')}
                >
                  Eliminate
                </button>
              )}
              {c.status === 'Eliminated' && (
                <button
                  className={`${styles.btn} ${styles.btnGreen} ${styles.btnSm}`}
                  onClick={() => handleStatus(c.id, 'Active')}
                >
                  Restore
                </button>
              )}
              <button
                className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                onClick={() => handleRemove(c.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {data.contestants.length === 0 && (
        <div className={styles.empty}>No contestants added yet</div>
      )}

      {/* ── Modal ── */}
      {modal && (
        <DashboardModal title="Add Contestant" onClose={() => setModal(false)}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <label className={styles.label}>Full Name</label>
              <input className={styles.input} placeholder="Contestant's name"
                value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Nickname / Handle</label>
              <input className={styles.input} placeholder="@handle"
                value={form.nickname} onChange={e => setForm(p => ({ ...p, nickname: e.target.value }))} />
            </div>
            <div className={styles.formGroup}>
              <label className={styles.label}>Category</label>
              <select className={styles.select}
                value={form.category} onChange={e => setForm(p => ({ ...p, category: e.target.value }))}>
                <option>Vocals</option>
                <option>Dance</option>
                <option>Instrumentals</option>
              </select>
            </div>
          </div>
          <div className={styles.modalActions}>
            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setModal(false)}>Cancel</button>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdd}>Add Contestant</button>
          </div>
        </DashboardModal>
      )}
    </div>
  );
};

export default DashboardContestants;