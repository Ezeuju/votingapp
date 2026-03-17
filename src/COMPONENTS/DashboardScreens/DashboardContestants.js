// src/COMPONENTS/DashboardScreens/DashboardContestants.jsx
import React, { useState, useEffect } from "react";
import styles     from "../DashboardScreens/Dashboardshared.module.css";
import pageStyles from "../DashboardScreens/Dashboardpages.module.css";
import DashboardModal    from "./Dashboardmodal";
import ConfirmModal      from "./ConfirmModal";
import ContestantProfile from "../../Screens/ContestantProfile";
import VotingPage        from "../../Screens/VotingPage";
import { STATUS_MAP }    from "./Dashboarddata";
import { adminApi }      from "../../services/adminApi";
import { uploadFile }    from "../../services/fileApi";
import { toast }         from "react-toastify";

const MEDALS = ["🥇", "🥈", "🥉"];


const normalise = (c) => ({
  id:           c._id,
  name:         `${c.first_name || ''} ${c.last_name || ''}`.trim(),
  nickname:     c.nickname     || `#${c.contestant_number || ''}`,
  category:     c.talent_category || 'N/A',
  votes:        c.votes        || 0,
  max:          10000,
  status:       c.contestant_status || 'Active',
  age:          c.age          || '',
  hometown:     c.hometown     || c.location || '',
  bio:          c.bio          || '',
  highlight:    c.highlight    || '',
  instagram:    c.instagram    || '',
  auditionSong: c.audition_song || '',
  photoPreview: c.photo        || null,
 
  _raw: c,
});

