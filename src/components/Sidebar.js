

// import { Link, useLocation } from "react-router-dom";
// import "../App.css";
// import logo from "../assets/pos.png";

// function Sidebar({ isOpen, toggleSidebar }) {
//   const location = useLocation(); 
  
//   const userbranch = localStorage.getItem("branch").trim();

//   return (
//     <div
//       style={{
//         display: isOpen ? "block" : "none",
//         width: "250px",
//         height: "100vh",
//         background:"#3F53B6",
//         position: "fixed",
//         top: 0,
//         left: 0,
//         zIndex: 1000,
//       }}
//       className="shadow sidebar"
//     >
   
//       <div className="sidebar-header position-relative pt-3">
//         <div className="d-flex justify-content-center">
//           <img src={logo} alt="Logo" className="sidebarLogo" />
//         </div>

//         <button
//           className="btn d-lg-none position-absolute end-0 top-50 translate-middle-y me-2"
//           onClick={toggleSidebar}
//            style={{color:'#0F2470'}}
//         >
//           ✖
//         </button>
//       </div>

//       {/* MENU */}
//       <ul className="list-unstyled py-4 fw-bold text-black">
// {/* 
//         <li className={`py-2 px-3 ${location.pathname === "/inventory" ? "active-menu" : ""}`}>
//           <Link to="/inventory" className="text-decoration-none link d-block">
//             <i class="bi bi-cash-stack me-2"></i>
//             Transactions
//           </Link>
//         </li> */}

//         <li className={`py-2 px-3 ${location.pathname === "/entry" ? "active-menu" : ""}`}>
//           <Link to="/entry" className="text-decoration-none link  d-block">
//             <i className="bi bi-pencil-square me-2"></i>
//             Expenses
//           </Link>
//         </li>

//         <li className={`py-2 px-3 ${location.pathname === "/suspense" ? "active-menu" : ""}`}>
//           <Link to="/suspense" className="text-decoration-none link d-block">
//             <i class="bi bi-pen me-2"></i>
//             Suspense
//           </Link>
//         </li>

//         <li className={`py-2 px-3 ${location.pathname === "/cashentry" ? "active-menu" : ""}`}>
//           <Link to="/cashentry" className="text-decoration-none link d-block">
//             <i class="bi bi-cash-coin me-2"></i>
//             Denomination
//           </Link>
//         </li>



//         <li className={`py-2 px-3 ${location.pathname === "/dailyTransaction" ? "active-menu" : ""}`}>
//           <Link to="/dailyTransaction" className="text-decoration-none link d-block">
//             <i class="bi bi-wallet2 me-2"></i>
//             Daily Transactions
//           </Link>
//         </li>

        

        
//         <li className={`py-2 px-3 ${location.pathname === "/cashreports" ? "active-menu" : ""}`}>
//           <Link to="/cashreports" className="text-decoration-none link d-block">
//            <i class="bi bi-file-bar-graph me-2"></i>
//             Cash Reports
//           </Link>
//         </li>

//         <li className={`py-2 px-3  ${location.pathname === "/expensesreport" ? "active-menu" : ""}`}>                
//           <Link to="/expensesreport" className="text-decoration-none link d-block">
//           <i class="bi bi-file-earmark-check me-2"></i>
//             Expense Reports
//           </Link>
//         </li>

//         <li className={`py-2 px-3 ${location.pathname === "/suspensereports" ? "active-menu" : ""}`}>
//           <Link to="/suspensereports" className="text-decoration-none link d-block">
//             <i class="bi bi-file-earmark-excel me-2"></i>
//             Suspense Reports
//           </Link>
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
  const location = useLocation();
  const userbranch = localStorage.getItem("branch").trim();
  
  const user = JSON.parse(localStorage.getItem("user") || "{}"); // parse user object

  const role = user.role;

  return (
    <div
      style={{
        display: isOpen ? "block" : "none",
        width: "250px",
        height: "100vh",
        background: "#3F53B6",
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
          style={{ color: "#0F2470" }}
        >
          ✖
        </button>
      </div>

      {/* MENU */}
      <ul className="list-unstyled py-4 fw-bold text-black">
        {/* Hide for HO */}
        {!["1", "2"].includes(role) && (
          <>
            <li
              className={`py-2 px-3 ${
                location.pathname === "/entry" ? "active-menu" : ""
              }`}
            >
              <Link to="/entry" className="text-decoration-none link d-block">
                <i className="bi bi-pencil-square me-2"></i>
                Expenses
              </Link>
            </li>

            <li
              className={`py-2 px-3 ${
                location.pathname === "/suspense" ? "active-menu" : ""
              }`}
            >
              <Link to="/suspense" className="text-decoration-none link d-block">
                <i className="bi bi-pen me-2"></i>
                Suspense
              </Link>
            </li>

            <li
              className={`py-2 px-3 ${
                location.pathname === "/cashentry" ? "active-menu" : ""
              }`}
            >
              <Link to="/cashentry" className="text-decoration-none link d-block">
                <i className="bi bi-cash-coin me-2"></i>
                Denomination
              </Link>
            </li>
          </>
        )}

        {/* Always visible */}
        <li
          className={`py-2 px-3 ${
            location.pathname === "/dailyTransaction" ? "active-menu" : ""
          }`}
        >
          <Link
            to="/dailyTransaction"
            className="text-decoration-none link d-block"
          >
            <i className="bi bi-wallet2 me-2"></i>
            Daily Transactions
          </Link>
        </li>

        <li
          className={`py-2 px-3 ${
            location.pathname === "/cashreports" ? "active-menu" : ""
          }`}
        >
          <Link to="/cashreports" className="text-decoration-none link d-block">
            <i className="bi bi-file-bar-graph me-2"></i>
            Cash Reports
          </Link>
        </li>

        <li
          className={`py-2 px-3 ${
            location.pathname === "/expensesreport" ? "active-menu" : ""
          }`}
        >
          <Link
            to="/expensesreport"
            className="text-decoration-none link d-block"
          >
            <i className="bi bi-file-earmark-check me-2"></i>
            Expense Reports
          </Link>
        </li>

        <li
          className={`py-2 px-3 ${
            location.pathname === "/suspensereports" ? "active-menu" : ""
          }`}
        >
          <Link
            to="/suspensereports"
            className="text-decoration-none link d-block"
          >
            <i className="bi bi-file-earmark-excel me-2"></i>
            Suspense Reports
          </Link>
        </li>
      </ul>
    </div>
  );
}

export default Sidebar;
