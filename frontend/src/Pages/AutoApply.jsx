import { useState } from "react";

export default function AutoApply() {
  const [formData, setFormData] = useState({
    keywords: "",
    locations: "",
    resume: null,
    coverLetter: false
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Auto apply started:", formData);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-6 py-12 space-y-8">

        {/* Header */}
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-1">
            Auto Apply
          </h1>
          <p className="text-gray-600">
            Automatically apply to matching jobs using your preferences
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl border shadow-sm p-8">
          <form onSubmit={handleSubmit} className="space-y-6">

            {/* Keywords */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Job Keywords
              </label>
              <input
                type="text"
                placeholder="Java, Spring Boot, React"
                value={formData.keywords}
                onChange={(e) =>
                  setFormData({ ...formData, keywords: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Locations */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Preferred Locations
              </label>
              <input
                type="text"
                placeholder="Bangalore, Hyderabad, Remote"
                value={formData.locations}
                onChange={(e) =>
                  setFormData({ ...formData, locations: e.target.value })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {/* Resume */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Resume
              </label>
              <input
                type="file"
                accept=".pdf,.doc,.docx"
                onChange={(e) =>
                  setFormData({ ...formData, resume: e.target.files[0] })
                }
                className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500"
              />
              <p className="text-xs text-gray-500 mt-1">
                PDF or DOC (max 2MB)
              </p>
            </div>

            {/* Cover Letter Toggle */}
            <div className="flex items-start gap-3">
              <input
                type="checkbox"
                id="coverLetter"
                checked={formData.coverLetter}
                onChange={(e) =>
                  setFormData({ ...formData, coverLetter: e.target.checked })
                }
                className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <label htmlFor="coverLetter" className="text-sm text-gray-700">
                Generate personalized cover letters using AI
                <span className="block text-xs text-amber-600 mt-1">
                  Recommended for higher response rates
                </span>
              </label>
            </div>

            {/* Submit */}
            <button
              type="submit"
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-semibold transition focus:ring-4 focus:ring-blue-200"
            >
              Start Auto Apply
            </button>
          </form>
        </div>

        {/* Recent Applications */}
        <div className="bg-white rounded-2xl border shadow-sm p-8">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Recent Auto Applications
          </h3>

          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-800">
                TCS · Software Engineer
              </span>
              <span className="text-sm font-medium text-green-600">
                Applied
              </span>
            </div>

            <div className="flex justify-between items-center">
              <span className="text-gray-800">
                Google · SDE
              </span>
              <span className="text-sm font-medium text-amber-600">
                Pending
              </span>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
