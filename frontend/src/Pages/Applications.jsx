import { useEffect, useState } from "react";
import JobTable from "../components/JobTable";
import { fetchJobs } from "../services/jobService";

const Applications = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await fetchJobs();
      setJobs(data);
    } catch {
      setError("Unable to load applications");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, []);

  if (loading) {
    return <p className="p-6 text-gray-500">Loading applications...</p>;
  }

  if (error) {
    return <p className="p-6 text-red-500">{error}</p>;
  }

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-4">Applications</h1>

      <JobTable jobs={jobs} refreshJobs={loadJobs} />
    </div>
  );
};

export default Applications;
