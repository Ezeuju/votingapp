import React from 'react';
import styles from '../CSS-MODULES/Sponsor.module.css';
import Navbar from '../COMPONENTS/Navbar';
import Footer from "../COMPONENTS/Footer"

const Sponsor = () => {
  const packages = [
    { tier: "Bronze Partner", includes: "Logo placement, event passes, social mentions" },
    { tier: "Silver Sponsor", includes: "VIP booth, media shout-outs, co-branded merchandise" },
    { tier: "Gold Sponsor", includes: "Full brand integration, branding zones, speaking opportunities" },
    { tier: "Platinum Partner", includes: "Naming rights (segments), press coverage, national promotion" }
  ];

  return (
    <>
    <Navbar />
    <div className={styles.sponsorPage}>
      {/* HERO SECTION */}
      <header className={styles.hero}>
        <div className={styles.container}>
          <span className={styles.badge}>🤝 Partner with Naija Talent Show 2026</span>
          <h1>Empower the <span className={styles.goldText}>Future of Talent</span></h1>
          <p>Naija Talent Show 2026 is a nationwide movement that uplifts, inspires, and connects. Partner with us to make a real impact.</p>
          <div className={styles.heroBtns}>
            <a href="#apply" className={styles.primaryBtn}>Apply to Sponsor</a>
            <button className={styles.secondaryBtn}><a href="/contact">Contact Us</a></button>
          </div>
        </div>
      </header>

      {/* WHY SPONSOR SECTION */}
      <section className={styles.whySection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🎯 Why Sponsor Us?</h2>
          <div className={styles.grid}>
            <div className={styles.card}>
              <h4>Massive Exposure</h4>
              <p>Showcase your brand to thousands live and millions online.</p>
            </div>
            <div className={styles.card}>
              <h4>Targeted Visibility</h4>
              <p>Reach Nigeria's vibrant youth and creative economy.</p>
            </div>
            <div className={styles.card}>
              <h4>Brand Alignment</h4>
              <p>Connect with innovation, empowerment, and development.</p>
            </div>
            <div className={styles.card}>
              <h4>Flexible Packages</h4>
              <p>Bronze to Platinum tiers designed to fit your brand goals.</p>
            </div>
          </div>
        </div>
      </section>

      {/* SPONSORSHIP OPPORTUNITIES TABLE */}
      <section className={styles.packageSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🧩 Sponsorship Opportunities</h2>
          <div className={styles.tableWrapper}>
            <table className={styles.sponsorTable}>
              <thead>
                <tr>
                  <th>Package</th>
                  <th>Includes</th>
                </tr>
              </thead>
              <tbody>
                {packages.map((pkg, index) => (
                  <tr key={index}>
                    <td className={styles.tierName}>{pkg.tier}</td>
                    <td>{pkg.includes}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* APPLICATION FORM */}
      <section className={styles.formSection} id="apply">
        <div className={styles.container}>
          <div className={styles.formWrapper}>
            <h2>📥 Become a Sponsor – Apply Now</h2>
            <form className={styles.sponsorForm}>
              <div className={styles.inputRow}>
                <input type="text" placeholder="Organization/Brand Name" required />
                <input type="text" placeholder="Contact Person" required />
              </div>
              <div className={styles.inputRow}>
                <input type="email" placeholder="Email Address" required />
                <input type="tel" placeholder="Phone Number" required />
              </div>
              <div className={styles.inputRow}>
                <select required>
                  <option value="">Sponsorship Tier Interested In</option>
                  <option>Platinum Partner</option>
                  <option>Gold Sponsor</option>
                  <option>Silver Sponsor</option>
                  <option>Bronze Partner</option>
                </select>
                <input type="url" placeholder="Company Website / Social Link" />
              </div>
              <textarea placeholder="Brief Message / Partnership Goal" rows="4"></textarea>
              <div className={styles.fileInput}>
                <label>Upload Logo or Proposal (Optional)</label>
                <input type="file" />
              </div>
              <button type="submit" className={styles.submitBtn}>Submit Application</button>
              <p className={styles.disclaimer}>🔒 All submissions are confidential.</p>
            </form>
          </div>
        </div>
      </section>

      {/* CONTACT INFO */}
      <footer className={styles.contactFooter}>
        <div className={styles.container}>
          <h3>📩 Contact Us Directly</h3>
          <div className={styles.footerGrid}>
            <div>
              <h4>Email</h4>
              <p>info@naijatalentshow.com</p>
            </div>
            <div>
              <h4>Nigeria</h4>
              <p>+234 706 076 5161</p>
            </div>
            <div>
              <h4>USA</h4>
              <p>+1 919 624 2265</p>
            </div>
          </div>
          <p className={styles.slogan}>🌟 Let's Build the Future Together.</p>
        </div>
      </footer>
    </div>
    <Footer />
    </>
  );
};

export default Sponsor;