import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';

const SeekerDashboard = () => {
  const { user } = useAuth();
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.get('/api/applications/my')
      .then(res => setApplications(res.data))
      .finally(() => setLoading(false));
  }, []);

  const statusColor = (status) => {
    if (status === 'ACCEPTED') return { bg: '#f0fdf4', color: '#16a34a' };
    if (status === 'REJECTED') return { bg: '#fef2f2', color: '#dc2626' };
    if (status === 'REVIEWED') return { bg: '#fefce8', color: '#ca8a04' };
    return { bg: '#eff6ff', color: '#3b82f6' };
  };

  return (
    <div style={{ maxWidth: '900px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '8px' }}>
        My Applications
      </h1>
      <p style={{ color: '#64748b', marginBottom: '24px' }}>
        Welcome back, {user?.name}!
      </p>
      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px',
          color: '#64748b' }}>Loading...</div>
      ) : applications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px',
          color: '#64748b' }}>
          <p style={{ fontSize: '18px', marginBottom: '8px' }}>
            No applications yet
          </p>
          <a href="/jobs" style={{ color: '#3b82f6' }}>
            Browse jobs →
          </a>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {applications.map(app => {
            const sc = statusColor(app.status);
            return (
              <div key={app.id} style={{
                background: 'white', padding: '20px',
                borderRadius: '12px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                display: 'flex', justifyContent: 'space-between',
                alignItems: 'center', border: '1px solid #e2e8f0' }}>
                <div>
                  <h3 style={{ color: '#1e293b', marginBottom: '4px' }}>
                    {app.jobTitle}
                  </h3>
                  <p style={{ color: '#64748b', fontSize: '13px',
                    marginBottom: '4px' }}>
                    Applied: {new Date(app.appliedAt).toLocaleDateString()}
                  </p>
                  {app.resumeLink && (
                    <a href={app.resumeLink} target="_blank"
                      rel="noreferrer"
                      style={{ color: '#3b82f6', fontSize: '13px' }}>
                      View Resume
                    </a>
                  )}
                </div>
                <span style={{
                  padding: '6px 14px', borderRadius: '12px',
                  fontSize: '13px', fontWeight: '500',
                  background: sc.bg, color: sc.color }}>
                  {app.status}
                </span>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
export default SeekerDashboard;