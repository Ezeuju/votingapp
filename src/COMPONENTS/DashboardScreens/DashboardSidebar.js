import React from 'react';
import styles from '../DashboardScreens/Dashboard.module.css';
import { NAV_ITEMS } from './Dashboarddata';

const Dashboardsidebar = ({ active, onNavigate }) => {
  return (
    <aside className={styles.sidebar}>
      {/* ── Logo ── */}
      <div className={styles.logo}>
        <div className={styles.logoBadge}>Admin Panel</div>
        <h1 className={styles.logoTitle}>NaijaTalent</h1>
        <p className={styles.logoSub}>Season 4 · 2026</p>
      </div>

      {/* ── Navigation ── */}
      <nav className={styles.nav}>
        <div className={styles.navLabel}>Navigation</div>
        {NAV_ITEMS.map(item => (
          <div
            key={item.id}
            className={`${styles.navItem} ${active === item.id ? styles.navItemActive : ''}`}
            onClick={() => onNavigate(item.id)}
          >
            <span className={styles.navIcon}>{item.icon}</span>
            <span>{item.label}</span>
            {item.badge && (
              <span className={styles.navBadge}>{item.badge}</span>
            )}
          </div>
        ))}
      </nav>

      {/* ── Admin Footer ── */}
      <div className={styles.sidebarFooter}>
        <div className={styles.adminCard}>
          <div className={styles.avatar}>SA</div>
          <div>
            <p className={styles.adminName}>Super Admin</p>
            <span className={styles.adminEmail}>admin@starstage.ng</span>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Dashboardsidebar;