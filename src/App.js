import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Login from "./components/Login";
import Entry from "./pages/Entry";
import SuspenseEntry from "./pages/SuspenseEntry";
import InventoryDashboard from "./pages/InventoryDashboard";

import DailyTransaction from "./pages/DailyTransaction";

import SuspensesReport from "./pages/SuspenseReports";
import MainLayout from "./components/MainLayout";
import CashEntry from "./pages/CashEntry";
import CashEntryReports from "./pages/CashEntryReports";

function App() {

  const [isSidebarOpen, setSidebarOpen] = useState(false);

  const toggleSidebar = () => {
    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>

      <Routes>

        {/* 🔐 LOGIN PAGE (NO SIDEBAR) */}
        <Route path="/" element={<Login />} />

        {/* 🔥 PROTECTED LAYOUT */}
        <Route
          path="/"
          element={
            <MainLayout
              isSidebarOpen={isSidebarOpen}
              toggleSidebar={toggleSidebar}
            />
          }
        >    
      <Route path="cashentry" element={<CashEntry />} />
         <Route path="cashreports" element={<CashEntryReports />} />
          <Route path="inventory" element={<InventoryDashboard />} />

          <Route path="dailyTransaction" element={<DailyTransaction/>} />

          <Route path="entry" element={<Entry />} />
          <Route path="suspense" element={<SuspenseEntry />} />
          <Route path="suspensereports" element={<SuspensesReport />} />
        </Route>

      </Routes>

    </Router>
  );
}

export default App;