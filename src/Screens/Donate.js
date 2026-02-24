import React, { useState, useEffect } from 'react';
import styles from '../CSS-MODULES/Donate.module.css';
import Navbar from '../COMPONENTS/Navbar';
import Footer from '../COMPONENTS/Footer';
import paystack from "../assets/paystack.png";
import { planApi } from '../services/planApi';
import { paymentApi } from '../services/paymentApi';

const Donate = () => {
  const [formData, setFormData] = useState({
    first_name: '',
    last_name: '',
    email: '',
    amount: '',
    phone: '',
    donation_plan_id: ''
  });
  const [donationTiers, setDonationTiers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchDonationTiers = async () => {
      try {
        const response = await planApi.getAll('donation');
        setDonationTiers(response.data.data);
      } catch (err) {
        console.error('Failed to fetch donation tiers:', err);
      }
    };
    fetchDonationTiers();
  }, []);

  const handleDonateClick = (tier) => {
    setFormData({ 
      ...formData, 
      amount: tier.amount.toString(),
      donation_plan_id: tier._id
    });
    document.getElementById('donate-form').scrollIntoView({ behavior: 'smooth' });
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        phone: formData.phone,
        amount: formData.amount
      };
      
      if (formData.donation_plan_id) {
        payload.donation_plan_id = formData.donation_plan_id;
      }

      const response = await paymentApi.donations.initialize(payload);
      window.location.href = response.data.authorization_url;
    } catch (err) {
      setError(err.message || 'Failed to initialize payment');
    } finally {
      setLoading(false);
    }
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
              <div className={styles.icon}>🧑🎤</div>
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
            {donationTiers.map((tier) => (
              <div key={tier._id} className={styles.tierCard}>
                <span className={styles.tierIcon}>🎁</span>
                <h3>{tier.title}</h3>
                <div className={styles.tierPrice}>₦{tier.amount.toLocaleString()}</div>
                <p>{tier.description}</p>
                <button 
                  className={styles.cardDonateBtn} 
                  onClick={() => handleDonateClick(tier)}
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
              
              <form className={styles.form} onSubmit={handleSubmit}>
                {error && <div style={{background: '#fee', color: '#c33', padding: '12px', borderRadius: '8px', marginBottom: '15px', fontSize: '14px'}}>{error}</div>}
                
                <div className={styles.inputGroup}>
                  <label>First Name</label>
                  <input 
                    type="text" 
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleInputChange}
                    placeholder="First Name" 
                    required 
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Last Name</label>
                  <input 
                    type="text" 
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleInputChange}
                    placeholder="Last Name" 
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
                    type="tel" 
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="09012345678" 
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

                <button type="submit" className={styles.donateBtn} disabled={loading}>
                  {loading ? 'PROCESSING...' : 'PROCEED TO PAYSTACK'}
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
        <p>Help us discover and develop Nigeria's next stars.</p>
        <button className={styles.contactBtn}>CONTACT OUR TEAM</button>
      </footer>
    </div>
    <Footer />
    </>
  );
};

export default Donate;
