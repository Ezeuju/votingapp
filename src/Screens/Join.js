import React, { useState } from "react";
import styles from "../CSS-MODULES/Join.module.css";
import Navbar from "../COMPONENTS/Navbar";
import Footer from "../COMPONENTS/Footer";
import { useToast } from "../COMPONENTS/Toast";

const Join = () => {
  const { showToast } = useToast();
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    role: "Volunteer",
    experience: "",
    link: "",
  });
  const [loading, setLoading] = useState(false);

  const roles = [
    "Event Coordinator",
    "Social Media Manager",
    "Technical Crew (Sound/Light)",
    "Contestant Manager",
    "Security & Logistics",
    "Media & Content Creator",
    "Volunteer",
  ];

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API_URL}/teams/apply/user`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        },
      );

      if (response.ok) {
        showToast("Application submitted successfully!", "success");
        setFormData({
          full_name: "",
          email: "",
          phone: "",
          role: "Volunteer",
          experience: "",
          link: "",
        });
      } else {
        showToast("Failed to submit application. Please try again.", "error");
      }
    } catch (error) {
      showToast("Network error. Please try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar />
      <div className={styles.joinPage}>
        {/* HERO SECTION */}
        <header className={styles.hero}>
          <div className={styles.container}>
            <span className={styles.badge}>
              Career & Volunteer Opportunities
            </span>
            <h1>
              Build the Future of{" "}
              <span className={styles.greenText}>Entertainment</span>
            </h1>
            <p>
              Join a global team dedicated to discovering and empowering
              Nigeria's next generation of superstars.
            </p>
          </div>
        </header>

        <section className={styles.contentSection}>
          <div className={styles.container}>
            <div className={styles.flexLayout}>
              {/* WHY JOIN INFO */}
              <div className={styles.infoColumn}>
                <h2>Why Join the NTS Team?</h2>
                <p>
                  Be part of a cross-continental movement bridging Nigeria and
                  the USA.
                </p>

                <div className={styles.perks}>
                  <div className={styles.perkItem}>
                    <h4>Global Networking</h4>
                    <p>
                      Work alongside industry veterans from NTR Inc USA and NTS
                      Ltd Nigeria.
                    </p>
                  </div>
                  <div className={styles.perkItem}>
                    <h4>Skill Development</h4>
                    <p>
                      Gain hands-on experience in large-scale event production
                      and media management.
                    </p>
                  </div>
                  <div className={styles.perkItem}>
                    <h4>Social Impact</h4>
                    <p>
                      Directly contribute to a platform that changes lives and
                      restores hope through talent.
                    </p>
                  </div>
                </div>
              </div>

              {/* APPLICATION FORM */}
              <div className={styles.formColumn}>
                <div className={styles.formCard}>
                  <h3>Apply to Join</h3>
                  <form className={styles.form} onSubmit={handleSubmit}>
                    <div className={styles.inputGroup}>
                      <label>Full Name</label>
                      <input
                        type="text"
                        placeholder="Your Name"
                        value={formData.full_name}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            full_name: e.target.value,
                          })
                        }
                        required
                      />
                    </div>

                    <div className={styles.row}>
                      <div className={styles.inputGroup}>
                        <label>Email Address</label>
                        <input
                          type="email"
                          placeholder="email@example.com"
                          value={formData.email}
                          onChange={(e) =>
                            setFormData({ ...formData, email: e.target.value })
                          }
                          required
                        />
                      </div>
                      <div className={styles.inputGroup}>
                        <label>Phone Number</label>
                        <input
                          type="tel"
                          placeholder="+234..."
                          value={formData.phone}
                          onChange={(e) =>
                            setFormData({ ...formData, phone: e.target.value })
                          }
                          required
                        />
                      </div>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Position Interested In</label>
                      <select
                        value={formData.role}
                        onChange={(e) =>
                          setFormData({ ...formData, role: e.target.value })
                        }
                      >
                        {roles.map((role) => (
                          <option key={role} value={role}>
                            {role}
                          </option>
                        ))}
                      </select>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Briefly describe your experience</label>
                      <textarea
                        rows="4"
                        placeholder="How can you add value to the NTS team?"
                        value={formData.experience}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            experience: e.target.value,
                          })
                        }
                        required
                      ></textarea>
                    </div>

                    <div className={styles.inputGroup}>
                      <label>Upload CV / Portfolio (Link)</label>
                      <input
                        type="url"
                        placeholder="Google Drive or LinkedIn Link"
                        value={formData.link}
                        onChange={(e) =>
                          setFormData({ ...formData, link: e.target.value })
                        }
                      />
                    </div>

                    <button
                      type="submit"
                      className={styles.submitBtn}
                      disabled={loading}
                    >
                      {loading ? "Submitting..." : "Submit Application"}
                    </button>
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

export default Join;
