import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AdminAuth.module.css';
import { authApi } from '../../services/authApi';

const AdminAuth = () => {
  const [view, setView] = useState('login'); // login or forgot
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const response = await authApi.admin.login(formData);
      localStorage.setItem('token', response.data.token);
      navigate('/dashboard');
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.authPage}>
      <div className={styles.authCard}>
        <div className={styles.logoSection}>
          <div className={styles.logo}>NTS<span>ADMIN</span></div>
          <p>Official Control Portal</p>
        </div>

        {view === 'login' ? (
          /* --- ADMIN LOGIN FORM --- */
          <form className={styles.form} onSubmit={handleLogin}>
            <h2>Internal Sign In</h2>
            {error && <div className={styles.error}>{error}</div>}
            <div className={styles.inputGroup}>
              <label>Admin Email</label>
              <input 
                type="email" 
                placeholder="admin@naijatalentshow.com" 
                value={formData.email}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                required 
              />
            </div>
            <div className={styles.inputGroup}>
              <label>Security Password</label>
              <input 
                type="password" 
                placeholder="••••••••" 
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                required 
              />
            </div>
            <button type="submit" className={styles.loginBtn} disabled={loading}>
              {loading ? "Authenticating..." : "Access Dashboard"}
            
            </button>
            <p className={styles.toggleText} onClick={() => setView('forgot')}>
              Trouble logging in? <span>Reset Access</span>
            </p>
          </form>
        ) : (
          /* --- FORGOT PASSWORD FORM --- */
          <form className={styles.form} onSubmit={(e) => e.preventDefault()}>
            <h2>Reset Credentials</h2>
            <p className={styles.formHint}>Enter your registered admin email to receive a secure reset link.</p>
            <div className={styles.inputGroup}>
              <label>Work Email</label>
              <input type="email" placeholder="admin@naijatalentshow.com" required />
            </div>
            <button type="submit" className={styles.loginBtn}>Send Recovery Email</button>
            <p className={styles.toggleText} onClick={() => setView('login')}>
              Return to <span>Sign In</span>
            </p>
          </form>
        )}
      </div>
      <footer className={styles.footer}>
        &copy; 2026 Naija Talent Show | Secure Admin Environment
      </footer>
    </div>
  );
};

export default AdminAuth;