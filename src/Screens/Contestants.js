import React, { useState } from 'react';
import styles from '../CSS-MODULES/Contestants.module.css';
import Navbar from '../COMPONENTS/Navbar';
import Footer from '../COMPONENTS/Footer';

const Contestants = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [category, setCategory] = useState("All");
  const [visibleCount, setVisibleCount] = useState(8); // Show 8 initially

  const contestantsData = [
    { id: "001", name: "Ayo Williams", talent: "Singing", location: "Lagos, NG", image: "https://via.placeholder.com/400x500", votes: "1,200" },
    { id: "002", name: "Sarah Johnson", talent: "Dancing", location: "Raleigh, USA", image: "https://via.placeholder.com/400x500", votes: "950" },
    { id: "003", name: "Obinna Okafor", talent: "Comedy", location: "Enugu, NG", image: "https://via.placeholder.com/400x500", votes: "2,100" },
    { id: "004", name: "Grace Edet", talent: "Spoken Word", location: "Uyo, NG", image: "https://via.placeholder.com/400x500", votes: "1,550" },
    { id: "005", name: "John Doe", talent: "Singing", location: "Abuja, NG", image: "https://via.placeholder.com/400x500", votes: "800" },
    { id: "006", name: "Musa Chen", talent: "Magic", location: "Calabar, NG", image: "https://via.placeholder.com/400x500", votes: "3,400" },
    { id: "007", name: "David West", talent: "Dancing", location: "Port Harcourt, NG", image: "https://via.placeholder.com/400x500", votes: "1,100" },
    { id: "008", name: "Emily Blunt", talent: "Comedy", location: "New York, USA", image: "https://via.placeholder.com/400x500", votes: "2,050" },
    { id: "009", name: "Kelechi Iheanacho", talent: "Singing", location: "Abia, NG", image: "https://via.placeholder.com/400x500", votes: "1,700" },
    // Add 10-20 more objects here...
  ];

  // Logic: Filter by Name AND Category
  const filteredContestants = contestantsData.filter(person => {
    const matchesName = person.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === "All" || person.talent === category;
    return matchesName && matchesCategory;
  });

  const handleLoadMore = () => {
    setVisibleCount(prevCount => prevCount + 4); // Load 4 more at a time
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
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <select 
              className={styles.filterDrop}
              onChange={(e) => setCategory(e.target.value)}
            >
              <option value="All">All Categories</option>
              <option value="Singing">Singing</option>
              <option value="Dancing">Dancing</option>
              <option value="Comedy">Comedy</option>
              <option value="Magic">Magic</option>
              <option value="Spoken Word">Spoken Word</option>
            </select>
          </div>
        </header>

        
        <div className={styles.contestantGrid}>
          {filteredContestants.slice(0, visibleCount).map((item) => (
            <div key={item.id} className={styles.contestantCard}>
              <div className={styles.imageWrapper}>
                <img src={item.image} alt={item.name} className={styles.photo} />
                <div className={styles.idBadge}>#{item.id}</div>
                <div className={styles.voteOverlay}>
                   <button className={styles.voteBtnQuick}>VOTE</button>
                </div>
              </div>
              
              <div className={styles.details}>
                <div className={styles.nameRow}>
                  <h3>{item.name}</h3>
                  <span className={styles.voteTally}>{item.votes} Votes</span>
                </div>
                <p className={styles.talentTag}>{item.talent}</p>
                <p className={styles.loc}>📍 {item.location}</p>
                <button className={styles.profileBtn}>View Full Profile</button>
              </div>
            </div>
          ))}
        </div>

        {/* Load More Button */}
        {visibleCount < filteredContestants.length && (
          <div className={styles.loadMoreWrapper}>
            <button className={styles.loadMoreBtn} onClick={handleLoadMore}>
              LOAD MORE CONTESTANTS
            </button>
          </div>
        )}
      </div>
    </section>
    <Footer />
    </>
  );
};

export default Contestants;