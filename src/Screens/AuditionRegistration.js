// import React, { useState, useEffect } from 'react';
// import { useNavigate, useSearchParams } from 'react-router-dom';
// import styles from '../CSS-MODULES/Auditiony.module.css';
// import Navbar from '../COMPONENTS/Navbar';
// import Footer from '../COMPONENTS/Footer';
// import { paymentApi } from '../services/paymentApi';
// import { planApi } from '../services/planApi';
// import { useToast } from '../COMPONENTS/Toast';


// const AFRICAN_COUNTRIES = [
//   { code: 'DZ', name: 'Algeria' },
//   { code: 'AO', name: 'Angola' },
//   { code: 'BJ', name: 'Benin' },
//   { code: 'BW', name: 'Botswana' },
//   { code: 'BF', name: 'Burkina Faso' },
//   { code: 'BI', name: 'Burundi' },
//   { code: 'CM', name: 'Cameroon' },
//   { code: 'CV', name: 'Cape Verde' },
//   { code: 'CF', name: 'Central African Republic' },
//   { code: 'TD', name: 'Chad' },
//   { code: 'KM', name: 'Comoros' },
//   { code: 'CG', name: 'Congo' },
//   { code: 'CD', name: 'Congo (DRC)' },
//   { code: 'CI', name: 'Côte d\'Ivoire' },
//   { code: 'DJ', name: 'Djibouti' },
//   { code: 'EG', name: 'Egypt' },
//   { code: 'GQ', name: 'Equatorial Guinea' },
//   { code: 'ER', name: 'Eritrea' },
//   { code: 'ET', name: 'Ethiopia' },
//   { code: 'GA', name: 'Gabon' },
//   { code: 'GM', name: 'Gambia' },
//   { code: 'GH', name: 'Ghana' },
//   { code: 'GN', name: 'Guinea' },
//   { code: 'GW', name: 'Guinea-Bissau' },
//   { code: 'KE', name: 'Kenya' },
//   { code: 'LS', name: 'Lesotho' },
//   { code: 'LR', name: 'Liberia' },
//   { code: 'LY', name: 'Libya' },
//   { code: 'MG', name: 'Madagascar' },
//   { code: 'MW', name: 'Malawi' },
//   { code: 'ML', name: 'Mali' },
//   { code: 'MR', name: 'Mauritania' },
//   { code: 'MU', name: 'Mauritius' },
//   { code: 'MA', name: 'Morocco' },
//   { code: 'MZ', name: 'Mozambique' },
//   { code: 'NA', name: 'Namibia' },
//   { code: 'NE', name: 'Niger' },
//   { code: 'NG', name: 'Nigeria' },
//   { code: 'RW', name: 'Rwanda' },
//   { code: 'ST', name: 'São Tomé and Príncipe' },
//   { code: 'SN', name: 'Senegal' },
//   { code: 'SC', name: 'Seychelles' },
//   { code: 'SL', name: 'Sierra Leone' },
//   { code: 'SO', name: 'Somalia' },
//   { code: 'ZA', name: 'South Africa' },
//   { code: 'SS', name: 'South Sudan' },
//   { code: 'SD', name: 'Sudan' },
//   { code: 'SZ', name: 'Eswatini' },
//   { code: 'TZ', name: 'Tanzania' },
//   { code: 'TG', name: 'Togo' },
//   { code: 'TN', name: 'Tunisia' },
//   { code: 'UG', name: 'Uganda' },
//   { code: 'ZM', name: 'Zambia' },
//   { code: 'ZW', name: 'Zimbabwe' }
// ];

// const AuditionRegistration = () => {
//   const navigate = useNavigate();
//   const [searchParams] = useSearchParams();
//   const { showToast } = useToast();
//   const [step, setStep] = useState(1);
//   const [agreed, setAgreed] = useState(false);
//   const [loading, setLoading] = useState(false);
//   const [plans, setPlans] = useState([]);
//   const [plansLoading, setPlansLoading] = useState(false);
//   const [plansError, setPlansError] = useState(null);
//   const [formData, setFormData] = useState({
//     first_name: '',
//     last_name: '',
//     email: '',
//     country: 'NG',
//     street_address: '',
//     apartment: '',
//     town: '',
//     state: '',
//     phone: '',
//     audition_plan_id: ''
//   });
//   const [showModal, setShowModal] = useState(false);
//   const [paymentStatus, setPaymentStatus] = useState(null);

