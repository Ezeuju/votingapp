import React, { useState, useEffect } from 'react';
import styles from '../CSS-MODULES/Partners.module.css';
import { partnerApi } from '../services/partnerApi';

const Partners = () => {
  const [logos, setLogos] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPartners = async () => {
      try {
        const response = await partnerApi.getAll({ status: 'approved' });
        if (response?.data && response.data.length > 0) {
          setLogos(response.data);
        }
      } catch (error) {
        console.error('Error fetching partners:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPartners();
  }, []);

  // We triple the array to ensure there's always content visible during the animation
  const infiniteLogos = logos.length > 0 ? [...logos, ...logos, ...logos] : [];

  return (
    <section className={styles.partnersSection} id="partner">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Global Reach, Local Touch</span>
          <h2>Our Proud <span className={styles.greenText}>Partners & Sponsors</span></h2>
        </div>

        <div className={styles.slider}>
          <div className={styles.slideTrack}>
            {infiniteLogos.map((logo, index) => (
              <div key={index} className={styles.logoBox}>
                <img src={logo.logo_url} alt={logo.organization_name} title={logo.organization_name} />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Partners;