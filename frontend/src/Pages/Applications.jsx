// src/pages/Applications.jsx - COMPLETE APPLICATIONS PAGE

import { useState, useEffect } from 'react';
import { jobAPI } from '../services/api';

export default function Applications() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [editingJob, setEditingJob] = useState(null);
  const [showEditModal, setShowEditModal] = useState(false);

  // Load jobs from database
  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await jobAPI.getAllJobs();
      setJobs(data);
      setError(null);
    } catch (err) {
      setError('Failed to load applications. Make sure backend is running.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Delete job
  const handleDelete = async (id, company) => {
    if (window.confirm(`Delete application for ${company}?`)) {
      try {
        await jobAPI.deleteJob(id);
        setJobs(jobs.filter(job => job.id !== id));
        alert('✅ Application deleted successfully!');
      } catch (err) {
        alert('❌ Failed to delete application');
        console.error(err);
      }
    }
  };

  // Open edit modal
  const openEditModal = (job) => {
    setEditingJob({...job});
    setShowEditModal(true);
  };

  // Save edited job
  const saveEdit = async () => {
    try {
      const updated = await jobAPI.updateJob(editingJob.id, editingJob);
      setJobs(jobs.map(job => job.id === updated.id ? updated : job));
      setShowEditModal(false);
      setEditingJob(null);
      alert('✅ Application updated successfully!');
    } catch (err) {
      alert('❌ Failed to update application');
      console.error(err);
    }
  };

  // Filter jobs
  const filteredJobs = jobs.filter(job => {
    const matchesSearch = job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         job.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === 'all' || job.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // Calculate stats
  const totalJobs = jobs.length;
  const appliedCount = jobs.filter(j => j.status === 'Applied').length;
  const interviewCount = jobs.filter(j => j.status === 'Interview').length;
  const offerCount = jobs.filter(j => j.status === 'Offer').length;

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">⏳</div>
          <div className="text-2xl text-gray-600">Loading applications...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="text-4xl mb-4">❌</div>
          <div className="text-xl text-red-600 mb-4">{error}</div>
          <button 
            onClick={loadJobs}
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="ml-70 bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-6 shadow-lg">
        <h1 className="text-4xl font-bold mb-2">My Applications</h1>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="text-sm text-gray-600 mb-2">Applied</div>
            <div className="text-4xl font-bold text-yellow-600">{appliedCount}</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-purple-600">
            <div className="text-sm text-gray-600 mb-2">Interviews</div>
            <div className="text-4xl font-bold text-purple-600">{interviewCount}</div>
          </div>
          
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-600">
            <div className="text-sm text-gray-600 mb-2">Offers</div>
            <div className="text-4xl font-bold text-green-600">{offerCount}</div>
          </div>
        </div>

        {/* Search and Filter */}
        <div className="bg-white rounded-2xl shadow-lg p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <input
                type="text"
                placeholder="🔍 Search by company or role..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 focus:border-blue-400"
              />
            </div>
            
            <select 
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-6 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 bg-white"
            >
              <option value="all">All Status</option>
              <option value="Applied">Applied</option>
              <option value="Interview">Interview</option>
              <option value="Offer">Offer</option>
              <option value="Rejected">Rejected</option>
            </select>
          </div>
          
          
        </div>

        {/* Applications Table */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-bold">ID</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Company</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Role</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Applied Date</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Status</th>
                  <th className="px-6 py-4 text-left text-sm font-bold">Job Link</th>
                  <th className="px-6 py-4 text-center text-sm font-bold">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredJobs.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center">
                      <div className="text-4xl mb-4">📭</div>
                      <div className="text-xl text-gray-600">No applications found</div>
                      <div className="text-gray-500 mt-2">
                        {searchTerm || filterStatus !== 'all' 
                          ? 'Try adjusting your filters' 
                          : 'Start adding job applications!'}
                      </div>
                    </td>
                  </tr>
                ) : (
                  filteredJobs.map((job, index) => (
                    <tr key={job.id} className="hover:bg-blue-50 transition-colors">
                      <td className="px-6 py-4 text-gray-900 font-medium">{index+1}</td>
                      <td className="px-6 py-4">
                        <div className="font-bold text-gray-900">{job.company}</div>
                      </td>
                      <td className="px-6 py-4 text-gray-700">{job.role}</td>
                      <td className="px-6 py-4 text-gray-600">{job.appliedDate || job.applied_date}</td>
                      <td className="px-6 py-4">
                        <span className={`px-4 py-2 rounded-full text-sm font-semibold inline-block
                          ${job.status === 'Applied' ? 'bg-yellow-100 text-yellow-800' : ''}
                          ${job.status === 'Interview' ? 'bg-purple-100 text-purple-800' : ''}
                          ${job.status === 'Offer' ? 'bg-green-100 text-green-800' : ''}
                          ${job.status === 'Rejected' ? 'bg-red-100 text-red-800' : ''}
                        `}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        {job.jobUrl || job.job_link ? (
                          <a 
                            href={job.jobUrl || job.job_link} 
                            target="_blank" 
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                          >
                            🔗 View Job
                          </a>
                        ) : (
                          <span className="text-gray-400">No link</span>
                        )}
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex justify-center gap-2">
                          <button 
                            onClick={() => openEditModal(job)}
                            className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 font-medium transition-all"
                          >
                            ✏️ Edit
                          </button>
                          <button 
                            onClick={() => handleDelete(job.id, job.company)}
                            className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 font-medium transition-all"
                          >
                            🗑️ Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit Modal */}
      {showEditModal && editingJob && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-6 rounded-t-2xl">
              <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold">✏️ Edit Application</h2>
                <button 
                  onClick={() => setShowEditModal(false)}
                  className="text-white text-3xl hover:bg-white hover:bg-opacity-20 rounded-full w-10 h-10 flex items-center justify-center"
                >
                  ×
                </button>
              </div>
            </div>

            {/* Modal Body */}
            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Company Name
                </label>
                <input
                  type="text"
                  value={editingJob.company}
                  onChange={(e) => setEditingJob({...editingJob, company: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Role/Position
                </label>
                <input
                  type="text"
                  value={editingJob.role}
                  onChange={(e) => setEditingJob({...editingJob, role: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Application Status
                </label>
                <select
                  value={editingJob.status}
                  onChange={(e) => setEditingJob({...editingJob, status: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100"
                >
                  <option value="Applied">Applied</option>
                  <option value="Interview">Interview</option>
                  <option value="Offer">Offer</option>
                  <option value="Rejected">Rejected</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Applied Date
                </label>
                <input
                  type="date"
                  value={editingJob.appliedDate || editingJob.applied_date}
                  onChange={(e) => setEditingJob({...editingJob, appliedDate: e.target.value})}
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Link
                </label>
                <input
                  type="url"
                  value={editingJob.jobUrl || editingJob.job_link || ''}
                  onChange={(e) => setEditingJob({...editingJob, jobUrl: e.target.value})}
                  placeholder="https://company.com/job"
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Job Description
                </label>
                <textarea
                  value={editingJob.description || ''}
                  onChange={(e) => setEditingJob({...editingJob, description: e.target.value})}
                  rows="4"
                  placeholder="Paste job description here..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 resize-vertical"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Notes
                </label>
                <textarea
                  value={editingJob.notes || ''}
                  onChange={(e) => setEditingJob({...editingJob, notes: e.target.value})}
                  rows="3"
                  placeholder="Add personal notes..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-4 focus:ring-blue-100 resize-vertical"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-gray-50 rounded-b-2xl flex gap-4">
              <button
                onClick={() => setShowEditModal(false)}
                className="flex-1 px-6 py-3 bg-gray-200 text-gray-800 font-bold rounded-xl hover:bg-gray-300 transition-all"
              >
                Cancel
              </button>
              <button
                onClick={saveEdit}
                className="flex-1 px-6 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white font-bold rounded-xl hover:from-blue-700 hover:to-indigo-700 transition-all"
              >
                💾 Save Changes
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