//   useEffect(() => {
//     const reference = searchParams.get('reference');
//     const planId = searchParams.get('plan');
    
//     if (reference) {
//       verifyPayment(reference);
//     }
    
//     if (planId) {
//       setStep(2);
//     }
//   }, [searchParams]);

//   useEffect(() => {
//     const fetchPlans = async () => {
//       setPlansLoading(true);
//       setPlansError(null);
//       try {
//         const response = await planApi.getAll('audition');
//         const fetchedPlans = response?.data?.data || response?.data || [];
//         setPlans(fetchedPlans);
        
//         const planId = searchParams.get('plan');
//         if (planId) {
//           setFormData(prev => ({ ...prev, audition_plan_id: planId }));
//         } else if (fetchedPlans.length > 0) {
//           setFormData(prev => ({ ...prev, audition_plan_id: fetchedPlans[0]._id }));
//         }
//       } catch (err) {
//         setPlansError('Unable to load audition plans. Please refresh and try again.');
//         showToast('Unable to load audition plans. Please refresh and try again.', 'error');
//       } finally {
//         setPlansLoading(false);
//       }
//     };
//     fetchPlans();
//   }, [searchParams]);

//   const verifyPayment = async (reference) => {
//     setLoading(true);
//     try {
//       const response = await paymentApi.verify(reference);
//       const status = response.data.data?.status || response.data.status;
//       setPaymentStatus(status);
//       setShowModal(true);
//     } catch (error) {
//       setPaymentStatus('failed');
//       setShowModal(true);
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleInputChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setLoading(true);
//     try {
//       const payload = {
//         first_name: formData.first_name,
//         last_name: formData.last_name,
//         email: formData.email,
//         country: formData.country,
//         street_address: `${formData.street_address}${formData.apartment ? ', ' + formData.apartment : ''}`,
//         town: formData.town,
//         state: formData.state,
//         phone: formData.phone,
//         audition_plan_id: formData.audition_plan_id
//       };
//       const response = await paymentApi.initialize(payload);
//       console.log('Full response:', response);
//       const authUrl = response?.data?.data?.authorization_url || response?.data?.authorization_url;
//       if (authUrl) {
//         window.location.href = authUrl;
//       } else {
//         throw new Error('No authorization URL received');
//       }
//     } catch (error) {
//       console.log(error);
//       showToast(error.response?.data?.message || error.message || 'Payment initialization failed', 'error');
//     } finally {
//       setLoading(false);
//     }
//   };

//   if (loading) {
//     return (
//       <>
//         <Navbar />
//         <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
//           <div style={{ textAlign: 'center' }}>
//             <div style={{ fontSize: '48px', marginBottom: '20px' }}>⏳</div>
//             <h2>Processing...</h2>
//           </div>
//         </div>
//         <Footer />
//       </>
//     );
//   }

//   return (
//     <>
//       <Navbar />
//       <section className={styles.regPage}>
//         <div className={styles.container}>

//           {/* STEP 1: RULES & PROCESS GUIDE */}
//           {step === 1 && (
//             <div className={styles.guideBox}>
//               <header className={styles.header}>
//                 <h2>Before You Register</h2>
//                 <p>Read This First: Rules & Audition Guide</p>
//               </header>

//               <div className={styles.infoGrid}>
//                 <div className={styles.infoCard}>
//                   <h3>🧾 The Audition Process</h3>
//                   <ol>
//                     <li>Complete Registration Online</li>
//                     <li>Prepare & Practice Your Act</li>
//                     <li>Arrive 30 Minutes Early</li>
//                     <li>Perform at Assigned Venue</li>
//                     <li>Check Shortlist Updates</li>
//                   </ol>
//                 </div>

