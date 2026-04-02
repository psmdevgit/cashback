
import React from "react";
import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";
import Sidebar from "./Sidebar";

const MainLayout = ({ isSidebarOpen, toggleSidebar }) => {
  const isDesktop = window.innerWidth >= 992;

  return (
    <div>

      {isSidebarOpen && !isDesktop && (
        <div
          onClick={toggleSidebar}
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            background: "rgba(0,0,0,0.3)",
            zIndex: 999
          }}
        />
      )}

      <Sidebar isOpen={isSidebarOpen} toggleSidebar={toggleSidebar} />

      <div
        style={{
          marginLeft: isDesktop && isSidebarOpen ? "250px" : "0",
          transition: "0.3s"
        }}
      >
        <Navbar toggleSidebar={toggleSidebar} />

        <div className="p-3">
          <Outlet />
        </div>
      </div>

    </div>
  );
};

export default MainLayout;