import { Route, Routes } from "react-router-dom";
import Login from "./components/login/Login";
import Dashboard from "./pages/dashboard/Dashboard";
import Customers from "./pages/customers/Customers";
import DashboardLayout from "./components/layout/DashboardLayout";
import Services from "./pages/services/Services";
import Payments from "./pages/payment/Payments";
import Settings from "./pages/settings/Settings";
function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route element={<DashboardLayout />}>
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/dashboard/customers" element={<Customers />} />
        <Route path="/dashboard/services" element={<Services />} />
        <Route path="/dashboard/payments" element={<Payments />} />
        <Route path="/dashboard/settings" element={<Settings />} />
      </Route>
    </Routes>
  );
}
export default App;
