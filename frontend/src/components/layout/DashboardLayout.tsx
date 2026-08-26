import { Outlet } from "react-router-dom";
import Sidebar from "./Sidebar";


function DashboardLayout() {
    return (
        <div className="h-screen overflow-hidden bg-slate-100 flex">
            <Sidebar />

            <main className="flex-1 overflow-y-auto p-6">
                <Outlet />
            </main>
        </div>
    )
}
export default DashboardLayout;