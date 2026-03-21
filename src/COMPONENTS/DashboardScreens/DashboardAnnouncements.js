// src/COMPONENTS/DashboardScreens/DashboardAnnouncements.js
import React, { useState, useEffect } from 'react';
import styles from '../DashboardScreens/Dashboardshared.module.css';
import pageStyles from '../DashboardScreens/Dashboardpages.module.css';
import DashboardModal from './Dashboardmodal';
import ConfirmModal from './ConfirmModal';
import { adminApi } from '../../services/adminApi';
import { toast } from 'react-toastify';

const DashboardAnnouncements = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ title: '', description: '', start_date: '', end_date: '', is_pinned: false });
  const [confirmId, setConfirmId] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const resp = await adminApi.getTimelines({ limitNo: 100 });
      const data = resp.data?.data || [];
      setAnnouncements(data);
    } catch (err) {
      console.error("Failed to load announcements", err);
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return "";
    return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'short', day: 'numeric' });
  };
  
  const handleAdd = async () => {
    if (!form.title || !form.description) {
      toast.error("Please fill in Title and Message.");
      return;
    }
    setSaving(true);

    try {
      const payload = {
        title: form.title,
        description: form.description,
        is_pinned: form.is_pinned
      };
      
      if (form.start_date) payload.start_date = form.start_date;
      if (form.end_date) payload.end_date = form.end_date;

      await adminApi.createTimeline(payload);
      toast.success("Announcement published successfully!");
      setModal(false);
      setForm({ title: '', description: '', start_date: '', end_date: '', is_pinned: false });
      fetchAnnouncements();
    } catch (err) {
      console.error("Failed to add announcement", err);
      toast.error("Failed to add announcement");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!confirmId) return;
    const id = confirmId;
    setConfirmId(null);
    try {
      await adminApi.deleteTimeline(id);
      toast.success("Announcement deleted successfully!");
      fetchAnnouncements();
    } catch (err) {
      console.error("Failed to delete announcement", err);
      toast.error("Failed to delete announcement");
    }
  };

  const handleTogglePin = async (id, currentPinned) => {
    try {
      await adminApi.updateTimeline(id, { is_pinned: !currentPinned });
      toast.success("Pin status updated!");
      fetchAnnouncements();
    } catch (err) {
      console.error("Failed to update pin", err);
      toast.error("Failed to update pin status");
    }
  };

  return (
    <div>
      {/* ── Header ── */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>📢 <span>Announcements / Timeline</span></span>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setModal(true)}>
          + New Announcement
        </button>
      </div>

      {loading ? (
        <div className={styles.empty}>Loading announcements...</div>
      ) : (
        <>
          {/* ── Cards ── */}
          {announcements.map(ann => (
            <div
              key={ann._id}
              className={`${pageStyles.annCard} ${ann.is_pinned ? pageStyles.annCardPinned : ''}`}
            >
              <div className={pageStyles.annHeader}>
                <div style={{ flex: 1 }}>
                  <div className={pageStyles.annTitle}>
                    {ann.is_pinned && <span className={pageStyles.pinIcon}>📌 </span>}
                    {ann.title}
                  </div>
                  <div className={pageStyles.annBody}>{ann.description}</div>
                  <div className={pageStyles.annMeta}>
                    Timeline Date: {(ann.start_date && ann.end_date)
                      ? `${formatDate(ann.start_date)} - ${formatDate(ann.end_date)}`
                      : ann.start_date || ann.end_date 
                        ? formatDate(ann.start_date || ann.end_date)
                        : "N/A"
                    }
                  </div>
                </div>
                <div className={pageStyles.annActions}>
                  <button
                    className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                    onClick={() => handleTogglePin(ann._id, ann.is_pinned)}
                  >
                    {ann.is_pinned ? 'Unpin' : 'Pin'}
                  </button>
                  <button
                    className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                    onClick={() => setConfirmId(ann._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}

          {announcements.length === 0 && (
            <div className={styles.empty}>No announcements yet</div>
          )}
        </>
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
        <DashboardModal title="New Announcement / Timeline Event" onClose={() => setModal(false)}>
          <div className={styles.formGrid}>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.label}>Title</label>
              <input className={styles.input} placeholder="Announcement / Timeline title"
                value={form.title} onChange={e => setForm(p => ({ ...p, title: e.target.value }))} />
            </div>
            
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.label}>Timeline Dates</label>
              <div style={{ display: 'flex', gap: '16px' }}>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#888', marginBottom: '4px', display: 'block' }}>Start Date</label>
                  <input type="date" className={styles.input} 
                    value={form.start_date} onChange={e => setForm(p => ({ ...p, start_date: e.target.value }))} />
                </div>
                <div style={{ flex: 1 }}>
                  <label style={{ fontSize: '12px', color: '#888', marginBottom: '4px', display: 'block' }}>End Date (Optional)</label>
                  <input type="date" className={styles.input} 
                    value={form.end_date} onChange={e => setForm(p => ({ ...p, end_date: e.target.value }))} />
                </div>
              </div>
            </div>

            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.label}>Message / Description</label>
              <textarea className={styles.textarea} placeholder="Write your announcement details here..."
                value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))} />
            </div>
            <div className={styles.formGroup}>
              <label style={{ display: 'flex', alignItems: 'center', gap: 8, cursor: 'pointer' }}>
                <input
                  type="checkbox"
                  checked={form.is_pinned}
                  onChange={e => setForm(p => ({ ...p, is_pinned: e.target.checked }))}
                />
                <span className={styles.label} style={{ marginBottom: 0 }}>Pin this announcement</span>
              </label>
            </div>
          </div>
          <div className={styles.modalActions}>
            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setModal(false)} disabled={saving}>Cancel</button>
            <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={handleAdd} disabled={saving}>
              {saving ? 'Publishing...' : 'Publish'}
            </button>
          </div>
        </DashboardModal>
      )}
    </div>
  );
};

export default DashboardAnnouncements;