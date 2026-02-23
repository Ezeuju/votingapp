import React from 'react';
import styles from '../CSS-MODULES/Timeline.module.css';
import Navbar from '../COMPONENTS/Navbar';
import Footer from '../COMPONENTS/Footer';

const Timeline = () => {
  const events = [
    {
      date: "May 2026",
      title: "Audition Registration Opens",
      description: "Registration begins for all talent categories including singers, dancers, and innovators across Nigeria and the USA.",
      status: "upcoming"
    },
    {
      date: "July 15 - August 30, 2026",
      title: "Nationwide Audition Tour",
      description: "Live auditions take place in major hubs: Lagos, Abuja, Port Harcourt, Enugu, and Uyo.",
      status: "upcoming"
    },
    {
      date: "September 5, 2026",
      title: "Shortlisting & Mentorship",
      description: "Successful candidates are paired with professional mentors like Bishop Dr. Daniel Jack and Pastor Moses Eskor for coaching.",
      status: "upcoming"
    },
    {
      date: "October 2026",
      title: "The Live Shows Begin",
      description: "Contestants perform on the grand stage. Public voting opens for fans to support their favorites with NTS points.",
      status: "upcoming"
    },
    {
      date: "December 20, 2026",
      title: "Grand Finale",
      description: "The top-rated acts compete for the grand prize and international recognition in the ultimate talent-recovery showpiece.",
      status: "upcoming"
    }
  ];

  return (
    <>
    <Navbar />
    <div className={styles.timelinePage}>
      {/* HERO SECTION */}
      <header className={styles.hero}>
        <div className={styles.container}>
          <span className={styles.badge}>Road to Stardom</span>
          <h1>Season 4 <span className={styles.goldText}>Timeline</span></h1>
          <p>Mark your calendars. Here is the official roadmap for the Naija Talent Show 2026 season.</p>
        </div>
      </header>

      

      {/* TIMELINE SECTION */}
      <section className={styles.roadmapSection}>
        <div className={styles.container}>
          <div className={styles.timelineWrapper}>
            {events.map((event, index) => (
              <div key={index} className={styles.timelineItem}>
                <div className={styles.dateSide}>
                  <div className={styles.dateCircle}>{event.date}</div>
                </div>
                <div className={styles.contentSide}>
                  <div className={styles.eventCard}>
                    <h3>{event.title}</h3>
                    <p>{event.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA SECTION */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <h2>Ready to make your mark?</h2>
          <p>Don't miss the registration deadline for Season 4.</p>
          <button className={styles.applyBtn}><a href="/auditiony">Start Your Journey</a></button>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default Timeline;