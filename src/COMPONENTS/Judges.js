import React, { useEffect, useState } from 'react';
import styles from '../CSS-MODULES/Judges.module.css';
import { getPublicJudges } from '../services/api';

const Judges = () => {
  const [judges, setJudges] = useState([]);
  const [loading, setLoading] = useState(true);

  // Default mystery seats if not enough judges are returned
  const defaultSeats = [
    { id: 1, category: "Industry Veteran" },
    { id: 2, category: "Creative Director" },
    { id: 3, category: "Global Superstar" },
    { id: 4, category: "Vocal Powerhouse" }
  ];

  useEffect(() => {
    const fetchJudges = async () => {
      try {
        const resp = await getPublicJudges();
        // The endpoint returns { data: { data: [...] } }
        const data = resp.data?.data || [];
        setJudges(data);
      } catch (err) {
        console.error("Failed to load judges", err);
      } finally {
        setLoading(false);
      }
    };
    fetchJudges();
  }, []);

  // Map the available API judges to the 4 seats. 
  // If fewer than 4 judges exist, the rest will remain "Mystery".
  const displayJudges = defaultSeats.map((seat, index) => {
    const apiJudge = judges[index];
    if (apiJudge) {
      return {
        id: apiJudge._id || seat.id,
        name: `${apiJudge.first_name} ${apiJudge.last_name}`,
        category: apiJudge.position || seat.category,
        photo: apiJudge.photo,
        isMystery: false
      };
    }
    return { ...seat, isMystery: true };
  });

  return (
    <section className={styles.judgeSection} id="judges">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Season 4 Panel</span>
          <h2>The <span className={styles.greenText}>Mystery</span> <span className={styles.goldText}>Judges</span></h2>
          <p>Four industry giants. One stage. The identities remain top secret!</p>
        </div>

        <div className={styles.judgeGrid}>
          {displayJudges.map((seat) => (
            <div key={seat.id} className={styles.judgeCard}>
              <div className={styles.imageWrapper}>
                {seat.isMystery || !seat.photo ? (
                  <div className={styles.mysteryFrame}>
                    <div className={styles.silhouette}>
                      <span className={styles.questionMark}>?</span>
                    </div>
                    <div className={styles.frameGlow}></div>
                  </div>
                ) : (
                  <img src={seat.photo} alt={seat.name} style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: '16px' }} />
                )}
                
                {/* Social Overlay kept from your original code for future use */}
                <div className={styles.socialOverlay}>
                  <a href="/">𝕏</a>
                  <a href="#/">📸</a>
                </div>
              </div>

              <div className={styles.info}>
                <h3 className={styles.revealText}>{seat.isMystery ? "To Be Revealed" : seat.name}</h3>
                <p className={styles.title}>{seat.category}</p>
                <div className={styles.categoryBadge}>{seat.isMystery ? "Mystery" : "Judge"}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Judges;