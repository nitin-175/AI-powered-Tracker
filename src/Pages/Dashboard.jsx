import JobFilters from "../Components/JobFilters";
import JobTable from "../Components/JobTable";
import Sidebar from "../Components/Sidebar";
import StatCard from "../Components/StatCard";
import Topbar from "../Components/Topbar";
import { jobs } from "../data/jobs";
import { useState } from "react";




export default function Dashboard() {


  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.role.toLowerCase().includes(search.toLowerCase());

    const matchesStatus =
      status === "" || job.status === status;

    return matchesSearch && matchesStatus;
  });



  return (
    <>
      <Topbar />
      <Sidebar />

      <div className="grid grid-cols-3 p-10">

        <StatCard title="Total Applications" value="120" />
        <StatCard title="Active Applications" value="45" />
        <StatCard title="Response Rate" value="38%" subtitle="Last 30 days" />
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
