import React from "react";
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


  return (
    <div className="fixed">
      <div className="h-screen w-70 bg-blue-600 pt-5 ">
        <div className="flex items-center gap-3 pl-6">
          <img className="h-15" src="/Images/logo.png" />
          <h1 className="text-2xl font-medium">AI Tracker</h1>
        </div>

        <div className=" w-70 bg-blue-600 pl-6 pt-10">
          <div className="space-y-2 mt-6">
            {menuItems.map((item) => (
              <button
                key={item.label}
                className="
              w-full h-15 bg-blue-600 text-white
              rounded-l-lg
              flex items-center gap-3 px-10 justify-start
              hover:bg-blue-500 transition
            "
              >
                {item.icon}
                <span className="text-sm font-large"> {item.label}</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
