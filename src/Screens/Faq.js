import React, { useState } from 'react';
import styles from '../CSS-MODULES/Faq.module.css';
import Navbar from '../COMPONENTS/Navbar';
import Footer from '../COMPONENTS/Footer';


const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "How do I register for Season 4 auditions?",
      answer: "You can register by clicking the 'Register' button on our website. You will need to fill out your details, upload a 1-2 minute audition video, and pay the registration fee of ₦10,000."
    },
    {
      question: "What is the age limit for contestants?",
      answer: "Naija Talent Show is open to everyone! We accept contestants from age 3 and above. Participants under 18 must have parental or guardian consent."
    },
    {
      question: "Can I perform in both a solo and a group act?",
      answer: "According to our entry limits, a participant is limited to one entry only. You cannot perform in a solo act and a group act simultaneously."
    },
    {
      question: "How long should my audition performance be?",
      answer: "Performances must be between 2 and 4 minutes long. Any act exceeding 5 minutes may face point deductions or be cut short during the live show."
    },
    {
      question: "Is the registration fee refundable?",
      answer: "No, registration fees are generally non-refundable. This applies even if an act is unable to perform or is disqualified due to misconduct."
    },
    {
      question: "Where will the live auditions take place?",
      answer: "Live auditions are scheduled for major cities including Lagos (starting Sept 5th), Abuja, Port Harcourt, Enugu, and Uyo. Check the 'Audition Roadmap' for specific venue details."
    }
  ];

  return (

    <>
    <Navbar />
    <section className={styles.faqSection}>
      <div className={styles.container}>
        <header className={styles.header}>
          <span className={styles.badge}>Got Questions?</span>
          <h1>Frequently Asked <span className={styles.greenText}>Questions</span></h1>
          <p>Everything you need to know about the show, auditions, and participation.</p>
        </header>

        

        <div className={styles.accordion}>
          {faqData.map((item, index) => (
            <div 
              key={index} 
              className={`${styles.faqItem} ${activeIndex === index ? styles.active : ''}`}
            >
              <button 
                className={styles.questionBtn} 
                onClick={() => toggleAccordion(index)}
              >
                {item.question}
                <span className={styles.icon}>{activeIndex === index ? '−' : '+'}</span>
              </button>
              
              <div className={styles.answerWrapper}>
                <div className={styles.answerContent}>
                  {item.answer}
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className={styles.contactSupport}>
          <p>Still have questions? <a href="#contact">Contact our support team</a></p>
        </div>
      </div>
    </section>
    <Footer />
    </>
  );
};

export default FAQ;