import React, { useState } from 'react';
import styles from '../CSS-MODULES/Contact.module.css';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    email: '',
    message: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form Submitted:", formData);
    // Add your backend or email service logic here
    alert("Thank you! Our support team will contact you shortly.");
  };

  return (
    <section className={styles.contactSection} id="contact">
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.eyebrow}>Need Help?</span>
          <h2>Contact Our Audition Support Team</h2>
          <p>
            Have questions about registration, audition locations, ticket plans, or international applications? 
            Our support team is ready to guide you every step of the way.
          </p>
        </div>

        <div className={styles.flexWrapper}>
          {/* Info Side */}
          <div className={styles.contactInfo}>
            <div className={styles.infoGroup}>
              <h3>Audition Support (Nigeria & USA)</h3>
              <p>📞 +234 706 245 725</p>
              <p>📞 +234 913 314 1647</p>
              <p>🇺🇸 +1 919 624 2265 (USA)</p>
            </div>

            <div className={styles.infoGroup}>
              <h3>Email Support</h3>
              <p>✉️ Info@naijatalentshow.com</p>
            </div>

            <div className={styles.infoGroup}>
              <h3>Office Locations</h3>
              <p>📍 No 19A Utang Street, Off Barracks Road, Uyo</p>
              <p>📍 18 Akpan Etuk Street Off Nwaniba Road, Uyo</p>
            </div>
          </div>

          {/* Form Side */}
          <div className={styles.formWrapper}>
            <h3>Send us a message</h3>
            <form onSubmit={handleSubmit} className={styles.contactForm}>
              <div className={styles.inputGroup}>
                <label>Name</label>
                <input type="text" name="name" required onChange={handleChange} />
              </div>

              <div className={styles.inputRow}>
                <div className={styles.inputGroup}>
                  <label>Phone</label>
                  <input type="tel" name="phone" required onChange={handleChange} />
                </div>
                <div className={styles.inputGroup}>
                  <label>Email</label>
                  <input type="email" name="email" required onChange={handleChange} />
                </div>
              </div>

              <div className={styles.inputGroup}>
                <label>Message</label>
                <textarea name="message" rows="5" required onChange={handleChange}></textarea>
              </div>

              <button type="submit" className={styles.submitBtn}>SEND MESSAGE</button>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Contact;