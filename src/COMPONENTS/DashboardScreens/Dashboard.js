import React, { useState, useEffect } from 'react';

import layoutStyles from '../DashboardScreens/Dashboard.module.css';
import sharedStyles from '../DashboardScreens/Dashboardshared.module.css';
import Dashboardjudges from '../DashboardScreens/Dashboardjudges';

import DashboardSidebar      from './DashboardSidebar';
import DashboardOverview     from './DashboardOverview';
import DashboardDonations    from './DashboardDonations';
import DashboardTickets      from './DashboardTickets';
import DashboardAnnouncements from './DashboardAnnouncements';
import DashboardLiveUpdates  from './DashboardLiveUpdates';
import DashboardAuditions    from './DashboardAuditions';
import DashboardContestants  from './DashboardContestants';
import DashboardPartners  from './DashboardPartners';
import Dashboardjointeam  from './Dashboardjointeam';
import Dashboardcontactus from './Dashboardcontactus';

import { INIT_DATA, PAGE_TITLES } from './Dashboarddata';


const Dashboard = () => {
  const [active, setActive] = useState(() => {
    return localStorage.getItem('dashboardActiveTab') || 'dashboard';
  });
  const [data, setData] = useState(INIT_DATA);

  useEffect(() => {
    localStorage.setItem('dashboardActiveTab', active);
  }, [active]);

  const sharedProps = { data, setData };

  const renderPage = () => {
    switch (active) {
      case 'dashboard':     return <DashboardOverview      {...sharedProps} />;
      case 'donations':     return <DashboardDonations     {...sharedProps} />;
      case 'tickets':       return <DashboardTickets       {...sharedProps} />;
      case 'announcements': return <DashboardAnnouncements {...sharedProps} />;
      case 'updates':       return <DashboardLiveUpdates   {...sharedProps} />;
      case 'auditions':     return <DashboardAuditions     {...sharedProps} />;
      case 'contestants':   return <DashboardContestants   />;
      case 'sponsors':  return <DashboardPartners />;
       case 'jointeam':  
        return <Dashboardjointeam />;
      case 'contact':   
        return <Dashboardcontactus />; 
      case 'judges':    
        return <Dashboardjudges />;                                          
      default:              return <DashboardOverview      {...sharedProps} />;
    }
  };

  return (
    <div className={layoutStyles.root}>
  
      <DashboardSidebar active={active} onNavigate={setActive} />

  
      <main className={layoutStyles.main}>
     
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

     
        <div className={layoutStyles.content}>
          {renderPage()}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;