import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../api/axios';
import toast from 'react-hot-toast';

const Register = () => {
  const [form, setForm] = useState({
    name: '', email: '', password: '', role: 'JOB_SEEKER'
  });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post('/api/auth/register', form);
      toast.success('Registered! Please login.');
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', background: '#f1f5f9',
      display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <div style={{ background: 'white', padding: '40px',
        borderRadius: '12px', width: '100%', maxWidth: '400px',
        boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}>
        <h2 style={{ marginBottom: '24px', textAlign: 'center',
          color: '#1e293b' }}>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px',
              color: '#475569', fontSize: '14px' }}>Full Name</label>
            <input value={form.name}
              onChange={e => setForm({...form, name: e.target.value})}
              required style={{ width: '100%', padding: '10px',
                border: '1px solid #e2e8f0', borderRadius: '8px',
                fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px',
              color: '#475569', fontSize: '14px' }}>Email</label>
            <input type="email" value={form.email}
              onChange={e => setForm({...form, email: e.target.value})}
              required style={{ width: '100%', padding: '10px',
                border: '1px solid #e2e8f0', borderRadius: '8px',
                fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ display: 'block', marginBottom: '6px',
              color: '#475569', fontSize: '14px' }}>Password</label>
            <input type="password" value={form.password}
              onChange={e => setForm({...form, password: e.target.value})}
              required style={{ width: '100%', padding: '10px',
                border: '1px solid #e2e8f0', borderRadius: '8px',
                fontSize: '14px', boxSizing: 'border-box' }} />
          </div>
          <div style={{ marginBottom: '24px' }}>
            <label style={{ display: 'block', marginBottom: '6px',
              color: '#475569', fontSize: '14px' }}>I am a...</label>
            <select value={form.role}
              onChange={e => setForm({...form, role: e.target.value})}
              style={{ width: '100%', padding: '10px',
                border: '1px solid #e2e8f0', borderRadius: '8px',
                fontSize: '14px', boxSizing: 'border-box' }}>
              <option value="JOB_SEEKER">Job Seeker</option>
              <option value="RECRUITER">Recruiter</option>
            </select>
          </div>
          <button type="submit" disabled={loading} style={{
            width: '100%', padding: '12px', background: '#10b981',
            color: 'white', border: 'none', borderRadius: '8px',
            fontSize: '16px', cursor: 'pointer', fontWeight: '500' }}>
            {loading ? 'Creating...' : 'Create Account'}
          </button>
        </form>
        <p style={{ textAlign: 'center', marginTop: '16px',
          color: '#64748b', fontSize: '14px' }}>
          Have account? <Link to="/login"
            style={{ color: '#3b82f6' }}>Login</Link>
        </p>
      </div>
    </div>
  );
};
export default Register;