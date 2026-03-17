// src/COMPONENTS/DashboardScreens/DashboardJudges.jsx
import React, { useState } from 'react';
import styles from '../DashboardScreens/Judges.module.css';
import shared from '../DashboardScreens/Dashboardshared.module.css';
import DashboardModal from './Dashboardmodal';

const ROLES = ['Head Judge', 'Guest Judge', 'Mentor'];

const ROLE_CLASS = {
  'Head Judge':  styles.roleHead,
  'Guest Judge': styles.roleGuest,
  'Mentor':      styles.roleMentor,
};

const SPECIALITIES = [
  'Vocals', 'Dance', 'Instrumentals', 'Music Production',
  'Acting', 'Comedy', 'Spoken Word', 'General',
];

const EMPTY_FORM = {
  fullName:    '',
  email:       '',
  phone:       '',
  role:        'Guest Judge',
  speciality:  'Vocals',
  nationality: '',
  bio:         '',
  instagram:   '',
  photoPreview: null,
  photoFile:   null,
  status:      'Active',
};

const INIT_JUDGES = [
  {
    id: 1,
    fullName:    'Dr. Adaeze Okonkwo',
    email:       'adaeze@starstage.ng',
    phone:       '+234 801 111 2222',
    role:        'Head Judge',
    speciality:  'Vocals',
    nationality: 'Nigerian',
    bio:         'Award-winning vocal coach with 20 years in the Nigerian music industry. Producer of 3 platinum-certified albums.',
    instagram:   '@adaezeokonkwo',
    photoPreview: null,
    status:      'Active',
  },
  {
    id: 2,
    fullName:    'Kofi Mensah',
    email:       'kofi@starstage.ng',
    phone:       '+233 244 333 4444',
    role:        'Guest Judge',
    speciality:  'Dance',
    nationality: 'Ghanaian',
    bio:         'Internationally acclaimed choreographer. Has worked with top African artists on world tours.',
    instagram:   '@kofimensahdance',
    photoPreview: null,
    status:      'Active',
  },
  {
    id: 3,
    fullName:    'Fatima Al-Hassan',
    email:       'fatima@starstage.ng',
    phone:       '+234 802 555 6666',
    role:        'Mentor',
    speciality:  'Music Production',
    nationality: 'Nigerian',
    bio:         'Grammy-nominated music producer and songwriter. Founder of AfroSound Studios, Lagos.',
    instagram:   '@fatimaproduces',
    photoPreview: null,
    status:      'Active',
  },
  {
    id: 4,
    fullName:    'Segun Adeyemi',
    email:       'segun@starstage.ng',
    phone:       '+234 803 777 8888',
    role:        'Guest Judge',
    speciality:  'Instrumentals',
    nationality: 'Nigerian',
    bio:         'Classical and contemporary guitarist, music lecturer at the University of Lagos.',
    instagram:   '@segunguitar',
    photoPreview: null,
    status:      'Inactive',
  },
];

