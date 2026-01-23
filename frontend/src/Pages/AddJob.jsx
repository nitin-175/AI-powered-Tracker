import React, { useState } from "react";
import { addJob } from "../services/jobService";
import { useNavigate } from "react-router-dom";

export default function AddJob() {
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    company: "",
    role: "",
    jobLink: "",
    status: "Applied",
    appliedDate: "",
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await addJob(formData);
      navigate("/applications"); // redirect after success
    } catch (error) {
      alert("Failed to add job");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ml-70 mt-12 p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 max-w-5xl bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* LEFT — FORM */}
        <div className="p-10">
          <h2 className="text-2xl font-semibold mb-8">
            Add Your Job
          </h2>

          <form className="space-y-3" onSubmit={handleSubmit}>

            <div>
              <label className="block text-sm font-medium">Company Name</label>
              <input
                type="text"
                name="company"
                value={formData.company}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Job Role</label>
              <input
                type="text"
                name="role"
                value={formData.role}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Job Link</label>
              <input
                type="url"
                name="jobLink"
                value={formData.jobLink}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">Status</label>
              <select
                name="status"
                value={formData.status}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
              >
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium">Applied Date</label>
              <input
                type="date"
                name="appliedDate"
                value={formData.appliedDate}
                onChange={handleChange}
                className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                {loading ? "Saving..." : "Add Job"}
              </button>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="flex-1 border border-gray-600 py-2.5 rounded-lg hover:bg-red-200 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT — VIDEO */}
        <div className="hidden lg:block relative">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source
              src="https://videos.pexels.com/video-files/3129977/3129977-hd_1920_1080_30fps.mp4"
              type="video/mp4"
            />
          </video>
        </div>

      </div>
    </div>
  );
}
