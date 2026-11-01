// frontend/src/pages/MaterialDetail.jsx
import React, { useEffect, useState } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getMaterial, deleteMaterial } from '../api/materials';
import { generateQuestions } from '../api/questions';

export default function MaterialDetail() {
  const { id } = useParams();
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [material, setMaterial] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [difficulty, setDifficulty] = useState('medium');
  const [generating, setGenerating] = useState(false);
  const [genError, setGenError] = useState('');
  const [generated, setGenerated] = useState(null);

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

  const handleGenerateQuestions = async () => {
    setGenError('');
    setGenerated(null);
    setGenerating(true);
    try {
      const data = await generateQuestions(id, { difficulty });
      setGenerated(data.questionSet);
    } catch (err) {
      setGenError(err.response?.data?.error || 'Failed to generate questions.');
    } finally {
      setGenerating(false);
    }
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

            {/* Generate questions box */}
            <div style={styles.card}>
              <h2 style={styles.sectionTitle}>🧠 Generate Questions</h2>
              <div style={styles.genRow}>
                <label style={styles.label}>Difficulty:</label>
                <select
                  value={difficulty}
                  onChange={(e) => setDifficulty(e.target.value)}
                  style={styles.select}
                >
                  <option value="easy">Easy</option>
                  <option value="medium">Medium</option>
                  <option value="hard">Hard</option>
                </select>
                <button
                  onClick={handleGenerateQuestions}
                  style={styles.generateBtn}
                  disabled={generating}
                >
                  {generating ? 'Generating…' : 'Generate Questions'}
                </button>
              </div>

              {generating && <p style={styles.hint}>This can take up to a minute on the free tier. Please wait…</p>}

              {genError && <div style={styles.genError}>{genError}</div>}

              {generated && (
                <div style={styles.successBox}>
                  ✅ Created <strong>{generated.questions.length} questions</strong> ({generated.difficulty})!
                  <p style={styles.hint}>
                    The question set is saved as “{generated.title}”. The quiz-taking view comes in the next step —
                    for now you can verify it via <code>GET /api/questions/sets/{generated.id}</code>.
                  </p>
                </div>
              )}
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
    marginBottom: '20px',
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
  sectionTitle: {
    fontSize: '18px',
    marginBottom: '16px',
  },
  genRow: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    flexWrap: 'wrap',
  },
  label: {
    fontSize: '14px',
    fontWeight: 600,
    color: '#444',
  },
  select: {
    padding: '8px 12px',
    borderRadius: '8px',
    border: '1px solid #ddd',
    fontSize: '14px',
  },
  generateBtn: {
    background: '#667eea',
    color: 'white',
    border: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    fontWeight: 600,
    fontSize: '14px',
    cursor: 'pointer',
  },
  hint: {
    fontSize: '13px',
    color: '#888',
    marginTop: '12px',
    lineHeight: 1.5,
  },
  genError: {
    marginTop: '12px',
    background: '#fee2e2',
    color: '#b91c1c',
    padding: '10px 12px',
    borderRadius: '8px',
    fontSize: '14px',
  },
  successBox: {
    marginTop: '16px',
    background: '#d1fae5',
    color: '#065f46',
    padding: '14px 16px',
    borderRadius: '8px',
    fontSize: '15px',
  },
};