// view: 'list' | 'profile' | 'vote'
const DashboardContestants = () => {
  const [view,             setView]             = useState('list');
  const [activeContestant, setActiveContestant] = useState(null);

  const [modal,            setModal]            = useState(false);
  const [searchTerm,       setSearchTerm]       = useState('');
  const [applicants,       setApplicants]       = useState([]);
  const [contestants,      setContestants]      = useState([]);
  const [selectedApplicant,setSelectedApplicant]= useState(null);
  const [loadingApplicants,setLoadingApplicants]= useState(false);
  const [loadingContestants,setLoadingContestants]=useState(false);
  const [actionLoading,    setActionLoading]    = useState(null);
  const [confirmId,        setConfirmId]        = useState(null);
  const [previewImage,     setPreviewImage]     = useState(null);
  const [uploadedPhoto,    setUploadedPhoto]    = useState(null);
  const [uploading,        setUploading]        = useState(false);

 
  const sorted = [...contestants]
    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
    .map(normalise);

  const getRank = (id) => sorted.findIndex(c => c.id === id) + 1;

  useEffect(() => { fetchContestants(); }, []);

  useEffect(() => {
    if (modal) fetchApplicants();
  }, [modal]);

  useEffect(() => {
    if (!modal) return;
    if (searchTerm) {
      const timer = setTimeout(() => fetchApplicants(searchTerm), 500);
      return () => clearTimeout(timer);
    } else {
      fetchApplicants();
    }
  }, [searchTerm, modal]);

  const fetchContestants = async () => {
    setLoadingContestants(true);
    try {
      const resp   = await adminApi.getContestants();
      const result = resp.data?.[0] || resp.data;
      setContestants(result?.data || []);
    } catch (err) {
      console.error('Failed to fetch contestants:', err);
      toast.error('Failed to load contestants');
    } finally {
      setLoadingContestants(false);
    }
  };

  const fetchApplicants = async (search = '') => {
    setLoadingApplicants(true);
    try {
      const resp   = await adminApi.getUsers({ account_type: 'Applicant', limitNo: 100, search });
      const result = resp.data?.[0] || resp.data;
      setApplicants(result?.data || []);
    } catch (err) {
      console.error('Failed to fetch applicants:', err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleAdd = async () => {
    if (!selectedApplicant) return;
    setActionLoading('add');
    try {
      await adminApi.convertToContestant(selectedApplicant._id, { photo: uploadedPhoto });
      toast.success('Contestant added successfully');
      await fetchContestants();
      resetForm();
      setModal(false);
    } catch (err) {
      console.error('Failed to add contestant:', err);
      toast.error(err.response?.data?.message || 'Failed to add contestant');
    } finally {
      setActionLoading(null);
    }
  };

  const handlePhotoUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setUploading(true);
    try {
      const response = await uploadFile(file);
      setUploadedPhoto(response.url || response.data?.url);
      toast.success('Photo uploaded successfully');
    } catch (err) {
      console.error('Upload error:', err);
      toast.error('Failed to upload photo');
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSearchTerm('');
    setSelectedApplicant(null);
    setUploadedPhoto(null);
  };

  const handleRemoveClick = (id) => setConfirmId(id);

  const handleRemoveConfirm = async () => {
    if (!confirmId) return;
    const id = confirmId;
    setConfirmId(null);
    setActionLoading(`remove-${id}`);
    try {
      await adminApi.removeContestant(id);
      toast.success('Contestant removed successfully');
      await fetchContestants();
    } catch (err) {
      console.error('Failed to remove contestant:', err);
      toast.error(err.response?.data?.message || 'Failed to remove contestant');
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatus = async (id, currentStatus) => {
    const action = currentStatus === 'Active' ? 'eliminate' : 'restore';
    setActionLoading(`status-${id}`);
    try {
      await adminApi.updateContestantStatus(id, action);
      toast.success(`Contestant ${action}d successfully`);
      await fetchContestants();
    } catch (err) {
      console.error('Failed to update status:', err);
      toast.error(err.response?.data?.message || 'Failed to update status');
    } finally {
      setActionLoading(null);
    }
  };

  // ── Called by VotingPage after successful Paystack payment
  // Updates local vote count optimistically; real count refreshed from API
  const handleVoteSuccess = async (contestantId, votesAdded) => {
    setContestants(prev =>
      prev.map(c =>
        c._id === contestantId
          ? { ...c, votes: (c.votes || 0) + votesAdded }
          : c
      )
    );
   
    await fetchContestants();
  };


  const goProfile = (normContestant) => {
    setActiveContestant(normContestant);
    setView('profile');
  };

  const goVote = (normContestant) => {
    setActiveContestant(normContestant);
    setView('vote');
  };

  const goList = () => {
    setView('list');
    setActiveContestant(null);
  };


  if (view === 'profile') {
    return (
      <ContestantProfile
        contestant={activeContestant}
        rank={getRank(activeContestant.id)}
        onBack={goList}
        onVote={goVote}
      />
    );
  }


  if (view === 'vote') {
    return (
      <VotingPage
        preselectedContestant={activeContestant}
        contestants={sorted}
        onBack={goList}
        onVoteSuccess={handleVoteSuccess}
      />
    );
  }


  return (
    <div>
    
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>
          🏆 <span>Contestants</span>
        </span>
        <div style={{ display: 'flex', gap: 10 }}>
          <button
            className={`${styles.btn} ${styles.btnGreen}`}
            onClick={() => goVote(null)}
          >
            🗳️ Vote Now
          </button>
          <button
            className={`${styles.btn} ${styles.btnPrimary}`}
            onClick={() => setModal(true)}
          >
            + Add Contestant
          </button>
        </div>
      </div>

     
      {loadingContestants ? (
        <div className={styles.empty}>Loading contestants...</div>
      ) : (
        <div className={pageStyles.contestantsGrid}>
          {sorted.map((c, i) => (
            <div key={c.id} className={pageStyles.contestantCard}>
              {i < 3 && <div className={pageStyles.medal}>{MEDALS[i]}</div>}

            
              <div
                className={pageStyles.contestantAvatar}
                style={{ cursor: c.photoPreview ? 'pointer' : 'default' }}
                onClick={() => c.photoPreview && setPreviewImage(c.photoPreview)}
              >
                {c.photoPreview ? (
                  <img
                    src={c.photoPreview}
                    alt={c.name}
                    style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }}
                  />
                ) : (
                  c.name[0] || 'C'
                )}
              </div>

              <div className={pageStyles.contestantName}>{c.name}</div>
              <div className={pageStyles.contestantTag}>
                {c.nickname} · {c.category}
              </div>

              <span className={`${styles.badge} ${styles[STATUS_MAP[c.status]]}`}>
                {c.status}
              </span>

              <div className={pageStyles.contestantVoteSection}>
                <div className={pageStyles.contestantVotes}>
                  {c.votes.toLocaleString()}
                </div>
                <div className={pageStyles.contestantVotesLabel}>Votes</div>
                <div className={pageStyles.voteBarWrap}>
                  <div
                    className={pageStyles.voteBar}
                    style={{ width: `${Math.min((c.votes / c.max) * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className={pageStyles.contestantActions}>

                {/* ── View Profile (new) ── */}
                <button
                  className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                  onClick={() => goProfile(c)}
                >
                  View Profile
                </button>

                {/* ── Vote (new) ── */}
                {c.status === 'Active' && (
                  <button
                    className={`${styles.btn} ${styles.btnGreen} ${styles.btnSm}`}
                    onClick={() => goVote(c)}
                  >
                    🗳️ Vote
                  </button>
                )}

                {/* ── Status actions (unchanged) ── */}
                {c.status === 'Active' && (
                  <button
                    className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                    onClick={() => handleStatus(c.id, c.status)}
                    disabled={actionLoading === `status-${c.id}`}
                  >
                    {actionLoading === `status-${c.id}` ? 'Processing...' : 'Eliminate'}
                  </button>
                )}
                {(c.status === 'Eliminated' || c.status === 'Probation') && (
                  <button
                    className={`${styles.btn} ${styles.btnGreen} ${styles.btnSm}`}
                    onClick={() => handleStatus(c.id, c.status)}
                    disabled={actionLoading === `status-${c.id}`}
                  >
                    {actionLoading === `status-${c.id}` ? 'Processing...' : 'Restore'}
                  </button>
                )}

              
                <button
                  className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                  onClick={() => handleRemoveClick(c.id)}
                  disabled={actionLoading === `remove-${c.id}`}
                >
                  {actionLoading === `remove-${c.id}` ? 'Removing...' : 'Remove'}
                </button>

              </div>
            </div>
          ))}
        </div>
      )}

      {!loadingContestants && contestants.length === 0 && (
        <div className={styles.empty}>No contestants added yet</div>
      )}

 
      {modal && (
        <DashboardModal
          title="Convert Applicant to Contestant"
          onClose={() => { setModal(false); resetForm(); }}
        >
          <div className={styles.formGrid}>
            {!selectedApplicant ? (
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.label}>Search Audition Applicant</label>
                <div className={pageStyles.applicantSearchWrap}>
                  <input
                    className={styles.input}
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {loadingApplicants && (
                    <div style={{ marginTop: 20, color: 'rgba(232,245,232,0.4)', fontSize: 12 }}>
                      Loading applicants...
                    </div>
                  )}
                  {!loadingApplicants && applicants.length > 0 && (
                    <select
                      className={styles.select}
                      style={{ marginTop: 20 }}
                      value={selectedApplicant?._id || ''}
                      onChange={(e) => {
                        const applicant = applicants.find(a => a._id === e.target.value);
                        setSelectedApplicant(applicant);
                      }}
                    >
                      <option value=''>Select an applicant...</option>
                      {applicants.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.first_name} {a.last_name} - {a.email}
                        </option>
                      ))}
                    </select>
                  )}
                  {!loadingApplicants && applicants.length === 0 && (
                    <div style={{ marginTop: 20, color: '#ff4444', fontSize: 12 }}>
                      No applicants found
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.label}>Selected Applicant</label>
                <div className={pageStyles.selectedApplicantCard}>
                  <div className={pageStyles.selectedInfo}>
                    <span className={pageStyles.selectedName}>
                      {selectedApplicant.first_name} {selectedApplicant.last_name}
                    </span>
                    <span className={pageStyles.selectedMeta}>{selectedApplicant.email}</span>
                  </div>
                  <button className={pageStyles.changeBtn} onClick={() => setSelectedApplicant(null)}>
                    Change
                  </button>
                </div>
                <div className={`${styles.formGroup} ${styles.formGroupFull}`} style={{ marginTop: 16 }}>
                  <label className={styles.label}>Contestant Photo</label>
                  {uploading ? (
                    <div style={{ padding: 20, textAlign: 'center', color: '#FFD700' }}>Uploading...</div>
                  ) : uploadedPhoto ? (
                    <div style={{ padding: 12, background: 'rgba(0,135,81,0.1)', borderRadius: 8, border: '1px solid rgba(0,135,81,0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: '#4ade80' }}>✓ Photo uploaded</span>
                      <button
                        type='button'
                        className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                        onClick={() => setUploadedPhoto(null)}
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div style={{ position: 'relative', border: '2px dashed rgba(0,135,81,0.3)', borderRadius: 8, padding: 20, textAlign: 'center', cursor: 'pointer', background: 'rgba(0,30,15,0.4)' }}>
                      <input
                        type='file'
                        accept='image/*'
                        onChange={handlePhotoUpload}
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                      />
                      <div style={{ color: 'rgba(232,245,232,0.6)', fontSize: 14 }}>Click to upload photo</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className={styles.modalActions}>
            <button
              className={`${styles.btn} ${styles.btnOutline}`}
              onClick={() => { setModal(false); resetForm(); }}
            >
              Cancel
            </button>
            <button
              className={`${styles.btn} ${styles.btnPrimary}`}
              onClick={handleAdd}
              disabled={!selectedApplicant || !uploadedPhoto || actionLoading === 'add'}
            >
              {actionLoading === 'add' ? 'Adding...' : 'Add Contestant'}
            </button>
          </div>
        </DashboardModal>
      )}

  
      {confirmId && (
        <ConfirmModal
          message='Are you sure you want to remove this contestant?'
          onConfirm={handleRemoveConfirm}
          onCancel={() => setConfirmId(null)}
        />
      )}

     
      {previewImage && (
        <div
          style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.9)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 10000, padding: 40 }}
          onClick={() => setPreviewImage(null)}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%', display: 'flex', justifyContent: 'center' }}>
            <button
              style={{ position: 'absolute', top: -40, right: 0, background: 'none', border: 'none', color: 'white', fontSize: 30, cursor: 'pointer', fontWeight: 'bold' }}
              onClick={() => setPreviewImage(null)}
            >
              ✕
            </button>
            <img
              src={previewImage}
              alt='Full Preview'
              style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: 8, boxShadow: '0 0 40px rgba(0,0,0,0.5)', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardContestants;