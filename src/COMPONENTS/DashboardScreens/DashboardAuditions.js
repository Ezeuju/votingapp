import React, { useState, useEffect } from 'react';
import styles from '../DashboardScreens/Dashboardshared.module.css';
import DashboardModal from './Dashboardmodal';
import ConfirmModal from './ConfirmModal';
import { STATUS_MAP } from './Dashboarddata';
import { useTableData } from '../../hooks/useTableData';
import { adminApi } from '../../services/adminApi';

const DashboardAuditions = ({ setData: setDashboardData }) => {
  const [viewDetails, setViewDetails] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [searchInput, setSearchInput] = useState('');
  const [stats, setStats] = useState(null);
  const [confirmId, setConfirmId] = useState(null);

  const { data, metadata, loading, error, params, setPage, setSearch, refetch } = useTableData(
    adminApi.getUsers,
    { account_type: 'Applicant' }
  );

  const fetchStats = async () => {
    try {
      const response = await adminApi.getAuditionStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput, setSearch]);

  const getLocation = (user) => {
    if (user.state) return `${user.state}, ${user.country}`;
    if (user.location) return `${user.location}, ${user.country}`;
    return user.country;
  };

  const getPlanBadge = (plan) => {
    if (plan?.includes('Silver')) return 'badgeInfo';
    if (plan?.includes('Gold')) return 'badgeWarning';
    if (plan?.includes('VIP')) return 'badgeGreen';
    return 'badgeInfo';
  };

  const handleViewDetails = async (userId) => {
    try {
      const response = await adminApi.getUserById(userId);
      setViewDetails(response.data);
    } catch (err) {
      console.error('Failed to fetch user details:', err);
    }
  };

  const handleDelete = async () => {
    const userId = confirmId;
    setConfirmId(null);
    try {
      await adminApi.deleteAudition(userId);
      await fetchStats();
      refetch();
    } catch (err) {
      console.error('Failed to delete audition:', err);
      alert('Failed to delete audition registration');
    }
  };

  const counts = {
    total: stats?.total_registrations || 0,
    silver: stats?.total_silver || 0,
    gold: stats?.total_gold || 0,
    vip: stats?.total_vip || 0,
    confirmed: stats?.total_confirmed || 0,
    pending: stats?.total_pending || 0,
  };

  return (
    <div>
      {/* ── Summary Stats ── */}
      <div className={styles.statsGrid}>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🎤</div>
          <div className={styles.statValue}>{counts.total}</div>
          <div className={styles.statLabel}>Total Registrations</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🥈</div>
          <div className={styles.statValue}>{counts.silver}</div>
          <div className={styles.statLabel}>Silver Pass</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>🥇</div>
          <div className={styles.statValue}>{counts.gold}</div>
          <div className={styles.statLabel}>Gold Pass</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>💎</div>
          <div className={styles.statValue}>{counts.vip}</div>
          <div className={styles.statLabel}>VIP Pass</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>✅</div>
          <div className={styles.statValue}>{counts.confirmed}</div>
          <div className={styles.statLabel}>Confirmed</div>
        </div>
        <div className={styles.statCard}>
          <div className={styles.statIcon}>⏳</div>
          <div className={styles.statValue}>{counts.pending}</div>
          <div className={styles.statLabel}>Pending</div>
        </div>
      </div>

      {/* ── Header ── */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>🎤 <span>Audition Registrations</span></span>
        {/* <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setModal(true)}>
          + Add Registration
        </button> */}
      </div>

      {/* ── Search ── */}
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          placeholder="Search by name, email, country or plan..."
          value={searchInput}
          onChange={e => setSearchInput(e.target.value)}
        />
      </div>

      {loading && <div style={{ textAlign: 'center', padding: '20px', color: '#FFD700' }}>Loading...</div>}
      {error && <div style={{ textAlign: 'center', padding: '20px', color: '#ff4444' }}>{error}</div>}

      {/* ── Table ── */}
      {!loading && (
        <>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Country / Location</th>
                  <th>Category</th>
                  <th>Date & Time</th>
                  <th>Plan</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {data.map(a => (
                  <tr key={a._id} className={styles.clickableRow} onClick={() => handleViewDetails(a._id)}>
                    <td className={styles.tdBold}>{a.first_name} {a.last_name}</td>
                    <td className={styles.tdMuted}>{a.email}</td>
                    <td className={styles.tdMuted}>{a.phone || 'N/A'}</td>
                    <td>{getLocation(a)}</td>
                    <td className={styles.tdMuted}>{a.talent_category || 'N/A'}</td>
                    <td className={styles.tdMuted}>
                      {new Date(a.date).toLocaleDateString()}
                      <br />
                      <span style={{ color: '#FFD700', fontSize: 11 }}>
                        {new Date(a.date).toLocaleTimeString()}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles[getPlanBadge(a.audition_plan)]}`}>
                        {a.audition_plan || 'N/A'}
                      </span>
                    </td>
                    <td>
                      <span className={`${styles.badge} ${styles[STATUS_MAP[a.account_status]]}`}>
                        {a.account_status}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
                        <button
                          className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                          onClick={() => handleViewDetails(a._id)}
                        >
                          View
                        </button>
                        <button
                          className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                          onClick={() => setConfirmId(a._id)}
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {data.length === 0 && (
                  <tr>
                    <td colSpan={9} className={styles.emptyRow}>No audition registrations found</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          {/* ── Pagination ── */}
          {metadata.pages > 1 && (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '10px', marginTop: '20px' }}>
              <button
                className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                onClick={() => setPage(params.pageNo - 1)}
                disabled={params.pageNo <= 1}
              >
                Previous
              </button>
              <span style={{ color: '#FFD700' }}>
                Page {params.pageNo} of {metadata.pages} ({metadata.total} total)
              </span>
              <button
                className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                onClick={() => setPage(params.pageNo + 1)}
                disabled={params.pageNo >= metadata.pages}
              >
                Next
              </button>
            </div>
          )}
        </>
      )}



      {/* ── Confirm Delete Modal ── */}
      {confirmId && (
        <ConfirmModal
          message="Are you sure you want to delete this audition registration? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {/* ── View Details Modal ── */}
      {viewDetails && (
        <DashboardModal title="Registrant Details" onClose={() => setViewDetails(null)}>
          {viewDetails.photo && (
            <div style={{ textAlign: 'center', marginBottom: '20px' }}>
              <img
                src={viewDetails.photo}
                alt="Profile"
                style={{
                  width: '120px',
                  height: '120px',
                  borderRadius: '50%',
                  objectFit: 'cover',
                  cursor: 'pointer',
                  border: '3px solid #008751',
                  boxShadow: '0 4px 12px rgba(0,0,0,0.2)'
                }}
                onClick={() => setPreviewImage(viewDetails.photo)}
                title="Click to preview full image"
              />
            </div>
          )}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px 24px' }}>
            {[
              { label: 'First Name', value: viewDetails.first_name },
              { label: 'Last Name', value: viewDetails.last_name },
              { label: 'Email', value: viewDetails.email },
              { label: 'Phone', value: viewDetails.phone },
              { label: 'Country', value: viewDetails.country },
              { label: 'State', value: viewDetails.state },
              { label: 'Town', value: viewDetails.town },
              { label: 'Street Address', value: viewDetails.street_address },
              { label: 'Category', value: viewDetails.talent_category },
              { label: 'Account Type', value: viewDetails.account_type },
              { label: 'Role', value: viewDetails.role },
            ].map(row => (
              <div key={row.label}>
                <div className={styles.label} style={{ marginBottom: 4 }}>{row.label}</div>
                <div style={{ color: '#e8f5e8', fontSize: 14, fontWeight: 500 }}>{row.value || 'N/A'}</div>
              </div>
            ))}
            <div style={{ gridColumn: '1 / -1' }}>
              <div className={styles.label} style={{ marginBottom: 6 }}>Status</div>
              <span className={`${styles.badge} ${styles[STATUS_MAP[viewDetails.account_status]]}`}>
                {viewDetails.account_status}
              </span>
            </div>
          </div>
          {viewDetails.video && (
            <div style={{ marginTop: '24px', marginBottom: '20px' }}>
              <div className={styles.label} style={{ marginBottom: 8 }}>Introduction Video</div>
              <video
                src={viewDetails.video}
                controls
                preload="metadata"
                style={{
                  width: '100%',
                  borderRadius: '8px',
                  backgroundColor: '#000',
                  border: '1px solid rgba(0, 135, 81, 0.3)'
                }}
              />
            </div>
          )}
          {!viewDetails.video && (
            <div style={{ marginTop: '24px', marginBottom: '20px', color: 'rgba(232, 245, 232, 0.5)', fontSize: '14px' }}>
              <div className={styles.label} style={{ marginBottom: 8 }}>Introduction Video</div>
              <div>No video submitted</div>
            </div>
          )}
          <div className={styles.modalActions}>
            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setViewDetails(null)}>
              Close
            </button>
          </div>
        </DashboardModal>
      )}

      {/* ── Image Preview Lightbox ── */}
      {previewImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '40px'
          }}
          onClick={() => setPreviewImage(null)}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%', display: 'flex', justifyContent: 'center' }}>
            <button
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '30px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              onClick={() => setPreviewImage(null)}
            >
              ✕
            </button>
            <img
              src={previewImage}
              alt="Full Preview"
              style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px', boxShadow: '0 0 40px rgba(0,0,0,0.5)', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardAuditions;