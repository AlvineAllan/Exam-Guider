import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMaterial, deleteMaterial } from '../api/materials';

export default function MaterialDetail() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchMaterial = async () => {
      try {
        setLoading(true);
        const data = await getMaterial(id);
        setMaterial(data.material);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to load material');
      } finally {
        setLoading(false);
      }
    };
    fetchMaterial();
  }, [id]);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async () => {
    if (!window.confirm('Delete this study material? This cannot be undone.')) return;
    try {
      await deleteMaterial(id);
      navigate('/materials');
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete');
    }
  };

  // Placeholder for later
  const handleGenerateQuestions = () => {
    alert('Question generation will be added in the next step!');
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <Link to="/dashboard" style={styles.logo}>📚 Exam Prep AI</Link>
        <div style={styles.userInfo}>
          <span style={styles.email}>{user?.email}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Log out</button>
        </div>
      </header>

      <main style={styles.main}>
        {loading ? (
          <p style={styles.centered}>Loading material...</p>
        ) : error ? (
          <div style={styles.errorBox}>
            <p>{error}</p>
            <Link to="/materials" style={styles.backLink}>← Back to materials</Link>
          </div>
        ) : (
          <>
            {/* Top bar */}
            <div style={styles.topBar}>
              <Link to="/materials" style={styles.backLink}>← Back to materials</Link>
              <div style={styles.actions}>
                <button onClick={handleGenerateQuestions} style={styles.generateBtn}>
                  Generate Questions
                </button>
                <button onClick={handleDelete} style={styles.deleteBtn}>
                  Delete
                </button>
              </div>
            </div>

            {/* Content card */}
            <div style={styles.card}>
              <h1 style={styles.title}>{material.title}</h1>
              <p style={styles.meta}>
                Created {new Date(material.createdAt).toLocaleString()}
              </p>
              <div style={styles.content}>
                {material.content}
              </div>
            </div>
          </>
        )}
      </main>
    </div>
  );
}

const styles = {
  container: {
    minHeight: '100vh',
    background: '#f5f7fa',
  },
  header: {
    background: 'white',
    padding: '12px 16px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
    flexWrap: 'wrap',
    gap: '10px',
  },
  logo: {
    fontSize: '20px',
    fontWeight: 700,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    fontSize: '14px',
  },
  email: {
    maxWidth: '160px',
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    whiteSpace: 'nowrap',
  },
  logoutBtn: {
    padding: '7px 14px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 600,
    fontSize: '13px',
  },
  main: {
    maxWidth: '800px',
    margin: '24px auto',
    padding: '0 16px 40px',
  },
  centered: {
    textAlign: 'center',
    marginTop: '60px',
    color: '#666',
  },
  errorBox: {
    textAlign: 'center',
    marginTop: '40px',
  },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '20px',
    flexWrap: 'wrap',
    gap: '12px',
  },
  backLink: {
    color: '#667eea',
    fontWeight: 600,
    fontSize: '15px',
  },
  actions: {
    display: 'flex',
    gap: '10px',
    flexWrap: 'wrap',
  },
  generateBtn: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '14px',
  },
  deleteBtn: {
    background: '#fee2e2',
    color: '#b91c1c',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '14px',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '24px 20px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  },
  title: {
    fontSize: '24px',
    marginBottom: '8px',
    lineHeight: 1.3,
  },
  meta: {
    fontSize: '13px',
    color: '#888',
    marginBottom: '24px',
  },
  content: {
    fontSize: '16px',
    lineHeight: 1.7,
    whiteSpace: 'pre-wrap',
    color: '#333',
  },
};