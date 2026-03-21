import React, { useEffect, useState } from 'react';
import styles from '../DashboardScreens/Dashboardshared.module.css';
import pageStyles from '../DashboardScreens/Dashboardpages.module.css';
import { STATUS_MAP } from './Dashboarddata';
import { adminApi } from '../../services/adminApi';
import DashboardModal from './Dashboardmodal';

const DashboardOverview = ({ data }) => {
  const [recentDonations, setRecentDonations] = useState([]);
  const [totalDonations, setTotalDonations] = useState(0);
  const [totalContestants, setTotalContestants] = useState(0);
  const [totalTickets, setTotalTickets] = useState(0);
  const [totalVotes, setTotalVotes] = useState(0);
  const [topContestants, setTopContestants] = useState([]);
  const [viewEntry, setViewEntry] = useState(null);

  useEffect(() => {
    const fetchRecentDonations = async () => {
      try {
        const response = await adminApi.getDonors({ pageNo: 1, limitNo: 4 });
        setRecentDonations(response.data.data);
      } catch (err) {
        console.error('Failed to fetch recent donations:', err);
      }
    };

    const fetchDonationSummary = async () => {
      try {
        const response = await adminApi.getDonorSummary();
        setTotalDonations(response.data.total_amount);
      } catch (err) {
        console.error('Failed to fetch donation summary:', err);
      }
    };

    const fetchContestantStats = async () => {
      try {
        const response = await adminApi.getContestantStats();
        setTotalContestants(response.data.total_contestants);
      } catch (err) {
        console.error('Failed to fetch contestant stats:', err);
      }
    };

    const fetchTopContestants = async () => {
      try {
        const response = await adminApi.getContestants({ limitNo: 4 });
        const result = response.data?.[0] || response.data;
        const contestants = result?.data || [];
        setTopContestants(contestants.sort((a, b) => (b.votes || 0) - (a.votes || 0)).slice(0, 4));
      } catch (err) {
        console.error('Failed to fetch top contestants:', err);
      }
    };

    const fetchTicketStats = async () => {
      try {
        const response = await adminApi.getTicketStats();
        setTotalTickets(response?.data?.total_tickets || 0);
      } catch (err) {
        console.error('Failed to fetch ticket stats:', err);
      }
    };

    const fetchTotalVotes = async () => {
      try {
        const response = await adminApi.getTotalVotes();
        setTotalVotes(response?.data?.total_votes || 0);
      } catch (err) {
        console.error('Failed to fetch total votes:', err);
      }
    };

    fetchRecentDonations();
    fetchDonationSummary();
    fetchContestantStats();
    fetchTopContestants();
    fetchTicketStats();
    fetchTotalVotes();
  }, []);
  const stats = [
    { icon: '💰', label: 'Total Donations', value: `₦${totalDonations.toLocaleString()}`, delta: '+12%' },
    { icon: '🎫', label: 'Tickets Issued', value: totalTickets, delta: '' },
    { icon: '🏆', label: 'Contestants', value: totalContestants, delta: '' },
    { icon: '🗳️', label: 'Total Votes', value: totalVotes.toLocaleString(), delta: '' },
    { icon: '📢', label: 'Announcements', value: data.announcements.length, delta: '' },
  ];

  return (
    <div>
      {/* ── Stat Cards ── */}
      <div className={styles.statsGrid}>
        {stats.map(st => (
          <div className={styles.statCard} key={st.label}>
            <div className={styles.statIcon}>{st.icon}</div>
            <div className={styles.statValue}>{st.value}</div>
            <div className={styles.statLabel}>{st.label}</div>
            {st.delta && <span className={styles.statDelta}>{st.delta}</span>}
          </div>
        ))}
      </div>

      {/* ── Quick Tables ── */}
      <div className={pageStyles.dashGrid}>
        {/* Recent Donations */}
        <div>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Recent <span>Donations</span></span>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th>Donor</th><th>Amount</th><th>Status</th></tr>
              </thead>
              <tbody>
                {recentDonations.map(d => (
                  <tr key={d._id} className={styles.clickableRow} onClick={() => setViewEntry({ ...d, type: 'donation' })}>
                    <td>{d.first_name} {d.last_name}</td>
                    <td className={styles.tdGold}>₦{d.total_donated?.toLocaleString()}</td>
                    <td>
                      <span className={`${styles.badge} ${d.payment_status === 'Confirmed' ? styles.badgeSuccess : styles.badgeWarning}`}>
                        {d.payment_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Top Contestants */}
        <div>
          <div className={styles.sectionHeader}>
            <span className={styles.sectionTitle}>Top <span>Contestants</span></span>
          </div>
          <div className={styles.tableWrap}>
            <table className={styles.table}>
              <thead>
                <tr><th>Name</th><th>Votes</th><th>Status</th></tr>
              </thead>
              <tbody>
                {topContestants.map(c => (
                  <tr key={c._id} className={styles.clickableRow} onClick={() => setViewEntry({ ...c, type: 'contestant' })}>
                    <td>{c.first_name} {c.last_name}</td>
                    <td className={styles.tdGold}>{(c.votes || 0).toLocaleString()}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[STATUS_MAP[c.contestant_status]]}`}>
                        {c.contestant_status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* ── Detail Modal ── */}
      {viewEntry && (
        <DashboardModal
          title={viewEntry.type === 'donation' ? "Donation Details" : "Contestant Details"}
          onClose={() => setViewEntry(null)}
        >
          <div className={styles.formGrid}>
            {viewEntry.type === 'donation' ? (
              <>
                <div className={styles.formGroup}>
                  <span className={styles.label}>Name</span>
                  <span style={{ color: '#e8f5e8', fontSize: 14, fontWeight: 500 }}>{viewEntry.first_name} {viewEntry.last_name}</span>
                </div>
                <div className={styles.formGroup}>
                  <span className={styles.label}>Amount</span>
                  <span style={{ color: '#FFD700', fontSize: 14, fontWeight: 500 }}>₦{viewEntry.total_donated?.toLocaleString()}</span>
                </div>
                <div className={styles.formGroup}>
                  <span className={styles.label}>Email</span>
                  <span style={{ color: '#e8f5e8', fontSize: 14, fontWeight: 500 }}>{viewEntry.email}</span>
                </div>
                <div className={styles.formGroup}>
                  <span className={styles.label}>Status</span>
                  <div style={{ marginTop: 4 }}>
                    <span className={`${styles.badge} ${viewEntry.payment_status === 'Confirmed' ? styles.badgeSuccess : styles.badgeWarning}`}>
                      {viewEntry.payment_status}
                    </span>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className={styles.formGroup}>
                  <span className={styles.label}>Full Name</span>
                  <span style={{ color: '#e8f5e8', fontSize: 14, fontWeight: 500 }}>{viewEntry.first_name} {viewEntry.last_name}</span>
                </div>
                <div className={styles.formGroup}>
                  <span className={styles.label}>Category</span>
                  <span style={{ color: '#e8f5e8', fontSize: 14, fontWeight: 500 }}>{viewEntry.talent_category}</span>
                </div>
                <div className={styles.formGroup}>
                  <span className={styles.label}>Votes</span>
                  <span style={{ color: '#FFD700', fontSize: 14, fontWeight: 500 }}>{(viewEntry.votes || 0).toLocaleString()}</span>
                </div>
                <div className={styles.formGroup}>
                  <span className={styles.label}>Status</span>
                  <div style={{ marginTop: 4 }}>
                    <span className={`${styles.badge} ${styles[STATUS_MAP[viewEntry.contestant_status]]}`}>
                      {viewEntry.contestant_status}
                    </span>
                  </div>
                </div>
              </>
            )}
          </div>
          <div className={styles.modalActions}>
            <button className={`${styles.btn} ${styles.btnOutline}`} onClick={() => setViewEntry(null)}>Close</button>
          </div>
        </DashboardModal>
      )}
    </div>
  );
};

export default DashboardOverview;