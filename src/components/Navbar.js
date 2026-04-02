import React from "react";
import logo from "../assets/pos.png";
import { useNavigate } from 'react-router-dom';

function Navbar({ toggleSidebar }) {

  const navigate = useNavigate();

   const userName = localStorage.getItem("branch"); 
  return (
    <nav className="navbar navbar-expand-lg navbar-white bg-whit shadow" style={{
      // background:'#2B7CD3'      
        background:"#3F53B6",
        position: "sticky",
        top: 0,
        zIndex: 1050
        // background:"#0F2470"
      }}>
      <div className="container-fluid d-flex justify-content-between">

        <div className="d-flex align-items-center gap-3 ps-lg-5">

          <button
            className="btn d-lg-none"
            onClick={toggleSidebar}
          >
            <i className="bi bi-list fs-1 text-white"></i>
          </button>

        </div>

        {/* USER */}
        <div className="d-flex align-items-center gap-2 text-white px-lg-3 " onClick={()=> navigate("/")}>
          <i className="bi bi-person-circle fs-5 text-white"></i>
          <span className="fw-semibold">{userName ? userName+' User' : "User"}</span>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;