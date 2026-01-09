import React, { useState } from "react";
import { MdDashboard, MdWork, MdAnalytics, MdSettings } from "react-icons/md";
import { FaFileAlt, FaRobot } from "react-icons/fa";
import { IoAddCircle } from "react-icons/io5";

export default function Sidebar() {
  const menuItems = [
    { label: "Dashboard", icon: <MdDashboard size={20} /> },
    { label: "Add Job", icon: <IoAddCircle size={20} /> },
    { label: "Applications", icon: <MdWork size={20} /> },
    { label: "Analytics", icon: <MdAnalytics size={20} /> },
    { label: "Resume Manager", icon: <FaFileAlt size={18} /> },
    { label: "Auto Apply", icon: <FaRobot size={18} /> },
    { label: "Settings", icon: <MdSettings size={20} /> }
  ];

  const [activeItem, setActiveItem] = useState("Dashboard");

  return (
    <div className="fixed">
      <div className="h-screen w-70 bg-blue-600 pt-5 text-white">
        <div className="flex items-center gap-3 pl-6">
          <img className="h-15" src="/Images/logo.png" />
          <h1 className="text-2xl font-medium">AI Tracker</h1>
        </div>

        <div className="pl-6 pt-10">
          <div className="space-y-2 mt-6">
            {menuItems.map((item) => {
              const isActive = activeItem === item.label;

              return (
                <button
                  key={item.label}
                  onClick={() => setActiveItem(item.label)}
                  className={`
                    w-full h-15
                    rounded-l-lg
                    flex items-center gap-3 px-10 justify-start
                    transition relative
                    ${isActive ? "bg-blue-500" : "bg-blue-600 hover:bg-blue-500"}
                  `}
                >
                  {isActive && (
                    <span className="absolute left-0 top-0 h-full w-1 bg-white rounded-r-md"></span>
                  )}

                  {item.icon}
                  <span className="text-sm font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
