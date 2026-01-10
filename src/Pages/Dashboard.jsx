import JobFilters from "../Components/JobFilters";
import JobTable from "../Components/JobTable";
import StatCard from "../Components/StatCard";
import { jobs as jobsData } from "../data/jobs";
import { useState } from "react";




export default function Dashboard() {


  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const [jobs, setJobs] = useState(jobsData);

  const totalApplications = jobs.length;

  const activeApplications = jobs.filter(
    (job) => job.status === "Applied" || job.status === "Interview"
  ).length;

  const respondedJobs = jobs.filter(
    (job) => job.status === "Interview" || job.status === "Offer" || job.status === "Selected"
  ).length;

  const responseRate =
    totalApplications === 0
      ? 0
      : Math.round((respondedJobs / totalApplications) * 100);


  const filteredJobs = jobsData.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.role.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === "" || job.status === status;

    return matchesSearch && matchesStatus;
  });



  return (
    <>
      <div className="grid grid-cols-3 p-10">

        <StatCard title="Total Applications" value={totalApplications} />
        <StatCard title="Active Applications" value={activeApplications} />
        <StatCard
          title="Response Rate"
          value={`${responseRate}%`}
          subtitle="Based on responses"
        />

    
      </div> 

      <div className="p-6">
        <JobFilters
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
        />

        <JobTable jobs={filteredJobs} />
      </div>


    </>

  )
}
