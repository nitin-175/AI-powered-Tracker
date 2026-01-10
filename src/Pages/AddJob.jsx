import React from "react";

export default function AddJob() {
  return (
    <div className="ml-70 mt-12 p-6 ">
      <div className="grid grid-cols-1 sm:grid-cols-2 max-w-5xl  bg-white rounded-2xl shadow-xl overflow-hidden">

        {/* LEFT SIDE — FORM */}
        <div className="p-10">
          <div className="mb-8">
            <h2 className="text-2xl font-semibold tracking-tight">
              Add Your Job
            </h2>
          </div>

          <form className="space-y-2">
            <div>
              <label className="block text-sm font-medium ">
                Company Name
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Google"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Job Role
              </label>
              <input
                type="text"
                className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="e.g. Frontend Developer"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Job Link
              </label>
              <input
                type="url"
                className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                placeholder="https://company.com/careers"
              />
            </div>

            <div>
              <label className="block text-sm font-medium">
                Status
              </label>
              <select className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none">
                <option>Applied</option>
                <option>Interview</option>
                <option>Offer</option>
                <option>Rejected</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium ">
                Applied Date
              </label>
              <input
                type="date"
                className="w-full px-4 py-2.5 border rounded-lg bg-gray-50 focus:bg-white focus:ring-2 focus:ring-blue-500 outline-none"
                required
              />
            </div>

            <div className="flex gap-4 pt-6">
              <button
                type="submit"
                className="flex-1 bg-blue-600 text-white py-2.5 rounded-lg hover:bg-blue-700 transition font-medium"
              >
                Add Job
              </button>

              <button
                type="button"
                className="flex-1 border border-gray-600 py-2.5 rounded-lg hover:bg-red-200 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>

        {/* RIGHT SIDE — TECH STOCK VIDEO */}
        <div className="hidden lg:block relative">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover"
          >
            <source
              src="https://www.pexels.com/download/video/3129977/"
              type="video/mp4" autoPlay muted
            />
          </video>
          
        </div>

      </div>
    </div>
  );
}
