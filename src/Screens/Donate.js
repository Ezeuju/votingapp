import React, { useState } from 'react';
import styles from '../CSS-MODULES/Donate.module.css';
import Navbar from '../COMPONENTS/Navbar';
import Footer from '../COMPONENTS/Footer';
import paystack from   "../assets/paystack.png"

const Donate = () => {
  // FIXED: Consolidated state to match your inputs
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    amount: '',
    phone: "",
    isMonthly: false
  });

  const donationTiers = [
    { title: "Friend of Talent", price: "₦2,000", desc: "Helps one performer reach auditions", icon: "🧑‍🎤" },
    { title: "Bronze Donor", price: "₦25,000", desc: "Supports logistics for 1 live event", icon: "📸" },
    { title: "Gold Donor", price: "₦100,000", desc: "Funds training, transport, or equipment", icon: "📍" },
    { title: "Corporate Sponsor", price: "₦500,000", desc: "Major show sponsorship tier", icon: "🏢" }
  ];

  // FIXED: Added the missing handler function
  const handleDonateClick = (priceString) => {
    // Strip non-numeric characters to get just the number
    const numericPrice = priceString.replace(/[^0-9]/g, '');
    setFormData({ ...formData, amount: numericPrice });
    
    // Smooth scroll to the form
    document.getElementById('donate-form').scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
  };

  return (
    <>
    <Navbar />
    <div className={styles.donatePage}>
      {/* 1. HERO SECTION */}
      <header className={styles.hero}>
        <div className={styles.container}>
          <span className={styles.badge}>Empower Talented Nigerians</span>
          <h1>Support the Next Generation of <span className={styles.greenText}>Superstars</span></h1>
          <p>Your donation provides a life-changing platform for young talents across Nigeria.</p>
          <div className={styles.heroBtns}>
            <a href="#donate-form" className={styles.primaryBtn}>DONATE NOW</a>
          </div>
        </div>
      </header>

      {/* 2. IMPACT SECTION */}
      <section className={styles.impactSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🎯 Why Donate?</h2>
          <div className={styles.impactGrid}>
            <div className={styles.impactCard}>
              <div className={styles.icon}>🧑‍🎤</div>
              <h4>Give youth a chance</h4>
              <p>Help young talents get discovered and showcase their gifts to the world.</p>
            </div>
            <div className={styles.impactCard}>
              <div className={styles.icon}>📸</div>
              <h4>Create life-changing content</h4>
              <p>Fund media production that elevates Nigerian talent globally.</p>
            </div>
            <div className={styles.impactCard}>
              <div className={styles.icon}>📍</div>
              <h4>Reach underserved communities</h4>
              <p>Bring opportunities to talented youth across all regions of Nigeria.</p>
            </div>
          </div>
        </div>
      </section>

      {/* 3. DONATION OPTIONS */}
      <section className={styles.tierSection}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>🎁 Choose a Donation Tier</h2>
          <div className={styles.tierGrid}>
            {donationTiers.map((tier, index) => (
              <div key={index} className={styles.tierCard}>
                <span className={styles.tierIcon}>{tier.icon}</span>
                <h3>{tier.title}</h3>
                <div className={styles.tierPrice}>{tier.price}</div>
                <p>{tier.desc}</p>
                <button 
                  className={styles.cardDonateBtn} 
                  onClick={() => handleDonateClick(tier.price)}
                >
                  DONATE NOW
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. SECURE PAYSTACK FORM */}
      <section className={styles.formSection} id="donate-form">
        <div className={styles.container}>
          <div className={styles.dualGrid}>
            
            <div className={styles.formCard}>
              <h3>📥 Secure Paystack Donation</h3>
              <p className={styles.paystackHint}>Enter your details below to proceed to the secure Paystack gateway.</p>
              
              <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
                <div className={styles.inputGroup}>
                  <label>Full Name</label>
                  <input 
                    type="text" 
                    name="fullName"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    placeholder="Full Name" 
                    required 
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Email Address</label>
                  <input 
                    type="email" 
                    name="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    placeholder="email@example.com" 
                    required 
                  />
                </div>
                <div className={styles.inputGroup}>
                  <label>Phone Number</label>
                  <input 
                    type="phone" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="07020323290" 
                    required 
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Amount (₦)</label>
                  <div className={styles.inputWithSymbol}>
                    <input 
                      type="number" 
                      name="amount"
                      value={formData.amount} 
                      onChange={handleInputChange} 
                      placeholder="Enter Amount" 
                      required 
                    />
                  </div>
                </div>

                <div className={styles.paystackLogoBox}>
                  <span>Payment Gateway:</span>
                  <img src={paystack} alt="Paystack" className={styles.psLogo} />
                </div>

                <label className={styles.checkRow}>
                  <input 
                    type="checkbox" 
                    name="isMonthly"
                    checked={formData.isMonthly}
                    onChange={handleInputChange}
                  /> Make this a monthly donation
                </label>

                <button type="submit" className={styles.donateBtn}>
                  PROCEED TO PAYSTACK
                </button>
              </form>
            </div>

            <div className={styles.bankCard}>
              <h3>🧾 Bank Transfer</h3>
              <div className={styles.bankDetails}>
                <p><strong>Bank:</strong> [Insert Bank Name]</p>
                <p><strong>Account Name:</strong> Naija Talent Show</p>
                <p><strong>Account Number:</strong> [Insert Number]</p>
              </div>
              <p className={styles.bankInfo}>📧 Email proof to <strong>info@naijatalentshow.com</strong></p>
              
              <div className={styles.perksBox}>
                <h4>🤝 What You Get</h4>
                <ul>
                  <li>Personalized thank-you certificate</li>
                  <li>Name listed on website (optional)</li>
                  <li>Monthly donor impact reports</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className={styles.donateFooter}>
        <h3>❤️ Every naira makes a difference</h3>
        <p>Help us discover and develop Nigeria’s next stars.</p>
        <button className={styles.contactBtn}>CONTACT OUR TEAM</button>
      </footer>
    </div>
    <Footer />
    </>
  );
};

export default Donate;