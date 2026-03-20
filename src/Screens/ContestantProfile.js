import React from 'react';
import styles from '../CSS-MODULES/Contestantprofile.module.css';
import shared from '../COMPONENTS/DashboardScreens/Dashboardshared.module.css';

const MEDALS = ['🥇', '🥈', '🥉'];

const STATUS_STYLE = {
  Active:     { background: 'rgba(74,222,128,0.13)', color: '#4ade80',  border: '1px solid rgba(74,222,128,0.25)'  },
  Probation:  { background: 'rgba(255,215,0,0.12)',  color: '#FFD700',  border: '1px solid rgba(255,215,0,0.25)'   },
  Eliminated: { background: 'rgba(255,107,107,0.1)', color: '#ff6b6b',  border: '1px solid rgba(255,107,107,0.2)'  },
};


const DEFAULT_CONTESTANT = {
  name: "Guest Contestant",
  nickname: "The Star",
  photoPreview: null,
  votes: 0,
  max: 1000,
  status: "Active",
  category: "General",
  hometown: "Unknown",
  age: "--",
  bio: "No bio available yet.",
  instagram: "@talent_show",
  auditionSong: "N/A"
};

const ContestantProfile = ({ contestant = DEFAULT_CONTESTANT, rank = 1, onBack, onVote }) => {
 
  const current = contestant || DEFAULT_CONTESTANT;
  

  const totalVotes = current.votes || 0;
  const maxVotes = current.max || 1; 
  const pct = Math.round((totalVotes / maxVotes) * 100);
  
  const statusStyle = STATUS_STYLE[current.status] || STATUS_STYLE.Active;

  return (
    <div className={styles.profgrid}>
      <button className={styles.backBtn} onClick={onBack}>
        ← Back to Contestants
      </button>


      <div className={styles.profileHero}>
        <div className={styles.profileAvatarWrap}>
          <div className={styles.profileAvatar}>
            {current.photoPreview
              ? <img src={current.photoPreview} alt={current.name} />
              : (current.name ? current.name[0] : '?')
            }
          </div>
          {rank <= 3 && (
            <div className={styles.profileMedal}>{MEDALS[rank - 1]}</div>
          )}
        </div>

        <div className={styles.profileMeta}>
          <div className={styles.profileName}>{current.name}</div>
          <div className={styles.profileNickname}>{current.nickname}</div>

          <div className={styles.profileTags}>
            <span className={styles.profileTag}>🎵 {current.category}</span>
            <span className={styles.profileTag}>📍 {current.hometown}</span>
            <span className={styles.profileTag}>🎂 Age {current.age}</span>
            <span
              style={{
                ...statusStyle,
                padding: '4px 12px',
                borderRadius: 20,
                fontSize: 12,
                fontWeight: 600,
              }}
            >
              {current.status}
            </span>
          </div>

          <div className={styles.profileVoteCount}>
            {totalVotes.toLocaleString()}
          </div>
          <div className={styles.profileVoteLabel}>Total Votes · {pct}%</div>

          <div className={styles.profileVoteBar}>
            <div className={styles.profileVoteBarFill} style={{ width: `${pct}%` }} />
          </div>

          <div className={styles.profileHeroActions}>
            {current.instagram && (
              <button className={`${shared.btn} ${shared.btnOutline}`}>
                📸 {current.instagram}
              </button>
            )}
          </div>
        </div>
      </div>


      <div className={styles.profileBody}>
        <div className={`${styles.profileSection} ${styles.profileSectionFull}`}>
          <div className={styles.profileSectionTitle}>About</div>
          <p className={styles.profileBio}>{current.bio}</p>
        </div>

        <div className={styles.profileSection}>
          <div className={styles.profileSectionTitle}>Details</div>
          <div className={styles.profileRow}>
            <span className={styles.profileRowIcon}>🎵</span>
            <span className={styles.profileRowLabel}>Category</span>
            <span className={styles.profileRowValue}>{current.category}</span>
          </div>
          <div className={styles.profileRow}>
            <span className={styles.profileRowIcon}>📍</span>
            <span className={styles.profileRowLabel}>Hometown</span>
            <span className={styles.profileRowValue}>{current.hometown}</span>
          </div>
        </div>

        <div className={styles.profileSection}>
          <div className={styles.profileSectionTitle}>Audition</div>
          <div className={styles.profileRow}>
            <span className={styles.profileRowIcon}>🎤</span>
            <span className={styles.profileRowLabel}>Song</span>
            <span className={styles.profileRowValue}>{current.auditionSong || '—'}</span>
          </div>
          <div className={styles.profileRow}>
            <span className={styles.profileRowIcon}>📊</span>
            <span className={styles.profileRowLabel}>Votes</span>
            <span className={styles.profileRowValue}>
              {totalVotes.toLocaleString()} / {maxVotes.toLocaleString()}
            </span>
          </div>
        </div>
      </div>


    </div>
  );
};

export default ContestantProfile;