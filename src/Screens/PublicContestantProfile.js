import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import styles from '../CSS-MODULES/Contestantprofile.module.css';
import shared from '../COMPONENTS/DashboardScreens/Dashboardshared.module.css';
import Navbar from '../COMPONENTS/Navbar';
import Footer from '../COMPONENTS/Footer';
import api from '../services/api';

const MEDALS = ['🥇', '🥈', '🥉'];

const STATUS_STYLE = {
  Active:     { background: 'rgba(74,222,128,0.13)', color: '#4ade80',  border: '1px solid rgba(74,222,128,0.25)'  },
  Probation:  { background: 'rgba(255,215,0,0.12)',  color: '#FFD700',  border: '1px solid rgba(255,215,0,0.25)'   },
  Eliminated: { background: 'rgba(255,107,107,0.1)', color: '#ff6b6b',  border: '1px solid rgba(255,107,107,0.2)'  },
};

const PublicContestantProfile = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [contestant, setContestant] = useState(null);
  const [allContestants, setAllContestants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [rank, setRank] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await api.get('/users/contestants');
        let data = response.data || response;
        if (Array.isArray(data) && data.length > 0 && data[0].data) data = data[0].data;
        else if (data.data && Array.isArray(data.data)) data = data.data;

        const list = Array.isArray(data) ? data : [];
        setAllContestants(list);

        // Sort by votes to determine rank
        const sorted = [...list].sort((a, b) => (b.votes || 0) - (a.votes || 0));
        const found = sorted.find(c => c._id === id);
        if (found) {
          setContestant(found);
          setRank(sorted.findIndex(c => c._id === id) + 1);
        }
      } catch (err) {
        console.error('Failed to fetch contestant:', err);
      } finally {
        setLoading(false);
      }
    };

    if (id) fetchData();
  }, [id]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000e05', color: '#FFD700', fontSize: 16 }}>
          Loading profile...
        </div>
        <Footer />
      </>
    );
  }

  if (!contestant) {
    return (
      <>
        <Navbar />
        <div style={{ minHeight: '60vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#000e05', color: 'rgba(232,245,232,0.5)', fontSize: 16 }}>
          Contestant not found.
        </div>
        <Footer />
      </>
    );
  }

  const name = `${contestant.first_name || ''} ${contestant.last_name || ''}`.trim();
  const totalVotes = contestant.votes || 0;
  const maxVotes = 10000;
  const pct = Math.round((totalVotes / maxVotes) * 100);
  const status = contestant.contestant_status || 'Active';
  const statusStyle = STATUS_STYLE[status] || STATUS_STYLE.Active;
  const photo = contestant.photo || null;
  const category = contestant.talent_category || 'N/A';
  const hometown = contestant.hometown || contestant.location || contestant.state || 'N/A';
  const age = contestant.age || '--';
  const bio = contestant.bio || '';
  const auditionSong = contestant.audition_song || '—';
  const instagram = contestant.instagram || '';
  const nickname = contestant.nickname ? contestant.nickname : `#${contestant.contestant_number || ''}`;

  return (
    <>
      <Navbar />
      <div style={{ background: '#000e05', minHeight: '100vh', padding: '32px 20px' }}>
        <div className={styles.profgrid}>
          <button className={styles.backBtn} onClick={() => navigate('/contestants')}>
            ← Back to Contestants
          </button>

          <div className={styles.profileHero}>
            <div className={styles.profileAvatarWrap}>
              <div className={styles.profileAvatar}>
                {photo
                  ? <img src={photo} alt={name} />
                  : (name ? name[0] : '?')
                }
              </div>
              {rank <= 3 && (
                <div className={styles.profileMedal}>{MEDALS[rank - 1]}</div>
              )}
            </div>

            <div className={styles.profileMeta}>
              <div className={styles.profileName}>{name}</div>
              <div className={styles.profileNickname}>{nickname}</div>

              <div className={styles.profileTags}>
                <span className={styles.profileTag}>🎵 {category}</span>
                <span className={styles.profileTag}>📍 {hometown}</span>
                <span className={styles.profileTag}>🎂 Age {age}</span>
                <span style={{ ...statusStyle, padding: '4px 12px', borderRadius: 20, fontSize: 12, fontWeight: 600 }}>
                  {status}
                </span>
              </div>

              <div className={styles.profileVoteCount}>{totalVotes.toLocaleString()}</div>
              <div className={styles.profileVoteLabel}>Total Votes · {pct}%</div>

              <div className={styles.profileVoteBar}>
                <div className={styles.profileVoteBarFill} style={{ width: `${pct}%` }} />
              </div>

              <div className={styles.profileHeroActions}>
                <button
                  className={styles.voteNowBtn}
                  onClick={() => navigate(`/vote/${id}`)}
                  type="button"
                >
                  🗳️ Vote Now
                </button>
                {instagram && (
                  <button className={`${shared.btn} ${shared.btnOutline}`}>
                    📸 {instagram}
                  </button>
                )}
              </div>
            </div>
          </div>

          <div className={styles.profileBody}>
            <div className={`${styles.profileSection} ${styles.profileSectionFull}`}>
              <div className={styles.profileSectionTitle}>About</div>
              <p className={styles.profileBio}>{bio || 'No bio available yet.'}</p>
            </div>

            <div className={styles.profileSection}>
              <div className={styles.profileSectionTitle}>Details</div>
              <div className={styles.profileRow}>
                <span className={styles.profileRowIcon}>🎵</span>
                <span className={styles.profileRowLabel}>Category</span>
                <span className={styles.profileRowValue}>{category}</span>
              </div>
              <div className={styles.profileRow}>
                <span className={styles.profileRowIcon}>📍</span>
                <span className={styles.profileRowLabel}>Hometown</span>
                <span className={styles.profileRowValue}>{hometown}</span>
              </div>
            </div>

            <div className={styles.profileSection}>
              <div className={styles.profileSectionTitle}>Audition</div>
              <div className={styles.profileRow}>
                <span className={styles.profileRowIcon}>🎤</span>
                <span className={styles.profileRowLabel}>Song</span>
                <span className={styles.profileRowValue}>{auditionSong}</span>
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
      </div>
      <Footer />
    </>
  );
};

export default PublicContestantProfile;
