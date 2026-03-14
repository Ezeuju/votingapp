import React, { useState, useEffect, useCallback } from 'react';
import styles from '../DashboardScreens/Dashboardshared.module.css';
import DashboardModal from './Dashboardmodal';
import ConfirmModal from './ConfirmModal';
import { partnerApi } from '../../services/partnerApi';
import { uploadFile } from '../../services/fileApi';

const DashboardPartners = () => {
  const [partners, setPartners] = useState([]);
  const [plans, setPlans] = useState([]);
  const [stats, setStats] = useState({});
  const [metadata, setMetadata] = useState({});
  const [search, setSearch] = useState('');
  const [filter, setFilter] = useState('');
  const [page, setPage] = useState(1);
  const [viewEntry, setViewEntry] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [confirmId, setConfirmId] = useState(null);
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [formData, setFormData] = useState({
    organization_name: '',
    contact_person: '',
    email: '',
    phone_number: '',
    partnership_plan_id: '',
    company_website: '',
    partnership_goal: '',
    logo_url: ''
  });

  const fetchPartners = useCallback(async () => {
    setLoading(true);
    try {
      const params = { pageNo: page, limitNo: 10 };
      if (search) params.search = search;
      if (filter) params.sponsorship_tier = filter;
      const response = await partnerApi.getAll(params);
      setPartners(response.data?.data || []);
      setMetadata(response.data?.metadata || {});
    } catch (err) {
      console.error('Failed to fetch partners:', err);
      setPartners([]);
      setMetadata({});
    } finally {
      setLoading(false);
    }
  }, [page, search, filter]);

  const fetchStats = async () => {
    try {
      const response = await partnerApi.getStats();
      setStats(response.data || {});
    } catch (err) {
      console.error('Failed to fetch stats:', err);
      setStats({});
    }
  };

  const fetchPlans = async () => {
    try {
      const response = await partnerApi.getPlans();
      setPlans(response.data?.data || []);
    } catch (err) {
      console.error('Failed to fetch plans:', err);
      setPlans([]);
    }
  };

  useEffect(() => {
    fetchStats();
    fetchPlans();
  }, []);

  useEffect(() => {
    fetchPartners();
  }, [fetchPartners]);

  const handleDelete = async () => {
    const id = confirmId;
    setConfirmId(null);
    try {
      await partnerApi.delete(id);
      fetchStats();
      fetchPartners();
    } catch (err) {
      alert(err.message || 'Failed to delete partner');
    }
  };

  const handleView = async (id) => {
    try {
      const response = await partnerApi.getOne(id);
      setViewEntry(response.data);
    } catch (err) {
      alert(err.message || 'Failed to fetch partner details');
    }
  };

  const handleApprove = async (id) => {
    try {
      await partnerApi.update(id, { status: 'approved' });
      fetchStats();
      fetchPartners();
      if (viewEntry?._id === id) {
        setViewEntry({ ...viewEntry, status: 'approved' });
      }
    } catch (err) {
      alert(err.message || 'Failed to approve partner');
    }
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const uploadResponse = await uploadFile(file);
        const logoUrl = uploadResponse.data.url;
        setFormData({ ...formData, logo_url: logoUrl });
        setLogoFile(file);
        const reader = new FileReader();
        reader.onload = (event) => setLogoPreview(event.target.result);
        reader.readAsDataURL(file);
      } catch (error) {
        alert('Failed to upload logo: ' + (error.message || 'Unknown error'));
      } finally {
        setUploading(false);
      }
    }
  };

  const handleAddPartner = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await partnerApi.addAdmin(formData);
      setShowAddModal(false);
      setFormData({
        organization_name: '',
        contact_person: '',
        email: '',
        phone_number: '',
        partnership_plan_id: '',
        company_website: '',
        partnership_goal: '',
        logo_url: ''
      });
      setLogoFile(null);
      setLogoPreview('');
      fetchStats();
      fetchPartners();
    } catch (err) {
      alert(err.message || 'Failed to add partner');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const getTierBadge = (tier) => {
    const lowerTier = tier?.toLowerCase() || '';
    if (lowerTier.includes('platinum')) return styles.badgeSuccess;
    if (lowerTier.includes('gold')) return styles.badgeWarning;
    if (lowerTier.includes('silver')) return styles.badgeInfo;
    return styles.badgeDanger;
  };

  const summaryStats = [
    { icon: '🤝', label: 'Total Partners', count: stats.total_partners || 0 },
    { icon: '💎', label: 'Platinum', count: stats.platinum_partners || 0 },
    { icon: '🥇', label: 'Gold', count: stats.gold_partners || 0 },
    { icon: '🥈', label: 'Silver', count: stats.silver_partners || 0 },
    { icon: '🥉', label: 'Bronze', count: stats.bronze_partners || 0 },
  ];

  const tierFilters = [
    { value: '', label: 'All' },
    { value: 'Platinum Partner', label: 'Platinum' },
    { value: 'Gold Sponsor', label: 'Gold' },
    { value: 'Silver Sponsor', label: 'Silver' },
    { value: 'Bronze Partner', label: 'Bronze' },
  ];

  return (
    <div>
      {/* Stats */}
      <div className={styles.statsGrid}>
        {summaryStats.map(st => (
          <div className={styles.statCard} key={st.label}>
            <div className={styles.statIcon}>{st.icon}</div>
            <div className={styles.statValue}>{st.count}</div>
            <div className={styles.statLabel}>{st.label}</div>
          </div>
        ))}
      </div>

      {/* Header */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>🤝 Partners & <span>Sponsors</span></span>
        <button className={`${styles.btn} ${styles.btnPrimary}`} onClick={() => setShowAddModal(true)}>
          + Add Partner
        </button>
      </div>

      {/* Search & Filter */}
      <div className={styles.searchWrap}>
        <span className={styles.searchIcon}>🔍</span>
        <input
          className={styles.searchInput}
          placeholder="Search by organisation, email or contact person..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* Tier Filters */}
      <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
        {tierFilters.map(t => (
          <button
            key={t.value}
            className={`${styles.btn} ${styles.btnSm} ${filter === t.value ? styles.btnPrimary : styles.btnOutline}`}
            onClick={() => setFilter(t.value)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Table */}
      <div className={styles.tableScroll}>
        <div className={styles.tableWrap}>
          <table className={styles.table}>
          <thead>
            <tr>
              <th>Organization</th>
              <th>Contact</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Tier</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan={8} className={styles.emptyRow}>Loading...</td></tr>
            ) : partners.length === 0 ? (
              <tr><td colSpan={8} className={styles.emptyRow}>No partners found</td></tr>
            ) : (
              partners.map(p => (
                <tr key={p._id} className={styles.clickableRow} onClick={() => handleView(p._id)}>
                  <td className={styles.tdBold}>{p.organization_name}</td>
                  <td className={styles.tdMuted}>{p.contact_person}</td>
                  <td className={styles.tdMuted}>{p.email}</td>
                  <td className={styles.tdMuted}>{p.phone_number}</td>
                  <td>
                    <span className={`${styles.badge} ${getTierBadge(p.sponsorship_tier)}`}>
                      {p.sponsorship_tier}
                    </span>
                  </td>
                  <td>
                    <span className={`${styles.badge} ${p.status === 'approved' ? styles.badgeSuccess : styles.badgeWarning}`}>
                      {p.status}
                    </span>
                  </td>
                  <td className={styles.tdMuted}>{new Date(p.date).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: 6 }} onClick={(e) => e.stopPropagation()}>
                      <button
                        className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                        onClick={() => handleView(p._id)}
                      >
                        View
                      </button>
                      {p.status === 'pending' && (
                        <button
                          className={`${styles.btn} ${styles.btnGreen} ${styles.btnSm}`}
                          onClick={() => handleApprove(p._id)}
                        >
                          Approve
                        </button>
                      )}
                      <button
                        className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                        onClick={() => setConfirmId(p._id)}
                      >
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
        </div>
      </div>

      {/* Pagination */}
      {metadata?.pages > 1 && (
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
          message="Are you sure you want to remove this partner? This action cannot be undone."
          onConfirm={handleDelete}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {/* Add Partner Modal */}
      {showAddModal && (
        <DashboardModal title="Add New Partner" onClose={() => setShowAddModal(false)}>
          <form onSubmit={handleAddPartner}>
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <span className={styles.label}>Organization Name</span>
                <input
                  className={styles.input}
                  name="organization_name"
                  value={formData.organization_name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <span className={styles.label}>Contact Person</span>
                <input
                  className={styles.input}
                  name="contact_person"
                  value={formData.contact_person}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <span className={styles.label}>Email</span>
                <input
                  className={styles.input}
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <span className={styles.label}>Phone Number</span>
                <input
                  className={styles.input}
                  name="phone_number"
                  value={formData.phone_number}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className={styles.formGroup}>
                <span className={styles.label}>Partnership Plan</span>
                <select
                  className={styles.select}
                  name="partnership_plan_id"
                  value={formData.partnership_plan_id}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Plan</option>
                  {plans.map(plan => (
                    <option key={plan._id} value={plan._id}>{plan.title}</option>
                  ))}
                </select>
              </div>
              <div className={styles.formGroup}>
                <span className={styles.label}>Company Website</span>
                <input
                  className={styles.input}
                  name="company_website"
                  value={formData.company_website}
                  onChange={handleChange}
                />
              </div>
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <span className={styles.label}>Partnership Goal</span>
                <textarea
                  className={styles.textarea}
                  name="partnership_goal"
                  value={formData.partnership_goal}
                  onChange={handleChange}
                />
              </div>
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <span className={styles.label}>Logo</span>
                {logoPreview ? (
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    marginTop: '10px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 135, 81, 0.3)'
                  }}>
                    <img src={logoPreview} alt="Logo preview" style={{ width: '100%', maxHeight: '150px', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => {
                        setLogoFile(null);
                        setLogoPreview('');
                      }}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                        fontSize: '18px'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleLogoChange}
                    style={{ marginTop: '8px' }}
                  />
                )}
              </div>
            </div>
            <div className={styles.modalActions}>
              <button type="button" className={`${styles.btn} ${styles.btnOutline}`} onClick={() => {
                setShowAddModal(false);
                setLogoFile(null);
                setLogoPreview('');
              }}>
                Cancel
              </button>
              <button type="submit" className={`${styles.btn} ${styles.btnPrimary}`} disabled={loading || uploading}>
                {uploading ? 'Uploading Logo...' : loading ? 'Adding...' : 'Add Partner'}
              </button>
            </div>
          </form>
        </DashboardModal>
      )}

      {/* View Modal */}
      {viewEntry && (
        <DashboardModal title="Partner Details" onClose={() => setViewEntry(null)}>
          <div className={styles.formGrid}>
            <div className={styles.formGroup}>
              <span className={styles.label}>Organization</span>
              <span style={{ color: '#e8f5e8', fontSize: 14, fontWeight: 500 }}>{viewEntry.organization_name}</span>
            </div>
            <div className={styles.formGroup}>
              <span className={styles.label}>Contact Person</span>
              <span style={{ color: '#e8f5e8', fontSize: 14, fontWeight: 500 }}>{viewEntry.contact_person}</span>
            </div>
            <div className={styles.formGroup}>
              <span className={styles.label}>Email</span>
              <span style={{ color: '#e8f5e8', fontSize: 14, fontWeight: 500 }}>{viewEntry.email}</span>
            </div>
            <div className={styles.formGroup}>
              <span className={styles.label}>Phone</span>
              <span style={{ color: '#e8f5e8', fontSize: 14, fontWeight: 500 }}>{viewEntry.phone_number}</span>
            </div>
            <div className={styles.formGroup}>
              <span className={styles.label}>Company Website</span>
              <a href={viewEntry.company_website} target="_blank" rel="noopener noreferrer" style={{ color: '#FFD700', fontSize: 14 }}>
                {viewEntry.company_website}
              </a>
            </div>
            <div className={styles.formGroup}>
              <span className={styles.label}>Status</span>
              <div style={{ marginTop: 4 }}>
                <span className={`${styles.badge} ${viewEntry.status === 'approved' ? styles.badgeSuccess : styles.badgeWarning}`}>
                  {viewEntry.status}
                </span>
              </div>
            </div>
            <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
              <span className={styles.label}>Partnership Goal</span>
              <span style={{ color: '#e8f5e8', fontSize: 14 }}>{viewEntry.partnership_goal}</span>
            </div>
            {viewEntry.logo_url && (
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <span className={styles.label}>Logo</span>
                <img src={viewEntry.logo_url} alt="Logo" style={{ maxWidth: 200, marginTop: 8, borderRadius: 8 }} />
              </div>
            )}
            <div className={styles.formGroup}>
              <span className={styles.label}>Created By</span>
              <span style={{ color: '#e8f5e8', fontSize: 14 }}>
                {viewEntry.is_admin_created ? 'Admin' : 'User Application'}
              </span>
            </div>
            <div className={styles.formGroup}>
              <span className={styles.label}>Date</span>
              <span style={{ color: '#e8f5e8', fontSize: 14 }}>
                {new Date(viewEntry.createdAt).toLocaleString()}
              </span>
            </div>
          </div>
          <div className={styles.modalActions}>
            {viewEntry.status === 'pending' && (
              <button
                className={`${styles.btn} ${styles.btnGreen}`}
                onClick={() => handleApprove(viewEntry._id)}
              >
                Approve
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

export default DashboardPartners;
