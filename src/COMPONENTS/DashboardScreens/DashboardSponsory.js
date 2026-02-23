// src/COMPONENTS/DashboardScreens/DashboardSponsors.jsx
import React, { useState } from 'react';
import styles from '../../CSS-MODULES/Sponsory.module.css';
import shared from './Dashboardshared.module.css';
import DashboardModal from './Dashboardmodal';

const TIERS = ['Platinum', 'Gold', 'Silver', 'Bronze'];

const TIER_CLASS = {
  Platinum: styles.tierPlatinum,
  Gold:     styles.tierGold,
  Silver:   styles.tierSilver,
  Bronze:   styles.tierBronze,
};

const TIER_ICON = {
  Platinum: '💠',
  Gold:     '🥇',
  Silver:   '🥈',
  Bronze:   '🥉',
};

const EMPTY_FORM = {
  orgName:    '',
  email:      '',
  contact:    '',
  phone:      '',
  tier:       'Gold',
  website:    '',
  message:    '',
  logo:       null,
  logoPreview: null,
};

const INIT_SPONSORS = [
  { id: 1, orgName: 'TechNaija Ltd',    email: 'hello@technaija.com',  contact: 'Emeka Obi',    phone: '+234 801 111 2222', tier: 'Platinum', website: 'https://technaija.com',    message: 'We aim to empower youth talent through technology partnerships.', logo: null, status: 'Active'   },
  { id: 2, orgName: 'Bloom Foods NG',   email: 'info@bloomfoods.ng',   contact: 'Ngozi Eze',    phone: '+234 802 333 4444', tier: 'Gold',     website: 'https://bloomfoods.ng',    message: 'Supporting cultural expressions and entertainment in Nigeria.',   logo: null, status: 'Active'   },
  { id: 3, orgName: 'PanAfrica Media',  email: 'bd@panafrica.media',   contact: 'Kwame Asante', phone: '+233 244 555 6666', tier: 'Silver',   website: 'https://panafrica.media',  message: 'Expanding African storytelling to a global audience.',            logo: null, status: 'Pending'  },
  { id: 4, orgName: 'Royal Crown Bank', email: 'corp@royalcrown.ng',   contact: 'Fatima Musa',  phone: '+234 803 777 8888', tier: 'Bronze',   website: 'https://royalcrown.ng',    message: 'Banking on talent — proud to support Nigeria\'s rising stars.',   logo: null, status: 'Active'   },
];

