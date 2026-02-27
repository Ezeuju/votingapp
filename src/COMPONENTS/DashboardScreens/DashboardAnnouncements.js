// src/COMPONENTS/DashboardScreens/DashboardAnnouncements.jsx
import React, { useState } from 'react';
import styles from '../DashboardScreens/Dashboardshared.module.css';
import pageStyles from '../DashboardScreens/Dashboardpages.module.css';
import DashboardModal from './Dashboardmodal';
import ConfirmModal from './ConfirmModal';

const DashboardAnnouncements = ({ data, setData }) => {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', body: '', pinned: false });
  const [confirmId, setConfirmId] = useState(null);

  const handleAdd = () => {
    if (!form.title || !form.body) return;
    const entry = { id: Date.now(), ...form, date: 'Feb 20, 2026', author: 'Admin' };
    setData(prev => ({ ...prev, announcements: [entry, ...prev.announcements] }));
    setForm({ title: '', body: '', pinned: false });
    setModal(false);
  };

  const handleDelete = () => {
    const id = confirmId;
    setConfirmId(null);
    setData(prev => ({ ...prev, announcements: prev.announcements.filter(a => a.id !== id) }));
  };

  const handleTogglePin = id =>
    setData(prev => ({
      ...prev,
      announcements: prev.announcements.map(a =>
        a.id === id ? { ...a, pinned: !a.pinned } : a
      ),
    }));

  return (
    <div>
      {/* ── Header ── */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>📢 <span>Announcements</span></span>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setModal(true)}>
          + New Announcement
        </button>
      </div>

      {/* ── Cards ── */}
      {data.announcements.map(ann => (
        <div
          key={ann.id}
          className={`${pageStyles.annCard} ${ann.pinned ? pageStyles.annCardPinned : ''}`}
        >
          <div className={pageStyles.annHeader}>
            <div style={{ flex: 1 }}>
              <div className={pageStyles.annTitle}>
                {ann.pinned && <span className={pageStyles.pinIcon}>📌 </span>}
                {ann.title}
              </div>
              <div className={pageStyles.annBody}>{ann.body}</div>
              <div className={pageStyles.annMeta}>By {ann.author} · {ann.date}</div>
            </div>
            <div className={pageStyles.annActions}>
              <button
                className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                onClick={() => handleTogglePin(ann.id)}
              >
                {ann.pinned ? 'Unpin' : 'Pin'}
              </button>
              <button
                className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                onClick={() => setConfirmId(ann.id)}
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      ))}

      {data.announcements.length === 0 && (
        <div className={styles.empty}>No announcements yet</div>
      )}

      {/* ── Confirm Delete Modal ── */}
      {confirmId && (
        <ConfirmModal
          message="Are you sure you want to delete this announcement? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {/* ── Modal ── */}
      {modal && (
        <DashboardModal title="New Announcement" onClose={() => setModal(false)}>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.label}>Title</label>
              <input className={styles.input} placeholder="Announcement title"
                value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.label}>Message</label>
              <textarea className={styles.textarea} placeholder="Write your announcement here..."
                value={form.body} onChange={e => setForm(p => ({ ...p, body: e.target.value }))} />
            </div>
            <div className={styles.formGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.pinned}
                  onChange={e => setForm(p => ({ ...p, pinned: e.target.checked }))}
                />
                <span className={styles.label} style={{ marginBottom: 0 }}>Pin this announcement</span>
              </label>
            </div>
          </div>
          <div className={styles.modalActions}>
            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setModal(false)}>Cancel</button>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdd}>Publish</button>
          </div>
        </DashboardModal>
      )}
    </div>
  );
};

export default DashboardAnnouncements;