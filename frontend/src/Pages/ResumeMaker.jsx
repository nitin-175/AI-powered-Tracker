import { useState } from "react";

export default function ResumeManager() {
  const [resumes, setResumes] = useState([
    { id: 1, name: "Nitin_Java_Fullstack.pdf", created: "2026-01-28", jobsApplied: 12 },
    { id: 2, name: "Nitin_SpringBoot_Resume.pdf", created: "2026-01-25", jobsApplied: 8 }
  ]);

  const [selectedResume, setSelectedResume] = useState(null);

  const deleteResume = (id) => {
    setResumes(resumes.filter((r) => r.id !== id));
    if (selectedResume === id) setSelectedResume(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-6 py-12 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Resume Manager
          </h1>
          <p className="text-gray-600">
            Upload and manage multiple resume versions
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

          {/* Upload */}
          <div className="bg-white rounded-2xl border shadow-sm p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              Upload New Resume
            </h3>

            <div className="space-y-5">
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                className="w-full px-4 py-10 border-2 border-dashed border-gray-200 rounded-xl text-sm text-gray-500 hover:border-blue-400 focus:ring-2 focus:ring-blue-500"
              />

              <div className="flex gap-3">
                <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-blue-200 text-blue-700 text-sm cursor-pointer hover:bg-blue-50">
                  <input type="radio" name="role" className="hidden" />
                  Backend Focused
                </label>

                <label className="flex items-center gap-2 px-4 py-2 rounded-lg border border-amber-200 text-amber-700 text-sm cursor-pointer hover:bg-amber-50">
                  <input type="radio" name="role" className="hidden" />
                  Fullstack
                </label>
              </div>

              <button className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition focus:ring-4 focus:ring-blue-200">
                Upload Resume
              </button>
            </div>
          </div>

          {/* Resume List */}
          <div className="bg-white rounded-2xl border shadow-sm p-8">
            <h3 className="text-xl font-semibold text-gray-900 mb-6">
              My Resumes
            </h3>

            <div className="space-y-4">
              {resumes.map((resume) => {
                const isSelected = selectedResume === resume.id;

                return (
                  <div
                    key={resume.id}
                    className={`flex justify-between items-center p-4 rounded-xl border transition
                      ${isSelected
                        ? "border-blue-400 bg-blue-50"
                        : "border-gray-200 hover:bg-gray-50"}
                    `}
                  >
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center text-xs font-bold">
                        PDF
                      </div>

                      <div>
                        <p className="font-medium text-gray-900 truncate max-w-xs">
                          {resume.name}
                        </p>
                        <p className="text-sm text-gray-500">
                          Created {resume.created} • {resume.jobsApplied} jobs applied
                        </p>
                      </div>
                    </div>

                    <div className="flex gap-2">
                      <button
                        onClick={() => setSelectedResume(resume.id)}
                        className={`px-3 py-1.5 text-sm rounded-lg transition
                          ${isSelected
                            ? "bg-blue-600 text-white"
                            : "text-blue-600 hover:bg-blue-50"}
                        `}
                      >
                        {isSelected ? "Selected" : "Use"}
                      </button>

                      <button
                        onClick={() => deleteResume(resume.id)}
                        className="px-3 py-1.5 text-sm rounded-lg text-gray-500 hover:bg-gray-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
