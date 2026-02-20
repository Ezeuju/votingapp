// src/COMPONENTS/DashboardScreens/dashboardData.js
// ─── Seed data, nav config, page titles, status→badge mapping ────────────────

export const NAV_ITEMS = [
  { id: 'dashboard',     icon: '⬛', label: 'Dashboard'     },
  { id: 'donations',     icon: '💰', label: 'Donations',      badge: 5 },
  { id: 'tickets',       icon: '🎫', label: 'Issued Tickets',  badge: 5 },
  { id: 'announcements', icon: '📢', label: 'Announcements'  },
  { id: 'updates',       icon: '🔴', label: 'Live Updates',   badge: 4 },
  { id: 'auditions',     icon: '🎤', label: 'Auditions'      },
  { id: 'contestants',   icon: '🏆', label: 'Contestants'    },
];

export const PAGE_TITLES = {
  dashboard:     'Dashboard',
  donations:     'Donations',
  tickets:       'Issued Tickets',
  announcements: 'Announcements',
  updates:       'Live Updates',
  auditions:     'Auditions',
  contestants:   'Contestants',
};

export const STATUS_MAP = {
  Confirmed:  'badgeSuccess',
  Pending:    'badgeWarning',
  Refunded:   'badgeDanger',
  Active:     'badgeSuccess',
  Used:       'badgeInfo',
  Cancelled:  'badgeDanger',
  Passed:     'badgeSuccess',
  Failed:     'badgeDanger',
  Scheduled:  'badgeInfo',
  Eliminated: 'badgeDanger',
  Probation:  'badgeWarning',
};

