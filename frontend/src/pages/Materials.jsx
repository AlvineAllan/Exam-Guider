import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMaterials, deleteMaterial } from '../api/materials';

export default function Materials() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const data = await getMaterials();
      setMaterials(data.materials || []);
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to load materials');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this study material?')) return;
    try {
      await deleteMaterial(id);
      setMaterials((prev) => prev.filter((m) => m.id !== id));
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to delete');
    }
  };

  return (
    <div style={styles.container}>
      {/* Header */}
      <header style={styles.header}>
        <div style={styles.headerLeft}>
          <Link to="/dashboard" style={styles.logo}>📚 Exam Prep AI</Link>
        </div>
        <div style={styles.userInfo}>
          <span>{user?.email}</span>
          <button onClick={handleLogout} style={styles.logoutBtn}>Log out</button>
        </div>
      </header>

      <main style={styles.main}>
        <div style={styles.topBar}>
          <h1 style={styles.heading}>My Study Materials</h1>
          <Link to="/materials/new" style={styles.addBtn}>+ New Material</Link>
        </div>

        {error && <div style={styles.error}>{error}</div>}

        {loading ? (
          <p style={styles.loading}>Loading materials...</p>
        ) : materials.length === 0 ? (
          <div style={styles.empty}>
            <p>No study materials yet.</p>
            <Link to="/materials/new" style={styles.addBtn}>Create your first one</Link>
          </div>
        ) : (
          <div style={styles.grid}>
            {materials.map((material) => (
              <div key={material.id} style={styles.card}>
                <h3 style={styles.cardTitle}>{material.title}</h3>
                <p style={styles.cardPreview}>
                  {material.content.length > 140
                    ? material.content.slice(0, 140) + '...'
                    : material.content}
                </p>
                <div style={styles.cardFooter}>
                  <span style={styles.date}>
                    {new Date(material.createdAt).toLocaleDateString()}
                  </span>
                  <div style={styles.actions}>
                    <Link to={`/materials/${material.id}`} style={styles.viewBtn}>
                      View
                    </Link>
                    <button
                      onClick={() => handleDelete(material.id)}
                      style={styles.deleteBtn}
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
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
  headerLeft: { display: 'flex', alignItems: 'center', gap: '24px' },
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
  main: { maxWidth: '1000px', margin: '40px auto', padding: '0 20px' },
  topBar: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
  },
  heading: { fontSize: '28px' },
  addBtn: {
    background: '#667eea',
    color: 'white',
    padding: '10px 18px',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '15px',
  },
  error: {
    background: '#fee2e2',
    color: '#b91c1c',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
  },
  loading: { textAlign: 'center', color: '#666', marginTop: '40px' },
  empty: {
    textAlign: 'center',
    background: 'white',
    padding: '60px 20px',
    borderRadius: '12px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
    gap: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '22px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
    display: 'flex',
    flexDirection: 'column',
  },
  cardTitle: { fontSize: '18px', marginBottom: '10px' },
  cardPreview: { color: '#555', fontSize: '14px', flex: 1, lineHeight: 1.5 },
  cardFooter: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: '18px',
    paddingTop: '14px',
    borderTop: '1px solid #eee',
  },
  date: { fontSize: '13px', color: '#888' },
  actions: { display: 'flex', gap: '10px' },
  viewBtn: {
    fontSize: '13px',
    color: '#667eea',
    fontWeight: 600,
  },
  deleteBtn: {
    fontSize: '13px',
    color: '#ef4444',
    background: 'none',
    border: 'none',
    fontWeight: 600,
  },
};