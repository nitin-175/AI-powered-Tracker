// src/pages/Analytics.jsx
import { useState, useEffect } from 'react';
import { jobAPI } from '../services/api';

export default function Analytics() {
  const [stats, setStats] = useState({
    total: 0, applied: 0, interview: 0, offer: 0, rejected: 0
  });
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState('all');

  useEffect(() => {
    loadAnalytics();
  }, [timeRange]);

  const loadAnalytics = async () => {
    try {
      const jobs = await jobAPI.getAllJobs();
      const filtered = filterByTime(jobs, timeRange);
      
      setStats({
        total: filtered.length,
        applied: filtered.filter(j => j.status === 'Applied').length,
        interview: filtered.filter(j => j.status === 'Interview').length,
        offer: filtered.filter(j => j.status === 'Offer').length,
        rejected: filtered.filter(j => j.status === 'Rejected').length
      });
      setLoading(false);
    } catch (error) {
      console.error('Analytics load failed:', error);
      setLoading(false);
    }
  };

  const filterByTime = (jobs, range) => {
    const now = new Date();
    const cutoff = range === '30d' ? new Date(now - 30*24*60*60*1000) : 
                   range === '7d' ? new Date(now - 7*24*60*60*1000) : new Date(0);
    
    return jobs.filter(job => {
      const date = new Date(job.appliedDate || job.applied_date);
      return date >= cutoff;
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-blue-900 font-semibold">Loading analytics...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytics</h1>
          <p className="text-gray-600">Premium insights for your job search</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-8 rounded-xl shadow-sm border border-blue-50">
            <div className="text-sm font-medium text-gray-500 mb-2">Total Applications</div>
            <div className="text-3xl font-bold text-blue-900">{stats.total}</div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm border border-amber-50">
            <div className="text-sm font-medium text-gray-500 mb-2">Applied</div>
            <div className="text-3xl font-bold text-blue-900">{stats.applied}</div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm border border-blue-50">
            <div className="text-sm font-medium text-gray-500 mb-2">Interviews</div>
            <div className="text-3xl font-bold text-amber-600">{stats.interview}</div>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-sm border border-amber-50">
            <div className="text-sm font-medium text-gray-500 mb-2">Offers</div>
            <div className="text-3xl font-bold text-amber-600">{stats.offer}</div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border p-8 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">Success Rate</h3>
            <select 
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="all">All Time</option>
              <option value="30d">Last 30 Days</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <div className="text-4xl font-bold text-blue-900 mb-1">{Math.round((stats.interview + stats.offer) / Math.max(stats.total, 1) * 100)}%</div>
              <div className="text-sm text-gray-500">Interview + Offer Rate</div>
            </div>
            <div>
              <div className="text-4xl font-bold text-amber-600 mb-1">{Math.round(stats.offer / Math.max(stats.total, 1) * 100)}%</div>
              <div className="text-sm text-gray-500">Offer Conversion</div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-xl shadow-sm border p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Status Distribution</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-900 font-medium">Applied</span>
                <span className="text-blue-900 font-bold">{stats.applied}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-900 font-medium">Interview</span>
                <span className="text-amber-600 font-bold">{stats.interview}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-gray-100">
                <span className="text-gray-900 font-medium">Offer</span>
                <span className="text-amber-600 font-bold">{stats.offer}</span>
              </div>
              <div className="flex justify-between items-center py-3">
                <span className="text-gray-900 font-medium">Rejected</span>
                <span className="text-gray-500 font-bold">{stats.rejected}</span>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">Company Performance</h3>
            <div className="space-y-4">
              <div className="flex justify-between py-3">
                <span className="text-gray-900 font-medium">Top Companies</span>
                <span className="text-sm text-gray-500">Avg Success</span>
              </div>
              <div className="space-y-2">
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-900">TCS</span>
                  <span className="text-amber-600 font-medium">25%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-900">Google</span>
                  <span className="text-amber-600 font-medium">40%</span>
                </div>
                <div className="flex justify-between items-center py-2">
                  <span className="text-gray-900">Amazon</span>
                  <span className="text-blue-900 font-medium">15%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
