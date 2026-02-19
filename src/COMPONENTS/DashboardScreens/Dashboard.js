import React, { useState } from 'react';
import styles from './Dashboard.module.css';

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState('contestants');

  const menuItems = [
    { id: 'donations', label: 'Donations', icon: '💰' },
    { id: 'tickets', label: 'Issued Tickets', icon: '🎟️' },
    { id: 'announcements', label: 'Announcements', icon: '📣' },
    { id: 'updates', label: 'Live Updates', icon: '⚡' },
    { id: 'auditions', label: 'Auditions', icon: '🎤' },
    { id: 'contestants', label: 'Contestants', icon: '🌟' },
  ];

  return (
    <div className={styles.adminWrapper}>
      {/* SIDEBAR */}
      <aside className={styles.sidebar}>
        <div className={styles.logo}>NTS<span>ADMIN</span></div>
        <nav className={styles.nav}>
          {menuItems.map((item) => (
            <button 
              key={item.id}
              className={activeTab === item.id ? styles.activeTab : ''}
              onClick={() => setActiveTab(item.id)}
            >
              <span className={styles.icon}>{item.icon}</span> {item.label}
            </button>
          ))}
        </nav>
        <button className={styles.logoutBtn}>Logout</button>
      </aside>

      {/* MAIN CONTENT AREA */}
      <main className={styles.mainContent}>
        <header className={styles.topHeader}>
          <h1>{menuItems.find(i => i.id === activeTab).label} Portal</h1>
          <div className={styles.userProfile}>System Admin: HQ</div>
        </header>

        

        <div className={styles.contentBody}>
          {/* 1. DONATIONS VIEW */}
          {activeTab === 'donations' && (
            <div className={styles.tableCard}>
              <div className={styles.cardHeader}>
                <h3>Recent Donations</h3>
                <span className={styles.totalValue}>Total: ₦4,200,000</span>
              </div>
              <table className={styles.adminTable}>
                <thead>
                  <tr><th>Donor</th><th>Amount</th><th>Tier</th><th>Date</th></tr>
                </thead>
                <tbody>
                  <tr><td>Kunle Afolayan</td><td>₦100,000</td><td>Gold</td><td>Today</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 2. TICKETS VIEW */}
          {activeTab === 'tickets' && (
            <div className={styles.tableCard}>
              <h3>Tickets Issued</h3>
              <table className={styles.adminTable}>
                <thead>
                  <tr><th>Ticket ID</th><th>Type</th><th>Attendee</th><th>Status</th></tr>
                </thead>
                <tbody>
                  <tr><td>#VIP-992</td><td>VVIP</td><td>Chima Okoro</td><td>Valid</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 3. ANNOUNCEMENTS VIEW */}
          {activeTab === 'announcements' && (
            <div className={styles.formCard}>
              <h3>Post New Announcement</h3>
              <textarea placeholder="Write announcement for the website banner/home page..."></textarea>
              <button className={styles.actionBtn}>Push to Website</button>
            </div>
          )}

          {/* 4. LIVE UPDATES VIEW */}
          {activeTab === 'updates' && (
            <div className={styles.formCard}>
              <h3>Live Score/Update Feed</h3>
              <input type="text" placeholder="e.g. Bose Olisa is performing now!" />
              <button className={styles.goldActionBtn}>Update Live Feed</button>
            </div>
          )}

          {/* 5. AUDITIONS VIEW */}
          {activeTab === 'auditions' && (
            <div className={styles.tableCard}>
              <h3>Audition Roadmap Management</h3>
              <table className={styles.adminTable}>
                <thead>
                  <tr><th>Venue</th><th>Date</th><th>Manager</th><th>Capacity</th></tr>
                </thead>
                <tbody>
                  <tr><td>Uyo Stadium</td><td>Sept 12</td><td>Pastor Micah</td><td>5000</td></tr>
                </tbody>
              </table>
            </div>
          )}

          {/* 6. CONTESTANTS VIEW */}
          {activeTab === 'contestants' && (
            <div className={styles.tableCard}>
              <h3>Shortlisted Stars</h3>
              <table className={styles.adminTable}>
                <thead>
                  <tr><th>ID</th><th>Name</th><th>Votes</th><th>State</th><th>Action</th></tr>
                </thead>
                <tbody>
                  <tr><td>#3352</td><td>Bose Olisa</td><td>1600</td><td>Lagos</td><td><button>Edit</button></td></tr>
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;