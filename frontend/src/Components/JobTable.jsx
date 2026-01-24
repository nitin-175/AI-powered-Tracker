import { useState } from "react";
import { deleteJob, updateJob } from "../services/jobService";

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
      refreshJobs();
    } catch (err) {
      alert("Failed to update job");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this job?")) return;
    await deleteJob(id);
    refreshJobs();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm overflow-hidden">

      {/* RESPONSIVE WRAPPER */}
      <div className="overflow-x-auto">
        <table className="min-w-[800px] w-full">
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
                <td colSpan="5" className="py-8 text-center text-gray-400">
                  No applications found
                </td>
              </tr>
            ) : (
              jobs.map((job) => {
                const isEditing = editingJob?.id === job.id;

                return (
                  <tr
                    key={job.id}
                    className="border-t text-sm hover:bg-gray-50 transition"
                  >
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
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium
                            ${
                              job.status === "Applied"
                                ? "bg-blue-100 text-blue-700"
                                : job.status === "Interview"
                                ? "bg-yellow-100 text-yellow-700"
                                : job.status === "Offer"
                                ? "bg-green-100 text-green-700"
                                : "bg-red-100 text-red-700"
                            }`}
                        >
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
                            className="px-3 py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                          >
                            {saving ? "Saving..." : "Save"}
                          </button>

                          <button
                            onClick={cancelEdit}
                            className="px-3 py-1.5 bg-gray-200 rounded-lg hover:bg-gray-300"
                          >
                            Cancel
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEdit(job)}
                            className="px-3 py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                          >
                            Edit
                          </button>

                          <button
                            onClick={() => handleDelete(job.id)}
                            className="px-3 py-1.5 bg-red-600 text-white rounded-lg hover:bg-red-700"
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
