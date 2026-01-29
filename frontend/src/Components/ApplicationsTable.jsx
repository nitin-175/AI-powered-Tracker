export default function ApplicationsTable({ jobs, onEdit, onDelete, onAnalyze, aiLoading }) {
  const getStatusStyle = (status) => {
    switch (status?.toLowerCase()) {
      case "applied":
        return "bg-blue-200 text-blue-700 border border-blue-200";
      case "interview":
        return "bg-amber-200 text-amber-700 border border-amber-200";
      case "offer":
        return "bg-green-200 text-green-700 border border-green-200";
      case "rejected":
        return "bg-red-200 text-red-700 border border-red-200";
      default:
        return "bg-gray-200 text-gray-600 border border-gray-200";
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
          {jobs.length === 0 ? (
            <tr>
              <td colSpan="7" className="text-center py-10 text-gray-400">
                No applications found
              </td>
            </tr>
          ) : (
            jobs.map((job, index) => (
              <tr
                key={job.id}
                className="border-t hover:bg-amber-50/40 transition"
              >
                <td className="px-5 py-4 font-medium text-blue-600">
                  {index + 1}
                </td>

                <td className="px-5 py-4 font-medium text-gray-800">
                  {job.company}
                </td>

                <td className="px-5 py-4 text-gray-700">
                  {job.role}
                </td>

                <td className="px-5 py-4">
                  <span
                    className={`px-3 py-1 rounded-full text-s font-medium ${getStatusStyle(
                      job.status
                    )}`}
                  >
                    {job.status}
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
                    disabled={aiLoading}
                    className="px-4 py-1.5 rounded-md text-white bg-blue-600 hover:bg-blue-700 transition font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
                  >
                    {aiLoading ? 'Analyzing...' : 'Analyze'}
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
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
