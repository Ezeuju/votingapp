export const NAV_ITEMS = [
  { id: 'dashboard',     icon: '⬛', label: 'Dashboard'           },
  { id: 'donations',     icon: '💰', label: 'Donations'           },
  { id: 'tickets',       icon: '🎫', label: 'Issued Tickets'      },
  { id: 'announcements', icon: '📢', label: 'Announcements'       },
  { id: 'updates',       icon: '🔴', label: 'Live Updates'        },
  { id: 'auditions',     icon: '🎤', label: 'Auditions'           },
  { id: 'contestants',   icon: '🏆', label: 'Contestants'         },
  { id: 'sponsors',      icon: '🤝', label: 'Partners & Sponsors' },
  { id: 'jointeam',      icon: '👥', label: 'Join Our Team'       },
  { id: 'contact',       icon: '💬', label: 'Contact Messages'    },
  { id: 'judges',        icon: '⚖️', label: 'Judges'              },
];

export const PAGE_TITLES = {
  dashboard:     'Dashboard',
  donations:     'Donations',
  tickets:       'Issued Tickets',
  announcements: 'Announcements',
  updates:       'Live Updates',
  auditions:     'Auditions',
  contestants:   'Contestants',
  sponsors:      'Partners & Sponsors',
  jointeam:      'Join Our Team',
  contact:       'Contact Messages',
  judges:        'Judges',
};

export const STATUS_MAP = {
  Confirmed:  'badgeSuccess',
  Pending:    'badgeWarning',
  Active:     'badgeSuccess',
  Used:       'badgeInfo',
  Passed:     'badgeSuccess',
  Failed:     'badgeDanger',
  Scheduled:  'badgeInfo',
  Eliminated: 'badgeDanger',
  Probation:  'badgeWarning',
  Revoked:    'badgeDanger',
};

