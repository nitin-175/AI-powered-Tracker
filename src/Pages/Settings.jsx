import React from "react";

export default function Settings() {
  return (
    <div className="ml-65 mt-10 px-6 max-w-5xl space-y-8">

      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">Settings</h1>
        <p className="text-sm text-gray-500 mt-1">
          Manage your account preferences and application behavior
        </p>
      </div>

      {/* Profile */}
      <section className="bg-white rounded-xl border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-5">
          <h2 className="text-lg font-medium text-gray-900">
            Profile Information
          </h2>
          <button className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition">
            Edit Profile
          </button>
        </div>

        <div className="grid grid-cols-2 gap-6">
          <div>
            <p className="text-xs text-gray-500">Name</p>
            <p className="font-medium text-gray-800">John Doe</p>
          </div>
          <div>
            <p className="text-xs text-gray-500">Email</p>
            <p className="font-medium text-gray-800">john@example.com</p>
          </div>
        </div>
      </section>

      {/* Preferences */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-medium text-gray-900">
          Application Preferences
        </h2>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">
              Default Job Status
            </p>
            <p className="text-sm text-gray-500">
              Automatically applied when adding a job
            </p>
          </div>

          <select className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600">
            <option>Applied</option>
            <option>Interview</option>
            <option>Offer</option>
          </select>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <p className="font-medium text-gray-800">Date Format</p>
            <p className="text-sm text-gray-500">
              Choose how dates are displayed
            </p>
          </div>

          <select className="border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-600">
            <option>DD / MM / YYYY</option>
            <option>MM / DD / YYYY</option>
          </select>
        </div>
      </section>

      {/* Notifications */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-6">
        <h2 className="text-lg font-medium text-gray-900">
          Notifications
        </h2>

        <ToggleItem
          title="Interview Reminders"
          description="Receive alerts before scheduled interviews"
          enabled
        />

        <ToggleItem
          title="Follow-up Reminders"
          description="Get reminders to follow up on applications"
        />
      </section>

      {/* Data */}
      <section className="bg-white rounded-xl border border-gray-200 p-6 space-y-5">
        <h2 className="text-lg font-medium text-gray-900">
          Data Management
        </h2>

        <div className="flex items-center justify-between">
          <p className="font-medium text-gray-800">
            Export Applications
          </p>
          <button className="px-4 py-2 text-sm bg-amber-300 rounded-lg hover:bg-amber-400 transition">
            Export CSV
          </button>
        </div>

        <div className="flex items-center justify-between">
          <p className="font-medium text-red-600">
            Clear All Applications
          </p>
          <button className="px-4 py-2 text-sm bg-red-500 text-white rounded-lg hover:bg-red-600 transition">
            Clear Data
          </button>
        </div>
      </section>

    </div>
  );
}

/* Toggle Component */
function ToggleItem({ title, description, enabled }) {
  return (
    <div className="flex items-center justify-between">
      <div>
        <p className="font-medium text-gray-800">{title}</p>
        <p className="text-sm text-gray-500">{description}</p>
      </div>

      <div
        className={`w-11 h-6 rounded-full relative cursor-pointer transition ${
          enabled ? "bg-blue-600" : "bg-gray-300"
        }`}
      >
        <div
          className={`w-5 h-5 bg-white rounded-full absolute top-0.5 transition ${
            enabled ? "right-0.5" : "left-0.5"
          }`}
        />
      </div>
    </div>
  );
}
