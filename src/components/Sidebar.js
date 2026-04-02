// import { NavLink } from "react-router-dom";
// import '../App.css'
// import logo from "../assets/pos.png";

// function Sidebar({ isOpen, toggleSidebar }) {
//   return (
//     <div
//       style={{
//         display: isOpen ? "block" : "none", 
//         width: "250px",
//         height: "100vh",
//         background: "#2B7CD3",
//         position: "fixed",
//         top: 0,
//         left: 0,
//         zIndex: 1000
//       }}
//       className="shadow"
//     >
      
//       <div className="sidebar-header position-relative py-3">

//   <div className="d-flex justify-content-center">
//     <img
//       src={logo}
//       alt="Logo"
//       className="sidebarLogo"
     
//     />
//   </div>

//   <button
//     className="btn text-white d-lg-none position-absolute end-0 top-50 translate-middle-y me-2"
//     onClick={toggleSidebar}
//   >
//     ✖
//   </button>

// </div>

     
//       <ul className="list-unstyled py-4 fw-bold text-white">
//         <li className="py-2 px-4">
//           <i className="bi bi-pencil-square me-2"></i>
//           <NavLink to="/inventory"  className={({ isActive }) => 
//       `text-white text-decoration-none ${isActive ? "active-menu" : ""}`
//     }>Transactions</NavLink>
//         </li>

//         <li className="py-2 px-4">          
//           <i className="bi bi-pencil-square me-2"></i>
//           <NavLink to="/dailyTransaction"  className={({ isActive }) => 
//       `text-white text-decoration-none ${isActive ? "active-menu" : ""}`
//     }>Daily Transactions</NavLink>
//         </li>

//         <li className="py-2 px-4">          
//           <i className="bi bi-pencil-square me-2"></i>
//           <NavLink to="/cashentry"  className={({ isActive }) => 
//       `text-white text-decoration-none ${isActive ? "active-menu" : ""}`
//     }>Denomination</NavLink>
//         </li>

//         <li className="py-2 px-4">
//           <i className="bi bi-pencil-square me-2"></i>
//           <NavLink to="/entry"  className={({ isActive }) => 
//       `text-white text-decoration-none ${isActive ? "active-menu" : ""}`
//     }>Expenses</NavLink>
//         </li>

//         <li className="py-2 px-4">
//           <i className="bi bi-pencil-square me-2"></i>
//           <NavLink to="/suspense" className={({ isActive }) => 
//       `text-white text-decoration-none ${isActive ? "active-menu" : ""}`
//     }>Suspense</NavLink>
//         </li>

//         <li className="py-2 px-4">
//           <i className="bi bi-pencil-square me-2"></i>
//           <NavLink to="/cashreports"  className={({ isActive }) => 
//       `text-white text-decoration-none ${isActive ? "active-menu" : ""}`
//     }>Cash Reports</NavLink>
//         </li>

//         <li className="py-2 px-4">
//           <i className="bi bi-pencil-square me-2"></i>
//           <NavLink to="/suspensereports"  className={({ isActive }) => 
//       `text-white text-decoration-none ${isActive ? "active-menu" : ""}`
//     }>Suspense Reports</NavLink>
//         </li>
//       </ul>
//     </div>
//   );
// }

// export default Sidebar;

import { Link, useLocation } from "react-router-dom";
import "../App.css";
import logo from "../assets/pos.png";

function Sidebar({ isOpen, toggleSidebar }) {
  const location = useLocation(); // ✅ get current path

  return (
    <div
      style={{
        display: isOpen ? "block" : "none",
        width: "250px",
        height: "100vh",
        // background: "#2B7CD3",
        background:"#3F53B6",
        // background:"#eee",
        position: "fixed",
        top: 0,
        left: 0,
        zIndex: 1000,
      }}
      className="shadow sidebar"
    >
      {/* HEADER */}
      <div className="sidebar-header position-relative pt-3">
        <div className="d-flex justify-content-center">
          <img src={logo} alt="Logo" className="sidebarLogo" />
        </div>

        <button
          className="btn d-lg-none position-absolute end-0 top-50 translate-middle-y me-2"
          onClick={toggleSidebar}
           style={{color:'#0F2470'}}
        >
          ✖
        </button>
      </div>

      {/* MENU */}
      <ul className="list-unstyled py-4 fw-bold text-black">

        <li className={`py-2 px-3 ${location.pathname === "/inventory" ? "active-menu" : ""}`}>
          <Link to="/inventory" className="text-decoration-none link d-block">
            <i className="bi bi-pencil-square me-2"></i>
            Transactions
          </Link>
        </li>

        <li className={`py-2 px-3 ${location.pathname === "/dailyTransaction" ? "active-menu" : ""}`}>
          <Link to="/dailyTransaction" className="text-decoration-none link d-block">
            <i className="bi bi-pencil-square me-2"></i>
            Daily Transactions
          </Link>
        </li>

        <li className={`py-2 px-3 ${location.pathname === "/cashentry" ? "active-menu" : ""}`}>
          <Link to="/cashentry" className="text-decoration-none link d-block">
            <i className="bi bi-pencil-square me-2"></i>
            Denomination
          </Link>
        </li>

        <li className={`py-2 px-3 ${location.pathname === "/entry" ? "active-menu" : ""}`}>
          <Link to="/entry" className="text-decoration-none link  d-block">
            <i className="bi bi-pencil-square me-2"></i>
            Expenses
          </Link>
        </li>

        <li className={`py-2 px-3 ${location.pathname === "/suspense" ? "active-menu" : ""}`}>
          <Link to="/suspense" className="text-decoration-none link d-block">
            <i className="bi bi-pencil-square me-2"></i>
            Suspense
          </Link>
        </li>

        <li className={`py-2 px-3 ${location.pathname === "/cashreports" ? "active-menu" : ""}`}>
          <Link to="/cashreports" className="text-decoration-none link d-block">
            <i className="bi bi-pencil-square me-2"></i>
            Cash Reports
          </Link>
        </li>

        <li className={`py-2 px-3 ${location.pathname === "/suspensereports" ? "active-menu" : ""}`}>
          <Link to="/suspensereports" className="text-decoration-none link d-block">
            <i className="bi bi-pencil-square me-2"></i>
            Suspense Reports
          </Link>
        </li>
          <li className="py-2 px-4">    
      <i className="bi bi-file-text me-2"></i>
          <Link to="/expensesreport" className="text-decoration-none text-white">
            Expense Reports
          </Link>
        </li>

      </ul>
    </div>
  );
}

export default Sidebar;
