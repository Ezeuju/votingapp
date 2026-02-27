import React, { useState, useEffect, useCallback } from 'react';
import styles from '../DashboardScreens/Dashboardshared.module.css';
import DashboardModal from './Dashboardmodal';
import ConfirmModal from './ConfirmModal';
import { adminApi } from '../../services/adminApi';

const DashboardDonations = () => {
  const [donors, setDonors] = useState([]);
  const [stats, setStats] = useState({});
  const [metadata, setMetadata] = useState({});
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [viewEntry, setViewEntry] = useState(null);
  const [loading, setLoading] = useState(false);
  const [confirmId, setConfirmId] = useState(null);

const fetchDonors = useCallback(async () => {
  setLoading(true);
  try {
    const response = await adminApi.getDonors({
      pageNo: page,
      limitNo: 10,
      search
    });
    setDonors(response.data.data);
    setMetadata(response.data.metadata);
  } catch (err) {
    console.error('Failed to fetch donors:', err);
  } finally {
    setLoading(false);
  }
}, [page, search]);

  const fetchStats = async () => {
    try {
      const response = await adminApi.getDonorStats();
      setStats(response.data);
    } catch (err) {
      console.error('Failed to fetch stats:', err);
    }
  };

  useEffect(() => {
    fetchStats();
  }, [donors]);

useEffect(() => {
  fetchDonors();
}, [fetchDonors]);

  const handleDelete = async () => {
    const id = confirmId;
    setConfirmId(null);
    try {
      await adminApi.deleteDonor(id);
      await fetchStats();
      fetchDonors();
    } catch (err) {
      alert(err.message || 'Failed to delete donor');
    }
  };

  const handleView = async (id) => {
    try {
      const response = await adminApi.getDonorById(id);
      setViewEntry(response.data);
    } catch (err) {
      alert(err.message || 'Failed to fetch donor details');
    }
  };

  const summaryStats = [
    { icon: '💰', label: 'Total', count: stats.total_donors || 0 },
    { icon: '✅', label: 'Confirmed', count: stats.confirmed_donors || 0 },
    { icon: '⏳', label: 'Pending', count: stats.pending_donors || 0 },
    { icon: '🔁', label: 'Monthly', count: stats.monthly_donors || 0 },
  ];

  return (
    <div>
      {/* Stats */}
      <div className={styles.statsGrid}>
        {summaryStats.map(st => (
          <div className={styles.statCard} key={st.label}>
            <div className={styles.statIcon}>{st.icon}</div>
            <div className={styles.statValue}>{st.count}</div>
            <div className={styles.statLabel}>{st.label} Donations</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>All <span>Donations</span></span>
      </div>

      {/* Search */}
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          placeholder="Search by name, email or phone..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className={styles.tableScroll}>
        <table className={styles.table}>
          <thead>
            <tr>
              <th>Name</th>
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
            {loading ? (
              <tr><td colSpan={8} className={styles.emptyRow}>Loading...</td></tr>
            ) : donors.length === 0 ? (
              <tr><td colSpan={8} className={styles.emptyRow}>No donations found</td></tr>
            ) : (
              donors.map(d => (
                <tr key={d._id}>
                  <td className={styles.tdBold}>{d.first_name} {d.last_name}</td>
                  <td className={styles.tdMuted}>{d.email}</td>
                  <td className={styles.tdMuted}>{d.phone}</td>
                  <td className={styles.tdGold}>₦{d.total_donated?.toLocaleString()}</td>
                  <td>
                    <span className={`${styles.badge} ${d.type === 'monthly' ? styles.badgeSuccess : styles.badgeInfo}`}>
                      {d.type === 'monthly' ? '🔁 Monthly' : 'One-time'}
                    </span>
                  </td>
                  <td className={styles.tdMuted}>{new Date(d.date).toLocaleDateString()}</td>
                  <td>
                    <span className={`${styles.badge} ${d.payment_status === 'Confirmed' ? styles.badgeSuccess : styles.badgeWarning}`}>
                      {d.payment_status}
                    </span>
                  </td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <button
                        className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                        onClick={() => handleView(d._id)}
                      >
                        View
                      </button>
                      <button
                        className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                        onClick={() => setConfirmId(d._id)}
                      >
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {metadata.pages > 1 && (
        <div className={styles.pagination}>
          <button
            className={styles.btn}
            disabled={page === 1}
            onClick={() => setPage(page - 1)}
          >
            Previous
          </button>
          <span>Page {page} of {metadata.pages}</span>
          <button
            className={styles.btn}
            disabled={page === metadata.pages}
            onClick={() => setPage(page + 1)}
          >
            Next
          </button>
        </div>
      )}

      {/* Confirm Delete Modal */}
      {confirmId && (
        <ConfirmModal
          message="Are you sure you want to delete this donor? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {/* View Modal */}
      {viewEntry && (
        <DashboardModal title="Donation Details" onClose={() => setViewEntry(null)}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <span className={styles.label}>First Name</span>
              <span style={{ color: '#e8f5e8', fontSize: 14, fontWeight: 500 }}>{viewEntry.first_name}</span>
            </div>
            <div className={styles.formGroup}>
              <span className={styles.label}>Last Name</span>
              <span style={{ color: '#e8f5e8', fontSize: 14, fontWeight: 500 }}>{viewEntry.last_name}</span>
            </div>
            <div className={styles.formGroup}>
              <span className={styles.label}>Email</span>
              <span style={{ color: '#e8f5e8', fontSize: 14, fontWeight: 500 }}>{viewEntry.email}</span>
            </div>
            <div className={styles.formGroup}>
              <span className={styles.label}>Phone</span>
              <span style={{ color: '#e8f5e8', fontSize: 14, fontWeight: 500 }}>{viewEntry.phone}</span>
            </div>
            <div className={styles.formGroup}>
              <span className={styles.label}>Total Donated</span>
              <span style={{ color: '#FFD700', fontSize: 14, fontWeight: 500 }}>₦{viewEntry.total_donated?.toLocaleString()}</span>
            </div>
            <div className={styles.formGroup}>
              <span className={styles.label}>Type</span>
              <div style={{ marginTop: 4 }}>
                <span className={`${styles.badge} ${viewEntry.type === 'monthly' ? styles.badgeSuccess : styles.badgeInfo}`}>
                  {viewEntry.type === 'monthly' ? '🔁 Monthly' : 'One-time'}
                </span>
              </div>
            </div>
            <div className={styles.formGroup}>
              <span className={styles.label}>Status</span>
              <div style={{ marginTop: 4 }}>
                <span className={`${styles.badge} ${viewEntry.payment_status === 'Confirmed' ? styles.badgeSuccess : styles.badgeWarning}`}>
                  {viewEntry.payment_status}
                </span>
              </div>
            </div>
            <div className={styles.formGroup}>
              <span className={styles.label}>Date</span>
              <span style={{ color: '#e8f5e8', fontSize: 14, fontWeight: 500 }}>
                {new Date(viewEntry.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
          <div className={styles.modalActions}>
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
