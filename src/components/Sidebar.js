import React from "react";
import '../App.css'

function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div className={`sidebar shadow ${isOpen ? "open" : ""}`} style={{background:'#2B7CD3'}}>

      {/* Mobile Close Button */}
      <div className="d-flex justify-content-end d-lg-none py-3" style={{position:'absolute', right:'0'}}>
        <button className="btn text-white" onClick={toggleSidebar}>
          <i className="bi bi-x-lg fs-5"></i>
        </button>
      </div>

      <ul className="list-unstyled py-4 fw-bold">
        <li className="py-2 px-4">
            <i class="bi bi-pencil-square me-2 fw-bold"></i>
          <a href="/entry" className="text-decoration-none ">Entry</a>
        </li>

        <li className="py-2 px-4">
            <i class="bi bi-cash-coin me-2 fw-bold"></i>
          <a href="/products" className="text-decoration-none ">Denomination</a>
        </li>

        <li className="py-2 px-4">
            <i class="bi bi-file-text me-2 fw-bold "></i>
            <a href="/orders" className="text-decoration-none ">Expenses</a>
        </li>

        
      </ul>

    </div>
  );
}

export default Sidebar;