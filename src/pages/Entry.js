import React, { useEffect, useState } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";

function Entry() {

  const [uname, setUname] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));

    if (user && user.role === "3") {
      setUname(user.username);
    } else {
      window.location.href = "/";
    }
  }, []);

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div>

      <Navbar toggleSidebar={toggleSidebar} />

      <div className="d-flex">

        <Sidebar 
          isOpen={sidebarOpen} 
          toggleSidebar={toggleSidebar} 
        />

        <div className="content p-4">
          <h2>Welcome Entry Page {uname}</h2>
        </div>

      </div>

    </div>
  );
}

export default Entry;