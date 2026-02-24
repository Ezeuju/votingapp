import React, { useEffect, useState } from 'react';
import styles from '../DashboardScreens/Dashboardshared.module.css';
import pageStyles from '../DashboardScreens/Dashboardpages.module.css';
import { STATUS_MAP } from './Dashboarddata';
import { adminApi } from '../../services/adminApi';

const DashboardOverview = ({ data }) => {
  const [recentDonations, setRecentDonations] = useState([]);
  const [totalDonations, setTotalDonations] = useState(0);

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

    fetchRecentDonations();
    fetchDonationSummary();
  }, []);
  const stats = [
    { icon: '💰', label: 'Total Donations',  value: `₦${totalDonations.toLocaleString()}`, delta: '+12%' },
    { icon: '🎫', label: 'Tickets Issued',   value: data.tickets.length,     delta: '+3%'  },
    { icon: '🏆', label: 'Contestants',      value: data.contestants.length, delta: ''     },
    { icon: '🗳️', label: 'Total Votes',     value: '32,280',                delta: '+18%' },
    { icon: '🎤', label: 'Auditions Today',  value: data.auditions.length,   delta: ''     },
    { icon: '📢', label: 'Announcements',   value: data.announcements.length,delta: ''     },
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
                  <tr key={d._id}>
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
                {[...data.contestants]
                  .sort((a, b) => b.votes - a.votes)
                  .slice(0, 4)
                  .map(c => (
                    <tr key={c.id}>
                      <td>{c.name}</td>
                      <td className={styles.tdGold}>{c.votes.toLocaleString()}</td>
                      <td>
                        <span className={`${styles.badge} ${styles[STATUS_MAP[c.status]]}`}>
                          {c.status}
                        </span>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DashboardOverview;