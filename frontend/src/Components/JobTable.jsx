export default function JobTable({ jobs }) {
  return (
    <div className="rounded-xl shadow-sm overflow-hidden ml-70">
      <table className="w-full">
        <thead className="bg-blue-700">
          <tr className="text-left text-sm text-white">
            <th className="px-4 py-3">Company</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
            <th className="px-4 py-3">Applied Date</th>
          </tr>
        </thead>

        <tbody>
          {jobs.length === 0 ? (
            <tr>
              <td colSpan="4" className="text-center py-6 text-gray-400">
                No applications found
              </td>
            </tr>
          ) : (
            jobs.map((job) => (
              <tr key={job.id} className="border-t text-sm hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{job.company}</td>
                <td className="px-4 py-3">{job.role}</td>
                <td className="px-4 py-3">
                  <span
                    className={`px-3 py-2 rounded-full text-sm font-medium
                      ${
                        job.status === "Applied"
                          ? "bg-blue-200 text-blue-700"
                          : job.status === "Interview"
                          ? "bg-yellow-200 text-yellow-700"
                          : job.status === "Offer"
                          ? "bg-green-200 text-green-700"
                          : "bg-red-200 text-red-700"
                      }`}
                  >
                    {job.status}
                  </span>
                </td>
                <td className="px-4 py-3">{job.appliedDate}</td>
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}
