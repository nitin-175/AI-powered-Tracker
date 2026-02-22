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
      setTimeout(() => setLoading(false), 600);
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
    const base = { total: jobs.length, Applied: 0, Interview: 0, Offer: 0, Rejected: 0 };
    jobs.forEach((job) => {
      if (STATUSES.includes(job.status)) base[job.status]++;
    });
    return base;
  }, [jobs]);

  const topCompanies = useMemo(() => {
    const counts = {};
    jobs.forEach((job) => {
      const name = job.companyName || job.company_name || "Unknown";
      if (!counts[name]) counts[name] = { total: 0, success: 0 };
      counts[name].total++;
      if (["Interview", "Offer"].includes(job.status)) counts[name].success++;
    });

    return Object.entries(counts)
      .map(([name, data]) => ({
        name,
        total: data.total,
        rate: Math.round((data.success / Math.max(data.total, 1)) * 100),
      }))
      .sort((a, b) => b.total - a.total)
      .slice(0, 4); 
  }, [jobs]);

  const activityData = useMemo(() => {
    const days = Array.from({ length: 14 }, (_, i) => {
      const d = new Date();
      d.setDate(d.getDate() - (13 - i));
      return d.toISOString().split("T")[0];
    });

    const counts = days.reduce((acc, day) => ({ ...acc, [day]: 0 }), {});
    jobs.forEach((job) => {
      const date = new Date(job.appliedDate || job.applied_date);
      if (!isNaN(date)) {
        const dateStr = date.toISOString().split("T")[0];
        if (counts[dateStr] !== undefined) counts[dateStr]++;
      }
    });

    const max = Math.max(...Object.values(counts), 1);
    return days.map((day) => ({
      date: day,
      count: counts[day],
      height: Math.max((counts[day] / max) * 100, 4), 
    }));
  }, [jobs]);

  if (loading) return <SkeletonLoader />;
 
  return (
    <div className="min-h-screen bg-[#FDFDFD] md:ml-64 font-sans text-black selection:bg-amber-200/50 mt-10">
      <div className="max-w-[1400px] mx-auto px-6 lg:px-12 py-10 space-y-10">
        
        {/* Header */}
        <header className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-6 border-b border-gray-200">
          <div className="space-y-1">
            <h1 className="text-2xl font-medium tracking-tight text-black">Performance Analytics</h1>
            <p className="text-sm text-gray-500 font-medium">Deep dive into your application metrics and conversion funnel.</p>
          </div>
          <div className="relative inline-flex items-center">
            <svg className="absolute left-3 w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <select
              value={timeRange}
              onChange={(e) => setTimeRange(e.target.value)}
              className="appearance-none bg-white border border-gray-200 text-black text-sm font-medium py-2 pl-9 pr-10 rounded-lg shadow-sm hover:border-gray-300 focus:outline-none focus:ring-2 focus:ring-black transition-all cursor-pointer"
            >
              <option value="all">Lifetime</option>
              <option value="30d">Trailing 30 Days</option>
              <option value="7d">Trailing 7 Days</option>
            </select>
          </div>
        </header>

        {/* Primary Data Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm flex flex-col justify-between relative overflow-hidden group">
            <div className="flex justify-between items-start mb-6">
              <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Total Velocity</span>
              <span className="flex items-center gap-1 text-xs font-medium text-blue-700 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-200">
                <svg className="w-3 h-3" viewBox="0 0 12 12" fill="none"><path d="M2.5 8.5L5.5 5.5L7.5 7.5L10.5 3.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/></svg>
                Active
              </span>
            </div>
            <div>
              <span className="text-4xl font-semibold tracking-tighter text-black tabular-nums">{stats.total}</span>
              <div className="h-10 mt-4 flex items-end gap-1 w-full opacity-60 group-hover:opacity-100 transition-opacity">
                {activityData.map((data, i) => (
                  <div key={i} className="flex-1 bg-gray-100 rounded-t-sm hover:bg-black transition-colors relative group/bar">
                    <div style={{ height: `${data.height}%` }} className="bg-gray-800 rounded-t-sm w-full transition-all duration-500"></div>
                    <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-black text-white text-[10px] py-1 px-2 rounded opacity-0 group-hover/bar:opacity-100 pointer-events-none whitespace-nowrap z-10 transition-opacity">
                      {data.count} app(s)
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          <StatCard label="In Progress" value={stats.Applied} subtitle="Awaiting review" />
          <StatCard label="Interviews" value={stats.Interview} subtitle="Active technical rounds" highlight="text-blue-600" borderHighlight="border-blue-200" bgHighlight="bg-blue-50/30" />
          <StatCard label="Offers" value={stats.Offer} subtitle="Successfully negotiated" highlight="text-amber-600" borderHighlight="border-amber-200" bgHighlight="bg-amber-50/30" />
        </div>

        {/* Complex Data Bento Box */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Conversion Pipeline */}
          <div className="lg:col-span-2 bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 flex justify-between items-center bg-gray-50/80">
              <h3 className="text-sm font-semibold text-black">Conversion Pipeline</h3>
              <span className="text-xs text-gray-500 font-medium font-mono">FUNNEL_ANALYSIS</span>
            </div>
            <div className="p-6 sm:p-8 space-y-8 flex-1">
              <PipelineRow label="Initial Applications" count={stats.Applied} total={stats.total} color="bg-black" />
              <div className="pl-4 border-l-2 border-gray-100 ml-4 py-2 space-y-8">
                <PipelineRow label="Screening / Interviews" count={stats.Interview} total={stats.total} color="bg-blue-600" />
                <PipelineRow label="Final Offers" count={stats.Offer} total={stats.total} color="bg-amber-500" />
              </div>
              <div className="pt-6 border-t border-gray-100 border-dashed">
                <PipelineRow label="Rejected / Ghosted" count={stats.Rejected} total={stats.total} color="bg-gray-300" text="text-gray-500" />
              </div>
            </div>
          </div>

          {/* Dynamic Top Companies */}
          <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden flex flex-col">
            <div className="p-6 border-b border-gray-100 bg-gray-50/80">
              <h3 className="text-sm font-semibold text-black">High Intent Targets</h3>
              <p className="text-xs text-gray-500 mt-1">Companies with most interaction</p>
            </div>
            <div className="p-6 flex-1 flex flex-col gap-6 justify-center">
              {topCompanies.length > 0 ? (
                topCompanies.map((company, index) => (
                  <div key={index} className="group">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-3">
                        <span className="text-xs font-mono text-gray-400">0{index + 1}</span>
                        <span className="text-sm font-medium text-black">{company.name}</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="text-xs text-gray-400 font-medium">Vol: {company.total}</span>
                        <span className="text-sm font-semibold text-black tabular-nums">{company.rate}%</span>
                      </div>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-1 overflow-hidden">
                      <div 
                        className="bg-black h-1 rounded-full transition-all duration-1000 ease-out group-hover:bg-amber-500" 
                        style={{ width: `${company.rate}%` }}
                      ></div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center text-sm text-gray-500 py-10">Not enough data to calculate top companies.</div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------- Advanced Micro-Components ---------- */

function StatCard({ label, value, subtitle, highlight = "text-black", borderHighlight = "border-gray-200", bgHighlight = "bg-white" }) {
  return (
    <div className={`p-6 rounded-2xl border ${borderHighlight} ${bgHighlight} shadow-sm flex flex-col justify-between transition-all hover:border-gray-300`}>
      <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-8 block">{label}</span>
      <div>
        <span className={`text-4xl font-semibold tracking-tighter tabular-nums ${highlight}`}>{value}</span>
        <span className="block text-xs font-medium text-gray-400 mt-2">{subtitle}</span>
      </div>
    </div>
  );
}

function PipelineRow({ label, count, total, color, text = "text-black" }) {
  const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : "0.0";
  
  return (
    <div className="group relative">
      <div className="flex justify-between items-end mb-3">
        <span className="text-sm font-medium text-gray-600 group-hover:text-black transition-colors">{label}</span>
        <div className="flex items-baseline gap-4">
          <span className={`text-xl font-semibold tabular-nums tracking-tight ${text}`}>{count}</span>
          <span className="text-xs font-mono text-gray-400 w-10 text-right">{percentage}%</span>
        </div>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
        <div 
          className={`h-1.5 rounded-full ${color} transition-all duration-1000 ease-out relative`} 
          style={{ width: `${percentage}%` }}
        ></div>
      </div>
    </div>
  );
}

function SkeletonLoader() {
  return (
    <div className="min-h-screen bg-[#FDFDFD] md:ml-64 p-6 lg:p-12 space-y-10 animate-pulse">
      <div className="flex justify-between pb-6 border-b border-gray-200">
        <div className="space-y-3">
          <div className="h-6 w-48 bg-gray-200 rounded-md"></div>
          <div className="h-4 w-64 bg-gray-100 rounded-md"></div>
        </div>
        <div className="h-10 w-32 bg-gray-200 rounded-lg"></div>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-40 bg-gray-100 rounded-2xl border border-gray-200"></div>
        ))}
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 h-80 bg-gray-100 rounded-2xl border border-gray-200"></div>
        <div className="h-80 bg-gray-100 rounded-2xl border border-gray-200"></div>
      </div>
    </div>
  );
}