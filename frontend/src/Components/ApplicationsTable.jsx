export default function ApplicationsTable({
  jobs,
  onEdit,
  onDelete,
  onAnalyze,
  onAutoApply, // new callback
  aiLoading,
  analyzingJobId,
  aiAvailable = true
}) {

  const getStatusStyle = (status) => {
    switch ((status || "").toLowerCase()) {
      case "applied":
        return "bg-blue-100 text-blue-700";
      case "interview":
        return "bg-amber-100 text-amber-700";
      case "offer":
        return "bg-green-100 text-green-700";
      case "rejected":
        return "bg-red-100 text-red-700";
      default:
        return "bg-gray-100 text-gray-600";
    }
  };

  return (
    <div className="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="bg-blue-600 text-white">
          <tr>
            <th className="px-5 py-3 text-left font-semibold">#</th>
            <th className="px-5 py-3 text-left font-semibold">Company</th>
            <th className="px-5 py-3 text-left font-semibold">Role</th>
            <th className="px-5 py-3 text-left font-semibold">Status</th>
            <th className="px-5 py-3 text-left font-semibold">Applied Date</th>
            <th className="px-5 py-3 text-center font-semibold">AI</th>
            <th className="px-5 py-3 text-center font-semibold">Actions</th>
          </tr>
        </thead>

        <tbody>
          {!Array.isArray(jobs) || jobs.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-10 text-gray-400">
                No applications found
              </td>
            </tr>
          ) : (
            jobs.map((job, index) => (
              <tr
                key={job.id}
                className="border-t hover:bg-blue-50/40 transition"
              >
                <td className="px-5 py-4 font-medium text-blue-600">
                  {index + 1}
                </td>

                <td className="px-5 py-4 font-medium text-gray-800">
                  {job.company || "-"}
                </td>

                <td className="px-5 py-4 text-gray-700">
                  {job.role || "-"}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${getStatusStyle(
                      job.status
                    )}`}
                  >
                    {job.status || "-"}
                  </span>
                </td>

                <td className="px-5 py-4 text-gray-600">
                  {job.appliedDate
                    ? new Date(job.appliedDate).toLocaleDateString()
                    : "-"}
                </td>

                <td className="px-5 py-4 text-center">
                  <button
                    onClick={() => onAnalyze(job.id)}
                    disabled={!aiAvailable || (aiLoading && analyzingJobId === job.id)}
                    className="px-4 py-1.5 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                    title={!aiAvailable ? "AI features unavailable" : "Analyze this job with AI"}
                  >
                    {!aiAvailable ? "AI Unavailable" : aiLoading && analyzingJobId === job.id ? "Analyzing..." : "Analyze"}
                  </button>
                </td>

                <td className="px-5 py-4 text-center">
                  <button
                    onClick={() => onEdit(job)}
                    className="mr-2 px-3 py-1.5 rounded-md text-black bg-amber-300 hover:bg-amber-400 transition"
                  >
                    Edit
                  </button>

                  <button
                    onClick={() => onDelete(job.id)}
                    className="px-3 py-1.5 rounded-md text-black bg-red-300 hover:bg-red-400 transition"
                  >
                    Delete
                  </button>
                  {onAutoApply && (
                    <button
                      onClick={() => onAutoApply(job)}
                      className="ml-2 px-3 py-1.5 rounded-md text-white bg-green-500 hover:bg-green-600 transition"
                    >
                      Apply
                    </button>
                  )}
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
