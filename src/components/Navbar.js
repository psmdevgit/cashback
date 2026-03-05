import React from "react";
import logo from "../assets/pos.png";
import { useNavigate } from 'react-router-dom';

function Navbar({ toggleSidebar }) {

  const navigate = useNavigate();

  return (
    <nav className="navbar navbar-expand-lg navbar-white bg-whit shadow" style={{background:'#2B7CD3'}}>
      <div className="container-fluid d-flex justify-content-between">

        {/* LEFT SIDE */}
        <div className="d-flex align-items-center gap-3 ps-lg-5">

          {/* MENU ICON (mobile) */}
          <button
            className="btn d-lg-none"
            onClick={toggleSidebar}
          >
            <i className="bi bi-list fs-1 text-white"></i>
          </button>

          <img
            src={logo}
            alt="Logo"
            className="navlogo"
          />
        </div>

        {/* USER */}
        <div className="d-flex align-items-center gap-2 text-white px-lg-3 " onClick={()=> navigate("/")}>
          <i className="bi bi-person-circle fs-5 text-black"></i>
          <span className="fw-semibold">Hello, User</span>
        </div>

      </div>
    </nav>
  );
}

export default Navbar;