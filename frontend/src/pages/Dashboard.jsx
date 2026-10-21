import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

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
          <h3 style={styles.cardTitle}>Next steps</h3>
          <ul style={styles.list}>
            <li>Upload or paste your study materials</li>
            <li>Generate practice questions with AI</li>
            <li>Take quizzes and track your progress</li>
          </ul>
          <p style={styles.note}>
            (We will build these features next)
          </p>
        </div>
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
    padding: '16px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    boxShadow: '0 1px 3px rgba(0,0,0,0.08)',
  },
  logo: {
    fontSize: '22px',
    fontWeight: 700,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '16px',
    fontSize: '14px',
  },
  logoutBtn: {
    padding: '8px 16px',
    background: '#ef4444',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    fontWeight: 600,
  },
  main: {
    maxWidth: '800px',
    margin: '40px auto',
    padding: '0 20px',
  },
  heading: {
    fontSize: '28px',
    marginBottom: '8px',
  },
  subtext: {
    color: '#666',
    marginBottom: '32px',
  },
  card: {
    background: 'white',
    borderRadius: '12px',
    padding: '28px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.06)',
  },
  cardTitle: {
    marginBottom: '16px',
    fontSize: '18px',
  },
  list: {
    paddingLeft: '20px',
    lineHeight: 1.8,
    color: '#444',
  },
  note: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#888',
    fontStyle: 'italic',
  },
};