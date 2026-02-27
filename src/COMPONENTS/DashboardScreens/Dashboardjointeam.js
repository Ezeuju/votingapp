// src/COMPONENTS/DashboardScreens/DashboardJoinTeam.jsx
import React, { useState, useEffect } from "react";
import styles from "../../CSS-MODULES/Jointeam.module.css";
import shared from "./Dashboardshared.module.css";
import DashboardModal from "./Dashboardmodal";
import { adminApi } from "../../services/adminApi";
import { useTableData } from "../../hooks/useTableData";

const STATUS_CLASS = {
  Pending: styles.statusNew,
  Reviewing: styles.statusReviewing,
  Accepted: styles.statusAccepted,
  Declined: styles.statusDeclined,
};

const DashboardJoinTeam = () => {
  const { data: applicants,loading, setSearch, refetch } = useTableData(adminApi.getTeams);
  const [viewEntry, setViewEntry] = useState(null);
  const [filter, setFilter] = useState("All");
  const [searchInput, setSearchInput] = useState("");
  const [updating, setUpdating] = useState(false);
  const [stats, setStats] = useState({
    total_teams: 0,
    total_new: 0,
    total_review: 0,
    total_accepted: 0,
    total_declined: 0,
  });

  useEffect(() => {
    fetchStats();
  }, [applicants]);

  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 500);
    return () => clearTimeout(timer);
  }, [searchInput, setSearch]);

  const handleStatus = async (id, status) => {
    setUpdating(true);
    try {
      await adminApi.updateTeamStatus(id, status);
      await fetchStats();
      refetch();
      setViewEntry(null);
    } catch (error) {
      console.error("Failed to update status:", error);
    } finally {
      setUpdating(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await adminApi.getTeamStats();
      setStats(response.data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const filtered = applicants.filter(
    (a) => filter === "All" || a.status === filter,
  );

  const counts = {
    total: stats.total_teams,
    pending: stats.total_new,
    reviewing: stats.total_review,
    accepted: stats.total_accepted,
    declined: stats.total_declined,
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
          <div className={shared.statValue}>{counts.pending}</div>
          <div className={shared.statLabel}>Pending</div>
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
        <span className={shared.sectionTitle}>
          👥 <span>Join Our Team</span>
        </span>
      </div>

      {/* ── Search ── */}
      <div className={shared.searchWrap}>
        <span className={shared.searchIcon}>🔍</span>
        <input
          className={shared.searchInput}
          placeholder="Search by name, email or position..."
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
        />
      </div>

      {/* ── Filter Tabs ── */}
      <div className={styles.filterTabs}>
        {["All", "Pending", "Reviewing", "Accepted", "Declined"].map((f) => (
          <button
            key={f}
            className={`${styles.filterTab} ${filter === f ? styles.filterTabActive : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      {/* ── Applicant Cards ── */}
      {loading ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>⏳</div>
          Loading applicants...
        </div>
      ) : filtered.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>👥</div>
          No applicants found
        </div>
      ) : (
        <div className={styles.applicantsGrid}>
          {filtered.map((a) => (
            <div key={a._id} className={styles.applicantCard}>
              <div className={styles.cardHeader}>
                <div className={styles.cardAvatar}>
                  {(a.full_name || "?")[0]}
                </div>
                <div>
                  <div className={styles.cardName}>{a.full_name}</div>
                  <div className={styles.cardEmail}>{a.email}</div>
                </div>
              </div>

              <div style={{ marginBottom: 8 }}>
                <span className={STATUS_CLASS[a.status]}>{a.status}</span>{" "}
                <span className={styles.positionBadge}>{a.role}</span>
              </div>

              <div className={styles.cardDivider} />

              <div className={styles.cardRow}>
                <span className={styles.cardRowIcon}>📞</span>
                <span className={styles.cardRowValue}>{a.phone}</span>
              </div>

              <div className={styles.cardRow}>
                <span className={styles.cardRowIcon}>📅</span>
                <span className={styles.cardRowValue}>
                  {new Date(a.createdAt).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                  })}
                </span>
              </div>

              {a.experience && (
                <div className={styles.cardExperience}>{a.experience}</div>
              )}

              {a.link && (
                <div className={styles.cardRow} style={{ marginTop: 8 }}>
                  <span className={styles.cardRowIcon}>📎</span>
                  <a
                    href={a.link}
                    target="_blank"
                    rel="noreferrer"
                    className={styles.portfolioLink}
                  >
                    {a.link}
                  </a>
                </div>
              )}

              <div className={styles.cardActions}>
                <button
                  className={`${shared.btn} ${shared.btnOutline} ${shared.btnSm}`}
                  onClick={() => setViewEntry(a)}
                >
                  View
                </button>
                {a.status === "Pending" && (
                  <button
                    className={`${shared.btn} ${shared.btnGreen} ${shared.btnSm}`}
                    onClick={() => handleStatus(a._id, "Reviewing")}
                    disabled={updating}
                  >
                    Review
                  </button>
                )}
                {a.status === "Reviewing" && (
                  <button
                    className={`${shared.btn} ${shared.btnGreen} ${shared.btnSm}`}
                    onClick={() => handleStatus(a._id, "Accepted")}
                    disabled={updating}
                  >
                    Accept
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* ── View Applicant Modal ── */}
      {viewEntry && (
        <DashboardModal
          title="Applicant Details"
          onClose={() => setViewEntry(null)}
        >
          <div className={shared.formGrid}>
            {[
              { label: "Full Name", value: viewEntry.full_name },
              { label: "Email", value: viewEntry.email },
              { label: "Phone", value: viewEntry.phone },
              {
                label: "Date",
                value: new Date(
                  viewEntry.createdAt || viewEntry.date,
                ).toLocaleDateString("en-GB", {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                }),
              },
            ].map((row) => (
              <div className={shared.formGroup} key={row.label}>
                <span className={shared.label}>{row.label}</span>
                <span
                  style={{ color: "#e8f5e8", fontSize: 14, fontWeight: 500 }}
                >
                  {row.value || "—"}
                </span>
              </div>
            ))}

            <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
              <span className={shared.label}>Position</span>
              <div style={{ marginTop: 4 }}>
                <span className={styles.positionBadge}>{viewEntry.role}</span>
              </div>
            </div>

            {viewEntry.experience && (
              <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
                <span className={shared.label}>Experience</span>
                <div className={styles.cardExperience} style={{ marginTop: 6 }}>
                  {viewEntry.experience}
                </div>
              </div>
            )}

            {viewEntry.link && (
              <div className={`${shared.formGroup} ${shared.formGroupFull}`}>
                <span className={shared.label}>Portfolio / CV Link</span>
                <a
                  href={viewEntry.link}
                  target="_blank"
                  rel="noreferrer"
                  className={styles.portfolioLink}
                  style={{ marginTop: 4, display: "block" }}
                >
                  {viewEntry.link}
                </a>
              </div>
            )}

            <div className={shared.formGroup}>
              <span className={shared.label}>Status</span>
              <div style={{ marginTop: 4 }}>
                <span className={STATUS_CLASS[viewEntry.status]}>
                  {viewEntry.status}
                </span>
              </div>
            </div>
          </div>

          <div className={shared.modalActions}>
            {viewEntry.status === "Pending" && (
              <button
                className={`${shared.btn} ${shared.btnOutline}`}
                onClick={() => handleStatus(viewEntry._id, "Reviewing")}
                disabled={updating}
              >
                🔍 Move to Review
              </button>
            )}
            {viewEntry.status === "Reviewing" && (
              <>
                <button
                  className={`${shared.btn} ${shared.btnGreen}`}
                  onClick={() => handleStatus(viewEntry._id, "Accepted")}
                  disabled={updating}
                >
                  ✓ Accept
                </button>
                <button
                  className={`${shared.btn} ${shared.btnDanger}`}
                  onClick={() => handleStatus(viewEntry._id, "Declined")}
                  disabled={updating}
                >
                  ✗ Decline
                </button>
              </>
            )}
            <button
              className={`${shared.btn} ${shared.btnOutline}`}
              onClick={() => setViewEntry(null)}
            >
              Close
            </button>
          </div>
        </DashboardModal>
      )}
    </div>
  );
};

export default DashboardJoinTeam;
