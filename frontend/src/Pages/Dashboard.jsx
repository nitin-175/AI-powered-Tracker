
import JobTable from "../Components/JobTable";
import StatCard from "../Components/StatCard";
import ResumeBuilder from "../Components/ResumeBuilder";
import AutoApply from "../Pages/AutoApply"; // reuse page component
import { fetchJobs } from "../services/jobService";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showResumeBuilder, setShowResumeBuilder] = useState(false);
  const [showAutoApply, setShowAutoApply] = useState(false);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await fetchJobs();
        setJobs(data);
      } catch {
        console.error("Failed to load jobs");
      } finally {
        setLoading(false);
      }
    };

    loadJobs();
  }, []);

  const totalApplications = jobs.length;

  const activeApplications = jobs.filter(
    (job) => job.status === "Applied" || job.status === "Interview"
  ).length;

  const respondedJobs = jobs.filter(
    (job) =>
      job.status === "Interview" ||
      job.status === "Offer" ||
      job.status === "Selected"
  ).length;

  const responseRate =
    totalApplications === 0
      ? 0
      : Math.round((respondedJobs / totalApplications) * 100);


  if (loading) {
    return <p className="p-6 text-gray-500">Loading dashboard...</p>;
  }

  return (
    <>
      {/* STATS */}
      <div className="grid grid-cols-3 p-5 -mb-10">
        <StatCard title="Total Applications" value={totalApplications} />
        <StatCard title="Active Applications" value={activeApplications} />
        <StatCard
          title="Response Rate"
          value={`${responseRate}%`}
          subtitle="Based on responses"
        />
      </div>

     


      {/* quick access buttons */}
      <div className="p-5 flex gap-4 ml-70">
        <button
          onClick={() => setShowResumeBuilder(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700"
        >
          Resume Builder
        </button>
        <button
          onClick={() => setShowAutoApply(true)}
          className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
        >
          Auto Apply
        </button>
      </div>

      {showResumeBuilder && (
        <div className="p-5 bg-gray-50 rounded-lg shadow-inner">
          <button
            onClick={() => setShowResumeBuilder(false)}
            className="text-red-500 mb-2"
          >Close</button>
          <ResumeBuilder />
        </div>
      )}
      {showAutoApply && (
        <div className="p-5 bg-gray-50 rounded-lg shadow-inner">
          <button
            onClick={() => setShowAutoApply(false)}
            className="text-red-500 mb-2"
          >Close</button>
          <AutoApply />
        </div>
      )}

      <JobTable/>
    </>
  );
}