const DashboardJudges = () => {
  const [judges, setJudges]       = useState(INIT_JUDGES);
  const [modal, setModal]         = useState(false);
  const [viewEntry, setViewEntry] = useState(null);
  const [editEntry, setEditEntry] = useState(null);
  const [search, setSearch]       = useState('');
  const [roleFilter, setRoleFilter] = useState('All');
  const [form, setForm]           = useState(EMPTY_FORM);

  const field = (key, val) => setForm(p => ({ ...p, [key]: val }));

  const handlePhotoUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setForm(p => ({ ...p, photoFile: file, photoPreview: ev.target.result }));
    reader.readAsDataURL(file);
  };

  const openAdd = () => {
    setEditEntry(null);
    setForm(EMPTY_FORM);
    setModal(true);
  };

  const openEdit = (judge) => {
    setEditEntry(judge);
    setForm({ ...judge });
    setModal(true);
  };

  const handleSave = () => {
    if (!form.fullName || !form.email || !form.role) return;
    if (editEntry) {
      setJudges(p => p.map(j => j.id === editEntry.id ? { ...j, ...form } : j));
    } else {
      setJudges(p => [{ id: Date.now(), ...form }, ...p]);
    }
    setForm(EMPTY_FORM);
    setEditEntry(null);
    setModal(false);
  };

  const handleDelete = id => setJudges(p => p.filter(j => j.id !== id));

  const handleToggleStatus = id =>
    setJudges(p => p.map(j =>
      j.id === id ? { ...j, status: j.status === 'Active' ? 'Inactive' : 'Active' } : j
    ));

  const filtered = judges.filter(j => {
    const q = search.toLowerCase();
    const matchSearch =
      (j.fullName    || '').toLowerCase().includes(q) ||
      (j.email       || '').toLowerCase().includes(q) ||
      (j.speciality  || '').toLowerCase().includes(q) ||
      (j.nationality || '').toLowerCase().includes(q);
    const matchRole = roleFilter === 'All' || j.role === roleFilter;
    return matchSearch && matchRole;
  });

  const counts = {
    total:    judges.length,
    head:     judges.filter(j => j.role === 'Head Judge').length,
    guest:    judges.filter(j => j.role === 'Guest Judge').length,
    mentor:   judges.filter(j => j.role === 'Mentor').length,
    active:   judges.filter(j => j.status === 'Active').length,
  };

  return (
    <div>
      {/* ── Stats ── */}
      <div className={shared.statsGrid}>
        <div className={shared.statCard}>
          <div className={shared.statIcon}>⚖️</div>
          <div className={shared.statValue}>{counts.total}</div>
          <div className={shared.statLabel}>Total Judges</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statIcon}>👑</div>
          <div className={shared.statValue}>{counts.head}</div>
          <div className={shared.statLabel}>Head Judges</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statIcon}>🌟</div>
          <div className={shared.statValue}>{counts.guest}</div>
          <div className={shared.statLabel}>Guest Judges</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statIcon}>🎓</div>
          <div className={shared.statValue}>{counts.mentor}</div>
          <div className={shared.statLabel}>Mentors</div>
        </div>
        <div className={shared.statCard}>
          <div className={shared.statIcon}>✅</div>
          <div className={shared.statValue}>{counts.active}</div>
          <div className={shared.statLabel}>Active</div>
        </div>
      </div>

      {/* ── Header ── */}
      <div className={shared.sectionHeader}>
        <span className={shared.sectionTitle}>⚖️ <span>Judges Panel</span></span>
        <button className={`${shared.btn} ${shared.btnPrimary}`} onClick={openAdd}>
          + Add Judge
        </button>
      </div>

      {/* ── Search ── */}
      <div className={shared.searchWrap}>
        <span className={shared.searchIcon}>🔍</span>
        <input
          className={shared.searchInput}
          placeholder="Search by name, email, speciality or nationality..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Role Filter Tabs ── */}
      <div className={styles.filterTabs}>
        {['All', ...ROLES].map(r => (
          <button
            key={r}
            className={`${styles.filterTab} ${roleFilter === r ? styles.filterTabActive : ''}`}
            onClick={() => setRoleFilter(r)}
          >
            {r}
          </button>
        ))}
      </div>

      {/* ── Judge Cards ── */}
      {filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>⚖️</div>
          No judges found
        </div>
      ) : (
        <div className={styles.judgesGrid}>
          {filtered.map(j => (
            <div key={j.id} className={styles.judgeCard}>
              <div className={styles.cardTop}>
                <div className={styles.judgeAvatar}>
                  {j.photoPreview
                    ? <img src={j.photoPreview} alt={j.fullName} />
                    : (j.fullName || '?')[0]
                  }
                </div>
                <div className={styles.judgeInfo}>
                  <div className={styles.judgeName}>{j.fullName}</div>
                  <div className={styles.judgeTitle}>{j.speciality} · {j.nationality}</div>
                  <span className={ROLE_CLASS[j.role]}>{j.role}</span>
                </div>
              </div>

              <div className={styles.cardDivider} />

              <div className={styles.detailRow}>
                <span className={styles.detailIcon}>📧</span>
                <span className={styles.detailText}>{j.email}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailIcon}>📞</span>
                <span className={styles.detailText}>{j.phone}</span>
              </div>
              {j.instagram && (
                <div className={styles.detailRow}>
                  <span className={styles.detailIcon}>📸</span>
                  <span className={styles.detailText}>{j.instagram}</span>
                </div>
              )}

              <div style={{ marginTop: 8 }}>
                <span className={j.status === 'Active' ? styles.statusActive : styles.statusInactive}>
                  {j.status}
                </span>
              </div>

              {j.bio && <div className={styles.judgeBio}>"{j.bio}"</div>}

              <div className={styles.cardActions}>
                <button
                  className={`${shared.btn} ${shared.btnOutline} ${shared.btnSm}`}
                  onClick={() => setViewEntry(j)}
                >
                  View
                </button>
                <button
                  className={`${shared.btn} ${shared.btnGreen} ${shared.btnSm}`}
                  onClick={() => openEdit(j)}
                >
                  Edit
                </button>
                <button
                  className={`${shared.btn} ${shared.btnDanger} ${shared.btnSm}`}
                  onClick={() => handleDelete(j.id)}
                >
                  Remove
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── Add / Edit Judge Modal ── */}
      {modal && (
        <DashboardModal
          title={editEntry ? 'Edit Judge' : 'Add Judge'}
          onClose={() => { setModal(false); setForm(EMPTY_FORM); setEditEntry(null); }}
        >
          <div className={shared.formGrid}>

            <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
              <label className={shared.label}>Full Name</label>
              <input className={shared.input} placeholder="e.g. Dr. Adaeze Okonkwo"
                value={form.fullName} onChange={e => field('fullName', e.target.value)} />
            </div>

            <div className={shared.formGroup}>
              <label className={shared.label}>Email Address</label>
              <input className={shared.input} type="email" placeholder="e.g. judge@starstage.ng"
                value={form.email} onChange={e => field('email', e.target.value)} />
            </div>

            <div className={shared.formGroup}>
              <label className={shared.label}>Phone Number</label>
              <input className={shared.input} placeholder="e.g. +234 801 234 5678"
                value={form.phone} onChange={e => field('phone', e.target.value)} />
            </div>

            <div className={shared.formGroup}>
              <label className={shared.label}>Role</label>
              <select className={shared.select} value={form.role} onChange={e => field('role', e.target.value)}>
                {ROLES.map(r => <option key={r} value={r}>{r}</option>)}
              </select>
            </div>

            <div className={shared.formGroup}>
              <label className={shared.label}>Speciality</label>
              <select className={shared.select} value={form.speciality} onChange={e => field('speciality', e.target.value)}>
                {SPECIALITIES.map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className={shared.formGroup}>
              <label className={shared.label}>Nationality</label>
              <input className={shared.input} placeholder="e.g. Nigerian"
                value={form.nationality} onChange={e => field('nationality', e.target.value)} />
            </div>

            <div className={shared.formGroup}>
              <label className={shared.label}>Instagram Handle</label>
              <input className={shared.input} placeholder="e.g. @judgename"
                value={form.instagram} onChange={e => field('instagram', e.target.value)} />
            </div>

            <div className={shared.formGroup}>
              <label className={shared.label}>Status</label>
              <select className={shared.select} value={form.status} onChange={e => field('status', e.target.value)}>
                <option value="Active">Active</option>
                <option value="Inactive">Inactive</option>
              </select>
            </div>

            <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
              <label className={shared.label}>Bio</label>
              <textarea className={shared.textarea}
                placeholder="Brief biography and professional background..."
                value={form.bio} onChange={e => field('bio', e.target.value)} />
            </div>

            <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
              <label className={shared.label}>Upload Photo</label>
              {form.photoPreview ? (
                <div className={styles.uploadPreview}>
                  <img src={form.photoPreview} alt="preview" className={styles.uploadPreviewImg} />
                  <span className={styles.uploadPreviewName}>{form.photoFile?.name || 'Photo uploaded'}</span>
                  <button
                    className={styles.uploadPreviewRemove}
                    onClick={() => setForm(p => ({ ...p, photoFile: null, photoPreview: null }))}
                  >✕</button>
                </div>
              ) : (
                <div className={styles.uploadArea}>
                  <div className={styles.uploadIcon}>📷</div>
                  <div className={styles.uploadText}>Click to upload judge photo</div>
                  <div className={styles.uploadSub}>PNG or JPG · Max 3MB</div>
                  <input type="file" accept="image/*" className={styles.uploadInput} onChange={handlePhotoUpload} />
                </div>
              )}
            </div>

          </div>
          <div className={shared.modalActions}>
            <button
              className={`${shared.btn} ${shared.btnOutline}`}
              onClick={() => { setModal(false); setForm(EMPTY_FORM); setEditEntry(null); }}
            >
              Cancel
            </button>
            <button className={`${shared.btn} ${shared.btnPrimary}`} onClick={handleSave}>
              {editEntry ? 'Save Changes' : 'Add Judge'}
            </button>
          </div>
        </DashboardModal>
      )}

      {/* ── View Judge Modal ── */}
      {viewEntry && (
        <DashboardModal title="Judge Profile" onClose={() => setViewEntry(null)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div className={styles.judgeAvatar} style={{ width: 70, height: 70, fontSize: 26 }}>
              {viewEntry.photoPreview
                ? <img src={viewEntry.photoPreview} alt={viewEntry.fullName} />
                : (viewEntry.fullName || '?')[0]
              }
            </div>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: '#e8f5e8', marginBottom: 4 }}>
                {viewEntry.fullName}
              </div>
              <span className={ROLE_CLASS[viewEntry.role]}>{viewEntry.role}</span>
              {' '}
              <span className={viewEntry.status === 'Active' ? styles.statusActive : styles.statusInactive}>
                {viewEntry.status}
              </span>
            </div>
          </div>

          <div className={shared.formGrid}>
            {[
              { label: 'Email',       value: viewEntry.email       },
              { label: 'Phone',       value: viewEntry.phone       },
              { label: 'Speciality',  value: viewEntry.speciality  },
              { label: 'Nationality', value: viewEntry.nationality },
              { label: 'Instagram',   value: viewEntry.instagram   },
            ].map(row => (
              <div className={shared.formGroup} key={row.label}>
                <span className={shared.label}>{row.label}</span>
                <span style={{ color: '#e8f5e8', fontSize: 14, fontWeight: 500 }}>{row.value || '—'}</span>
              </div>
            ))}

            {viewEntry.bio && (
              <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
                <span className={shared.label}>Bio</span>
                <div className={styles.judgeBio} style={{ marginTop: 6 }}>"{viewEntry.bio}"</div>
              </div>
            )}
          </div>

          <div className={shared.modalActions}>
            <button
              className={`${shared.btn} ${shared.btnGreen}`}
              onClick={() => { setViewEntry(null); openEdit(viewEntry); }}
            >
              ✏️ Edit Profile
            </button>
            <button
              className={`${shared.btn} ${shared.btnOutline}`}
              onClick={() => { handleToggleStatus(viewEntry.id); setViewEntry(null); }}
            >
              {viewEntry.status === 'Active' ? '⏸ Set Inactive' : '▶ Set Active'}
            </button>
            <button className={`${shared.btn} ${shared.btnOutline}`} onClick={() => setViewEntry(null)}>
              Close
            </button>
          </div>
        </DashboardModal>
      )}
    </div>
  );
};

export default DashboardJudges;