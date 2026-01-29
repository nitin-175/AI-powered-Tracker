import { useEffect, useState } from "react";
import { jobAPI } from "../services/api";
import ApplicationsTable from "../components/ApplicationsTable";
import EditApplicationModal from "../components/EditApplicationModal";

export default function Applications() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [editingJob, setEditingJob] = useState(null);

  useEffect(() => {
    loadJobs();
  }, []);

  const loadJobs = async () => {
    try {
      setLoading(true);
      const data = await jobAPI.getAllJobs();
      setJobs(data);
      setError("");
    } catch {
      setError("Failed to load applications");
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this application?")) return;
    await jobAPI.deleteJob(id);
    setJobs((prev) => prev.filter((j) => j.id !== id));
  };

  const handleSaveEdit = async (updatedJob) => {
    const saved = await jobAPI.updateJob(updatedJob.id, updatedJob);
    setJobs((prev) =>
      prev.map((j) => (j.id === saved.id ? saved : j))
    );
    setEditingJob(null);
  };

  const filteredJobs = jobs.filter((job) => {
    const matchesSearch =
      job.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
      job.role.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus =
      filterStatus === "all" || job.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  if (loading) return <p className="p-6">Loading...</p>;
  if (error) return <p className="p-6 text-red-600">{error}</p>;

  return (
    <div className="p-6 ml-70 mt-10">
      <h1 className="text-3xl font-semibold mb-6">Applications</h1>

      {/* Filters */}
      <div className="flex gap-4 mb-6">
        <input
          className="flex-1 px-4 py-2 border rounded-lg"
          placeholder="Search company or role"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <select
          className="px-4 py-2 border rounded-lg"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="all">All</option>
          <option>Applied</option>
          <option>Interview</option>
          <option>Offer</option>
          <option>Rejected</option>
        </select>
      </div>

      <ApplicationsTable
        jobs={filteredJobs}
        onEdit={setEditingJob}
        onDelete={handleDelete}
      />

      {editingJob && (
        <EditApplicationModal
          job={editingJob}
          onClose={() => setEditingJob(null)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
