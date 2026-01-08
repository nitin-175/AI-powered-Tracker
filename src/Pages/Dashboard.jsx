import Sidebar from "../Components/Sidebar";
import StatCard from "../Components/StatCard";
import Topbar from "../Components/Topbar";




export default function Dashboard() {


  return (
    <>
      <Topbar />
      <Sidebar />

    <div className="grid grid-cols-3 p-10">

      <StatCard title="Total Applications" value="120" />
      <StatCard title="Active Applications" value="45" />
      <StatCard title="Response Rate" value="38%" subtitle="Last 30 days" />
    </div>


    </>

  )
}
