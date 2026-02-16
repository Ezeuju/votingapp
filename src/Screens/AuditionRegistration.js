import React, { useState } from 'react';
import styles from '../CSS-MODULES/Auditiony.module.css';
import Navbar from '../COMPONENTS/Navbar';
import Footer from '../COMPONENTS/Footer';


const AuditionRegistration = () => {
  const [step, setStep] = useState(1); // 1: Info, 2: Form/Payment
  const [agreed, setAgreed] = useState(false);

  return (
    <>
    <Navbar />
    <section className={styles.regPage}>
      <div className={styles.container}>
        
        {/* STEP 1: RULES & PROCESS GUIDE */}
        {step === 1 && (
          <div className={styles.guideBox}>
            <header className={styles.header}>
              <h2>Before You Register</h2>
              <p>Read This First: Rules & Audition Guide</p>
            </header>

            <div className={styles.infoGrid}>
              <div className={styles.infoCard}>
                <h3>🧾 The Audition Process</h3>
                <ol>
                  <li>Complete Registration Online</li>
                  <li>Prepare & Practice Your Act</li>
                  <li>Arrive 30 Minutes Early</li>
                  <li>Perform at Assigned Venue</li>
                  <li>Check Shortlist Updates</li>
                </ol>
              </div>

              <div className={styles.infoCard}>
                <h3>🎤 What to Expect</h3>
                <p><strong>Judges:</strong> 4 Panel Judges & 1 Chief Judge.</p>
                <p><strong>Criteria:</strong> Appropriateness, Stage Presence, Level of Talent, Overall Presentation.</p>
                <p><strong>Safety:</strong> No fire, weapons, or messy substances (glitter/water).</p>
              </div>
            </div>

            <div className={styles.rulesWarning}>
              <h3>⚠️ Important Rules</h3>
              <ul>
                <li>Maximum performance time: <strong>4 minutes</strong>.</li>
                <li>Registration fees are <strong>non-refundable</strong>.</li>
                <li>Singing tracks must be instrumental (no lead vocals).</li>
                <li>Full costume is required for auditions.</li>
              </ul>
            </div>

            <div className={styles.consentSection}>
              <label className={styles.checkboxLabel}>
                <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} />
                I have read and agree to follow the NTS Laws and Guidelines.
              </label>
              <button 
                className={styles.nextBtn} 
                disabled={!agreed} 
                onClick={() => setStep(2)}
              >
                Proceed to Registration
              </button>
            </div>
          </div>
        )}

        {/* STEP 2: REGISTRATION FORM & CHECKOUT */}
        {step === 2 && (
          <div className={styles.formContainer}>
            <button className={styles.backLink} onClick={() => setStep(1)}>← Back to Rules</button>
            
            <div className={styles.checkoutFlex}>
              <form className={styles.regForm}>
                <h3>Applicant Details</h3>
                <div className={styles.inputRow}>
                  <div className={styles.field}>
                    <label>First Name *</label>
                    <input type="text" placeholder="First Name" required />
                  </div>
                  <div className={styles.field}>
                    <label>Last Name *</label>
                    <input type="text" placeholder="Last Name" required />
                  </div>
                </div>

                <div className={styles.field}>
                  <label>Country / Region *</label>
                  <select required>
                    <option value="NG">Nigeria</option>
                    <option value="US">United States (US)</option>
                    <option value="UK">United Kingdom (UK)</option>
                    {/* Map other countries here */}
                  </select>
                </div>

                <div className={styles.field}>
                  <label>Street Address *</label>
                  <input type="text" placeholder="House number and street name" required />
                  <input type="text" placeholder="Apartment, suite, unit, etc. (optional)" style={{marginTop: '10px'}} />
                </div>

                <div className={styles.inputRow}>
                  <div className={styles.field}>
                    <label>Town / City *</label>
                    <input type="text" required />
                  </div>
                  <div className={styles.field}>
                    <label>State *</label>
                    <select required>
                      <option value="">Select an option...</option>
                      <option value="Lagos">Lagos</option>
                      <option value="Abuja">Abuja</option>
                      <option value="Akwa Ibom">Akwa Ibom</option>
                      {/* Map other states here */}
                    </select>
                  </div>
                </div>

                <div className={styles.field}>
                  <label>Phone (Optional)</label>
                  <input type="tel" />
                </div>
              </form>

              {/* Order Summary */}
              <div className={styles.orderSummary}>
                <h3>Your Registration</h3>
                <div className={styles.summaryTable}>
                  <div className={styles.summaryRow}>
                    <span>NTS Season 4 Form × 1</span>
                    <span>₦10,000.00</span>
                  </div>
                  <div className={`${styles.summaryRow} ${styles.totalRow}`}>
                    <span>Total</span>
                    <span>₦10,000.00</span>
                  </div>
                </div>

                <div className={styles.paymentNotice}>
                  <p>Secure payment via Paystack/Flutterwave.</p>
                </div>

                <button className={styles.confirmBtn}>Confirm ₦10,000.00</button>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
    <Footer />
    </>
  );
};

export default AuditionRegistration;