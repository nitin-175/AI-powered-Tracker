import { useState } from "react";

export default function JobTable({ jobs }) {
  const ITEMS_PER_PAGE = 5;
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  if (!Array.isArray(jobs)) {
    return (
      <div className="ml-70 p-6 text-red-500">
        Jobs data is invalid
      </div>
    );
  }

  const visibleJobs = jobs.slice(0, visibleCount);
  const hasMore = visibleCount < jobs.length;

  return (
    <div className="ml-70 space-y-4">

      {/* TABLE */}
      <div className="rounded-2xl shadow-md overflow-hidden bg-white">
        <table className="w-full border-collapse">
          <thead className="bg-blue-700">
            <tr className="text-left text-sm text-white">
              <th className="px-5 py-3">Company</th>
              <th className="px-5 py-3">Role</th>
              <th className="px-5 py-3">Status</th>
              <th className="px-5 py-3">Applied Date</th>
            </tr>
          </thead>

          <tbody>
            {visibleJobs.length === 0 ? (
              <tr>
                <td colSpan="4" className="text-center py-8 text-gray-400">
                  No applications found
                </td>
              </tr>
            ) : (
              visibleJobs.map((job) => (
                <tr
                  key={job.id}
                  className="border-t text-sm hover:bg-gray-50 transition"
                >
                  <td className="px-5 py-4 font-medium">
                    {job.company || "-"}
                  </td>

                  <td className="px-5 py-4">
                    {job.role || "-"}
                  </td>

                  <td className="px-5 py-4">
                    <span
                      className={`px-3 py-1.5 rounded-full text-xs font-medium
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
                  </td>

                  <td className="px-5 py-4">
                    {job.appliedDate
                      ? new Date(job.appliedDate).toLocaleDateString()
                      : "-"}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* LOAD MORE BUTTON */}
      {hasMore && (
        <div className="flex justify-center">
          <button
            onClick={() => setVisibleCount((prev) => prev + ITEMS_PER_PAGE)}
            className="px-6 py-2 rounded-full bg-blue-600 text-white font-medium
                       hover:bg-blue-700 transition shadow-md"
          >
            Load More
          </button>
        </div>
      )}

      {/* FOOTER INFO */}
      <p className="text-center text-xs text-gray-500">
        Showing {Math.min(visibleCount, jobs.length)} of {jobs.length} applications
      </p>
    </div>
  );
}
