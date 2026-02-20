import React, { useState } from 'react';

import layoutStyles from '../DashboardScreens/Dashboard.module.css';
import sharedStyles from '../DashboardScreens/Dashboardshared.module.css';


import DashboardSidebar      from './DashboardSidebar';
import DashboardOverview     from './DashboardOverview';
import DashboardDonations    from './DashboardDonations';
import DashboardTickets      from './DashboardTickets';
import DashboardAnnouncements from './DashboardAnnouncements';
import DashboardLiveUpdates  from './DashboardLiveUpdates';
import DashboardAuditions    from './DashboardAuditions';
import DashboardContestants  from './DashboardContestants';

import { INIT_DATA, PAGE_TITLES } from './Dashboarddata';

const Dashboard = () => {
  const [active, setActive] = useState('dashboard');
  const [data, setData]     = useState(INIT_DATA);

  const sharedProps = { data, setData };

  const renderPage = () => {
    switch (active) {
      case 'dashboard':     return <DashboardOverview      {...sharedProps} />;
      case 'donations':     return <DashboardDonations     {...sharedProps} />;
      case 'tickets':       return <DashboardTickets       {...sharedProps} />;
      case 'announcements': return <DashboardAnnouncements {...sharedProps} />;
      case 'updates':       return <DashboardLiveUpdates   {...sharedProps} />;
      case 'auditions':     return <DashboardAuditions     {...sharedProps} />;
      case 'contestants':   return <DashboardContestants   {...sharedProps} />;
      default:              return <DashboardOverview      {...sharedProps} />;
    }
  };

  return (
    <div className={layoutStyles.root}>
      {/* ── Sidebar ── */}
      <DashboardSidebar active={active} onNavigate={setActive} />

      {/* ── Main ── */}
      <main className={layoutStyles.main}>
        {/* Topbar */}
        <div className={layoutStyles.topbar}>
          <span className={layoutStyles.topbarTitle}>{PAGE_TITLES[active]}</span>
          <div className={layoutStyles.topbarActions}>
            <button className={`${sharedStyles.btn} ${sharedStyles.btnOutline}`}>
              🔔 Notifications
            </button>
            <button className={`${sharedStyles.btn} ${sharedStyles.btnGreen}`}>
              ⚙ Settings
            </button>
          </div>
        </div>

        {/* Page Content */}
        <div className={layoutStyles.content}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;