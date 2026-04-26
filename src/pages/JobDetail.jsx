import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const JobDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [job, setJob] = useState(null);
  const [resume, setResume] = useState(null);
  const [applying, setApplying] = useState(false);
  const [applied, setApplied] = useState(false);

  useEffect(() => {
    api.get(`/api/jobs/${id}`).then(res => setJob(res.data));
  }, [id]);

  const handleApply = async (e) => {
    e.preventDefault();
    if (!user) { toast.error('Please login first'); return; }
    setApplying(true);
    try {
      const formData = new FormData();
      formData.append('jobId', id);
      if (resume) formData.append('resume', resume);
      await api.post('/api/applications', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      toast.success('Applied successfully!');
      setApplied(true);
    } catch (err) {
      toast.error(err.response?.data?.message || 'Apply failed');
    } finally {
      setApplying(false);
    }
  };

  if (!job) return (
    <div style={{ textAlign: 'center', padding: '60px',
      color: '#64748b' }}>Loading...</div>
  );

  return (
    <div style={{ maxWidth: '800px', margin: '0 auto', padding: '24px' }}>
      <div style={{ background: 'white', borderRadius: '12px',
        padding: '32px', boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
        <h1 style={{ color: '#1e293b', marginBottom: '8px' }}>
          {job.title}
        </h1>
        <p style={{ color: '#64748b', marginBottom: '8px' }}>
          📍 {job.location}
        </p>
        <p style={{ color: '#10b981', fontSize: '18px',
          fontWeight: '600', marginBottom: '16px' }}>
          ₹{Number(job.salary).toLocaleString()}
        </p>
        <div style={{ marginBottom: '16px' }}>
          {job.skillsRequired?.split(',').map((s, i) => (
            <span key={i} style={{
              background: '#eff6ff', color: '#3b82f6',
              padding: '4px 10px', borderRadius: '12px',
              fontSize: '13px', marginRight: '6px' }}>
              {s.trim()}
            </span>
          ))}
        </div>
        <h3 style={{ color: '#1e293b', marginBottom: '8px' }}>
          Description
        </h3>
        <p style={{ color: '#475569', lineHeight: '1.7',
          marginBottom: '24px' }}>{job.description}</p>
        <p style={{ color: '#94a3b8', fontSize: '13px',
          marginBottom: '24px' }}>Posted by {job.postedByName}</p>

        {user?.role === 'JOB_SEEKER' && !applied && (
          <form onSubmit={handleApply} style={{
            background: '#f8fafc', padding: '20px',
            borderRadius: '8px', border: '1px solid #e2e8f0' }}>
            <h3 style={{ marginBottom: '12px', color: '#1e293b' }}>
              Apply for this job
            </h3>
            <div style={{ marginBottom: '16px' }}>
              <label style={{ display: 'block', marginBottom: '6px',
                color: '#475569', fontSize: '14px' }}>
                Upload Resume (PDF)
              </label>
              <input type="file" accept=".pdf,.doc,.docx"
                onChange={e => setResume(e.target.files[0])}
                style={{ fontSize: '14px' }} />
            </div>
            <button type="submit" disabled={applying} style={{
              padding: '10px 24px', background: '#3b82f6',
              color: 'white', border: 'none', borderRadius: '8px',
              cursor: 'pointer', fontSize: '14px', fontWeight: '500' }}>
              {applying ? 'Applying...' : 'Apply Now'}
            </button>
          </form>
        )}
        {applied && (
          <div style={{ background: '#f0fdf4', padding: '16px',
            borderRadius: '8px', color: '#16a34a', fontWeight: '500' }}>
            ✅ Application submitted successfully!
          </div>
        )}
        {!user && (
          <p style={{ color: '#64748b' }}>
            Please <a href="/login" style={{ color: '#3b82f6' }}>login</a> to apply.
          </p>
        )}
      </div>
    </div>
  );
};
export default JobDetail;