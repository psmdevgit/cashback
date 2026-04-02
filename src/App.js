import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { useState, useEffect } from "react";

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

useEffect(() => {
  if (isSidebarOpen && window.innerWidth < 992) {
    document.body.style.overflow = "hidden";
    document.body.style.height = "100vh"; 
  } else {
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
  }

  return () => {
    document.body.style.overflow = "auto";
    document.body.style.height = "auto";
  };
}, [isSidebarOpen]);

   
  // 👇 Detect screen size
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 992) {
        setSidebarOpen(true); 
      } else {
        setSidebarOpen(false);
      }
    };

    handleResize(); 
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const toggleSidebar = () => {
   
    if (window.innerWidth >= 992) return;

    setSidebarOpen(!isSidebarOpen);
  };

  return (
    <Router>

      <Routes>
        <Route path="/" element={<Login />} />

        
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
          <Route path="cashentry" element={<CashEntry />} />
          <Route path="entry" element={<Entry />} />
          <Route path="suspense" element={<SuspenseEntry />} />
          <Route path="cashreports" element={<CashEntryReports />} />
          <Route path="suspensereports" element={<SuspensesReport />} />
        </Route>

      </Routes>

    </Router>
  );
}

export default App;