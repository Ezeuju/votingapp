// src/COMPONENTS/DashboardScreens/DashboardTickets.js
import React, { useState, useEffect, useCallback } from 'react';
import styles from '../DashboardScreens/Dashboardshared.module.css';
import DashboardModal from './Dashboardmodal';
import { STATUS_MAP } from './Dashboarddata';
import { adminApi } from '../../services/adminApi';
import { planApi } from '../../services';

const TICKET_TYPE_BADGE = {};
const getBadge = (ticketType) => {
  if (!ticketType) return 'badgeInfo';
  const l = ticketType.toLowerCase();
  if (l.includes('vip') || l.includes('gold')) return 'badgeWarning';
  if (l.includes('silver')) return 'badgeInfo';
  return 'badgeInfo';
};

const EMPTY_FORM = { full_name: '', email: '', ticket_plan_id: '' };

const fmt = (dateStr) => {
  if (!dateStr) return '—';
  try {
    return new Date(dateStr).toLocaleDateString('en-GB', {
      day: 'numeric', month: 'short', year: 'numeric',
    });
  } catch { return dateStr; }
};

const fmtAmount = (amount) => {
  if (!amount && amount !== 0) return '—';
  return `₦${Number(amount).toLocaleString()}`;
};

const DashboardTickets = () => {
  const [tickets, setTickets]         = useState([]);
  const [stats, setStats]             = useState(null);
  const [plans, setPlans]             = useState([]);
  const [loading, setLoading]         = useState(true);
  const [statsLoading, setStatsLoading] = useState(true);

  // Pagination / search
  const [search, setSearch]           = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [pageNo, setPageNo]           = useState(1);
  const [totalPages, setTotalPages]   = useState(1);
  const [totalCount, setTotalCount]   = useState(0);
  const limitNo = 10;

  // Modals
  const [issueModal, setIssueModal]   = useState(false);
  const [viewEntry, setViewEntry]     = useState(null);
  const [viewLoading, setViewLoading] = useState(false);
  const [editPlanMode, setEditPlanMode] = useState(false);

  // Issue/Edit form
  const [form, setForm]               = useState(EMPTY_FORM);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError]     = useState('');
  const [formSuccess, setFormSuccess] = useState('');

  // Edit ticket plan (in view modal)
  const [editPlanId, setEditPlanId]       = useState('');
  const [editStatus, setEditStatus]       = useState('');
  const [editLoading, setEditLoading]     = useState(false);
  const [editError, setEditError]         = useState('');

  const field = (key, val) => setForm(p => ({ ...p, [key]: val }));

  // ---------- fetch helpers ----------
  const loadStats = useCallback(async () => {
    setStatsLoading(true);
    try {
      const res = await adminApi.getTicketStats();
      setStats(res?.data || null);
    } catch (e) {
      console.error('Stats error:', e);
    } finally {
      setStatsLoading(false);
    }
  }, []);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    try {
      const res = await adminApi.getTickets({ pageNo, limitNo, search });
      const wrapper = res?.data?.[0] || res?.data || {};
      setTickets(wrapper?.data || []);
      const meta = wrapper?.metadata || {};
      setTotalPages(meta.pages || 1);
      setTotalCount(meta.total || 0);
    } catch (e) {
      console.error('Tickets error:', e);
    } finally {
      setLoading(false);
    }
  }, [pageNo, search]);

  const loadPlans = useCallback(async () => {
    try {
      const res = await planApi.getAll('ticket');
      setPlans(res?.data?.data || []);
    } catch (e) {
      console.error('Plans error:', e);
    }
  }, []);

  useEffect(() => { loadStats(); loadPlans(); }, [loadStats, loadPlans]);
  useEffect(() => { loadTickets(); }, [loadTickets]);

  // Search debounce
  useEffect(() => {
    const t = setTimeout(() => { setSearch(searchInput); setPageNo(1); }, 500);
    return () => clearTimeout(t);
  }, [searchInput]);

  // ---------- issue ticket ----------
  const handleIssue = async () => {
    if (!form.full_name || !form.ticket_plan_id) {
      setFormError('Please fill in all required fields.');
      return;
    }
    setFormLoading(true);
    setFormError('');
    try {
      await adminApi.issueTicket(form);
      setFormSuccess('Ticket issued successfully!');
      setForm(EMPTY_FORM);
      await loadTickets();
      await loadStats();
      setTimeout(() => { setIssueModal(false); setFormSuccess(''); }, 1500);
    } catch (e) {
      setFormError(e?.message || 'Failed to issue ticket.');
    } finally {
      setFormLoading(false);
    }
  };

  // ---------- view single ticket ----------
  const handleView = async (ticket) => {
    setViewEntry(ticket);
    setEditPlanMode(false);
    setEditPlanId(ticket.ticket_plan_id || '');
    setEditStatus(ticket.status || '');
    setEditError('');
    setViewLoading(true);
    try {
      const res = await adminApi.getTicketById(ticket._id);
      const data = res?.data || ticket;
      setViewEntry(data);
      setEditPlanId(data.ticket_plan_id || '');
      setEditStatus(data.status || '');
    } catch (e) {
      console.error('View error:', e);
    } finally {
      setViewLoading(false);
    }
  };

  // ---------- update ticket (plan / status) ----------
  const handleUpdateTicket = async () => {
    if (!viewEntry?._id) return;
    setEditLoading(true);
    setEditError('');
    try {
      const payload = { ticket_plan_id: editPlanId, status: editStatus };
      const res = await adminApi.updateTicket(viewEntry._id, payload);
      const updated = res?.data || { ...viewEntry, ticket_plan_id: editPlanId, status: editStatus };
      setViewEntry(updated);
      setEditPlanMode(false);
      await loadTickets();
      await loadStats();
    } catch (e) {
      setEditError(e?.message || 'Failed to update ticket.');
    } finally {
      setEditLoading(false);
    }
  };

  // ---------- mark active ----------
  const handleMarkActive = async (ticket) => {
    try {
      await adminApi.updateTicket(ticket._id, { ticket_plan_id: ticket.ticket_plan_id, status: 'Active' });
      await loadTickets();
      await loadStats();
    } catch (e) {
      console.error('Mark active error:', e);
    }
  };

  // ---------- mark used ----------
  const handleMarkUsed = async (ticket) => {
    try {
      await adminApi.updateTicket(ticket._id, { ticket_plan_id: ticket.ticket_plan_id, status: 'Used' });
      await loadTickets();
      await loadStats();
    } catch (e) {
      console.error('Mark used error:', e);
    }
  };

  // ---------- revoke ----------
  const handleRevoke = async (ticket) => {
    try {
      await adminApi.updateTicket(ticket._id, { ticket_plan_id: ticket.ticket_plan_id, status: 'Revoked' });
      await loadTickets();
      await loadStats();
    } catch (e) {
      console.error('Revoke error:', e);
    }
  };

  // ---------- stats cards ----------
  const summaryStats = [
    { icon: '🎫', label: 'Total Tickets',  count: stats?.total_tickets   ?? '…' },
    { icon: '✅', label: 'Active',          count: stats?.active_tickets  ?? '…' },
    { icon: '🔵', label: 'Used',            count: stats?.used_tickets    ?? '…' },
    { icon: '⏳', label: 'Pending',         count: stats?.pending_tickets ?? '…' },
    { icon: '🚫', label: 'Revoked',         count: stats?.revoked_tickets ?? '…' },
  ];

  const planName = (id) => plans.find(p => p._id === id)?.title || id || '—';

  return (
    <div>
      {/* ── Summary Stats ── */}
      <div className={styles.statsGrid}>
        {summaryStats.map(st => (
          <div className={styles.statCard} key={st.label}>
            <div className={styles.statIcon}>{st.icon}</div>
            <div className={styles.statValue}>{statsLoading ? '…' : st.count}</div>
            <div className={styles.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* ── Header ── */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>Issued <span>Tickets</span></span>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => { setIssueModal(true); setFormError(''); setFormSuccess(''); }}>
          + Issue Ticket
        </button>
      </div>

      {/* ── Search ── */}
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          placeholder="Search by name, email or ticket ID..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
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
              <th>Amount</th>
              <th>Date</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className={styles.emptyRow}>Loading tickets…</td></tr>
            ) : tickets.length === 0 ? (
              <tr><td colSpan={8} className={styles.emptyRow}>No tickets found</td></tr>
            ) : tickets.map(t => (
              <tr key={t._id} className={styles.clickableRow} onClick={() => handleView(t)}>
                <td className={`${styles.tdMono} ${styles.tdGold}`}>{t.ticket_id}</td>
                <td className={styles.tdBold}>{t.full_name}</td>
                <td className={styles.tdMuted}>{t.email || '—'}</td>
                <td>
                  <span className={`${styles.badge} ${styles[getBadge(t.ticket_type)]}`}>
                    {t.ticket_type || '—'}
                  </span>
                </td>
                <td className={styles.tdMuted}>{fmtAmount(t.ticket_amount)}</td>
                <td className={styles.tdMuted}>{fmt(t.date)}</td>
                <td>
                  <span className={`${styles.badge} ${styles[STATUS_MAP[t.status] || 'badgeInfo']}`}>
                    {t.status}
                  </span>
                </td>
                <td>
                  <div style={{ display: 'flex', gap: 6 }} onClick={e => e.stopPropagation()}>
                    <button
                      className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                      onClick={() => handleView(t)}
                    >
                      View
                    </button>
                    {t.status === 'Active' && (
                      <button
                        className={`${styles.btn} ${styles.btnGreen} ${styles.btnSm}`}
                        onClick={() => handleMarkUsed(t)}
                      >
                        Mark Used
                      </button>
                    )}
                    {(t.status === 'Pending' || t.status === 'Used') && (
                      <button
                        className={`${styles.btn} ${styles.btnGreen} ${styles.btnSm}`}
                        onClick={() => handleMarkActive(t)}
                      >
                        Activate
                      </button>
                    )}
                    {t.status !== 'Revoked' && (
                      <button
                        className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                        onClick={() => handleRevoke(t)}
                      >
                        Revoke
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Pagination ── */}
      {totalPages > 1 && (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 12, marginTop: 16 }}>
          <button
            className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
            disabled={pageNo <= 1}
            onClick={() => setPageNo(p => p - 1)}
          >
            ← Prev
          </button>
          <span style={{ color: '#a8c4a8', fontSize: 13 }}>Page {pageNo} of {totalPages}</span>
          <button
            className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
            disabled={pageNo >= totalPages}
            onClick={() => setPageNo(p => p + 1)}
          >
            Next →
          </button>
        </div>
      )}

      {/* ── Issue Ticket Modal ── */}
      {issueModal && (
        <DashboardModal title="Issue New Ticket" onClose={() => { setIssueModal(false); setForm(EMPTY_FORM); setFormError(''); setFormSuccess(''); }}>
          <div className={styles.formGrid}>

            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.label}>Full Name *</label>
              <input
                className={styles.input}
                placeholder="e.g. Ada Nwosu"
                value={form.full_name}
                onChange={e => field('full_name', e.target.value)}
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

            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <label className={styles.label}>Ticket Plan *</label>
              <select
                className={styles.select}
                value={form.ticket_plan_id}
                onChange={e => field('ticket_plan_id', e.target.value)}
              >
                <option value="">— Select a ticket plan —</option>
                {plans.map(p => (
                  <option key={p._id} value={p._id}>{p.title} — ₦{Number(p.amount).toLocaleString()}</option>
                ))}
              </select>
            </div>

          </div>

          {formError && <p style={{ color: '#f87171', fontSize: 13, marginTop: 8 }}>{formError}</p>}
          {formSuccess && <p style={{ color: '#4ade80', fontSize: 13, marginTop: 8 }}>{formSuccess}</p>}

          <div className={styles.modalActions}>
            <button
              className={`${styles.btn} ${styles.btnOutline}`}
              onClick={() => { setIssueModal(false); setForm(EMPTY_FORM); setFormError(''); setFormSuccess(''); }}
            >
              Cancel
            </button>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={handleIssue}
              disabled={formLoading}
            >
              {formLoading ? 'Issuing…' : 'Issue Ticket'}
            </button>
          </div>
        </DashboardModal>
      )}

      {/* ── View / Edit Ticket Modal ── */}
      {viewEntry && (
        <DashboardModal title="Ticket Details" onClose={() => { setViewEntry(null); setEditPlanMode(false); setEditError(''); }}>
          {viewLoading ? (
            <div style={{ textAlign: 'center', padding: 24, color: '#a8c4a8' }}>Loading…</div>
          ) : (
            <>
              <div className={styles.formGrid}>
                {[
                  { label: 'Ticket ID',  value: viewEntry.ticket_id },
                  { label: 'Full Name',  value: viewEntry.full_name },
                  { label: 'Email',      value: viewEntry.email || '—' },
                  { label: 'Date',       value: fmt(viewEntry.createdAt || viewEntry.date) },
                  { label: 'Admin Issued', value: viewEntry.is_admin_issued ? 'Yes' : 'No' },
                ].map(row => (
                  <div className={styles.formGroup} key={row.label}>
                    <span className={styles.label}>{row.label}</span>
                    <span style={{ color: '#e8f5e8', fontSize: 14, fontWeight: 500 }}>{row.value || '—'}</span>
                  </div>
                ))}

                {/* Ticket Plan — editable */}
                <div className={styles.formGroup}>
                  <span className={styles.label}>Ticket Plan</span>
                  {editPlanMode ? (
                    <select
                      className={styles.select}
                      value={editPlanId}
                      onChange={e => setEditPlanId(e.target.value)}
                      style={{ marginTop: 4 }}
                    >
                      <option value="">— Select plan —</option>
                      {plans.map(p => (
                        <option key={p._id} value={p._id}>{p.title} — ₦{Number(p.amount).toLocaleString()}</option>
                      ))}
                    </select>
                  ) : (
                    <div style={{ marginTop: 4 }}>
                      <span className={`${styles.badge} ${styles[getBadge(viewEntry.ticket_type)]}`}>
                        {viewEntry.ticket_type || planName(viewEntry.ticket_plan_id)}
                      </span>
                    </div>
                  )}
                </div>

                {/* Status — editable when in edit mode */}
                <div className={styles.formGroup}>
                  <span className={styles.label}>Status</span>
                  {editPlanMode ? (
                    <select
                      className={styles.select}
                      value={editStatus}
                      onChange={e => setEditStatus(e.target.value)}
                      style={{ marginTop: 4 }}
                    >
                      <option value="Active">Active</option>
                      <option value="Used">Used</option>
                      <option value="Revoked">Revoked</option>
                      <option value="Pending">Pending</option>
                    </select>
                  ) : (
                    <div style={{ marginTop: 4 }}>
                      <span className={`${styles.badge} ${styles[STATUS_MAP[viewEntry.status] || 'badgeInfo']}`}>
                        {viewEntry.status}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {editError && <p style={{ color: '#f87171', fontSize: 13, marginTop: 8 }}>{editError}</p>}

              <div className={styles.modalActions}>
                {editPlanMode ? (
                  <>
                    <button
                      className={`${styles.btn} ${styles.btnOutline}`}
                      onClick={() => { setEditPlanMode(false); setEditPlanId(viewEntry.ticket_plan_id || ''); setEditStatus(viewEntry.status || ''); setEditError(''); }}
                    >
                      Cancel
                    </button>
                    <button
                      className={`${styles.btn} ${styles.btnPrimary}`}
                      onClick={handleUpdateTicket}
                      disabled={editLoading}
                    >
                      {editLoading ? 'Saving…' : 'Save Changes'}
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      className={`${styles.btn} ${styles.btnOutline}`}
                      style={{ borderColor: '#FFD700', color: '#FFD700' }}
                      onClick={() => setEditPlanMode(true)}
                    >
                      ✏️ Edit Ticket
                    </button>
                    {viewEntry.status === 'Active' && (
                      <button
                        className={`${styles.btn} ${styles.btnGreen}`}
                        onClick={async () => { await handleMarkUsed(viewEntry); setViewEntry(null); }}
                      >
                        ✓ Mark as Used
                      </button>
                    )}
                    {(viewEntry.status === 'Pending' || viewEntry.status === 'Used') && (
                      <button
                        className={`${styles.btn} ${styles.btnGreen}`}
                        onClick={async () => { await handleMarkActive(viewEntry); setViewEntry(null); }}
                      >
                        ✓ Activate
                      </button>
                    )}
                    {viewEntry.status !== 'Revoked' && (
                      <button
                        className={`${styles.btn} ${styles.btnDanger}`}
                        onClick={async () => { await handleRevoke(viewEntry); setViewEntry(null); }}
                      >
                        Revoke Ticket
                      </button>
                    )}
                    <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => { setViewEntry(null); setEditPlanMode(false); }}>
                      Close
                    </button>
                  </>
                )}
              </div>
            </>
          )}
        </DashboardModal>
      )}
    </div>
  );
};

export default DashboardTickets;