export const INIT_DATA = {
  donations: [
    { id: 1, fullName: 'Emeka Okafor',  email: 'emeka@mail.com',  phone: '+234 801 234 5678', amount: '₦50,000', monthly: true,  date: 'Feb 18, 2026', status: 'Confirmed' },
    { id: 2, fullName: 'Ngozi Eze',     email: 'ngozi@mail.com',  phone: '+234 802 345 6789', amount: '₦25,000', monthly: false, date: 'Feb 17, 2026', status: 'Confirmed' },
    { id: 3, fullName: 'Anonymous',     email: 'anon@mail.com',   phone: '+234 803 456 7890', amount: '₦10,000', monthly: false, date: 'Feb 17, 2026', status: 'Pending'   },
    { id: 4, fullName: 'Bello Adamu',   email: 'bello@mail.com',  phone: '+234 804 567 8901', amount: '₦75,000', monthly: true,  date: 'Feb 16, 2026', status: 'Confirmed' },
    { id: 5, fullName: 'Fatima Musa',   email: 'fatima@mail.com', phone: '+234 805 678 9012', amount: '₦15,000', monthly: true,  date: 'Feb 15, 2026', status: 'Pending'   },
  ],

  tickets: [
    { id: 'TKT-001', fullName: 'Ada Nwosu',   email: 'ada@mail.com',   type: 'Standard Access',     date: 'Mar 1, 2026',  status: 'Active' },
    { id: 'TKT-002', fullName: 'Seun Bello',  email: 'seun@mail.com',  type: 'VIP Access',          date: 'Apr 15, 2026', status: 'Active' },
    { id: 'TKT-003', fullName: 'Tunde Alli',  email: 'tunde@mail.com', type: 'All Access Gold Pass', date: 'Apr 1, 2026',  status: 'Used'   },
    { id: 'TKT-004', fullName: 'Grace Okeke', email: 'grace@mail.com', type: 'Standard Access',     date: 'Mar 2, 2026',  status: 'Active' },
    { id: 'TKT-005', fullName: 'Chidi Obi',   email: 'chidi@mail.com', type: 'All Access Gold Pass', date: 'Apr 15, 2026', status: 'Used'   },
  ],

  announcements: [
    { id: 1, title: 'Auditions now open!',              body: 'Applications for Season 3 auditions are now officially open. Interested candidates should visit our website to register.',                           date: 'Feb 15, 2026', author: 'Admin', pinned: true  },
    { id: 2, title: 'Venue Change for Auditions Day 2', body: 'Please note that Day 2 auditions have been moved to Muson Centre, Lagos. All registered candidates will receive updated details via email.',         date: 'Feb 18, 2026', author: 'Admin', pinned: false },
    { id: 3, title: 'Voting Lines Now Open!',           body: 'Cast your vote for your favourite contestant via SMS or the website. Standard network rates apply.',                                                 date: 'Feb 20, 2026', author: 'Admin', pinned: true  },
  ],

  updates: [
    { id: 1, text: '🎤 Amara Joy just scored 98/100 in the vocal round!',                   time: '2 mins ago',  pinned: true  },
    { id: 2, text: '📊 Voting lines experiencing high traffic — please retry in a moment.', time: '5 mins ago',  pinned: false },
    { id: 3, text: '🏆 Kelvin Bright advances to the next round with a standing ovation.',  time: '12 mins ago', pinned: false },
    { id: 4, text: '📢 The judges panel is now in deliberation for Group B.',               time: '25 mins ago', pinned: false },
  ],

  auditions: [
    { id: 1, firstName: 'Amara',  lastName: 'Joy',    email: 'amara@mail.com',  country: 'Nigeria',      phone: '+234 801 234 5678', location: 'Lagos',    date: 'Mar 1, 2026', time: '10:00 AM', planId: 'gold-pass',   status: 'Confirmed' },
    { id: 2, firstName: 'Kelvin', lastName: 'Bright', email: 'kelvin@mail.com', country: 'Ghana',        phone: '+233 244 567 890',  location: 'Accra',    date: 'Mar 1, 2026', time: '10:45 AM', planId: 'vip-pass',    status: 'Confirmed' },
    { id: 3, firstName: 'Sade',   lastName: 'Olu',    email: 'sade@mail.com',   country: 'Nigeria',      phone: '+234 802 345 6789', location: 'Abuja',    date: 'Mar 1, 2026', time: '11:30 AM', planId: 'silver-pass', status: 'Pending'   },
    { id: 4, firstName: 'Chisom', lastName: 'Uche',   email: 'chisom@mail.com', country: 'Nigeria',      phone: '+234 803 456 7890', location: 'Enugu',    date: 'Mar 2, 2026', time: '12:00 PM', planId: 'gold-pass',   status: 'Confirmed' },
    { id: 5, firstName: 'Emeka',  lastName: 'Ray',    email: 'emeka@mail.com',  country: 'Nigeria',      phone: '+234 805 678 9012', location: 'Lagos',    date: 'Mar 2, 2026', time: '1:00 PM',  planId: 'silver-pass', status: 'Pending'   },
    { id: 6, firstName: 'Lola',   lastName: 'Kins',   email: 'lola@mail.com',   country: 'Sierra Leone', phone: '+232 76 123 456',   location: 'Freetown', date: 'Mar 2, 2026', time: '1:45 PM',  planId: 'vip-pass',    status: 'Pending'   },
  ],

  // ── Contestants now include full profile fields for ContestantProfile + VotingPage
  contestants: [
    {
      id: 1, name: 'Amara Joy', nickname: '@AmaraShines', category: 'Vocals',
      votes: 8420, max: 10000, status: 'Active',
      age: 22, hometown: 'Lagos, Nigeria',
      bio: 'A powerhouse vocalist who has been singing since age 6. Amara trained at the Lagos Conservatory of Music and has performed at the National Theatre. Her rich tone and emotional delivery have captivated audiences across West Africa.',
      highlight: 'Won the Regional Vocal Championship 2024',
      instagram: '@amarashines', auditionSong: 'Ave Maria (Original Arrangement)',
      photoPreview: null,
    },
    {
      id: 2, name: 'Kelvin Bright', nickname: '@KelvinB', category: 'Dance',
      votes: 7210, max: 10000, status: 'Active',
      age: 25, hometown: 'Accra, Ghana',
      bio: 'Contemporary and afrobeats dancer trained under the Ghana National Dance Ensemble. Kelvin fuses traditional Ghanaian footwork with modern street dance, creating a signature style that is entirely his own.',
      highlight: 'Featured dancer on 3 music videos with 10M+ views',
      instagram: '@kelvinbright', auditionSong: 'Original Choreography to Burna Boy Medley',
      photoPreview: null,
    },
    {
      id: 3, name: 'Chisom Uche', nickname: '@ChisomU', category: 'Instrumentals',
      votes: 6550, max: 10000, status: 'Active',
      age: 20, hometown: 'Enugu, Nigeria',
      bio: 'Multi-instrumentalist who plays piano, guitar and mbira. Chisom composes original Afrofusion pieces that blend classical technique with traditional Igbo melodies. She is currently studying Music at UNN.',
      highlight: 'Performed at TEDx Enugu 2023',
      instagram: '@chisomunche', auditionSong: 'Original Piano Composition — Echoes of Udi',
      photoPreview: null,
    },
    {
      id: 4, name: 'Sade Olu', nickname: '@SadeOlu', category: 'Vocals',
      votes: 5100, max: 10000, status: 'Active',
      age: 24, hometown: 'Abuja, Nigeria',
      bio: 'Soulful R&B singer with an unmistakable falsetto. Sade has been a session vocalist for several Nollywood productions and is known for her intense stage presence and ability to connect deeply with every crowd she performs for.',
      highlight: 'Lead vocalist for Abuja International Jazz Festival 2024',
      instagram: '@sadeolu', auditionSong: 'No Ordinary Love — Original Cover',
      photoPreview: null,
    },
    {
      id: 5, name: 'Emeka Ray', nickname: '@EmekaRay', category: 'Vocals',
      votes: 3800, max: 10000, status: 'Probation',
      age: 27, hometown: 'Port Harcourt, Nigeria',
      bio: 'Gospel-turned-Afrobeats vocalist with a massive vocal range. Emeka has been singing in church choirs since childhood and recently transitioned to secular music, blending his gospel roots with contemporary African sound.',
      highlight: 'Choir Director at RCCG Port Harcourt for 5 years',
      instagram: '@emekaray', auditionSong: 'Higher — Original Gospel Afrobeats',
      photoPreview: null,
    },
    {
      id: 6, name: 'Lola Kins', nickname: '@LolaK', category: 'Dance',
      votes: 2200, max: 10000, status: 'Eliminated',
      age: 19, hometown: 'Freetown, Sierra Leone',
      bio: "Sierra Leone's youngest competitor this season. Lola is a self-taught dancer who learned from YouTube tutorials before joining a local dance crew at 14. Despite her elimination, she remains a fan favourite for her infectious energy.",
      highlight: 'Youngest contestant in StarStage Season 3',
      instagram: '@lolakins', auditionSong: 'Dance Medley — Afrobeats & Amapiano Fusion',
      photoPreview: null,
    },
  ],
};