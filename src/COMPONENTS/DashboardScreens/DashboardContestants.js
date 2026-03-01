// src/COMPONENTS/DashboardScreens/DashboardContestants.jsx
import React, { useState, useEffect } from "react";
import styles from "../DashboardScreens/Dashboardshared.module.css";
import pageStyles from "../DashboardScreens/Dashboardpages.module.css";
import DashboardModal from "./Dashboardmodal";
import { STATUS_MAP } from "./Dashboarddata";
import { adminApi } from "../../services/adminApi";

const MEDALS = ["🥇", "🥈", "🥉"];

const DashboardContestants = ({ data, setData }) => {
  const [modal, setModal] = useState(false);
  const [form, setForm] = useState({ name: "", nickname: "" });
  const [searchTerm, setSearchTerm] = useState("");
  const [applicants, setApplicants] = useState([]);
  const [selectedApplicant, setSelectedApplicant] = useState(null);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

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

  const fetchApplicants = async (search = "") => {
    setLoadingApplicants(true);
    try {
      const resp = await adminApi.getUsers({
        account_type: "Applicant",
        limitNo: 100,
        search,
      });
      setApplicants(resp.data.data || []);
    } catch (err) {
      console.error("Failed to fetch applicants:", err);
    } finally {
      setLoadingApplicants(false);
    }
  };

  const handleAdd = () => {
    if (!selectedApplicant) return;
    const entry = {
      id: selectedApplicant._id || Date.now(),
      name: `${selectedApplicant.first_name} ${selectedApplicant.last_name}`,
      nickname:
        form.nickname || `@${selectedApplicant.first_name.toLowerCase()}`,
      category: selectedApplicant.talent_category || "N/A",
      votes: 0,
      max: 10000,
      status: "Active",
    };
    setData((prev) => ({ ...prev, contestants: [...prev.contestants, entry] }));
    resetForm();
    setModal(false);
  };

  const resetForm = () => {
    setForm({ name: "", nickname: "" });
    setSearchTerm("");
    setSelectedApplicant(null);
  };

  const handleRemove = (id) =>
    setData((prev) => ({
      ...prev,
      contestants: prev.contestants.filter((c) => c.id !== id),
    }));

  const handleStatus = (id, status) =>
    setData((prev) => ({
      ...prev,
      contestants: prev.contestants.map((c) =>
        c.id === id ? { ...c, status } : c,
      ),
    }));

  const sorted = [...data.contestants].sort((a, b) => b.votes - a.votes);

  const searchResults = searchTerm.trim()
    ? applicants.filter(
        (a) =>
          `${a.first_name} ${a.last_name}`
            .toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          a.email.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    : [];

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
      <div className={pageStyles.contestantsGrid}>
        {sorted.map((c, i) => (
          <div key={c.id} className={pageStyles.contestantCard}>
            {i < 3 && <div className={pageStyles.medal}>{MEDALS[i]}</div>}

            <div className={pageStyles.contestantAvatar}>{c.name[0]}</div>
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
                  style={{ width: `${(c.votes / c.max) * 100}%` }}
                />
              </div>
            </div>

            <div className={pageStyles.contestantActions}>
              {c.status === "Active" && (
                <button
                  className={`${styles.btn} ${styles.btnOutline} ${styles.btnSm}`}
                  onClick={() => handleStatus(c.id, "Eliminated")}
                >
                  Eliminate
                </button>
              )}
              {c.status === "Eliminated" && (
                <button
                  className={`${styles.btn} ${styles.btnGreen} ${styles.btnSm}`}
                  onClick={() => handleStatus(c.id, "Active")}
                >
                  Restore
                </button>
              )}
              <button
                className={`${styles.btn} ${styles.btnDanger} ${styles.btnSm}`}
                onClick={() => handleRemove(c.id)}
              >
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {data.contestants.length === 0 && (
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
                        marginTop: 8,
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
                      style={{ marginTop: 8 }}
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
                      style={{ marginTop: 8, color: "#ff4444", fontSize: 12 }}
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
              </div>
            )}

            <div className={styles.formGroup}>
              <label className={styles.label}>Nickname / Handle</label>
              <input
                className={styles.input}
                placeholder="@handle"
                value={form.nickname}
                onChange={(e) =>
                  setForm((p) => ({ ...p, nickname: e.target.value }))
                }
              />
            </div>
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
              disabled={!selectedApplicant}
            >
              Add Contestant
            </button>
          </div>
        </DashboardModal>
      )}
    </div>
  );
};

export default DashboardContestants;
