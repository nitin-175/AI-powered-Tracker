import { useEffect, useState } from "react";
import { fetchJobs, deleteJob } from "../services/jobService";
import JobTable from "../components/JobTable";

const Applications = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadJobs = async () => {
    const data = await fetchJobs();
    setJobs(data);
  };

  useEffect(() => {
    loadJobs().finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id) => {
    try {
      await deleteJob(id);

      // ✅ REMOVE FROM UI IMMEDIATELY
      setJobs((prev) => prev.filter((job) => job.id !== id));

    } catch (err) {
      alert("❌ Failed to delete job");
    }
  };

  if (loading) return <p>Loading...</p>;

  return (
    <JobTable jobs={jobs} onDelete={handleDelete} />
  );
};

export default Applications;
