import React from 'react';
import styles from '../CSS-MODULES/Judges.module.css';
import { FaInstagram, FaTwitter, FaFacebook } from 'react-icons/fa'; // Ensure react-icons is installed
import judge1  from "../assets/judge1.webp"; 
import judge2 from  "../assets/judge2.webp";
import judge3 from "../assets/judge3.webp";


const Judges = () => {
  const judgesData = [
    {
      id: 1,
      name: "Dr. Daniel Jack",
      title: "Executive Producer & Head Judge",
      country: "USA / Nigeria",
      image: judge1, // Replace with actual image
      socials: { instagram: "#", twitter: "#", facebook: "#" }
    },
    {
      id: 2,
      name: "Industry Veteran",
      title: "Vocal Coach & Performance Expert",
      country: "Nigeria",
      image: judge2,
      socials: { instagram: "#", twitter: "#", facebook: "#" }
    },
    {
      id: 3,
      name: "Global Talent Scout",
      title: "Choreography Director",
      country: "United States",
      image: judge3,
      socials: { instagram: "#", twitter: "#", facebook: "#" }
    }
  ];

  return (
    <section className={styles.judgesSection} id="judges">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>The Decision Makers</span>
          <h2>Meet Our <span className={styles.greenText}>Global Panel</span> of Judges</h2>
          <p>Industry experts from Nigeria and the United States dedicated to discovering and grooming the next global icon.</p>
        </div>

        <div className={styles.judgesGrid}>
          {judgesData.map((judge) => (
            <div key={judge.id} className={styles.judgeCard}>
              <div className={styles.imageWrapper}>
                <div className={styles.judgeImage} ><img src={judge.image} alt={judge.name} /> </div>
                <div className={styles.socialOverlay}>
                  <a href={judge.socials.instagram} aria-label="Instagram"><FaInstagram /></a>
                  <a href={judge.socials.twitter} aria-label="Twitter"><FaTwitter /></a>
                  <a href={judge.socials.facebook} aria-label="Facebook"><FaFacebook /></a>
                </div>
              </div>
              <div className={styles.info}>
                <h3>{judge.name}</h3>
                <p className={styles.title}>{judge.title}</p>
                <span className={styles.country}>🌍 {judge.country}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Judges;