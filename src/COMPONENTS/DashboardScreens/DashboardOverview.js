import React from 'react';
import styles from '../DashboardScreens/Dashboardshared.module.css';
import pageStyles from '../DashboardScreens/Dashboardpages.module.css';
import { STATUS_MAP } from './Dashboarddata';

const DashboardOverview = ({ data }) => {
  const stats = [
    { icon: '💰', label: 'Total Donations',  value: '₦1.75M',               delta: '+12%' },
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
                {data.donations.slice(0, 4).map(d => (
                  <tr key={d.id}>
                    <td>{d.fullName}</td>
                    <td className={styles.tdGold}>{d.amount}</td>
                    <td>
                      <span className={`${styles.badge} ${styles[STATUS_MAP[d.status]]}`}>
                        {d.status}
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