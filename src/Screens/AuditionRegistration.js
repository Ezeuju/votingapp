import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import styles from "../CSS-MODULES/Auditiony.module.css";
import Navbar from "../COMPONENTS/Navbar";
import Footer from "../COMPONENTS/Footer";
import { useToast } from "../COMPONENTS/Toast";
import api from "../services/api";
import { uploadFile } from "../services/fileApi";

const AFRICAN_COUNTRIES = [
  { code: "DZ", name: "Algeria" },
  { code: "AO", name: "Angola" },
  { code: "BJ", name: "Benin" },
  { code: "BW", name: "Botswana" },
  { code: "BF", name: "Burkina Faso" },
  { code: "BI", name: "Burundi" },
  { code: "CM", name: "Cameroon" },
  { code: "CV", name: "Cape Verde" },
  { code: "CF", name: "Central African Republic" },
  { code: "TD", name: "Chad" },
  { code: "KM", name: "Comoros" },
  { code: "CG", name: "Congo" },
  { code: "CD", name: "Congo (DRC)" },
  { code: "CI", name: "Côte d'Ivoire" },
  { code: "DJ", name: "Djibouti" },
  { code: "EG", name: "Egypt" },
  { code: "GQ", name: "Equatorial Guinea" },
  { code: "ER", name: "Eritrea" },
  { code: "ET", name: "Ethiopia" },
  { code: "GA", name: "Gabon" },
  { code: "GM", name: "Gambia" },
  { code: "GH", name: "Ghana" },
  { code: "GN", name: "Guinea" },
  { code: "GW", name: "Guinea-Bissau" },
  { code: "KE", name: "Kenya" },
  { code: "LS", name: "Lesotho" },
  { code: "LR", name: "Liberia" },
  { code: "LY", name: "Libya" },
  { code: "MG", name: "Madagascar" },
  { code: "MW", name: "Malawi" },
  { code: "ML", name: "Mali" },
  { code: "MR", name: "Mauritania" },
  { code: "MU", name: "Mauritius" },
  { code: "MA", name: "Morocco" },
  { code: "MZ", name: "Mozambique" },
  { code: "NA", name: "Namibia" },
  { code: "NE", name: "Niger" },
  { code: "NG", name: "Nigeria" },
  { code: "RW", name: "Rwanda" },
  { code: "ST", name: "São Tomé and Príncipe" },
  { code: "SN", name: "Senegal" },
  { code: "SC", name: "Seychelles" },
  { code: "SL", name: "Sierra Leone" },
  { code: "SO", name: "Somalia" },
  { code: "ZA", name: "South Africa" },
  { code: "SS", name: "South Sudan" },
  { code: "SD", name: "Sudan" },
  { code: "SZ", name: "Eswatini" },
  { code: "TZ", name: "Tanzania" },
  { code: "TG", name: "Togo" },
  { code: "TN", name: "Tunisia" },
  { code: "UG", name: "Uganda" },
  { code: "ZM", name: "Zambia" },
  { code: "ZW", name: "Zimbabwe" },
];

const AuditionRegistration = () => {
  const navigate = useNavigate();
  const { showToast } = useToast();
  const [step, setStep] = useState(1);
  const [agreed, setAgreed] = useState(false);
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    country: "NG",
    street_address: "",
    town: "",
    state: "",
    state_of_origin: "",
    phone: "",
    category: "",
    customCategory: "",
    photo: "",
    photoPreview: null,
  });
  const [uploading, setUploading] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    if (name === "category" && value !== "Other") {
      setFormData((prev) => ({ ...prev, category: value, customCategory: "" }));
    }
  };

  

const handlePhotoUpload = async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  if (file.size > 5 * 1024 * 1024) {
    showToast("Image too large. Max size is 5MB.", "error");
    return;
  }

  setUploading(true);
  try {
    const response = await uploadFile(file);
    const photoUrl = response.data.url;
    const previewUrl = URL.createObjectURL(file);

    setFormData((prev) => ({
      ...prev,
      photo: photoUrl,
      photoPreview: previewUrl,
    }));

    showToast("Photo uploaded successfully!", "success");
  } catch (error) {
    console.error("Upload error:", error);
    showToast("Failed to upload photo. Please try again.", "error");
  } finally {
    setUploading(false);
  }
};