//                 <div className={styles.infoCard}>
//                   <h3>🎤 What to Expect</h3>
//                   <p><strong>Judges:</strong> 4 Panel Judges & 1 Chief Judge.</p>
//                   <p><strong>Criteria:</strong> Appropriateness, Stage Presence, Level of Talent, Overall Presentation.</p>
//                   <p><strong>Safety:</strong> No fire, weapons, or messy substances (glitter/water).</p>
//                 </div>
//               </div>

//               <div className={styles.rulesWarning}>
//                 <h3>⚠️ Important Rules</h3>
//                 <ul>
//                   <li>Maximum performance time: <strong>4 minutes</strong>.</li>
//                   <li>Registration fees are <strong>non-refundable</strong>.</li>
//                   <li>Singing tracks must be instrumental (no lead vocals).</li>
//                   <li>Full costume is required for auditions.</li>
//                 </ul>
//               </div>

//               <div className={styles.consentSection}>
//                 <label className={styles.checkboxLabel}>
//                   <input type="checkbox" checked={agreed} onChange={() => setAgreed(!agreed)} />
//                   I have read and agree to follow the NTS Laws and Guidelines.
//                 </label>
//                 <button
//                   className={styles.nextBtn}
//                   disabled={!agreed}
//                   onClick={() => setStep(2)}
//                 >
//                   Proceed to Registration
//                 </button>
//               </div>
//             </div>
//           )}

//           {/* STEP 2: REGISTRATION FORM & CHECKOUT */}
//           {step === 2 && (
//             <div className={styles.formContainer}>
//               <button className={styles.backLink} onClick={() => setStep(1)}>← Back to Rules</button>

//               <div className={styles.checkoutFlex}>

//                 {/* LEFT: Form fields */}
//                 <form id="audition-form" className={styles.regForm} onSubmit={handleSubmit}>
//                   <h3>Applicant Details</h3>
//                   <div className={styles.inputRow}>
//                     <div className={styles.field}>
//                       <label>First Name *</label>
//                       <input type="text" name="first_name" value={formData.first_name} onChange={handleInputChange} placeholder="First Name" required />
//                     </div>
//                     <div className={styles.field}>
//                       <label>Last Name *</label>
//                       <input type="text" name="last_name" value={formData.last_name} onChange={handleInputChange} placeholder="Last Name" required />
//                     </div>
//                   </div>

//                   <div className={styles.field}>
//                     <label>Email *</label>
//                     <input type="email" name="email" value={formData.email} onChange={handleInputChange} placeholder="Email" required />
//                   </div>

//                   <div className={styles.field}>
//                     <label>Country / Region *</label>
//                     <select name="country" value={formData.country} onChange={handleInputChange} required>
//                       <option value="">Select a country...</option>
//                       {AFRICAN_COUNTRIES.map(country => (
//                         <option key={country.code} value={country.code}>{country.name}</option>
//                       ))}
//                     </select>
//                   </div>

//                   <div className={styles.field}>
//                     <label>Phone *</label>
//                     <input type="tel" name="phone" value={formData.phone} onChange={handleInputChange} required />
//                   </div>

//                   <div className={styles.field}>
//                     <label>Street Address *</label>
//                     <input type="text" name="street_address" value={formData.street_address} onChange={handleInputChange} placeholder="House number and street name" required />
//                     <input type="text" name="apartment" value={formData.apartment} onChange={handleInputChange} placeholder="Apartment, suite, unit, etc. (optional)" style={{ marginTop: '10px' }} />
//                   </div>

//                   <div className={styles.inputRow}>
//                     <div className={styles.field}>
//                       <label>Town / City *</label>
//                       <input type="text" name="town" value={formData.town} onChange={handleInputChange} required />
//                     </div>
//                     <div className={styles.field}>
//                       <label>State *</label>
//                       <input type="text" name="state" value={formData.state} onChange={handleInputChange} required />
//                     </div>
//                   </div>

