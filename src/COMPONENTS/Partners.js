import React, { useState, useEffect } from 'react';
import styles from '../CSS-MODULES/Partners.module.css';
import { getPublicPartners } from '../services/api';

const Partners = () => {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await getPublicPartners();
        // The interceptor returns response.data directly.
        // The payload is { status: 200, data: { metadata: {}, data: [...] } }
        let partnersArray = [];
        if (Array.isArray(response?.data?.data)) {
          partnersArray = response.data.data;
        } else if (Array.isArray(response?.data)) {
          partnersArray = response.data;
        } else if (Array.isArray(response)) {
          partnersArray = response;
        }
        
        if (partnersArray.length > 0) {
          setLogos(partnersArray);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };
    
    // Initial fetch
    fetchPartners();

    // Poll at the same time and interval as Live Updates (15 seconds)
    const interval = setInterval(() => {
      fetchPartners();
    }, 15000);

    return () => clearInterval(interval);
  }, []);

  // We triple the array to ensure there's always content visible during the animation
  const infiniteLogos = logos.length > 0 ? [...logos, ...logos, ...logos] : [];

  // Each logo box is 300px wide; compute dynamic widths
  const LOGO_WIDTH = 300;
  const trackWidth = infiniteLogos.length * LOGO_WIDTH || 0;
  const scrollDistance = logos.length * LOGO_WIDTH || 0;

  return (
    <section className={styles.partnersSection} id="partner">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Global Reach, Local Touch</span>
          <h2>Our Proud <span className={styles.greenText}>Partners & Sponsors</span></h2>
        </div>

        {loading ? (
           <p style={{textAlign: "center", color: "#666"}}>Loading partners...</p>
        ) : logos.length > 0 ? (
          <div className={styles.slider}>
            <div 
              className={styles.slideTrack}
              style={{
                width: `${trackWidth}px`,
                '--scroll-distance': `-${scrollDistance}px`,
              }}
            >
              {infiniteLogos.map((logo, index) => (
                <div key={index} className={styles.logoBox}>
                  <div className={styles.imgWrapper}>
                    <img src={logo.logo_url} alt={logo.organization_name} title={logo.organization_name} />
                  </div>
                  <div className={styles.orgName}>{logo.organization_name}</div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <p style={{textAlign: "center", color: "#666"}}>No partners to display.</p>
        )}
      </div>
    </section>
  );
};

export default Partners;