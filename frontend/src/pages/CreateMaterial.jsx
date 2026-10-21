import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { createMaterial } from '../api/materials';

export default function CreateMaterial() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!title.trim() || !content.trim()) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    try {
      await createMaterial(title.trim(), content.trim());
      navigate('/materials');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to create material');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <Link to="/dashboard" style={styles.logo}>📚 Exam Prep AI</Link>
        <div style={styles.userInfo}>
          <span>{user?.email}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Log out</button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.topBar}>
          <h1 style={styles.heading}>New Study Material</h1>
          <Link to="/materials" style={styles.backLink}>← Back to materials</Link>
        </div>

        <div style={styles.card}>
          {error && <div style={styles.error}>{error}</div>}

          <form onSubmit={handleSubmit} style={styles.form}>
            <div style={styles.field}>
              <label style={styles.label}>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="e.g. Chapter 5 - Photosynthesis"
                style={styles.input}
                required
              />
            </div>

            <div style={styles.field}>
              <label style={styles.label}>Content</label>
              <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Paste or type your study notes here..."
                style={styles.textarea}
                rows={14}
                required
              />
            </div>

            <button type="submit" disabled={loading} style={styles.submitBtn}>
              {loading ? 'Saving...' : 'Save Material'}
            </button>
          </form>
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
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '24px',
  },
  heading: { fontSize: '28px' },
  backLink: { color: '#667eea', fontWeight: 600, fontSize: '15px' },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '32px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  },
  error: {
    background: '#fee2e2',
    color: '#b91c1c',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  form: { display: 'flex', flexDirection: 'column', gap: '20px' },
  field: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '14px', fontWeight: 600, color: '#333' },
  input: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '15px',
    outline: 'none',
  },
  textarea: {
    padding: '12px 14px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '15px',
    outline: 'none',
    resize: 'vertical',
    fontFamily: 'inherit',
  },
  submitBtn: {
    marginTop: '8px',
    padding: '14px',
    background: '#667eea',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 600,
  },
};