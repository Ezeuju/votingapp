import React, { useEffect, useState } from 'react';
import styles from '../CSS-MODULES/Timeline.module.css';
import Navbar from '../COMPONENTS/Navbar';
import Footer from '../COMPONENTS/Footer';
import { getPublicTimelines } from '../services/api';

const Timeline = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fallback/Default roadmap events in case there are no announcements yet
  const defaultEvents = [
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

  useEffect(() => {
    const fetchAnnouncementsForTimeline = async () => {
      try {
        const resp = await getPublicTimelines();
        const data = resp.data?.data || [];
        
        const formatDate = (dateStr) => {
          if (!dateStr) return "";
          return new Date(dateStr).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
        };

        // Map Announcements to Timeline Events
        const mappedEvents = data.map(ann => ({
          id: ann._id,
          date: (ann.start_date && ann.end_date)
            ? `${formatDate(ann.start_date)} - ${formatDate(ann.end_date)}`
            : ann.start_date || ann.end_date 
              ? formatDate(ann.start_date || ann.end_date)
              : "Upcoming",
          title: ann.title,
          description: ann.description,
          status: "upcoming"
        }));

        // If data returns successfully, we still allow an empty timeline
        // unless you strictly want defaults when empty. Typically defaults
        // are good for first-time launch before backend population.
        if (mappedEvents.length > 0) {
          setEvents(mappedEvents);
        } else {
          setEvents(defaultEvents);
        }
      } catch (err) {
        console.error("Failed to load announcements for timeline:", err);
        setEvents(defaultEvents);
      } finally {
        setLoading(false);
      }
    };
    fetchAnnouncementsForTimeline();
  }, []);

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
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px', color: '#e8f5e8' }}>
                Loading timeline events...
              </div>
            ) : (
              <div className={styles.timelineWrapper}>
                {events.map((event, index) => (
                  <div key={event.id || index} className={styles.timelineItem}>
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
            )}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className={styles.cta}>
          <div className={styles.container}>
            <h2>Ready to make your mark?</h2>
            <p>Don't miss the registration deadline for Season 4.</p>
            <button className={styles.applyBtn}><a href="/audition">Start Your Journey</a></button>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default Timeline;