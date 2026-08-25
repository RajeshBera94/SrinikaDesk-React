import {
    LayoutDashboard,
    Users,
    BriefcaseBusiness,
    CreditCard,
    Settings,
} from "lucide-react";
import { NavLink } from "react-router-dom";
const MenuItems = [
    {
        id: "dashboard",
        label: "Dashboard",
        Icon: LayoutDashboard,
        path: "/dashboard"
    },
    {
        id: "customers",
        label: "Customers",
        Icon: Users,
        path: "/dashboard/customers"
    },
    {
        id: "services",
        label: "Services",
        Icon: BriefcaseBusiness,
        path: "/dashboard/services"
    },
    {
        id: "payment",
        label: "Payment",
        Icon: CreditCard,
        path: "/dashboard/payments"
    },
    {
        id: "settings",
        label: "Settings",
        Icon: Settings,
        path: "/dashboard/settings"
    }
]

function Sidebar() {
    return (
        <aside className="w-64 min-h-screen bg-slate-900 text-white">
            {/* Logo */}
            <div className="px-6 py-5">
                <h1 className="text-xl font-bold">SrinikaDesk</h1>
            </div>

            {/* Navigation */}
            <nav className="px-3 mt-4 space-y-1">

                {
                    MenuItems.map((item) => {
                        const Icon = item.Icon;
                        return (
                            <NavLink
                                key={item.id}
                                to={item.path}
                                className={({ isActive }) => `flex items-center gap-3 px-4 py-3 rounded-md ${isActive ? "bg-slate-800" : "hover:bg-slate-800"}`}
                            >
                                <Icon size={20} />
                                <span>{item.label}</span>
                            </NavLink>

                        )
                    })
                }

            </nav>
        </aside >
    );
}

export default Sidebar;
