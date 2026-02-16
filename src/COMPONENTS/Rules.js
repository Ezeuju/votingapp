import React, { useState } from 'react';
import styles from '../CSS-MODULES/Rules.module.css';
import Navbar from  "../COMPONENTS/Navbar";
import Footer from "../COMPONENTS/Footer";

const Rules = () => {
  const [activeTab, setActiveTab] = useState(null);

  const toggleTab = (index) => {
    setActiveTab(activeTab === index ? null : index);
  };

  const ruleData = [
    {
      title: "Eligibility and Registration",
      items: [
        "Participants: Open to all individuals or groups (3 years and above).",
        "Entry Limit: Limited to one entry only (cannot perform in both solo and group acts).",
        "Parental Consent: Participants under 18 must have a parent/guardian signed consent.",
        "Registration: Completed forms must be submitted by the specified deadline.",
        "Global Access: No restrictions on nationality or residence."
      ]
    },
    {
      title: "Performance Guidelines",
      items: [
        "Content Policy: All acts must be PG-rated and wholesome. No profanity or suggestive behavior.",
        "Time Limit: Performances must be between 2 and 4 minutes. Over 5 mins may face deductions.",
        "Safety: No fire, pyrotechnics, weapons, or live animals.",
        "Cleanliness: No messy substances (glitter, water, feathers) on stage.",
        "Costumes: Must be appropriate, tasteful, and modest."
      ]
    },
    {
      title: "Technical Requirements",
      items: [
        "Music: Background tracks must be digital (MP3/USB) and clearly labeled.",
        "Vocals: Karaoke-style tracks preferred. Lead vocals on backing tracks are not allowed.",
        "Equipment: Microphones and sound systems are provided; performers bring their own props.",
        "Setup Time: Must be completed in under 1 minute."
      ]
    },
    {
      title: "Judging and Awards (Scoring Criteria)",
      items: [
        "Skill/Proficiency (25%): Technical ability and expertise.",
        "Stage Presence (25%): Poise, confidence, and audience engagement.",
        "Originality/Creativity (25%): Uniqueness of the performance.",
        "Appropriateness (25%): Adherence to the family-friendly theme.",
        "Decision: The judges’ decisions are final and not subject to change."
      ]
    },
    {
      title: "Cancellation and Legal Policy",
      items: [
        "Refunds: Payments are non-refundable if a contestant cancels or is suspended.",
        "Intellectual Property: NTS retains rights to performances and images for promotion.",
        "Governing Law: Governed by the laws of the United States and Nigeria."
      ]
    }
  ];

  return (
    <>
    <Navbar />
    <section className={styles.rulesSection}>
      <div className={styles.container}>
        <div className={styles.header}>
          <span className={styles.tag}>Naija Talent Show Season 4</span>
          <h1>Rules & <span className={styles.greenText}>Regulations</span></h1>
          <p className={styles.intro}>
            Ensuring a safe, organized, and family-friendly global event. 
            Please read carefully before registering.
          </p>
        </div>

        <div className={styles.accordion}>
          {ruleData.map((section, index) => (
            <div key={index} className={`${styles.card} ${activeTab === index ? styles.active : ''}`}>
              <button className={styles.trigger} onClick={() => toggleTab(index)}>
                {section.title}
                <span className={styles.chevron}>{activeTab === index ? '−' : '+'}</span>
              </button>
              <div className={styles.content}>
                <ul className={styles.list}>
                  {section.items.map((item, i) => (
                    <li key={i}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.footerNote}>
          <p><strong>Acknowledgment:</strong> By registering, contestants and parents/guardians acknowledge they have read, understood, and agree to abide by these guidelines.</p>
        </div>
      </div>
    </section>
    <Footer />
    </>
  );
};

export default Rules;