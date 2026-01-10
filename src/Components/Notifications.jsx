
import React, { useState, useRef, useEffect } from "react";
import { MdNotifications } from "react-icons/md";

export default function Notifications() {
  const [open, setOpen] = useState(false);
  const popupRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (popupRef.current && !popupRef.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const notifications = [
    {
      id: 1,
      title: "Interview Scheduled",
      message: "Google interview on 20 Sep at 10:00 AM",
    },
    {
      id: 2,
      title: "Follow-up Reminder",
      message: "Follow up with Amazon application",
    },
    {
      id: 3,
      title: "Application Viewed",
      message: "Microsoft viewed your application",
    },
  ];

  return (
    <div className="relative" ref={popupRef}>
      
      {/* Notification Button */}
      <button
        onClick={() => setOpen(!open)}
        className="relative p-2 rounded-full transition"
      >
        <MdNotifications size={22} />

        <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
      </button>

      {/* Popup */}
      {open && (
        <div className="absolute right-0 mt-3 w-80 bg-white rounded-xl shadow-xl border border-gray-200 z-50">
          
          <div className="px-4 py-3 border-b">
            <p className="font-medium text-gray-800">Notifications</p>
          </div>

          <div className="max-h-64 overflow-y-auto">
            {notifications.length === 0 ? (
              <p className="px-4 py-6 text-sm text-gray-500 text-center">
                No notifications
              </p>
            ) : (
              notifications.map((item) => (
                <div
                  key={item.id}
                  className="px-4 py-3 hover:bg-gray-50 cursor-pointer border-b last:border-b-0"
                >
                  <p className="text-sm font-medium text-gray-800">
                    {item.title}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    {item.message}
                  </p>
                </div>
              ))
            )}
          </div>

          <div className="px-4 py-2 border-t text-center">
            <button className="text-sm text-blue-600 hover:underline">
              View all
            </button>
          </div>

        </div>
      )}
    </div>
  );
}