const DashboardSponsors = () => {
  const [sponsors, setSponsors] = useState(INIT_SPONSORS);
  const [modal, setModal]       = useState(false);
  const [viewEntry, setViewEntry] = useState(null);
  const [search, setSearch]     = useState('');
  const [tierFilter, setTierFilter] = useState('All');
  const [form, setForm]         = useState(EMPTY_FORM);

  const field = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handleLogoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(p => ({ ...p, logo: file, logoPreview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const handleAdd = () => {
    if (!form.orgName || !form.email || !form.contact) return;
    const entry = { id: Date.now(), ...form, status: 'Pending' };
    setSponsors(p => [entry, ...p]);
    setForm(EMPTY_FORM);
    setModal(false);
  };

  const handleDelete = id => setSponsors(p => p.filter(s => s.id !== id));

  const handleStatusChange = (id, status) =>
    setSponsors(p => p.map(s => s.id === id ? { ...s, status } : s));

  const filtered = sponsors.filter(s => {
    const q = search.toLowerCase();
    const matchSearch =
      (s.orgName  || '').toLowerCase().includes(q) ||
      (s.email    || '').toLowerCase().includes(q) ||
      (s.contact  || '').toLowerCase().includes(q);
    const matchTier = tierFilter === 'All' || s.tier === tierFilter;
    return matchSearch && matchTier;
  });

  const counts = {
    total:    sponsors.length,
    platinum: sponsors.filter(s => s.tier === 'Platinum').length,
    gold:     sponsors.filter(s => s.tier === 'Gold').length,
    silver:   sponsors.filter(s => s.tier === 'Silver').length,
    bronze:   sponsors.filter(s => s.tier === 'Bronze').length,
  };

  return (
    <div>
      {/* ── Stats ── */}
      <div className={shared.statsGrid}>
        <div className={shared.statCard}>
          <div className={shared.statIcon}>🤝</div>
          <div className={shared.statValue}>{counts.total}</div>
          <div className={shared.statLabel}>Total Partners</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statIcon}>💠</div>
          <div className={shared.statValue}>{counts.platinum}</div>
          <div className={shared.statLabel}>Platinum</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statIcon}>🥇</div>
          <div className={shared.statValue}>{counts.gold}</div>
          <div className={shared.statLabel}>Gold</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statIcon}>🥈</div>
          <div className={shared.statValue}>{counts.silver}</div>
          <div className={shared.statLabel}>Silver</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statIcon}>🥉</div>
          <div className={shared.statValue}>{counts.bronze}</div>
          <div className={shared.statLabel}>Bronze</div>
        </div>
      </div>

      {/* ── Header ── */}
      <div className={shared.sectionHeader}>
        <span className={shared.sectionTitle}>🤝 <span>Partners & Sponsors</span></span>
        <button className={`${shared.btn} ${shared.btnPrimary}`} onClick={() => setModal(true)}>
          + Add Partner
        </button>
      </div>

      {/* ── Search ── */}
      <div className={shared.searchWrap}>
        <span className={shared.searchIcon}>🔍</span>
        <input
          className={shared.searchInput}
          placeholder="Search by organisation, email or contact person..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Tier Filter Tabs ── */}
      <div className={styles.tierTabs}>
        {['All', ...TIERS].map(t => (
          <button
            key={t}
            className={`${styles.tierTab} ${tierFilter === t ? styles.tierTabActive : ''}`}
            onClick={() => setTierFilter(t)}
          >
            {TIER_ICON[t] || '🔘'} {t}
          </button>
        ))}
      </div>

      {/* ── Sponsor Cards ── */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🤝</div>
          No partners found
        </div>
      ) : (
        <div className={styles.sponsorsGrid}>
          {filtered.map(s => (
            <div key={s.id} className={styles.sponsorCard}>
              <div className={styles.sponsorCardTop}>
                <div className={styles.sponsorLogo}>
                  {s.logoPreview
                    ? <img src={s.logoPreview} alt={s.orgName} />
                    : <div className={styles.sponsorLogoPlaceholder}>{s.orgName[0]}</div>
                  }
                </div>
                <div className={styles.sponsorInfo}>
                  <div className={styles.sponsorName}>{s.orgName}</div>
                  <div className={styles.sponsorContact}>{s.contact}</div>
                  <span className={TIER_CLASS[s.tier]}>{TIER_ICON[s.tier]} {s.tier}</span>
                </div>
              </div>

              <div className={styles.sponsorDivider} />

              <div className={styles.sponsorDetail}>
                <span className={styles.sponsorDetailIcon}>📧</span>
                <span>{s.email}</span>
              </div>
              <div className={styles.sponsorDetail}>
                <span className={styles.sponsorDetailIcon}>📞</span>
                <span>{s.phone}</span>
              </div>
              {s.website && (
                <div className={styles.sponsorDetail}>
                  <span className={styles.sponsorDetailIcon}>🌐</span>
                  <a href={s.website} target="_blank" rel="noreferrer" className={styles.sponsorWebsite}>
                    {s.website}
                  </a>
                </div>
              )}
              {s.message && (
                <div className={styles.sponsorMessage}>"{s.message}"</div>
              )}

              <div className={styles.sponsorCardActions}>
                <button
                  className={`${shared.btn} ${shared.btnOutline} ${shared.btnSm}`}
                  onClick={() => setViewEntry(s)}
                >
                  View
                </button>
                {s.status === 'Pending' && (
                  <button
                    className={`${shared.btn} ${shared.btnGreen} ${shared.btnSm}`}
                    onClick={() => handleStatusChange(s.id, 'Active')}
                  >
                    Approve
                  </button>
                )}
                <button
                  className={`${shared.btn} ${shared.btnDanger} ${shared.btnSm}`}
                  onClick={() => handleDelete(s.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add Partner Modal ── */}
      {modal && (
        <DashboardModal title="Add Partner / Sponsor" onClose={() => { setModal(false); setForm(EMPTY_FORM); }}>
          <div className={shared.formGrid}>

            <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
              <label className={shared.label}>Organisation / Brand Name</label>
              <input className={shared.input} placeholder="e.g. TechNaija Ltd"
                value={form.orgName} onChange={e => field('orgName', e.target.value)} />
            </div>

            <div className={shared.formGroup}>
              <label className={shared.label}>Email Address</label>
              <input className={shared.input} type="email" placeholder="e.g. hello@brand.com"
                value={form.email} onChange={e => field('email', e.target.value)} />
            </div>

            <div className={shared.formGroup}>
              <label className={shared.label}>Contact Person</label>
              <input className={shared.input} placeholder="e.g. Emeka Obi"
                value={form.contact} onChange={e => field('contact', e.target.value)} />
            </div>

            <div className={shared.formGroup}>
              <label className={shared.label}>Phone Number</label>
              <input className={shared.input} placeholder="e.g. +234 801 234 5678"
                value={form.phone} onChange={e => field('phone', e.target.value)} />
            </div>

            <div className={shared.formGroup}>
              <label className={shared.label}>Sponsorship Tier</label>
              <select className={shared.select} value={form.tier} onChange={e => field('tier', e.target.value)}>
                {TIERS.map(t => <option key={t} value={t}>{TIER_ICON[t]} {t}</option>)}
              </select>
            </div>

            <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
              <label className={shared.label}>Company Website</label>
              <input className={shared.input} placeholder="e.g. https://brand.com"
                value={form.website} onChange={e => field('website', e.target.value)} />
            </div>

            <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
              <label className={shared.label}>Brief Message / Partnership Goal</label>
              <textarea className={shared.textarea} placeholder="Describe your partnership goals..."
                value={form.message} onChange={e => field('message', e.target.value)} />
            </div>

            <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
              <label className={shared.label}>Upload Logo</label>
              {form.logoPreview ? (
                <div className={styles.uploadPreview}>
                  <img src={form.logoPreview} alt="logo" className={styles.uploadPreviewImg} />
                  <span className={styles.uploadPreviewName}>{form.logo?.name}</span>
                  <button className={styles.uploadPreviewRemove} onClick={() => field('logo', null) || field('logoPreview', null)}>✕</button>
                </div>
              ) : (
                <div className={styles.uploadArea}>
                  <div className={styles.uploadIcon}>🖼️</div>
                  <div className={styles.uploadText}>Click to upload logo</div>
                  <div className={styles.uploadSub}>PNG, JPG or SVG · Max 2MB</div>
                  <input type="file" accept="image/*" className={styles.uploadInput} onChange={handleLogoUpload} />
                </div>
              )}
            </div>

          </div>
          <div className={shared.modalActions}>
            <button className={`${shared.btn} ${shared.btnOutline}`} onClick={() => { setModal(false); setForm(EMPTY_FORM); }}>
              Cancel
            </button>
            <button className={`${shared.btn} ${shared.btnPrimary}`} onClick={handleAdd}>
              Add Partner
            </button>
          </div>
        </DashboardModal>
      )}

      {/* ── View Partner Modal ── */}
      {viewEntry && (
        <DashboardModal title="Partner Details" onClose={() => setViewEntry(null)}>
          <div className={shared.formGrid}>
            {[
              { label: 'Organisation', value: viewEntry.orgName  },
              { label: 'Email',        value: viewEntry.email    },
              { label: 'Contact',      value: viewEntry.contact  },
              { label: 'Phone',        value: viewEntry.phone    },
              { label: 'Website',      value: viewEntry.website  },
            ].map(row => (
              <div className={shared.formGroup} key={row.label}>
                <span className={shared.label}>{row.label}</span>
                <span style={{ color: '#e8f5e8', fontSize: 14, fontWeight: 500 }}>{row.value || '—'}</span>
              </div>
            ))}
            <div className={shared.formGroup}>
              <span className={shared.label}>Sponsorship Tier</span>
              <div style={{ marginTop: 4 }}>
                <span className={TIER_CLASS[viewEntry.tier]}>{TIER_ICON[viewEntry.tier]} {viewEntry.tier}</span>
              </div>
            </div>
            {viewEntry.message && (
              <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
                <span className={shared.label}>Partnership Goal</span>
                <div className={styles.sponsorMessage} style={{ marginTop: 6 }}>"{viewEntry.message}"</div>
              </div>
            )}
          </div>
          <div className={shared.modalActions}>
            {viewEntry.status === 'Pending' && (
              <button
                className={`${shared.btn} ${shared.btnGreen}`}
                onClick={() => { handleStatusChange(viewEntry.id, 'Active'); setViewEntry(null); }}
              >
                ✓ Approve Partner
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

export default DashboardSponsors;