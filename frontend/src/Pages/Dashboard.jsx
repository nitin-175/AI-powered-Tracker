import JobFilters from "../Components/JobFilters";
import JobTable from "../Components/JobTable";
import StatCard from "../Components/StatCard";
import { fetchJobs } from "../services/jobService";
import { useEffect, useState } from "react";

export default function Dashboard() {
  const [jobs, setJobs] = useState([]);
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await fetchJobs();
        setJobs(data);
      } catch (err) {
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

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.role.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === "" || job.status === status;

    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return <p className="p-6 text-gray-500">Loading dashboard...</p>;
  }

  return (
    <>
      {/* STATS */}
      <div className="grid grid-cols-3 p-10">
        <StatCard title="Total Applications" value={totalApplications} />
        <StatCard title="Active Applications" value={activeApplications} />
        <StatCard
          title="Response Rate"
          value={`${responseRate}%`}
          subtitle="Based on responses"
        />
      </div>

      {/* FILTERS + TABLE */}
      <div className="p-6">
        <JobFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
        />

        <JobTable jobs={filteredJobs} showActions={false} />
      </div>
    </>
  );
}
