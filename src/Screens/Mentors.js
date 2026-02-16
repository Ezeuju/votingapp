import React from 'react';
import styles from '../CSS-MODULES/Mentors.module.css';
import Navbar from '../COMPONENTS/Navbar';
import Footer from '../COMPONENTS/Footer';

const Mentors = () => {
  const mentorList = [
    { name: "Bishop Dr Daniel Jack", title: "President & Convener", region: "USA" },
    { name: "Evang. James Bregenzer", title: "Vice President", region: "USA" },
    { name: "Pastor Moses Eskor", title: "Project Director", region: "Nigeria" },
    { name: "Mr Godfrey Etim", title: "Media Manager", region: "Nigeria" },
    { name: "Evang. Ekaette Uko", title: "Concert Assistant Manager", region: "Nigeria" },
    { name: "Pastor Micah Victor", title: "Project Associate", region: "Nigeria" },
    { name: "Mr Jimmy De Young", title: "Creative Manager", region: "Nigeria" },
    { name: "Pastor Mbosowo Ebuk", title: "Media Assistant", region: "Nigeria" }
  ];

  return (

    <>
    <Navbar />
    <div className={styles.mentorPage}>
      {/* HERO SECTION */}
      <header className={styles.hero}>
        <div className={styles.container}>
          <span className={styles.badge}>🌟 Meet the Mentors</span>
          <h1>Guiding the <span className={styles.greenText}>Stars of Tomorrow</span></h1>
          <p>Our professional mentors help contestants unlock their full potential through expert coaching and creative direction.</p>
        </div>
      </header>

      {/* WHAT THEY DO SECTION */}
      
      <section className={styles.impactSection}>
        <div className={styles.container}>
          <div className={styles.impactGrid}>
            <div className={styles.impactCard}>
              <h4>One-on-One Coaching</h4>
              <p>Personalized guidance tailored to each contestant's unique needs.</p>
            </div>
            <div className={styles.impactCard}>
              <h4>Stage Presence</h4>
              <p>Teaching how to command attention and connect with global audiences.</p>
            </div>
            <div className={styles.impactCard}>
              <h4>Creative Direction</h4>
              <p>Refining performances for maximum emotional and technical impact.</p>
            </div>
          </div>
        </div>
      </section>

      {/* MENTORS GRID */}
      <section className={styles.teamSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Our Esteemed Panel</h2>
          <div className={styles.mentorGrid}>
            {mentorList.map((mentor, index) => (
              <div key={index} className={styles.mentorCard}>
                <div className={styles.avatarPlaceholder}>
                   {/* Placeholder for future images */}
                   <span>{mentor.name.charAt(0)}</span>
                </div>
                <h3>{mentor.name}</h3>
                <p className={styles.mentorTitle}>{mentor.title}</p>
                <span className={styles.regionTag}>{mentor.region}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section className={styles.formSection} id="apply">
        <div className={styles.container}>
          <div className={styles.formWrapper}>
            <div className={styles.formHeader}>
              <h2>💼 Join Our Mentorship Team</h2>
              <p>Are you a professional in entertainment with a passion for developing new talent? Apply today!</p>
            </div>
            
            <form className={styles.mentorForm}>
              <div className={styles.inputRow}>
                <input type="text" placeholder="Full Name" required />
                <input type="email" placeholder="Email Address" required />
              </div>
              <div className={styles.inputRow}>
                <input type="tel" placeholder="Phone Number" required />
                <select required>
                  <option value="">Area of Expertise</option>
                  <option value="vocal">Vocal Coaching</option>
                  <option value="dance">Dance/Choreography</option>
                  <option value="media">Media & Branding</option>
                  <option value="production">Stage Production</option>
                </select>
              </div>
              <textarea placeholder="Tell us about your professional background and why you want to mentor NTS stars..." rows="5"></textarea>
              <button type="submit" className={styles.submitBtn}>Submit Application</button>
            </form>
          </div>
        </div>
      </section>

     
    </div>
    <Footer />
    </>
  );
};

export default Mentors;