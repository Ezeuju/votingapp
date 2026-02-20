import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from '../CSS-MODULES/Audition.module.css';
import { planApi } from '../services';

const Audition = () => {
  const navigate = useNavigate();
  const [plans, setPlans] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPlans = async () => {
      try {
        const response = await planApi.getAll('audition');
        setPlans(response.data?.data || []);
      } catch (error) {
        console.error('Error fetching plans:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchPlans();
  }, []);

  return (
    <section className={styles.auditionSection} id="auditions">
      <div className={styles.container}>
        
        {/* 1. COUNTDOWN BLOCK */}
        <div className={styles.countdownWrapper}>
          <span className={styles.eyebrow}>Don't Wait!</span>
          <h2>Auditions Are Approaching</h2>
          <p className={styles.description}>
            Registration for NAIJA TALENT SHOW – Season 4 is now open. Don’t miss your chance to audition, 
            get mentored by industry professionals, and compete for life-changing rewards on a global stage.
          </p>
          
          <div className={styles.timer}>
            <div className={styles.timeUnit}><span>206</span><p>Days</p></div>
            <div className={styles.timeUnit}><span>22</span><p>Hours</p></div>
            <div className={styles.timeUnit}><span>06</span><p>Minutes</p></div>
            <div className={styles.timeUnit}><span>40</span><p>Seconds</p></div>
          </div>
          <button className={styles.mainRegisterBtn}>Register for Auditions</button>
        </div>

        {/* 2. REGISTRATION PLANS */}
        <div className={styles.plansHeader}>
          <h2>Choose Your Audition Plan</h2>
          <p>Register for NAIJA TALENT SHOW – Season 4 and take the first step toward global recognition.</p>
        </div>

        <div className={styles.planContainer}>
          {loading ? (
            <p>Loading plans...</p>
          ) : (
            plans.map((plan) => (
              <div 
                key={plan._id} 
                className={`${styles.planCard} ${plan.title?.toLowerCase().includes('gold') ? styles.featured : ''}`}
              >
                {plan.title?.toLowerCase().includes('gold') && (
                  <div className={styles.popularTag}>Priority Screening</div>
                )}
                <h3>{plan.title}</h3>
                <p>{plan.description}</p>
                <div className={styles.price}>₦{plan.amount?.toLocaleString()}</div>
                <button 
                  className={plan.title?.toLowerCase().includes('gold') ? styles.goldBtn : styles.planBtn}
                  onClick={() => navigate(`/auditiony?plan=${plan._id}`)}
                >
                  {plan.title?.toLowerCase().includes('vip') ? 'Apply as VIP' : 
                   plan.title?.toLowerCase().includes('gold') ? 'Get Gold Pass' : 'Register Now'}
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </section>
  );
};

export default Audition;