//                   <div className={styles.field}>
//                     <label>Audition Plan *</label>
//                     {plansLoading ? (
//                       <select disabled>
//                         <option>Loading plans...</option>
//                       </select>
//                     ) : plansError ? (
//                       <p style={{ color: 'red', fontSize: '14px' }}>{plansError}</p>
//                     ) : (
//                       <select
//                         name="audition_plan_id"
//                         value={formData.audition_plan_id}
//                         onChange={handleInputChange}
//                         required
//                       >
//                         <option value="">Select an audition plan...</option>
//                         {plans.map(plan => (
//                           <option key={plan._id} value={plan._id}>
//                             {plan.title} — ₦{plan.amount?.toLocaleString()}
//                           </option>
//                         ))}
//                       </select>
//                     )}
//                     {formData.audition_plan_id && plans.length > 0 && (() => {
//                       const selected = plans.find(p => p._id === formData.audition_plan_id);
//                       return selected?.description ? (
//                         <p style={{ marginTop: '6px', fontSize: '13px', color: '#666' }}>{selected.description}</p>
//                       ) : null;
//                     })()}
//                   </div>
//                 </form>

//                 {/* RIGHT: Order Summary */}
//                 <div className={styles.orderSummary}>
//                   <h3>Your Registration</h3>
//                   <div className={styles.summaryTable}>
//                     {(() => {
//                       const selectedPlan = plans.find(p => p._id === formData.audition_plan_id);
//                       const amount = selectedPlan?.amount;
//                       const label = selectedPlan?.title || 'NTS Season 4 Audition';
//                       return (
//                         <>
//                           <div className={styles.summaryRow}>
//                             <span>{label} × 1</span>
//                             <span>{amount != null ? `₦${amount.toLocaleString()}.00` : '—'}</span>
//                           </div>
//                           <div className={`${styles.summaryRow} ${styles.totalRow}`}>
//                             <span>Total</span>
//                             <span>{amount != null ? `₦${amount.toLocaleString()}.00` : '—'}</span>
//                           </div>
//                         </>
//                       );
//                     })()}
//                   </div>

//                   <div className={styles.paymentNotice}>
//                     <p>Secure payment via Paystack.</p>
//                   </div>

//                   <button
//                     type="submit"
//                     form="audition-form"
//                     className={styles.confirmBtn}
//                     disabled={loading || !formData.audition_plan_id || plansLoading}
//                   >
//                     {loading ? 'Processing...' : (() => {
//                       const selectedPlan = plans.find(p => p._id === formData.audition_plan_id);
//                       return selectedPlan ? `Confirm ₦${selectedPlan.amount?.toLocaleString()}.00` : 'Select a Plan';
//                     })()}
//                   </button>
//                 </div>

//               </div>
//             </div>
//           )}

//         </div>
//       </section>
      
//       {/* Payment Modal */}
//       {showModal && (
//         <div className={styles.modalOverlay}>
//           <div className={styles.modalContent}>
//             {paymentStatus === 'success' ? (
//               <>
//                 <div className={styles.successIcon}>✓</div>
//                 <h2>Payment Successful!</h2>
//                 <p>Your registration has been completed successfully.</p>
//                 <button className={styles.modalBtn} onClick={() => navigate('/')}>Go to Homepage</button>
//               </>
//             ) : (
//               <>
//                 <div className={styles.failIcon}>✕</div>
//                 <h2>Payment Failed</h2>
//                 <p>We're sorry, but your transaction could not be processed.</p>
//                 <div className={styles.modalBtnGroup}>
//                   <button className={styles.modalBtn} onClick={() => { setShowModal(false); setStep(2); }}>Retry Payment</button>
//                   <button className={styles.modalBtnSecondary} onClick={() => navigate('/')}>Go to Homepage</button>
//                 </div>
//               </>
//             )}
//           </div>
//         </div>
//       )}
      
//       <Footer />
//     </>
//   );
// };

// export default AuditionRegistration;