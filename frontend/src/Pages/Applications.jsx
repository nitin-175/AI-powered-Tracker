import { useEffect, useState } from "react";
import { fetchJobs } from "../services/jobService";
import JobTable from "../components/JobTable";

const Applications = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const loadJobs = async () => {
      try {
        const data = await fetchJobs();
        setJobs(data);
      } catch (err) {
        setError("Unable to load applications");
      } finally {
        setLoading(false);
      }
    };

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
      <h1 className="text-2xl  font-semibold mb-4">Applications</h1>
      <JobTable jobs={jobs} />
    </div>
  );
};

export default Applications;
