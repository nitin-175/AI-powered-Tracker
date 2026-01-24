import { useState } from "react";
import { updateJob, deleteJob } from "../services/jobService";

export default function JobTable({ jobs, refreshJobs }) {
  const [editingJob, setEditingJob] = useState(null);
  const [saving, setSaving] = useState(false);

  const startEdit = (job) => {
    setEditingJob({ ...job });
  };

  const cancelEdit = () => {
    setEditingJob(null);
  };

  const saveEdit = async () => {
    try {
      
      setSaving(true);
      await updateJob(editingJob.id, editingJob);
      setEditingJob(null);
      refreshJobs(); // 🔄 reload from Applications
    } catch {
      alert("Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this job?")) return;
    try {
      await deleteJob(id);
      refreshJobs(); // 🔄 reload from Applications
    } catch {
      alert("Failed to delete job");
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-[900px] w-full">
          <thead className="bg-blue-700">
            <tr className="text-white text-sm">
              <th className="px-4 py-3 text-left">Company</th>
              <th className="px-4 py-3 text-left">Role</th>
              <th className="px-4 py-3 text-left">Status</th>
              <th className="px-4 py-3 text-left">Applied Date</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>

          <tbody>
            {jobs.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-6 text-center text-gray-400">
                  No applications found
                </td>
              </tr>
            ) : (
              jobs.map((job) => {
                const isEditing = editingJob?.id === job.id;

                return (
                  <tr key={job.id} className="border-t text-sm hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">
                      {job.company}
                    </td>

                    <td className="px-4 py-3">
                      {job.role}
                    </td>

                    <td className="px-4 py-3">
                      {isEditing ? (
                        <select
                          value={editingJob.status}
                          onChange={(e) =>
                            setEditingJob({
                              ...editingJob,
                              status: e.target.value,
                            })
                          }
                          className="border rounded-lg px-2 py-1"
                        >
                          <option>Applied</option>
                          <option>Interview</option>
                          <option>Offer</option>
                          <option>Rejected</option>
                        </select>
                      ) : (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-700">
                          {job.status}
                        </span>
                      )}
                    </td>

                    <td className="px-4 py-3">
                      {new Date(job.appliedDate).toLocaleDateString()}
                    </td>

                    <td className="px-4 py-3 text-right space-x-2">
                      {isEditing ? (
                        <>
                          <button
                            onClick={saveEdit}
                            disabled={saving}
                            className="px-3 py-1 bg-green-600 text-white rounded"
                          >
                            {saving ? "Saving..." : "Save"}
                          </button>
                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1 bg-gray-300 rounded"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(job)}
                            className="px-3 py-1 bg-blue-600 text-white rounded"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(job.id)}
                            className="px-3 py-1 bg-red-600 text-white rounded"
                          >
                            Delete
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
