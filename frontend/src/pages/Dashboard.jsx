import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.logo}>📚 Exam Prep AI</h1>
        <div style={styles.userInfo}>
          <span>{user?.email}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>
            Log out
          </button>
        </div>
      </header>

      <main style={styles.main}>
        <h2 style={styles.heading}>Welcome back!</h2>
        <p style={styles.subtext}>
          You are logged in as <strong>{user?.email}</strong>
        </p>

        <div style={styles.card}>
          <h3 style={styles.cardTitle}>What would you like to do?</h3>
          <div style={styles.actions}>
            <Link to="/materials" style={styles.primaryBtn}>
              My Study Materials
            </Link>
            <Link to="/materials/new" style={styles.secondaryBtn}>
              + Add New Material
            </Link>
          </div>
        </div>
      </main>
    </div>
  );
}

const styles = {
  container: { minHeight: '100vh', background: '#f5f7fa' },
  header: {
    background: 'white',
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  logo: { fontSize: '22px', fontWeight: 700 },
  userInfo: { display: 'flex', alignItems: 'center', gap: '16px', fontSize: '14px' },
  logoutBtn: {
    padding: '8px 16px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 600,
  },
  main: { maxWidth: '800px', margin: '40px auto', padding: '0 20px' },
  heading: { fontSize: '28px', marginBottom: '8px' },
  subtext: { color: '#666', marginBottom: '32px' },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '28px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  },
  cardTitle: { marginBottom: '20px', fontSize: '18px' },
  actions: { display: 'flex', gap: '16px', flexWrap: 'wrap' },
  primaryBtn: {
    background: '#667eea',
    color: 'white',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: 600,
  },
  secondaryBtn: {
    background: '#e0e7ff',
    color: '#4338ca',
    padding: '12px 24px',
    borderRadius: '8px',
    fontWeight: 600,
  },
};