const removePhoto = () => {
  if (formData.photoPreview) {
    URL.revokeObjectURL(formData.photoPreview);
  }
  setFormData((prev) => ({
    ...prev,
    photo: "",
    photoPreview: null,
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.photo) {
      showToast("Please upload your photo to proceed.", "error");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        first_name: formData.first_name,
        last_name: formData.last_name,
        email: formData.email,
        country: formData.country,
        street_address: formData.street_address,
        town: formData.town,
        state: formData.state,
        state_of_origin: formData.state_of_origin,
        phone: formData.phone,
        talent_category:
          formData.category === "Other"
            ? formData.customCategory
            : formData.category,
        photo: formData.photo,
      };
      await api.post("/users/audition/register", payload);
      showToast("Registration successful!", "success");
      navigate("/");
    } catch (error) {
      showToast(
        error.response?.data?.message || error.message || "Registration failed",
        "error",
      );
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <>
        <Navbar />
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            minHeight: "60vh",
          }}
        >
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "20px" }}>⏳</div>
            <h2>Processing...</h2>
          </div>
        </div>
        <Footer />
      </>
    );
  }

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
                  <p>
                    <strong>Judges:</strong> 4 Panel Judges & 1 Chief Judge.
                  </p>
                  <p>
                    <strong>Criteria:</strong> Appropriateness, Stage Presence,
                    Level of Talent, Overall Presentation.
                  </p>
                  <p>
                    <strong>Safety:</strong> No fire, weapons, or messy
                    substances (glitter/water).
                  </p>
                </div>
              </div>

              <div className={styles.rulesWarning}>
                <h3>⚠️ Important Rules</h3>
                <ul>
                  <li>
                    Maximum performance time: <strong>4 minutes</strong>.
                  </li>
                  <li>
                    Registration fees are <strong>non-refundable</strong>.
                  </li>
                  <li>Singing tracks must be instrumental (no lead vocals).</li>
                  <li>Full costume is required for auditions.</li>
                </ul>
              </div>

              <div className={styles.consentSection}>
                <label className={styles.checkboxLabel}>
                  <input
                    type="checkbox"
                    checked={agreed}
                    onChange={() => setAgreed(!agreed)}
                  />
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
              <button className={styles.backLink} onClick={() => setStep(1)}>
                ← Back to Rules
              </button>

              <form
                  className={styles.regForm}
                  onSubmit={handleSubmit}
                >
                  <h3>Applicant Details</h3>
                  <div className={styles.inputRow}>
                    <div className={styles.field}>
                      <label>First Name *</label>
                      <input
                        type="text"
                        name="first_name"
                        value={formData.first_name}
                        onChange={handleInputChange}
                        placeholder="First Name"
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <label>Last Name *</label>
                      <input
                        type="text"
                        name="last_name"
                        value={formData.last_name}
                        onChange={handleInputChange}
                        placeholder="Last Name"
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label>Email *</label>
                    <input
                      type="email"
                      name="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      placeholder="Email"
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Country / Region *</label>
                    <select
                      name="country"
                      value={formData.country}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select a country...</option>
                      {AFRICAN_COUNTRIES.map((country) => (
                        <option key={country.code} value={country.code}>
                          {country.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className={styles.field}>
                    <label>Phone (Whatsapp number) *</label>
                    <input
                      type="tel"
                      name="phone"
                      value={formData.phone}
                      onChange={handleInputChange}
                      required
                    />
                  </div>

                  <div className={styles.field}>
                    <label>Category *</label>
                    <select
                      name="category"
                      value={formData.category}
                      onChange={handleInputChange}
                      required
                      style={{ height: "52px", padding: "14px 12px" }}
                    >
                      <option value="">Select a category...</option>
                      <option value="Singer">Singer</option>
                      <option value="Dancer">Dancer</option>
                      <option value="Comedian">Comedian</option>
                      <option value="Magician">Magician</option>
                      <option value="Poetry">Poetry</option>
                      <option value="Acting">Acting</option>
                      <option value="Handcraft">Handcraft</option>
                      <option value="Instrumentalist">Instrumentalist</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>

                  {formData.category === "Other" && (
                    <div className={styles.field}>
                      <label>Specify Category *</label>
                      <input
                        type="text"
                        name="customCategory"
                        value={formData.customCategory}
                        onChange={handleInputChange}
                        placeholder="Enter your category"
                        required
                      />
                    </div>
                  )}

                  <div className={styles.field}>
                    <label>Street Address *</label>
                    <input
                      type="text"
                      name="street_address"
                      value={formData.street_address}
                      onChange={handleInputChange}
                      placeholder="House number and street name"
                      required
                    />
                  </div>

                  <div className={styles.inputRow}>
                    <div className={styles.field}>
                      <label>Town / City *</label>
                      <input
                        type="text"
                        name="town"
                        value={formData.town}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                    <div className={styles.field}>
                      <label>State *</label>
                      <input
                        type="text"
                        name="state"
                        value={formData.state}
                        onChange={handleInputChange}
                        required
                      />
                    </div>
                  </div>

                  <div className={styles.field}>
                    <label>State of Origin *</label>
                    <select
                      name="state_of_origin"
                      value={formData.state_of_origin}
                      onChange={handleInputChange}
                      required
                    >
                      <option value="">Select state of origin...</option>
                      <option>Abia</option>
                      <option>Adamawa</option>
                      <option>Akwa Ibom</option>
                      <option>Anambra</option>
                      <option>Bauchi</option>
                      <option>Bayelsa</option>
                      <option>Benue</option>
                      <option>Borno</option>
                      <option>Cross River</option>
                      <option>Delta</option>
                      <option>Ebonyi</option>
                      <option>Edo</option>
                      <option>Ekiti</option>
                      <option>Enugu</option>
                      <option>FCT - Abuja</option>
                      <option>Gombe</option>
                      <option>Imo</option>
                      <option>Jigawa</option>
                      <option>Kaduna</option>
                      <option>Kano</option>
                      <option>Katsina</option>
                      <option>Kebbi</option>
                      <option>Kogi</option>
                      <option>Kwara</option>
                      <option>Lagos</option>
                      <option>Nasarawa</option>
                      <option>Niger</option>
                      <option>Ogun</option>
                      <option>Ondo</option>
                      <option>Osun</option>
                      <option>Oyo</option>
                      <option>Plateau</option>
                      <option>Rivers</option>
                      <option>Sokoto</option>
                      <option>Taraba</option>
                      <option>Yobe</option>
                      <option>Zamfara</option>
                    </select>
                  </div>

                <div className={styles.uploadSection}>
  <label
    style={{
      fontWeight: 700,
      marginBottom: "8px",
      display: "block",
    }}
  >
    Audition Photo *
  </label>
  {uploading ? (
    <div className={styles.uploadArea}>
      <div className={styles.uploadIcon}>⏳</div>
      <div className={styles.uploadText}>Uploading Photo...</div>
    </div>
  ) : formData.photoPreview ? (
    <div className={styles.uploadPreview}>
      <img
        src={formData.photoPreview}
        alt="Audition"
        className={styles.uploadPreviewImg}
      />
      <span className={styles.uploadPreviewName}>Photo Ready</span>
      <button
        type="button"
        className={styles.uploadPreviewRemove}
        onClick={removePhoto}
      >
        ✕
      </button>
    </div>
  ) : (
    <div className={styles.uploadArea}>
      <div className={styles.uploadIcon}>📷</div>
      <div className={styles.uploadText}>
        Click to upload your audition photo
      </div>
      <div className={styles.uploadSub}>
        JPG, PNG or WEBP · Max 5MB
      </div>
      <input
        type="file"
        accept="image/*"
        className={styles.uploadInput}
        onChange={handlePhotoUpload}
        required
      />
    </div>
  )}
</div>


                <button
                  type="submit"
                  className={styles.confirmBtn}
                  disabled={loading}
                >
                  {loading ? "Processing..." : "Register"}
                </button>
              </form>
            </div>
          )}
        </div>
      </section>



      <Footer />
    </>
  );
};

export default AuditionRegistration;
