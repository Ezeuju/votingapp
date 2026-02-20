// src/COMPONENTS/DashboardScreens/DashboardLiveUpdates.jsx
import React, { useState } from 'react';
import styles from '../DashboardScreens/Dashboardshared.module.css';
import pageStyles from '../DashboardScreens/Dashboardpages.module.css';
import DashboardModal from './Dashboardmodal';

const DashboardLiveUpdates = ({ data, setData }) => {
  const [modal, setModal] = useState(false);
  const [text, setText]   = useState('');

  const handleAdd = () => {
    if (!text.trim()) return;
    const entry = { id: Date.now(), text, time: 'Just now', pinned: false };
    setData(prev => ({ ...prev, updates: [entry, ...prev.updates] }));
    setText('');
    setModal(false);
  };

  const handleDelete = id =>
    setData(prev => ({ ...prev, updates: prev.updates.filter(u => u.id !== id) }));

  const handleTogglePin = id =>
    setData(prev => ({
      ...prev,
      updates: prev.updates.map(u => u.id === id ? { ...u, pinned: !u.pinned } : u),
    }));

  return (
    <div>
      {/* ── Header ── */}
      <div className={styles.sectionHeader}>
        <div className={pageStyles.liveHeader}>
          <div className={pageStyles.liveDot} />
          <span className={pageStyles.liveLabel}>Live</span>
          <span className={styles.sectionTitle} style={{ marginLeft: 6 }}>
            <span>Updates</span>
          </span>
        </div>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setModal(true)}>
          + Post Update
        </button>
      </div>

      <p className={pageStyles.liveSubtitle}>Real-time updates visible to all website visitors</p>

      {/* ── Update Items ── */}
      <div className={pageStyles.updateList}>
        {data.updates.map(u => (
          <div
            key={u.id}
            className={`${pageStyles.updateItem} ${u.pinned ? pageStyles.updateItemPinned : ''}`}
          >
            <div className={pageStyles.updateContent}>
              <div className={pageStyles.updateText}>
                {u.pinned && <span style={{ color: '#FFD700' }}>📌 </span>}
                {u.text}
              </div>
              <div className={pageStyles.updateMeta}>{u.time}</div>
            </div>
            <div className={pageStyles.updateActions}>
              <button
                className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                onClick={() => handleTogglePin(u.id)}
              >
                {u.pinned ? 'Unpin' : 'Pin'}
              </button>
              <button
                className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                onClick={() => handleDelete(u.id)}
              >
                Delete
              </button>
            </div>
          </div>
        ))}
        {data.updates.length === 0 && (
          <div className={styles.empty}>No live updates posted yet</div>
        )}
      </div>

      {/* ── Modal ── */}
      {modal && (
        <DashboardModal title="Post Live Update" onClose={() => setModal(false)}>
          <div className={styles.formGroup} style={{ marginBottom: 0 }}>
            <label className={styles.label}>Update Message</label>
            <textarea
              className={styles.textarea}
              placeholder="What's happening right now?..."
              value={text}
              onChange={e => setText(e.target.value)}
            />
          </div>
          <div className={styles.modalActions}>
            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setModal(false)}>Cancel</button>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdd}>🔴 Go Live</button>
          </div>
        </DashboardModal>
      )}
    </div>
  );
};

export default DashboardLiveUpdates;