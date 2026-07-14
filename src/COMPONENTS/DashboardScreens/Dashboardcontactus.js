import React, { useState, useEffect, useCallback } from 'react';
import styles from '../../CSS-MODULES/Contactus.module.css';
import shared from './Dashboardshared.module.css';
import DashboardModal from './Dashboardmodal';
import ConfirmModal from './ConfirmModal';
import { contactApi } from '../../services/contactApi';
import { useToast } from '../Toast';

const STATUS_CLASS = {
  Unread: styles.statusUnread,
  Read: styles.statusRead,
};

const DashboardContactUs = () => {
  const { showToast } = useToast();
  const [messages, setMessages] = useState([]);
  const [stats, setStats] = useState({ total_messages: 0, total_unread: 0, total_read: 0 });
  const [loading, setLoading] = useState(false);
  const [viewEntry, setViewEntry] = useState(null);
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('All');
  const [confirmId, setConfirmId] = useState(null);

  const fetchMessages = useCallback(async () => {
    setLoading(true);
    try {
      const params = { search };
      if (filter !== 'All') params.status = filter;
      const response = await contactApi.admin.getAll(params);
      setMessages(response.data.data || []);
    } catch (error) {
      showToast(error.message || 'Failed to fetch messages', 'error');
    } finally {
      setLoading(false);
    }
  }, [filter, search, showToast]);

  const fetchStats = useCallback(async () => {
    try {
      const response = await contactApi.admin.getStats();
      setStats(response.data || { total_messages: 0, total_unread: 0, total_read: 0 });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    }
  }, []);

  useEffect(() => {
    fetchMessages();
    fetchStats();
  }, [fetchMessages, fetchStats]);

  const handleDelete = async () => {
    const id = confirmId;
    setConfirmId(null);
    try {
      await contactApi.admin.delete(id);
      showToast('Message deleted successfully', 'success');
      fetchMessages();
      fetchStats();
    } catch (error) {
      showToast(error.message || 'Failed to delete message', 'error');
    }
  };

  const handleMarkAsRead = async (id) => {
    try {
      await contactApi.admin.updateStatus(id, true);
      showToast('Message marked as read', 'success');
      fetchMessages();
      fetchStats();
      if (viewEntry && viewEntry._id === id) {
        setViewEntry({ ...viewEntry, status: 'Read', is_read: true });
      }
    } catch (error) {
      showToast(error.message || 'Failed to update message', 'error');
    }
  };

  const handleView = async (msg) => {
    try {
      const response = await contactApi.admin.getById(msg._id);
      const fullMessage = response.data.data || response.data;
      setViewEntry(fullMessage);
      if (!msg.is_read) {
        await handleMarkAsRead(msg._id);
      }
    } catch (error) {
      showToast(error.message || 'Failed to load message', 'error');
    }
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' });
  };

  const formatTime = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString('en-GB', { hour: '2-digit', minute: '2-digit' });
  };

  const filtered = messages;

  const counts = {
    total: stats.total_messages,
    unread: stats.total_unread,
    read: stats.total_read,
  };

  return (
    <div>
      {/* ── Stat Strip ── */}
      <div className={styles.statStrip}>
        <div className={styles.statStripCard}>
          <span className={styles.statStripIcon}>💬</span>
          <div>
            <div className={styles.statStripValue}>{counts.total}</div>
            <div className={styles.statStripLabel}>Total Messages</div>
          </div>
        </div>
        <div className={styles.statStripCard}>
          <span className={styles.statStripIcon}>🔔</span>
          <div>
            <div className={styles.statStripValue}>{counts.unread}</div>
            <div className={styles.statStripLabel}>Unread</div>
          </div>
        </div>
        <div className={styles.statStripCard}>
          <span className={styles.statStripIcon}>👁️</span>
          <div>
            <div className={styles.statStripValue}>{counts.read}</div>
            <div className={styles.statStripLabel}>Read</div>
          </div>
        </div>
        {/* <div className={styles.statStripCard}>
          <span className={styles.statStripIcon}>✉️</span>
          <div>
            <div className={styles.statStripValue}>{counts.replied}</div>
            <div className={styles.statStripLabel}>Replied</div>
          </div>
        </div> */}
      </div>

      {/* ── Header ── */}
      <div className={shared.sectionHeader}>
        <span className={shared.sectionTitle}>💬 <span>Contact Messages</span></span>
        {/* <button className={`${shared.btn} ${shared.btnPrimary}`} onClick={() => setModal(true)}>
          + Add Message
        </button> */}
      </div>

      {/* ── Search ── */}
      <div className={shared.searchWrap}>
        <span className={shared.searchIcon}>🔍</span>
        <input
          className={shared.searchInput}
          placeholder="Search by name, email or subject..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Filter Tabs ── */}
      <div className={styles.filterTabs}>
        {['All', 'Unread', 'Read'].map(f => (
          <button
            key={f}
            className={`${styles.filterTab} ${filter === f ? styles.filterTabActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f} {f === 'Unread' && counts.unread > 0 ? `(${counts.unread})` : ''}
          </button>
        ))}
      </div>

      {/* ── Message List ── */}
      {loading ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>⏳</div>
          Loading messages...
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>💬</div>
          No messages found
        </div>
      ) : (
        <div className={styles.messageList}>
          {filtered.map(m => (
            <div
              key={m._id}
              className={`${styles.messageCard} ${m.status === 'Unread' ? styles.messageCardUnread : ''}`}
            >
              <div className={styles.msgAvatar}>{(m.name || '?')[0]}</div>
              <div className={styles.msgBody}>
                <div className={styles.msgTop}>
                  <span className={styles.msgName}>{m.name}</span>
                  <span className={styles.msgDate}>{formatDate(m.createdAt || m.date)} · {formatTime(m.createdAt || m.date)}</span>
                </div>
                <div className={styles.msgEmail}>{m.email}</div>
                <div className={styles.msgSubject}>{m.subject}</div>
                <div className={styles.msgPreview}>{m.message}</div>
                <div className={styles.msgActions}>
                  <button
                    className={`${shared.btn} ${shared.btnPrimary} ${shared.btnSm}`}
                    onClick={() => handleView(m)}
                  >
                    Read
                  </button>
                  <span className={STATUS_CLASS[m.status]}>{m.status}</span>
                  <button
                    className={`${shared.btn} ${shared.btnDanger} ${shared.btnSm}`}
                    style={{ marginLeft: 'auto' }}
                    onClick={() => setConfirmId(m._id)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Confirm Delete Modal ── */}
      {confirmId && (
        <ConfirmModal
          message="Are you sure you want to delete this message? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {/* ── Full Message View Modal ── */}
      {viewEntry && (
        <DashboardModal title="Message" onClose={() => setViewEntry(null)}>
          <div className={styles.msgFullSubject}>{viewEntry.subject}</div>
          <div className={styles.msgFullMeta}>
            <span className={styles.msgFullMetaItem}>👤 {viewEntry.name}</span>
            <span className={styles.msgFullMetaItem}>📧 {viewEntry.email}</span>
            <span className={styles.msgFullMetaItem}>📞 {viewEntry.phone}</span>
            <span className={styles.msgFullMetaItem}>📅 {formatDate(viewEntry.createdAt || viewEntry.date)} · {formatTime(viewEntry.createdAt || viewEntry.date)}</span>
            <span className={STATUS_CLASS[viewEntry.status]}>{viewEntry.status}</span>
          </div>
          <div className={styles.msgFullBody}>{viewEntry.message}</div>
          <div className={shared.modalActions}>
            <button className={`${shared.btn} ${shared.btnOutline}`} onClick={() => setViewEntry(null)}>
              Close
            </button>
          </div>
        </DashboardModal>
      )}
    </div>
  );
};

export default DashboardContactUs;