export const INIT_DATA = {
  donations: [
    { id: 1, donor: 'Emeka Okafor',  amount: '₦50,000', contestant: 'Amara Joy',     method: 'Bank Transfer', date: 'Feb 18, 2026', status: 'Confirmed' },
    { id: 2, donor: 'Ngozi Eze',     amount: '₦25,000', contestant: 'Kelvin Bright',  method: 'Card',          date: 'Feb 17, 2026', status: 'Confirmed' },
    { id: 3, donor: 'Anonymous',     amount: '₦10,000', contestant: 'Sade Olu',       method: 'USSD',          date: 'Feb 17, 2026', status: 'Pending'   },
    { id: 4, donor: 'Bello Adamu',   amount: '₦75,000', contestant: 'Chisom Uche',    method: 'Bank Transfer', date: 'Feb 16, 2026', status: 'Confirmed' },
    { id: 5, donor: 'Fatima Musa',   amount: '₦15,000', contestant: 'Amara Joy',      method: 'Card',          date: 'Feb 15, 2026', status: 'Refunded'  },
  ],
  tickets: [
    { id: 'TKT-001', holder: 'Ada Nwosu',   type: 'VIP',     event: 'Auditions – Day 1', seat: 'A12',    date: 'Mar 1, 2026',  status: 'Active'    },
    { id: 'TKT-002', holder: 'Seun Bello',  type: 'Regular', event: 'Grand Finale',       seat: 'C34',    date: 'Apr 15, 2026', status: 'Active'    },
    { id: 'TKT-003', holder: 'Tunde Alli',  type: 'VVIP',    event: 'Semi-Finals',        seat: 'VIP-03', date: 'Apr 1, 2026',  status: 'Used'      },
    { id: 'TKT-004', holder: 'Grace Okeke', type: 'Regular', event: 'Auditions – Day 2', seat: 'B07',    date: 'Mar 2, 2026',  status: 'Cancelled' },
    { id: 'TKT-005', holder: 'Chidi Obi',   type: 'VIP',     event: 'Grand Finale',       seat: 'A05',    date: 'Apr 15, 2026', status: 'Active'    },
  ],
  announcements: [
    { id: 1, title: 'Auditions now open!',              body: 'Applications for Season 3 auditions are now officially open. Interested candidates should visit our website to register.',                              date: 'Feb 15, 2026', author: 'Admin', pinned: true  },
    { id: 2, title: 'Venue Change for Auditions Day 2', body: 'Please note that Day 2 auditions have been moved to Muson Centre, Lagos. All registered candidates will receive updated details via email.',            date: 'Feb 18, 2026', author: 'Admin', pinned: false },
    { id: 3, title: 'Voting Lines Now Open!',           body: 'Cast your vote for your favourite contestant via SMS or the website. Standard network rates apply.',                                                    date: 'Feb 20, 2026', author: 'Admin', pinned: true  },
  ],
  updates: [
    { id: 1, text: '🎤 Amara Joy just scored 98/100 in the vocal round!',                    time: '2 mins ago',  pinned: true  },
    { id: 2, text: '📊 Voting lines experiencing high traffic — please retry in a moment.',  time: '5 mins ago',  pinned: false },
    { id: 3, text: '🏆 Kelvin Bright advances to the next round with a standing ovation.',   time: '12 mins ago', pinned: false },
    { id: 4, text: '📢 The judges panel is now in deliberation for Group B.',                time: '25 mins ago', pinned: false },
  ],
  auditions: [
    { id: 1, firstName: 'Amara',   lastName: 'Joy',     email: 'amara@mail.com',   country: 'Nigeria',      phone: '+234 801 234 5678', location: 'Lagos',   date: 'Mar 1, 2026',  time: '10:00 AM', planId: 'gold-pass',   status: 'Confirmed' },
    { id: 2, firstName: 'Kelvin',  lastName: 'Bright',  email: 'kelvin@mail.com',  country: 'Ghana',        phone: '+233 244 567 890',  location: 'Accra',   date: 'Mar 1, 2026',  time: '10:45 AM', planId: 'vip-pass',    status: 'Confirmed' },
    { id: 3, firstName: 'Sade',    lastName: 'Olu',     email: 'sade@mail.com',    country: 'Nigeria',      phone: '+234 802 345 6789', location: 'Abuja',   date: 'Mar 1, 2026',  time: '11:30 AM', planId: 'silver-pass', status: 'Pending'   },
    { id: 4, firstName: 'Chisom',  lastName: 'Uche',    email: 'chisom@mail.com',  country: 'Nigeria',      phone: '+234 803 456 7890', location: 'Enugu',   date: 'Mar 2, 2026',  time: '12:00 PM', planId: 'gold-pass',   status: 'Confirmed' },
    { id: 5, firstName: 'Emeka',   lastName: 'Ray',     email: 'emeka@mail.com',   country: 'Nigeria',      phone: '+234 805 678 9012', location: 'Lagos',   date: 'Mar 2, 2026',  time: '1:00 PM',  planId: 'silver-pass', status: 'Pending'   },
    { id: 6, firstName: 'Lola',    lastName: 'Kins',    email: 'lola@mail.com',    country: 'Sierra Leone', phone: '+232 76 123 456',   location: 'Freetown',date: 'Mar 2, 2026',  time: '1:45 PM',  planId: 'vip-pass',    status: 'Pending'   },
  ],
  contestants: [
    { id: 1, name: 'Amara Joy',     nickname: '@AmaraShines', category: 'Vocals',        votes: 8420, max: 10000, status: 'Active'     },
    { id: 2, name: 'Kelvin Bright', nickname: '@KelvinB',     category: 'Dance',         votes: 7210, max: 10000, status: 'Active'     },
    { id: 3, name: 'Chisom Uche',   nickname: '@ChisomU',     category: 'Instrumentals', votes: 6550, max: 10000, status: 'Active'     },
    { id: 4, name: 'Sade Olu',      nickname: '@SadeOlu',     category: 'Vocals',        votes: 5100, max: 10000, status: 'Active'     },
    { id: 5, name: 'Emeka Ray',     nickname: '@EmekaRay',    category: 'Vocals',        votes: 3800, max: 10000, status: 'Probation'  },
    { id: 6, name: 'Lola Kins',     nickname: '@LolaK',       category: 'Dance',         votes: 2200, max: 10000, status: 'Eliminated' },
  ],
};