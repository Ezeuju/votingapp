// src/COMPONENTS/DashboardScreens/Dashboardjudges.js
import React, { useState, useEffect } from 'react';
import styles from '../DashboardScreens/Judges.module.css';
import shared from '../DashboardScreens/Dashboardshared.module.css';
import DashboardModal from './Dashboardmodal';
import { adminApi } from "../../services/adminApi";
import { uploadFile } from "../../services/fileApi";
import { toast } from "react-toastify";

const POSITIONS = ['Head Judge', 'Guest Judge', 'Mentor', 'Industry Veteran', 'Creative Director', 'Global Superstar', 'Vocal Powerhouse'];

const POSITION_CLASS = {
  'Head Judge':  styles.roleHead,
  'Guest Judge': styles.roleGuest,
  'Mentor':      styles.roleMentor,
};

const EMPTY_FORM = {
  first_name:   '',
  last_name:    '',
  location:     '',
  phone:        '',
  position:     'Guest Judge',
  nationality:  '',
  bio:          '',
  instagram_handle: '',
  photoPreview: null,
  photoFile:    null,
  status:       'Active',
};

const DashboardJudges = () => {
  const [judges, setJudges]       = useState([]);
  const [loading, setLoading]     = useState(true);
  const [modal, setModal]         = useState(false);
  const [viewEntry, setViewEntry] = useState(null);
  const [editEntry, setEditEntry] = useState(null);
  const [search, setSearch]       = useState('');
  const [positionFilter, setPositionFilter] = useState('All');
  const [form, setForm]           = useState(EMPTY_FORM);
  const [saving, setSaving]       = useState(false);

  useEffect(() => {
    fetchJudges();
  }, []);

  const fetchJudges = async () => {
    setLoading(true);
    try {
      const resp = await adminApi.getJudges({ limitNo: 100 });
      const data = resp.data?.data || [];
      setJudges(data);
    } catch (err) {
      console.error("Failed to fetch judges:", err);
      toast.error("Failed to load judges.");
    } finally {
      setLoading(false);
    }
  };

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
    setForm({
      first_name: judge.first_name || '',
      last_name: judge.last_name || '',
      location: judge.location || '',
      phone: judge.phone || '',
      position: judge.position || 'Guest Judge',
      nationality: judge.nationality || '',
      bio: judge.bio || '',
      instagram_handle: judge.instagram_handle || '',
      status: judge.status || 'Active',
      photoPreview: judge.photo || null,
      photoFile: null
    });
    setModal(true);
  };

  const handleSave = async () => {
    if (!form.first_name || !form.last_name || !form.position) {
      toast.error("First name, last name, and position are required.");
      return;
    }
    setSaving(true);
    try {
      let photoUrl = form.photoPreview;
      if (form.photoFile) {
        toast.info("Uploading photo...");
        const uploadResp = await uploadFile(form.photoFile);
        photoUrl = uploadResp.url || uploadResp.data?.url;
      }

      const payload = {
        first_name: form.first_name,
        last_name: form.last_name,
        role: form.position, // Keep backward compat or ignore
        position: form.position,
        location: form.location,
        phone: form.phone,
        status: form.status,
        nationality: form.nationality,
        instagram_handle: form.instagram_handle,
        bio: form.bio,
        photo: photoUrl
      };

      if (editEntry) {
        await adminApi.updateJudge(editEntry._id, payload);
        toast.success("Judge updated successfully!");
      } else {
        await adminApi.createJudge(payload);
        toast.success("Judge added successfully!");
      }

      setModal(false);
      setForm(EMPTY_FORM);
      setEditEntry(null);
      fetchJudges();
    } catch (err) {
      console.error("Failed to save judge:", err);
      toast.error(err.response?.data?.message || "Failed to save judge.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to remove this judge?")) return;
    try {
      await adminApi.deleteJudge(id);
      toast.success("Judge removed successfully!");
      fetchJudges();
    } catch (err) {
      console.error("Failed to delete judge:", err);
      toast.error("Failed to delete judge.");
    }
  };

  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus === 'Active' ? 'Inactive' : 'Active';
      // If the API supports partial patch we can just send status. 
      // We will re-fetch the judge or assume updateJudge needs full payload. 
      // For simplicity, we can fetch their current data, merge and upload.
      const judgeToUpdate = judges.find(j => j._id === id);
      if(!judgeToUpdate) return;
      const payload = {
        first_name: judgeToUpdate.first_name,
        last_name: judgeToUpdate.last_name,
        position: judgeToUpdate.position,
        location: judgeToUpdate.location,
        phone: judgeToUpdate.phone,
        status: newStatus,
        nationality: judgeToUpdate.nationality,
        instagram_handle: judgeToUpdate.instagram_handle,
        bio: judgeToUpdate.bio,
        photo: judgeToUpdate.photo
      };
      await adminApi.updateJudge(id, payload);
      toast.success("Status updated!");
      fetchJudges();
    } catch (err) {
      console.error("Failed to toggle status:", err);
      toast.error("Failed to update status.");
    }
  };

  const filtered = judges.filter(j => {
    const q = search.toLowerCase();
    const matchSearch =
      (j.first_name    || '').toLowerCase().includes(q) ||
      (j.last_name     || '').toLowerCase().includes(q) ||
      (j.location      || '').toLowerCase().includes(q) ||
      (j.position      || '').toLowerCase().includes(q) ||
      (j.nationality   || '').toLowerCase().includes(q);
    const matchRole = positionFilter === 'All' || j.position === positionFilter;
    return matchSearch && matchRole;
  });

  const counts = {
    total:    judges.length,
    head:     judges.filter(j => j.position === 'Head Judge').length,
    guest:    judges.filter(j => j.position === 'Guest Judge').length,
    mentor:   judges.filter(j => j.position === 'Mentor').length,
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
          placeholder="Search by name, location, position or nationality..."
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {/* ── Role/Position Filter Tabs ── */}
      <div className={styles.filterTabs}>
        {['All', 'Head Judge', 'Guest Judge', 'Mentor'].map(r => (
          <button
            key={r}
            className={`${styles.filterTab} ${positionFilter === r ? styles.filterTabActive : ''}`}
            onClick={() => setPositionFilter(r)}
          >
            {r}
          </button>
        ))}
      </div>

      {/* ── Judge Cards ── */}
      {loading ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>⏳</div>
          Loading judges...
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>⚖️</div>
          No judges found
        </div>
      ) : (
        <div className={styles.judgesGrid}>
          {filtered.map(j => (
            <div key={j._id} className={styles.judgeCard}>
              <div className={styles.cardTop}>
                <div className={styles.judgeAvatar}>
                  {j.photo
                    ? <img src={j.photo} alt={j.first_name} />
                    : (j.first_name || '?')[0]
                  }
                </div>
                <div className={styles.judgeInfo}>
                  <div className={styles.judgeName}>{j.first_name} {j.last_name}</div>
                  <div className={styles.judgeTitle}>{j.nationality || 'N/A'}</div>
                  <span className={POSITION_CLASS[j.position] || styles.roleGuest}>{j.position}</span>
                </div>
              </div>

              <div className={styles.cardDivider} />

              <div className={styles.detailRow}>
                <span className={styles.detailIcon}>📍</span>
                <span className={styles.detailText}>{j.location || 'N/A'}</span>
              </div>
              <div className={styles.detailRow}>
                <span className={styles.detailIcon}>📞</span>
                <span className={styles.detailText}>{j.phone || 'N/A'}</span>
              </div>
              {j.instagram_handle && (
                <div className={styles.detailRow}>
                  <span className={styles.detailIcon}>📸</span>
                  <span className={styles.detailText}>{j.instagram_handle}</span>
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
                  onClick={() => handleDelete(j._id)}
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
            <div className={shared.formGroup}>
              <label className={shared.label}>First Name</label>
              <input className={shared.input} placeholder="e.g. Dr. Adaeze"
                value={form.first_name} onChange={e => field('first_name', e.target.value)} />
            </div>

            <div className={shared.formGroup}>
              <label className={shared.label}>Last Name</label>
              <input className={shared.input} placeholder="e.g. Okonkwo"
                value={form.last_name} onChange={e => field('last_name', e.target.value)} />
            </div>

            <div className={shared.formGroup}>
              <label className={shared.label}>Location / Address</label>
              <input className={shared.input} placeholder="e.g. Lagos, Nigeria"
                value={form.location} onChange={e => field('location', e.target.value)} />
            </div>

            <div className={shared.formGroup}>
              <label className={shared.label}>Phone Number</label>
              <input className={shared.input} placeholder="e.g. +234 801 234 5678"
                value={form.phone} onChange={e => field('phone', e.target.value)} />
            </div>

            <div className={shared.formGroup}>
              <label className={shared.label}>Position</label>
              <select className={shared.select} value={form.position} onChange={e => field('position', e.target.value)}>
                {POSITIONS.map(r => <option key={r} value={r}>{r}</option>)}
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
                value={form.instagram_handle} onChange={e => field('instagram_handle', e.target.value)} />
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
              disabled={saving}
            >
              Cancel
            </button>
            <button className={`${shared.btn} ${shared.btnPrimary}`} onClick={handleSave} disabled={saving}>
              {saving ? 'Saving...' : (editEntry ? 'Save Changes' : 'Add Judge')}
            </button>
          </div>
        </DashboardModal>
      )}

      {/* ── View Judge Modal ── */}
      {viewEntry && (
        <DashboardModal title="Judge Profile" onClose={() => setViewEntry(null)}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div className={styles.judgeAvatar} style={{ width: 70, height: 70, fontSize: 26 }}>
              {viewEntry.photo
                ? <img src={viewEntry.photo} alt={viewEntry.first_name} />
                : (viewEntry.first_name || '?')[0]
              }
            </div>
            <div>
              <div style={{ fontFamily: 'Playfair Display, serif', fontSize: 18, fontWeight: 700, color: '#e8f5e8', marginBottom: 4 }}>
                {viewEntry.first_name} {viewEntry.last_name}
              </div>
              <span className={POSITION_CLASS[viewEntry.position] || styles.roleGuest}>{viewEntry.position}</span>
              {' '}
              <span className={viewEntry.status === 'Active' ? styles.statusActive : styles.statusInactive}>
                {viewEntry.status}
              </span>
            </div>
          </div>

          <div className={shared.formGrid}>
            {[
              { label: 'Location',    value: viewEntry.location       },
              { label: 'Phone',       value: viewEntry.phone       },
              { label: 'Nationality', value: viewEntry.nationality },
              { label: 'Instagram',   value: viewEntry.instagram_handle   },
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
              onClick={() => { handleToggleStatus(viewEntry._id, viewEntry.status); setViewEntry(null); }}
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