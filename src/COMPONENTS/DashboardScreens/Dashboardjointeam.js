// src/COMPONENTS/DashboardScreens/DashboardJoinTeam.jsx
import React, { useState } from 'react';
import styles from '../../CSS-MODULES/Jointeam.module.css';
import shared from './Dashboardshared.module.css';
import DashboardModal from './Dashboardmodal';

const POSITIONS = [
  'Event Coordinator',
  'Marketing & PR',
  'Social Media Manager',
  'Videographer / Photographer',
  'Stage Manager',
  'Sound Engineer',
  'Volunteer',
  'Other',
];

const STATUS_CLASS = {
  New:       styles.statusNew,
  Reviewing: styles.statusReviewing,
  Accepted:  styles.statusAccepted,
  Declined:  styles.statusDeclined,
};

const EMPTY_FORM = {
  fullName:   '',
  email:      '',
  phone:      '',
  position:   'Event Coordinator',
  experience: '',
  portfolio:  '',
  cvFile:     null,
  cvFileName: '',
};

const INIT_APPLICANTS = [
  { id: 1, fullName: 'Amaka Osei',    email: 'amaka@mail.com',  phone: '+234 801 234 5678', position: 'Event Coordinator',       experience: '3 years managing large-scale cultural events across Lagos and Abuja.',    portfolio: 'https://linkedin.com/in/amakaosei',   cvFileName: 'amaka_cv.pdf',    status: 'Reviewing', date: 'Feb 18, 2026' },
  { id: 2, fullName: 'David Mensah',  email: 'david@mail.com',  phone: '+233 244 567 8901', position: 'Videographer / Photographer', experience: 'Award-winning videographer with 5+ years in music and entertainment.',  portfolio: 'https://davidmensah.co',              cvFileName: 'david_portfolio.pdf', status: 'Accepted',  date: 'Feb 16, 2026' },
  { id: 3, fullName: 'Zainab Yusuf',  email: 'zainab@mail.com', phone: '+234 802 345 6789', position: 'Social Media Manager',    experience: 'Grew brand accounts to 200k+ followers. Expert in content strategy.',      portfolio: 'https://zainabyusuf.com',             cvFileName: 'zainab_cv.pdf',   status: 'New',       date: 'Feb 20, 2026' },
  { id: 4, fullName: 'Chike Nwosu',   email: 'chike@mail.com',  phone: '+234 803 456 7890', position: 'Sound Engineer',         experience: '7 years of live sound engineering for concerts, award shows and TV.',      portfolio: 'https://soundcloud.com/chikenwosu',   cvFileName: 'chike_cv.pdf',    status: 'New',       date: 'Feb 21, 2026' },
];

