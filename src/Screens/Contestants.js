import React, { useState, useEffect, useCallback } from 'react';
import styles from '../CSS-MODULES/Contestants.module.css';
import Navbar from '../COMPONENTS/Navbar';
import Footer from '../COMPONENTS/Footer';
import api from '../services/api';
import { Link, useNavigate } from "react-router-dom"

const Contestants = () => {
  const navigate = useNavigate();
  const [searchTerm,    setSearchTerm]    = useState('');
  const [category,      setCategory]      = useState('All');
  const [visibleCount,  setVisibleCount]  = useState(8);
  const [contestants,   setContestants]   = useState([]);
  const [categories,    setCategories]    = useState([]);
  const [loading,       setLoading]       = useState(false);

  const fetchCategories = async () => {
    try {
      const response = await api.get('/users/contestants/talent-categories');
      setCategories(response.data || []);
    } catch (err) {
      console.error('Failed to fetch categories:', err);
    }
  };


  const fetchContestants = useCallback(async () => {
    setLoading(true);
    try {
      let url = '/users/contestants';
      const params = [];

      if (searchTerm) {
        params.push(`search=${encodeURIComponent(searchTerm)}`);
      }

      if (category !== 'All') {
        params.push(`talent_category=${encodeURIComponent(category)}`);
      }

      if (params.length > 0) {
        url += '?' + params.join('&');
      }

      const response = await api.get(url);
      let data = response.data || response;

      
      if (Array.isArray(data) && data.length > 0 && data[0].data) {
        data = data[0].data;
      } else if (data.data && Array.isArray(data.data)) {
        data = data.data;
      }

      setContestants(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to fetch contestants:', err);
      setContestants([]);
    } finally {
      setLoading(false);
    }
  }, [searchTerm, category]); 

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      fetchContestants();
    }, 500);
    return () => clearTimeout(timer);
  }, [fetchContestants]); 

  const handleLoadMore = () => {
    setVisibleCount(prev => prev + 4);
  };

  const handleVoteNow = (contestantId) => {
    navigate(`/vote/${contestantId}`);
  };

  return (
    <>
      <Navbar />
      <section className={styles.contestantSection}>
        <div className={styles.container}>
          <header className={styles.header}>
            <span className={styles.badge}>Season 4 Global Finalists</span>
            <h1>Meet the <span className={styles.greenText}>Rising Stars</span></h1>

            <div className={styles.controls}>
              <input
                type="text"
                placeholder="Search contestant..."
                className={styles.searchBox}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <select
                className={styles.filterDrop}
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              >
                <option value="All">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </header>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '40px', color: '#FFD700' }}>
              Loading contestants...
            </div>
          ) : contestants.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px', color: 'rgba(232, 245, 232, 0.5)' }}>
              No contestants found
            </div>
          ) : (
            <>
              <div className={styles.contestantGrid}>
                {contestants.slice(0, visibleCount).map((item) => (
                  <div key={item._id} className={styles.contestantCard}>
                    <div className={styles.imageWrapper}>
                      <img src={item.photo} alt={item.first_name} className={styles.photo} />
                      <div className={styles.idBadge}>#{item.contestant_number || 'N/A'}</div>
                    </div>



                    <div className={styles.details}>
                      <div className={styles.nameRow}>
                        <h3>{item.first_name} {item.last_name}</h3>
                        <span className={styles.voteTally}>{(item.votes || 0).toLocaleString()} Votes</span>
                      </div>
                      <p className={styles.talentTag}>{item.talent_category || 'N/A'}</p>
                      <p className={styles.loc}>📍 {item.state || item.location || 'N/A'}</p>
                      <div className={styles.cardActions}>
                        <Link to={`/contestantprofile/${item._id}`}>
                          <button className={styles.profileBtn}>View Full Profile</button>
                        </Link>
                        <button
                          className={styles.voteNowBtn}
                          onClick={() => handleVoteNow(item._id)}
                        >
                          Vote Now
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              {visibleCount < contestants.length && (
                <div className={styles.loadMoreWrapper}>
                  <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
                    LOAD MORE CONTESTANTS
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
      <Footer />
    </>
  );
};

export default Contestants;
