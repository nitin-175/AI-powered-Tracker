// src/pages/Analytics.jsx
import { useEffect, useState, useMemo } from "react";
import { jobAPI } from "../services/api";

const STATUSES = ["Applied", "Interview", "Offer", "Rejected"];

export default function Analytics() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("all");

  useEffect(() => {
    fetchJobs();
  }, [timeRange]);

  const fetchJobs = async () => {
    try {
      const data = await jobAPI.getAllJobs();
      setJobs(filterByTime(data, timeRange));
    } catch (err) {
      console.error("Analytics load failed:", err);
    } finally {
      setLoading(false);
    }
  };

  const filterByTime = (jobs, range) => {
    if (range === "all") return jobs;

    const now = new Date();
    const days = range === "30d" ? 30 : 7;
    const cutoff = new Date(now.setDate(now.getDate() - days));

    return jobs.filter((job) => {
      const date = new Date(job.appliedDate || job.applied_date);
      return !isNaN(date) && date >= cutoff;
    });
  };

  const stats = useMemo(() => {
    const base = {
      total: jobs.length,
      Applied: 0,
      Interview: 0,
      Offer: 0,
      Rejected: 0
    };

    jobs.forEach((job) => {
      if (STATUSES.includes(job.status)) {
        base[job.status]++;
      }
    });

    return base;
  }, [jobs]);

  const interviewRate = Math.round(
    ((stats.Interview + stats.Offer) / Math.max(stats.total, 1)) * 100
  );

  const offerRate = Math.round(
    (stats.Offer / Math.max(stats.total, 1)) * 100
  );

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="text-blue-700 font-medium">
          Loading analytics…
        </span>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 py-8 space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">
            Insights into your job applications
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard label="Total Applications" value={stats.total} accent="blue" />
          <StatCard label="Applied" value={stats.Applied} accent="blue" />
          <StatCard label="Interviews" value={stats.Interview} accent="amber" />
          <StatCard label="Offers" value={stats.Offer} accent="amber" />
        </div>

        {/* Success Rate */}
        <div className="bg-white rounded-xl border shadow-sm p-8">
          <div className="flex justify-between items-center mb-6">
            <h3 className="text-xl font-semibold text-gray-900">
              Success Rate
            </h3>

            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="px-4 py-2 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Time</option>
              <option value="30d">Last 30 Days</option>
              <option value="7d">Last 7 Days</option>
            </select>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <RateBox
              value={`${interviewRate}%`}
              label="Interview + Offer Rate"
              color="blue"
            />
            <RateBox
              value={`${offerRate}%`}
              label="Offer Conversion"
              color="amber"
            />
          </div>
        </div>

        {/* Breakdown */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <StatusBreakdown stats={stats} />
          <CompanyPerformance />
        </div>
      </div>
    </div>
  );
}

/* ---------- Small UI Components ---------- */

function StatCard({ label, value, accent }) {
  const color =
    accent === "amber" ? "text-amber-600" : "text-blue-700";

  return (
    <div className="bg-white p-6 rounded-xl border shadow-sm">
      <p className="text-sm text-gray-500 mb-1">{label}</p>
      <p className={`text-3xl font-bold ${color}`}>{value}</p>
    </div>
  );
}

function RateBox({ value, label, color }) {
  const text =
    color === "amber" ? "text-amber-600" : "text-blue-700";

  return (
    <div>
      <div className={`text-4xl font-bold ${text}`}>{value}</div>
      <div className="text-sm text-gray-500">{label}</div>
    </div>
  );
}

function StatusBreakdown({ stats }) {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Status Distribution
      </h3>

      {[
        ["Applied", "text-blue-700"],
        ["Interview", "text-amber-600"],
        ["Offer", "text-amber-600"],
        ["Rejected", "text-gray-500"]
      ].map(([label, color]) => (
        <div
          key={label}
          className="flex justify-between py-3 border-b last:border-0"
        >
          <span className="font-medium text-gray-900">{label}</span>
          <span className={`font-bold ${color}`}>
            {stats[label]}
          </span>
        </div>
      ))}
    </div>
  );
}

function CompanyPerformance() {
  return (
    <div className="bg-white rounded-xl border shadow-sm p-8">
      <h3 className="text-xl font-semibold text-gray-900 mb-6">
        Company Performance
      </h3>

      {[
        ["TCS", "25%"],
        ["Google", "40%"],
        ["Amazon", "15%"]
      ].map(([name, rate]) => (
        <div key={name} className="flex justify-between py-2">
          <span className="text-gray-900">{name}</span>
          <span className="font-medium text-amber-600">{rate}</span>
        </div>
      ))}
    </div>
  );
}
