import React, { useState, useEffect } from 'react';
import styles from '../CSS-MODULES/Sponsor.module.css';
import Navbar from '../COMPONENTS/Navbar';
import Footer from "../COMPONENTS/Footer"
import { partnerApi } from '../services/partnerApi';
import { uploadFile } from '../services/fileApi';

const Sponsor = () => {
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  const [logoFile, setLogoFile] = useState(null);
  const [logoPreview, setLogoPreview] = useState('');
  const [formData, setFormData] = useState({
    organization_name: '',
    contact_person: '',
    email: '',
    phone_number: '',
    partnership_plan_id: '',
    company_website: '',
    partnership_goal: '',
    logo_url: ''
  });

  useEffect(() => {
    fetchPlans();
  }, []);

  const fetchPlans = async () => {
    try {
      const response = await partnerApi.getPlans();
      setPlans(response.data?.data || []);
    } catch (error) {
      console.error('Error fetching plans:', error);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setUploading(true);
      try {
        const uploadResponse = await uploadFile(file);
        const logoUrl = uploadResponse.data.url;
        setFormData({ ...formData, logo_url: logoUrl });
        setLogoFile(file);
        const reader = new FileReader();
        reader.onload = (event) => setLogoPreview(event.target.result);
        reader.readAsDataURL(file);
      } catch (error) {
        alert('Failed to upload logo: ' + (error.message || 'Unknown error'));
      } finally {
        setUploading(false);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setSuccessMessage('');
    try {
      await partnerApi.submitUser(formData);
      setSuccessMessage('✅ Partner application submitted successfully! We will review your application and get back to you soon.');
      setFormData({
        organization_name: '',
        contact_person: '',
        email: '',
        phone_number: '',
        partnership_plan_id: '',
        company_website: '',
        partnership_goal: '',
        logo_url: ''
      });
      setLogoFile(null);
      setLogoPreview('');
      setTimeout(() => setSuccessMessage(''), 8000);
    } catch (error) {
      alert(error.message || 'Failed to submit application');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Navbar />
    <div className={styles.sponsorPage}>
     
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
                {plans.map((plan) => (
                  <tr key={plan._id}>
                    <td className={styles.tierName}>{plan.title}</td>
                    <td>{plan.description}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

   
      <section className={styles.formSection} id="apply">
        <div className={styles.container}>
          <div className={styles.formWrapper}>
            <h2>📥 Become a Sponsor – Apply Now</h2>
            {successMessage && (
              <div style={{
                background: 'rgba(74, 222, 128, 0.15)',
                border: '1px solid rgba(74, 222, 128, 0.3)',
                borderRadius: '8px',
                padding: '16px',
                marginBottom: '20px',
                color: '#4ade80',
                fontSize: '14px',
                fontWeight: '500'
              }}>
                {successMessage}
              </div>
            )}
            <form className={styles.sponsorForm} onSubmit={handleSubmit}>
              <div className={styles.inputRow}>
                <input type="text" name="organization_name" placeholder="Organization/Brand Name" value={formData.organization_name} onChange={handleChange} required />
                <input type="text" name="contact_person" placeholder="Contact Person" value={formData.contact_person} onChange={handleChange} required />
              </div>
              <div className={styles.inputRow}>
                <input type="email" name="email" placeholder="Email Address" value={formData.email} onChange={handleChange} required />
                <input type="tel" name="phone_number" placeholder="Phone Number" value={formData.phone_number} onChange={handleChange} required />
              </div>
              <div className={styles.inputRow}>
                <select name="partnership_plan_id" value={formData.partnership_plan_id} onChange={handleChange} required>
                  <option value="">Sponsorship Tier Interested In</option>
                  {plans.map(plan => (
                    <option key={plan._id} value={plan._id}>{plan.title}</option>
                  ))}
                </select>
                <input type="url" name="company_website" placeholder="Company Website / Social Link" value={formData.company_website} onChange={handleChange} />
              </div>
              <textarea name="partnership_goal" placeholder="Brief Message / Partnership Goal" rows="4" value={formData.partnership_goal} onChange={handleChange}></textarea>
              <div className={styles.fileInput}>
                <label>Upload Logo or Proposal (Optional)</label>
                {logoPreview ? (
                  <div style={{
                    position: 'relative',
                    width: '100%',
                    marginTop: '10px',
                    borderRadius: '8px',
                    overflow: 'hidden',
                    border: '1px solid rgba(0, 135, 81, 0.3)'
                  }}>
                    <img src={logoPreview} alt="Logo preview" style={{ width: '100%', maxHeight: '200px', objectFit: 'cover' }} />
                    <button
                      type="button"
                      onClick={() => {
                        setLogoFile(null);
                        setLogoPreview('');
                      }}
                      style={{
                        position: 'absolute',
                        top: '8px',
                        right: '8px',
                        background: 'rgba(0, 0, 0, 0.7)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '50%',
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                        fontSize: '18px'
                      }}
                    >
                      ✕
                    </button>
                  </div>
                ) : (
                  <input type="file" accept="image/*" onChange={handleLogoChange} />
                )}
              </div>
              <button type="submit" className={styles.submitBtn} disabled={loading || uploading}>
                {uploading ? 'Uploading Logo...' : loading ? 'Submitting...' : 'Submit Application'}
              </button>
              <p className={styles.disclaimer}>🔒 All submissions are confidential.</p>
            </form>
          </div>
        </div>
      </section>

    
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