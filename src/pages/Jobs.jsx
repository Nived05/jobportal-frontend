import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api/axios';

const Jobs = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [keyword, setKeyword] = useState('');
  const [location, setLocation] = useState('');
  const [page, setPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const navigate = useNavigate();

  const fetchJobs = async () => {
    setLoading(true);
    try {
      const res = await api.get('/api/jobs/search', {
        params: { keyword, location, page, size: 9 }
      });
      setJobs(res.data.content);
      setTotalPages(res.data.totalPages);
    } catch {
      const res = await api.get('/api/jobs', {
        params: { page, size: 9 }
      });
      setJobs(res.data.content);
      setTotalPages(res.data.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchJobs(); }, [page]);

  const handleSearch = (e) => {
    e.preventDefault();
    setPage(0);
    fetchJobs();
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
      <h1 style={{ color: '#1e293b', marginBottom: '24px' }}>
        Find Jobs
      </h1>
      <form onSubmit={handleSearch} style={{
        display: 'flex', gap: '12px', marginBottom: '32px',
        flexWrap: 'wrap' }}>
        <input placeholder="Job title or skill..."
          value={keyword}
          onChange={e => setKeyword(e.target.value)}
          style={{ flex: 1, padding: '10px', border: '1px solid #e2e8f0',
            borderRadius: '8px', fontSize: '14px', minWidth: '200px' }} />
        <input placeholder="Location..."
          value={location}
          onChange={e => setLocation(e.target.value)}
          style={{ flex: 1, padding: '10px', border: '1px solid #e2e8f0',
            borderRadius: '8px', fontSize: '14px', minWidth: '150px' }} />
        <button type="submit" style={{
          padding: '10px 24px', background: '#3b82f6', color: 'white',
          border: 'none', borderRadius: '8px', cursor: 'pointer',
          fontSize: '14px', fontWeight: '500' }}>
          Search
        </button>
      </form>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '40px',
          color: '#64748b' }}>Loading jobs...</div>
      ) : jobs.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px',
          color: '#64748b' }}>No jobs found.</div>
      ) : (
        <div style={{ display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
          gap: '20px' }}>
          {jobs.map(job => (
            <div key={job.id} style={{
              background: 'white', borderRadius: '12px', padding: '24px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              border: '1px solid #e2e8f0', cursor: 'pointer',
              transition: 'transform 0.2s' }}
              onClick={() => navigate(`/jobs/${job.id}`)}>
              <h3 style={{ color: '#1e293b', marginBottom: '8px' }}>
                {job.title}
              </h3>
              <p style={{ color: '#64748b', fontSize: '14px',
                marginBottom: '8px' }}>📍 {job.location}</p>
              <p style={{ color: '#10b981', fontSize: '14px',
                fontWeight: '500', marginBottom: '12px' }}>
                ₹{Number(job.salary).toLocaleString()}
              </p>
              <p style={{ color: '#475569', fontSize: '13px',
                marginBottom: '12px', lineHeight: '1.5' }}>
                {job.description?.substring(0, 100)}...
              </p>
              {job.skillsRequired && (
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {job.skillsRequired.split(',').map((s, i) => (
                    <span key={i} style={{
                      background: '#eff6ff', color: '#3b82f6',
                      padding: '2px 8px', borderRadius: '12px',
                      fontSize: '12px' }}>{s.trim()}</span>
                  ))}
                </div>
              )}
              <p style={{ color: '#94a3b8', fontSize: '12px',
                marginTop: '12px' }}>Posted by {job.postedByName}</p>
            </div>
          ))}
        </div>
      )}

      <div style={{ display: 'flex', justifyContent: 'center',
        gap: '8px', marginTop: '32px' }}>
        <button onClick={() => setPage(p => Math.max(0, p-1))}
          disabled={page === 0} style={{
          padding: '8px 16px', border: '1px solid #e2e8f0',
          borderRadius: '8px', cursor: 'pointer', background: 'white' }}>
          Previous
        </button>
        <span style={{ padding: '8px 16px', color: '#64748b' }}>
          Page {page + 1} of {totalPages}
        </span>
        <button onClick={() => setPage(p => Math.min(totalPages-1, p+1))}
          disabled={page >= totalPages - 1} style={{
          padding: '8px 16px', border: '1px solid #e2e8f0',
          borderRadius: '8px', cursor: 'pointer', background: 'white' }}>
          Next
        </button>
      </div>
    </div>
  );
};
export default Jobs;