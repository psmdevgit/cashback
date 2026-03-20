import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState } from "react";

import Login from "./components/Login";
import Entry from "./pages/Entry";
import SuspenseEntry from "./pages/SuspenseEntry";
import InventoryDashboard from "./pages/InventoryDashboard";

import DailyTransaction from "./pages/DailyTransaction";

import MainLayout from "./components/MainLayout";

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
          <Route path="inventory" element={<InventoryDashboard />} />

          <Route path="dailyTransaction" element={<DailyTransaction/>} />

          <Route path="entry" element={<Entry />} />
          <Route path="suspense" element={<SuspenseEntry />} />
        </Route>

      </Routes>

    </Router>
  );
}

export default App;