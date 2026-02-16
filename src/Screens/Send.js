import React from 'react';
import styles from '../CSS-MODULES/Send.module.css';
import Navbar from '../COMPONENTS/Navbar';
import Footer from '../COMPONENTS/Footer';

const Send = () => {
  return (
    <>
    <Navbar />
    <div className={styles.contactPage}>
      {/* 1. TOP HERO / HEADER */}
      <header className={styles.contactHero}>
        <div className={styles.container}>
          <h1>Get in <span className={styles.highlight}>Touch</span></h1>
          <p>Have questions about auditions, sponsorship, or general inquiries? Our team is here to help you.</p>
        </div>
      </header>

      <section className={styles.mainContent}>
        <div className={styles.container}>
          <div className={styles.contentGrid}>
            
            {/* 2. CONTACT INFO & MAPS */}
            <div className={styles.infoColumn}>
              <div className={styles.infoCard}>
                <h3>📍 Global Offices</h3>
                
                <div className={styles.location}>
                  <h4>Nigeria Office</h4>
                  <p>Lagos, Nigeria</p>
                  <p><strong>Hotlines:</strong> +234 706 076 5161, +234 901 750 5492</p>
                  {/* Embedded Google Map for Nigeria Context */}
                  <div className={styles.mapContainer}>
                    <iframe 
                      title="Nigeria Office Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d1014167.2435534164!2d3.0322237279165755!3d6.503405600000006!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103b8b1031a8d7c5%3A0x775f6201a0e0b5c0!2sLagos%2C%20Nigeria!5e0!3m2!1sen!2sng!4v1715800000000!5m2!1sen!2sng" 
                      width="100%" height="200" style={{border:0}} allowFullScreen="" loading="lazy">
                    </iframe>
                  </div>
                </div>

                <div className={styles.location}>
                  <h4>USA Office</h4>
                  <p>North Carolina, USA</p>
                  <p><strong>Hotline:</strong> +1 919 624 2265</p>
                  <div className={styles.mapContainer}>
                    <iframe 
                      title="USA Office Map"
                      src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3235.847525283401!2d-78.63817852355532!3d35.77958997255743!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89ac5a2f9f551699%3A0xf693836691492c68!2sRaleigh%2C%20NC%2C%20USA!5e0!3m2!1sen!2sus!4v1715800000000!5m2!1sen!2sus" 
                      width="100%" height="200" style={{border:0}} allowFullScreen="" loading="lazy">
                    </iframe>
                  </div>
                </div>

                <div className={styles.emailBlock}>
                  <h4>📧 Email Support</h4>
                  <p>info@naijatalentshow.com</p>
                </div>
              </div>
            </div>

            {/* 3. CONTACT FORM */}
            <div className={styles.formColumn}>
              <div className={styles.formWrapper}>
                <h2>Send us a Message</h2>
                <form className={styles.form}>
                  <div className={styles.inputGroup}>
                    <label>Your Name</label>
                    <input type="text" placeholder="Full Name" required />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Email Address</label>
                    <input type="email" placeholder="email@example.com" required />
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Subject</label>
                    <select>
                      <option>General Inquiry</option>
                      <option>Sponsorship</option>
                      <option>Audition Question</option>
                      <option>Media/Press</option>
                    </select>
                  </div>
                  <div className={styles.inputGroup}>
                    <label>Message</label>
                    <textarea rows="6" placeholder="How can we help you?"></textarea>
                  </div>
                  <button type="submit" className={styles.sendBtn}>Send Message</button>
                  <p className={styles.disclaimer}>🔒 All submissions are confidential.</p>
                </form>
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default Send;