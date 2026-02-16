import React from 'react';
import styles from '../CSS-MODULES/Privacy.module.css';
import Navbar from '../COMPONENTS/Navbar';
import Footer from '../COMPONENTS/Footer';  

const Privacy = () => {
  const sections = [
    { id: "collection", title: "Information We Collect", content: "We collect personal information you provide directly to us, including your name, email, phone number, physical address, and audition materials (videos/photos). For contestants under 18, we collect parental/guardian consent data." },
    { id: "usage", title: "How We Use Your Data", content: "Your data is used to process audition registrations, manage ticket sales, communicate show updates, and promote the Naija Talent Show on global media platforms." },
    { id: "sharing", title: "Sharing of Information", content: "We do not sell your personal data. We may share information with our partners (NTS Ltd Nigeria & NTR Inc USA), judges, and service providers (like Paystack) to facilitate the competition." },
    { id: "rights", title: "Your Rights & Choices", content: "You have the right to access, update, or delete your personal information. You can opt-out of marketing communications at any time by contacting our support team." },
    { id: "security", title: "Data Security", content: "We implement industry-standard security measures to protect your data. Payment information is processed through secure, encrypted gateways (PCI-DSS compliant)." }
  ];

  return (
    <>
    <Navbar />
    <div className={styles.privacyPage}>
      <header className={styles.header}>
        <div className={styles.container}>
          <h1>Privacy <span className={styles.greenText}>Policy</span></h1>
          <p>Last Updated: February 2026</p>
        </div>
      </header>

      <section className={styles.contentSection}>
        <div className={styles.container}>
          <div className={styles.flexLayout}>
            
            {/* STICKY SIDEBAR */}
            <aside className={styles.sidebar}>
              <ul>
                {sections.map(sec => (
                  <li key={sec.id}><a href={`#${sec.id}`}>{sec.title}</a></li>
                ))}
              </ul>
            </aside>

            {/* MAIN CONTENT */}
            <main className={styles.mainBody}>
              <p className={styles.intro}>
                At <strong>Naija Talent Show</strong>, we are committed to protecting your privacy. 
                This policy explains how we handle your data across our platforms in Nigeria and the USA.
              </p>

              {sections.map(sec => (
                <div key={sec.id} id={sec.id} className={styles.block}>
                  <h2>{sec.title}</h2>
                  <p>{sec.content}</p>
                </div>
              ))}

              <div className={styles.contactBlock}>
                <h3>Questions?</h3>
                <p>If you have any questions about this Privacy Policy, please email us at <strong>privacy@naijatalentshow.com</strong>.</p>
              </div>
            </main>

          </div>
        </div>
      </section>
    </div>
    <Footer />
    </>
  );
};

export default Privacy;