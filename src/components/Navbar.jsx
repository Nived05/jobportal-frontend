import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const dashboard = () => {
    if (user?.role === 'RECRUITER') navigate('/recruiter/dashboard');
    else navigate('/seeker/dashboard');
  };

  return (
    <nav style={{
      background: '#1e293b', padding: '12px 24px',
      display: 'flex', justifyContent: 'space-between',
      alignItems: 'center', color: 'white'
    }}>
      <Link to="/" style={{
        color: 'white', textDecoration: 'none',
        fontSize: '20px', fontWeight: 'bold'
      }}>
        💼 JobPortal
      </Link>
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <Link to="/jobs" style={{ color: 'white', textDecoration: 'none' }}>
          Jobs
        </Link>
        {user ? (
          <>
            <button onClick={dashboard} style={{
              background: '#3b82f6', color: 'white',
              border: 'none', padding: '6px 14px',
              borderRadius: '6px', cursor: 'pointer'
            }}>
              Dashboard
            </button>
            <span style={{ fontSize: '13px', color: '#94a3b8' }}>
              {user.name} ({user.role})
            </span>
            <button onClick={logout} style={{
              background: '#ef4444', color: 'white',
              border: 'none', padding: '6px 14px',
              borderRadius: '6px', cursor: 'pointer'
            }}>
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" style={{
              background: '#3b82f6', color: 'white',
              textDecoration: 'none', padding: '6px 14px',
              borderRadius: '6px'
            }}>Login</Link>
            <Link to="/register" style={{
              background: '#10b981', color: 'white',
              textDecoration: 'none', padding: '6px 14px',
              borderRadius: '6px'
            }}>Register</Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;