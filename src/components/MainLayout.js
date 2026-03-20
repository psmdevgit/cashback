import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MainLayout = ({ isSidebarOpen, toggleSidebar }) => {
  return (
    <div className="d-flex">

      {/* Sidebar */}
      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      {/* Main Content */}
      <div style={{ marginLeft: "250px", width: "100%" }}>

        <Navbar toggleSidebar={toggleSidebar} />

        <div className="p-3">
          <Outlet /> {/* 🔥 Page loads here */}
        </div>

      </div>

    </div>
  );
};

export default MainLayout;