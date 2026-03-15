// src/COMPONENTS/DashboardScreens/DashboardContestants.jsx
import React, { useState, useEffect } from "react";
import styles from "../DashboardScreens/Dashboardshared.module.css";
import pageStyles from "../DashboardScreens/Dashboardpages.module.css";
import DashboardModal from "./Dashboardmodal";
import ConfirmModal from "./ConfirmModal";
import { STATUS_MAP } from "./Dashboarddata";
import { adminApi } from "../../services/adminApi";
import { uploadFile } from "../../services/fileApi";
import { toast } from "react-toastify";

const MEDALS = ["🥇", "🥈", "🥉"];

const DashboardContestants = () => {
  const [modal, setModal] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [contestants, setContestants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [loadingApplicants, setLoadingApplicants] = useState(false);
  const [loadingContestants, setLoadingContestants] = useState(false);
  const [actionLoading, setActionLoading] = useState(null);
  const [confirmId, setConfirmId] = useState(null);
  const [previewImage, setPreviewImage] = useState(null);
  const [uploadedPhoto, setUploadedPhoto] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    fetchContestants();
  }, []);

  useEffect(() => {
    if (modal) {
      fetchApplicants();
    }
  }, [modal]);

  useEffect(() => {
    if (modal && searchTerm) {
      const timer = setTimeout(() => fetchApplicants(searchTerm), 500);
      return () => clearTimeout(timer);
    } else if (modal && !searchTerm) {
      fetchApplicants();
    }
  }, [searchTerm, modal]);

  const fetchContestants = async () => {
    setLoadingContestants(true);
    try {
      const resp = await adminApi.getContestants();
      const result = resp.data?.[0] || resp.data;
      setContestants(result?.data || []);
    } catch (err) {
      console.error("Failed to fetch contestants:", err);
      toast.error("Failed to load contestants");
    } finally {
      setLoadingContestants(false);
    }
  };

  const fetchApplicants = async (search = "") => {
    setLoadingApplicants(true);
    try {
      const resp = await adminApi.getUsers({
        account_type: "Applicant",
        limitNo: 100,
        search,
      });
      const result = resp.data?.[0] || resp.data;
      setApplicants(result?.data || []);
    } catch (err) {
      console.error("Failed to fetch applicants:", err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleAdd = async () => {
    if (!selectedApplicant) return;
    setActionLoading('add');
    try {
      await adminApi.convertToContestant(selectedApplicant._id, {
        photo: uploadedPhoto
      });
      toast.success("Contestant added successfully");
      await fetchContestants();
      resetForm();
      setModal(false);
    } catch (err) {
      console.error("Failed to add contestant:", err);
      toast.error(err.response?.data?.message || "Failed to add contestant");
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
      const photoUrl = response.url || response.data?.url;
      setUploadedPhoto(photoUrl);
      toast.success("Photo uploaded successfully");
    } catch (err) {
      console.error("Upload error:", err);
      toast.error("Failed to upload photo");
    } finally {
      setUploading(false);
    }
  };

  const resetForm = () => {
    setSearchTerm("");
    setSelectedApplicant(null);
    setUploadedPhoto(null);
  };

  const handleRemoveClick = (id) => {
    setConfirmId(id);
  };

  const handleRemoveConfirm = async () => {
    if (!confirmId) return;
    const id = confirmId;
    setConfirmId(null);
    setActionLoading(`remove-${id}`);
    try {
      await adminApi.removeContestant(id);
      toast.success("Contestant removed successfully");
      await fetchContestants();
    } catch (err) {
      console.error("Failed to remove contestant:", err);
      toast.error(err.response?.data?.message || "Failed to remove contestant");
    } finally {
      setActionLoading(null);
    }
  };

  const handleStatus = async (id, currentStatus) => {
    const action = currentStatus === "Active" ? "eliminate" : "restore";
    setActionLoading(`status-${id}`);
    try {
      await adminApi.updateContestantStatus(id, action);
      toast.success(`Contestant ${action}d successfully`);
      await fetchContestants();
    } catch (err) {
      console.error("Failed to update status:", err);
      toast.error(err.response?.data?.message || "Failed to update status");
    } finally {
      setActionLoading(null);
    }
  };

  const sorted = [...contestants].sort((a, b) => (b.votes || 0) - (a.votes || 0));

  return (
    <div>
      {/* ── Header ── */}
      <div className={styles.sectionHeader}>
        <span className={styles.sectionTitle}>
          🏆 <span>Contestants</span>
        </span>
        <button
          className={`${styles.btn} ${styles.btnPrimary}`}
          onClick={() => setModal(true)}
        >
          + Add Contestant
        </button>
      </div>

      {/* ── Cards Grid ── */}
      {loadingContestants ? (
        <div className={styles.empty}>Loading contestants...</div>
      ) : (
        <div className={pageStyles.contestantsGrid}>
          {sorted.map((c, i) => (
            <div key={c._id} className={pageStyles.contestantCard}>
              {i < 3 && <div className={pageStyles.medal}>{MEDALS[i]}</div>}

              <div className={pageStyles.contestantAvatar} style={{ cursor: 'pointer' }} onClick={() => c.photo && setPreviewImage(c.photo)}>
                {c.photo ? (
                  <img src={c.photo} alt={c.first_name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '50%' }} />
                ) : (
                  c.first_name?.[0] || 'C'
                )}
              </div>
              <div className={pageStyles.contestantName}>
                {c.first_name} {c.last_name}
              </div>
              <div className={pageStyles.contestantTag}>
                #{c.contestant_number || 'N/A'} • {c.talent_category || 'N/A'}
              </div>

              <span className={`${styles.badge} ${styles[STATUS_MAP[c.contestant_status]]}`}>
                {c.contestant_status}
              </span>

              <div className={pageStyles.contestantVoteSection}>
                <div className={pageStyles.contestantVotes}>
                  {(c.votes || 0).toLocaleString()}
                </div>
                <div className={pageStyles.contestantVotesLabel}>Votes</div>
                <div className={pageStyles.voteBarWrap}>
                  <div
                    className={pageStyles.voteBar}
                    style={{ width: `${Math.min((c.votes || 0) / 10000 * 100, 100)}%` }}
                  />
                </div>
              </div>

              <div className={pageStyles.contestantActions}>
                {c.contestant_status === "Active" && (
                  <button
                    className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                    onClick={() => handleStatus(c._id, c.contestant_status)}
                    disabled={actionLoading === `status-${c._id}`}
                  >
                    {actionLoading === `status-${c._id}` ? 'Processing...' : 'Eliminate'}
                  </button>
                )}
                {c.contestant_status === "Eliminated" && (
                  <button
                    className={`${styles.btn} ${styles.btnGreen} ${styles.btnSm}`}
                    onClick={() => handleStatus(c._id, c.contestant_status)}
                    disabled={actionLoading === `status-${c._id}`}
                  >
                    {actionLoading === `status-${c._id}` ? 'Processing...' : 'Restore'}
                  </button>
                )}
                {c.contestant_status === "Probation" && (
                  <button
                    className={`${styles.btn} ${styles.btnGreen} ${styles.btnSm}`}
                    onClick={() => handleStatus(c._id, c.contestant_status)}
                    disabled={actionLoading === `status-${c._id}`}
                  >
                    {actionLoading === `status-${c._id}` ? 'Processing...' : 'Restore'}
                  </button>
                )}
                <button
                  className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                  onClick={() => handleRemoveClick(c._id)}
                  disabled={actionLoading === `remove-${c._id}`}
                >
                  {actionLoading === `remove-${c._id}` ? 'Removing...' : 'Remove'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {!loadingContestants && contestants.length === 0 && (
        <div className={styles.empty}>No contestants added yet</div>
      )}

      {/* ── Modal ── */}
      {modal && (
        <DashboardModal
          title="Convert Applicant to Contestant"
          onClose={() => {
            setModal(false);
            resetForm();
          }}
        >
          <div className={styles.formGrid}>
            {!selectedApplicant ? (
              <div className={`${styles.formGroup} ${styles.formGroupFull}`}>
                <label className={styles.label}>
                  Search Audition Applicant
                </label>
                <div className={pageStyles.applicantSearchWrap}>
                  <input
                    className={styles.input}
                    placeholder="Search by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                  />
                  {loadingApplicants && (
                    <div
                      style={{
                        marginTop: 20,
                        color: "rgba(232,245,232,0.4)",
                        fontSize: 12,
                      }}
                    >
                      Loading applicants...
                    </div>
                  )}
                  {!loadingApplicants && applicants.length > 0 && (
                    <select
                      className={styles.select}
                      style={{ marginTop: 20 }}
                      value={selectedApplicant?._id || ""}
                      onChange={(e) => {
                        const applicant = applicants.find(
                          (a) => a._id === e.target.value,
                        );
                        setSelectedApplicant(applicant);
                      }}
                    >
                      <option value="">Select an applicant...</option>
                      {applicants.map((a) => (
                        <option key={a._id} value={a._id}>
                          {a.first_name} {a.last_name} - {a.email}
                        </option>
                      ))}
                    </select>
                  )}
                  {!loadingApplicants && applicants.length === 0 && (
                    <div
                      style={{ marginTop: 20, color: "#ff4444", fontSize: 12 }}
                    >
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
                      {selectedApplicant.first_name}{" "}
                      {selectedApplicant.last_name}
                    </span>
                    <span className={pageStyles.selectedMeta}>
                      {selectedApplicant.email}
                    </span>
                  </div>
                  <button
                    className={pageStyles.changeBtn}
                    onClick={() => setSelectedApplicant(null)}
                  >
                    Change
                  </button>
                </div>
                <div className={`${styles.formGroup} ${styles.formGroupFull}`} style={{ marginTop: '16px' }}>
                  <label className={styles.label}>Contestant Photo</label>
                  {uploading ? (
                    <div style={{ padding: '20px', textAlign: 'center', color: '#FFD700' }}>Uploading...</div>
                  ) : uploadedPhoto ? (
                    <div style={{ padding: '12px', background: 'rgba(0, 135, 81, 0.1)', borderRadius: '8px', border: '1px solid rgba(0, 135, 81, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <span style={{ color: '#4ade80' }}>✓ Photo uploaded</span>
                      <button
                        type="button"
                        className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                        onClick={() => setUploadedPhoto(null)}
                      >
                        Change
                      </button>
                    </div>
                  ) : (
                    <div style={{ position: 'relative', border: '2px dashed rgba(0, 135, 81, 0.3)', borderRadius: '8px', padding: '20px', textAlign: 'center', cursor: 'pointer', background: 'rgba(0, 30, 15, 0.4)' }}>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handlePhotoUpload}
                        style={{ position: 'absolute', inset: 0, opacity: 0, cursor: 'pointer' }}
                      />
                      <div style={{ color: 'rgba(232, 245, 232, 0.6)', fontSize: '14px' }}>Click to upload photo</div>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>
          <div className={styles.modalActions}>
            <button
              className={`${styles.btn} ${styles.btnOutline}`}
              onClick={() => {
                setModal(false);
                resetForm();
              }}
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

      {/* ── Confirm Delete Modal ── */}
      {confirmId && (
        <ConfirmModal
          message="Are you sure you want to remove this contestant?"
          onConfirm={handleRemoveConfirm}
          onCancel={() => setConfirmId(null)}
        />
      )}

      {/* ── Image Preview Lightbox ── */}
      {previewImage && (
        <div
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100vw',
            height: '100vh',
            background: 'rgba(0,0,0,0.9)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10000,
            padding: '40px'
          }}
          onClick={() => setPreviewImage(null)}
        >
          <div style={{ position: 'relative', maxWidth: '90%', maxHeight: '90%', display: 'flex', justifyContent: 'center' }}>
            <button
              style={{
                position: 'absolute',
                top: '-40px',
                right: '0',
                background: 'none',
                border: 'none',
                color: 'white',
                fontSize: '30px',
                cursor: 'pointer',
                fontWeight: 'bold'
              }}
              onClick={() => setPreviewImage(null)}
            >
              ✕
            </button>
            <img
              src={previewImage}
              alt="Full Preview"
              style={{ maxWidth: '100%', maxHeight: '80vh', borderRadius: '8px', boxShadow: '0 0 40px rgba(0,0,0,0.5)', objectFit: 'contain' }}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default DashboardContestants;