const DashboardJoinTeam = () => {
  const [applicants, setApplicants] = useState(INIT_APPLICANTS);
  const [modal, setModal]           = useState(false);
  const [viewEntry, setViewEntry]   = useState(null);
  const [search, setSearch]         = useState('');
  const [filter, setFilter]         = useState('All');
  const [form, setForm]             = useState(EMPTY_FORM);

  const field = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleCvUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setForm(p => ({ ...p, cvFile: file, cvFileName: file.name }));
  };

  const handleAdd = () => {
    if (!form.fullName || !form.email || !form.position) return;
    const entry = {
      id: Date.now(),
      ...form,
      status: 'New',
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
    };
    setApplicants(p => [entry, ...p]);
    setForm(EMPTY_FORM);
    setModal(false);
  };

  const handleDelete = id => setApplicants(p => p.filter(a => a.id !== id));

  const handleStatus = (id, status) =>
    setApplicants(p => p.map(a => a.id === id ? { ...a, status } : a));

  const filtered = applicants.filter(a => {
    const q = search.toLowerCase();
    const matchSearch =
      (a.fullName || '').toLowerCase().includes(q) ||
      (a.email    || '').toLowerCase().includes(q) ||
      (a.position || '').toLowerCase().includes(q);
    const matchFilter = filter === 'All' || a.status === filter;
    return matchSearch && matchFilter;
  });

  const counts = {
    total:     applicants.length,
    new:       applicants.filter(a => a.status === 'New').length,
    reviewing: applicants.filter(a => a.status === 'Reviewing').length,
    accepted:  applicants.filter(a => a.status === 'Accepted').length,
    declined:  applicants.filter(a => a.status === 'Declined').length,
  };

  return (
    <div>
      {/* ── Stats ── */}
      <div className={shared.statsGrid}>
        <div className={shared.statCard}>
          <div className={shared.statIcon}>👥</div>
          <div className={shared.statValue}>{counts.total}</div>
          <div className={shared.statLabel}>Total Applicants</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statIcon}>🆕</div>
          <div className={shared.statValue}>{counts.new}</div>
          <div className={shared.statLabel}>New</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statIcon}>🔍</div>
          <div className={shared.statValue}>{counts.reviewing}</div>
          <div className={shared.statLabel}>Reviewing</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statIcon}>✅</div>
          <div className={shared.statValue}>{counts.accepted}</div>
          <div className={shared.statLabel}>Accepted</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statIcon}>❌</div>
          <div className={shared.statValue}>{counts.declined}</div>
          <div className={shared.statLabel}>Declined</div>
        </div>
      </div>

      {/* ── Header ── */}
      <div className={shared.sectionHeader}>
        <span className={shared.sectionTitle}>👥 <span>Join Our Team</span></span>
        <button className={`${shared.btn} ${shared.btnPrimary}`} onClick={() => setModal(true)}>
          + Add Applicant
        </button>
      </div>

      {/* ── Search ── */}
      <div className={shared.searchWrap}>
        <span className={shared.searchIcon}>🔍</span>
        <input
          className={shared.searchInput}
          placeholder="Search by name, email or position..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Filter Tabs ── */}
      <div className={styles.filterTabs}>
        {['All', 'New', 'Reviewing', 'Accepted', 'Declined'].map(f => (
          <button
            key={f}
            className={`${styles.filterTab} ${filter === f ? styles.filterTabActive : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Applicant Cards ── */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>👥</div>
          No applicants found
        </div>
      ) : (
        <div className={styles.applicantsGrid}>
          {filtered.map(a => (
            <div key={a.id} className={styles.applicantCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardAvatar}>{(a.fullName || '?')[0]}</div>
                <div>
                  <div className={styles.cardName}>{a.fullName}</div>
                  <div className={styles.cardEmail}>{a.email}</div>
                </div>
              </div>

              <div style={{ marginBottom: 8 }}>
                <span className={STATUS_CLASS[a.status]}>{a.status}</span>
                {' '}
                <span className={styles.positionBadge}>{a.position}</span>
              </div>

              <div className={styles.cardDivider} />

              <div className={styles.cardRow}>
                <span className={styles.cardRowIcon}>📞</span>
                <span className={styles.cardRowValue}>{a.phone}</span>
              </div>

              {a.experience && (
                <div className={styles.cardExperience}>{a.experience}</div>
              )}

              {(a.portfolio || a.cvFileName) && (
                <div className={styles.cardRow} style={{ marginTop: 8 }}>
                  <span className={styles.cardRowIcon}>📎</span>
                  {a.portfolio
                    ? <a href={a.portfolio} target="_blank" rel="noreferrer" className={styles.portfolioLink}>{a.portfolio}</a>
                    : <span className={styles.cardRowValue}>{a.cvFileName}</span>
                  }
                </div>
              )}

              <div className={styles.cardActions}>
                <button
                  className={`${shared.btn} ${shared.btnOutline} ${shared.btnSm}`}
                  onClick={() => setViewEntry(a)}
                >
                  View
                </button>
                {a.status === 'New' && (
                  <button
                    className={`${shared.btn} ${shared.btnGreen} ${shared.btnSm}`}
                    onClick={() => handleStatus(a.id, 'Reviewing')}
                  >
                    Review
                  </button>
                )}
                {a.status === 'Reviewing' && (
                  <button
                    className={`${shared.btn} ${shared.btnGreen} ${shared.btnSm}`}
                    onClick={() => handleStatus(a.id, 'Accepted')}
                  >
                    Accept
                  </button>
                )}
                <button
                  className={`${shared.btn} ${shared.btnDanger} ${shared.btnSm}`}
                  onClick={() => handleDelete(a.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add Applicant Modal ── */}
      {modal && (
        <DashboardModal title="Add Applicant" onClose={() => { setModal(false); setForm(EMPTY_FORM); }}>
          <div className={shared.formGrid}>

            <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
              <label className={shared.label}>Full Name</label>
              <input className={shared.input} placeholder="e.g. Amaka Osei"
                value={form.fullName} onChange={e => field('fullName', e.target.value)} />
            </div>

            <div className={shared.formGroup}>
              <label className={shared.label}>Email Address</label>
              <input className={shared.input} type="email" placeholder="e.g. amaka@email.com"
                value={form.email} onChange={e => field('email', e.target.value)} />
            </div>

            <div className={shared.formGroup}>
              <label className={shared.label}>Phone Number</label>
              <input className={shared.input} placeholder="e.g. +234 801 234 5678"
                value={form.phone} onChange={e => field('phone', e.target.value)} />
            </div>

            <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
              <label className={shared.label}>Position Interested In</label>
              <select className={shared.select}
                value={form.position} onChange={e => field('position', e.target.value)}>
                {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
              </select>
            </div>

            <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
              <label className={shared.label}>Briefly Describe Your Experience</label>
              <textarea className={shared.textarea}
                placeholder="Tell us about your relevant experience..."
                value={form.experience} onChange={e => field('experience', e.target.value)} />
            </div>

            <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
              <label className={shared.label}>Portfolio Link (optional)</label>
              <input className={shared.input} placeholder="e.g. https://yourportfolio.com or LinkedIn URL"
                value={form.portfolio} onChange={e => field('portfolio', e.target.value)} />
            </div>

            <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
              <label className={shared.label}>Upload CV / Portfolio</label>
              {form.cvFileName ? (
                <div className={styles.uploadedFile}>
                  <span>📄</span>
                  <span className={styles.uploadedFileName}>{form.cvFileName}</span>
                  <button className={styles.uploadedRemove}
                    onClick={() => setForm(p => ({ ...p, cvFile: null, cvFileName: '' }))}>✕</button>
                </div>
              ) : (
                <div className={styles.uploadArea}>
                  <div className={styles.uploadIcon}>📄</div>
                  <div className={styles.uploadText}>Click to upload CV or Portfolio</div>
                  <div className={styles.uploadSub}>PDF, DOC, DOCX · Max 5MB</div>
                  <input type="file" accept=".pdf,.doc,.docx"
                    className={styles.uploadInput} onChange={handleCvUpload} />
                </div>
              )}
            </div>

          </div>
          <div className={shared.modalActions}>
            <button className={`${shared.btn} ${shared.btnOutline}`} onClick={() => { setModal(false); setForm(EMPTY_FORM); }}>
              Cancel
            </button>
            <button className={`${shared.btn} ${shared.btnPrimary}`} onClick={handleAdd}>
              Submit Application
            </button>
          </div>
        </DashboardModal>
      )}

      {/* ── View Applicant Modal ── */}
      {viewEntry && (
        <DashboardModal title="Applicant Details" onClose={() => setViewEntry(null)}>
          <div className={shared.formGrid}>
            {[
              { label: 'Full Name', value: viewEntry.fullName },
              { label: 'Email',     value: viewEntry.email    },
              { label: 'Phone',     value: viewEntry.phone    },
              { label: 'Date',      value: viewEntry.date     },
            ].map(row => (
              <div className={shared.formGroup} key={row.label}>
                <span className={shared.label}>{row.label}</span>
                <span style={{ color: '#e8f5e8', fontSize: 14, fontWeight: 500 }}>{row.value || '—'}</span>
              </div>
            ))}

            <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
              <span className={shared.label}>Position</span>
              <div style={{ marginTop: 4 }}>
                <span className={styles.positionBadge}>{viewEntry.position}</span>
              </div>
            </div>

            {viewEntry.experience && (
              <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
                <span className={shared.label}>Experience</span>
                <div className={styles.cardExperience} style={{ marginTop: 6 }}>{viewEntry.experience}</div>
              </div>
            )}

            {viewEntry.portfolio && (
              <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
                <span className={shared.label}>Portfolio / CV Link</span>
                <a href={viewEntry.portfolio} target="_blank" rel="noreferrer"
                  className={styles.portfolioLink} style={{ marginTop: 4, display: 'block' }}>
                  {viewEntry.portfolio}
                </a>
              </div>
            )}

            {viewEntry.cvFileName && !viewEntry.portfolio && (
              <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
                <span className={shared.label}>Uploaded CV</span>
                <span style={{ color: '#e8f5e8', fontSize: 13 }}>📄 {viewEntry.cvFileName}</span>
              </div>
            )}

            <div className={shared.formGroup}>
              <span className={shared.label}>Status</span>
              <div style={{ marginTop: 4 }}>
                <span className={STATUS_CLASS[viewEntry.status]}>{viewEntry.status}</span>
              </div>
            </div>
          </div>

          <div className={shared.modalActions}>
            {viewEntry.status === 'New' && (
              <button className={`${shared.btn} ${shared.btnOutline}`}
                onClick={() => { handleStatus(viewEntry.id, 'Reviewing'); setViewEntry(null); }}>
                🔍 Move to Review
              </button>
            )}
            {viewEntry.status === 'Reviewing' && (
              <button className={`${shared.btn} ${shared.btnGreen}`}
                onClick={() => { handleStatus(viewEntry.id, 'Accepted'); setViewEntry(null); }}>
                ✓ Accept
              </button>
            )}
            {(viewEntry.status === 'New' || viewEntry.status === 'Reviewing') && (
              <button className={`${shared.btn} ${shared.btnDanger}`}
                onClick={() => { handleStatus(viewEntry.id, 'Declined'); setViewEntry(null); }}>
                ✗ Decline
              </button>
            )}
            <button className={`${shared.btn} ${shared.btnOutline}`} onClick={() => setViewEntry(null)}>
              Close
            </button>
          </div>
        </DashboardModal>
      )}
    </div>
  );
};

export default DashboardJoinTeam;