
import Sidebar from "../Components/Sidebar";
import Topbar from "../Components/Topbar";
import { Outlet } from "react-router-dom";

export default function DashboardLayout() {
  return (
    <div className="flex">
      <Sidebar />

      <div className="flex-1 ">
        <Topbar />
        <div className="p-6">
          <Outlet />
        </div>
      </div>
    </div>
  );
}
