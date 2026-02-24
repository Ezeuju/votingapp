// src/COMPONENTS/DashboardScreens/DashboardLiveUpdates.jsx
import React, { useState } from 'react';
import styles from '../DashboardScreens/Dashboardshared.module.css';
import pageStyles from '../DashboardScreens/Dashboardpages.module.css';
import DashboardModal from './Dashboardmodal';
import { adminApi } from '../../services/adminApi';
import { useTableData } from '../../hooks/useTableData';

const DashboardLiveUpdates = () => {
  const { data: updates, loading, refetch } = useTableData(adminApi.getLiveUpdates);
  const [modal, setModal] = useState(false);
  const [text, setText] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleAdd = async () => {
    if (!text.trim()) return;
    setSubmitting(true);
    try {
      await adminApi.createLiveUpdate(text);
      setText('');
      setModal(false);
      refetch();
    } catch (error) {
      console.error('Failed to create update:', error);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminApi.deleteLiveUpdate(id);
      refetch();
    } catch (error) {
      console.error('Failed to delete update:', error);
    }
  };

  const handleTogglePin = async (id, currentPin) => {
    try {
      await adminApi.updateLiveUpdate(id, !currentPin);
      refetch();
    } catch (error) {
      console.error('Failed to toggle pin:', error);
    }
  };

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
      {loading ? (
        <div className={styles.empty}>Loading updates...</div>
      ) : (
        <div className={pageStyles.updateList}>
          {updates.map(u => (
            <div
              key={u._id}
              className={`${pageStyles.updateItem} ${u.is_pin ? pageStyles.updateItemPinned : ''}`}
            >
              <div className={pageStyles.updateContent}>
                <div className={pageStyles.updateText}>
                  {u.is_pin && <span style={{ color: '#FFD700' }}>📌 </span>}
                  {u.message}
                </div>
                <div className={pageStyles.updateMeta}>
                  {new Date(u.date).toLocaleString('en-GB', { 
                    day: 'numeric', 
                    month: 'short', 
                    year: 'numeric',
                    hour: '2-digit',
                    minute: '2-digit'
                  })}
                </div>
              </div>
              <div className={pageStyles.updateActions}>
                <button
                  className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                  onClick={() => handleTogglePin(u._id, u.is_pin)}
                >
                  {u.is_pin ? 'Unpin' : 'Pin'}
                </button>
                <button
                  className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                  onClick={() => handleDelete(u._id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
          {updates.length === 0 && (
            <div className={styles.empty}>No live updates posted yet</div>
          )}
        </div>
      )}

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
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdd} disabled={submitting}>
              {submitting ? 'Posting...' : '🔴 Go Live'}
            </button>
          </div>
        </DashboardModal>
      )}
    </div>
  );
};

export default DashboardLiveUpdates;
