import { useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from '../context/AuthContext';
import toast from 'react-hot-toast';

const RecruiterDashboard = () => {
  const { user } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [applicants, setApplicants] = useState([]);
  const [selectedJob, setSelectedJob] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', location: '',
    salary: '', skillsRequired: ''
  });

  const fetchMyJobs = async () => {
    const res = await api.get('/api/jobs/my');
    setJobs(res.data.content || []);
  };

  useEffect(() => { fetchMyJobs(); }, []);

  const handlePost = async (e) => {
    e.preventDefault();
    try {
      await api.post('/api/jobs', { ...form, salary: Number(form.salary) });
      toast.success('Job posted!');
      setShowForm(false);
      setForm({ title:'', description:'', location:'', salary:'', skillsRequired:'' });
      fetchMyJobs();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to post job');
    }
  };

  const viewApplicants = async (jobId) => {
    setSelectedJob(jobId);
    const res = await api.get(`/api/applications/job/${jobId}`);
    setApplicants(res.data);
  };

  const updateStatus = async (appId, status) => {
    await api.put(`/api/applications/${appId}/status`, null,
      { params: { status } });
    toast.success('Status updated!');
    viewApplicants(selectedJob);
  };

  return (
    <div style={{ maxWidth: '1100px', margin: '0 auto', padding: '24px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between',
        alignItems: 'center', marginBottom: '24px' }}>
        <h1 style={{ color: '#1e293b' }}>
          Welcome, {user?.name}
        </h1>
        <button onClick={() => setShowForm(!showForm)} style={{
          padding: '10px 20px', background: '#10b981', color: 'white',
          border: 'none', borderRadius: '8px', cursor: 'pointer',
          fontSize: '14px', fontWeight: '500' }}>
          + Post New Job
        </button>
      </div>

      {showForm && (
        <div style={{ background: 'white', padding: '24px',
          borderRadius: '12px', marginBottom: '24px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)' }}>
          <h2 style={{ marginBottom: '16px', color: '#1e293b' }}>
            Post a Job
          </h2>
          <form onSubmit={handlePost}>
            {['title','location','salary','skillsRequired'].map(field => (
              <div key={field} style={{ marginBottom: '12px' }}>
                <input placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={form[field]}
                  onChange={e => setForm({...form, [field]: e.target.value})}
                  required={field !== 'skillsRequired'}
                  style={{ width: '100%', padding: '10px',
                    border: '1px solid #e2e8f0', borderRadius: '8px',
                    fontSize: '14px', boxSizing: 'border-box' }} />
              </div>
            ))}
            <textarea placeholder="Job description"
              value={form.description}
              onChange={e => setForm({...form, description: e.target.value})}
              required rows={4}
              style={{ width: '100%', padding: '10px',
                border: '1px solid #e2e8f0', borderRadius: '8px',
                fontSize: '14px', boxSizing: 'border-box',
                marginBottom: '12px' }} />
            <button type="submit" style={{
              padding: '10px 24px', background: '#3b82f6', color: 'white',
              border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
              Post Job
            </button>
          </form>
        </div>
      )}

      <h2 style={{ color: '#1e293b', marginBottom: '16px' }}>My Jobs</h2>
      {jobs.length === 0 ? (
        <p style={{ color: '#64748b' }}>No jobs posted yet.</p>
      ) : (
        <div style={{ display: 'grid', gap: '16px' }}>
          {jobs.map(job => (
            <div key={job.id} style={{
              background: 'white', padding: '20px', borderRadius: '12px',
              boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center' }}>
              <div>
                <h3 style={{ color: '#1e293b', marginBottom: '4px' }}>
                  {job.title}
                </h3>
                <p style={{ color: '#64748b', fontSize: '14px' }}>
                  📍 {job.location} · ₹{Number(job.salary).toLocaleString()}
                </p>
              </div>
              <button onClick={() => viewApplicants(job.id)} style={{
                padding: '8px 16px', background: '#3b82f6', color: 'white',
                border: 'none', borderRadius: '8px', cursor: 'pointer' }}>
                View Applicants
              </button>
            </div>
          ))}
        </div>
      )}

      {selectedJob && (
        <div style={{ marginTop: '32px' }}>
          <h2 style={{ color: '#1e293b', marginBottom: '16px' }}>
            Applicants
          </h2>
          {applicants.length === 0 ? (
            <p style={{ color: '#64748b' }}>No applicants yet.</p>
          ) : (
            <div style={{ display: 'grid', gap: '12px' }}>
              {applicants.map(app => (
                <div key={app.id} style={{
                  background: 'white', padding: '16px',
                  borderRadius: '12px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.08)',
                  display: 'flex', justifyContent: 'space-between',
                  alignItems: 'center' }}>
                  <div>
                    <p style={{ fontWeight: '500', color: '#1e293b' }}>
                      {app.applicantName}
                    </p>
                    <p style={{ color: '#64748b', fontSize: '13px' }}>
                      {app.applicantEmail}
                    </p>
                    {app.resumeLink && (
                      <a href={app.resumeLink} target="_blank"
                        rel="noreferrer" style={{ color: '#3b82f6',
                          fontSize: '13px' }}>View Resume</a>
                    )}
                  </div>
                  <div style={{ display: 'flex', gap: '8px',
                    alignItems: 'center' }}>
                    <span style={{
                      padding: '4px 10px', borderRadius: '12px',
                      fontSize: '12px', fontWeight: '500',
                      background: app.status === 'ACCEPTED' ? '#f0fdf4' :
                        app.status === 'REJECTED' ? '#fef2f2' : '#eff6ff',
                      color: app.status === 'ACCEPTED' ? '#16a34a' :
                        app.status === 'REJECTED' ? '#dc2626' : '#3b82f6'
                    }}>{app.status}</span>
                    <select onChange={e => updateStatus(app.id, e.target.value)}
                      defaultValue="" style={{ padding: '6px',
                        border: '1px solid #e2e8f0', borderRadius: '6px',
                        fontSize: '13px', cursor: 'pointer' }}>
                      <option value="" disabled>Change status</option>
                      <option value="REVIEWED">Reviewed</option>
                      <option value="ACCEPTED">Accept</option>
                      <option value="REJECTED">Reject</option>
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
};
export default RecruiterDashboard;