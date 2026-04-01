import { Link } from "react-router-dom";
import logo from "../assets/pos.png";
function Sidebar({ isOpen, toggleSidebar }) {
  return (
    <div
      className={`sidebar shadow ${isOpen ? "open" : ""}`}
      style={{ background: "#2B7CD3", minHeight: "100vh", width: "250px", position: "fixed", zIndex: 1000 }}
    >
  <img
            src={logo}
            alt="Logo"
            className="navlogo"
          />
      {/* Mobile Close Button */}
      <div
        className="d-flex justify-content-end d-lg-none py-3 px-3"
      >
        <button className="btn text-white" onClick={toggleSidebar}>
          <i className="bi bi-x-lg fs-5"></i>
        </button>
      </div>

      {/* MENU */}
      <ul className="list-unstyled py-4 fw-bold text-white">

        <li className="py-2 px-4">
          <i className="bi bi-pencil-square me-2"></i>
          <Link to="/inventory" className="text-decoration-none text-white">
            Transcations
          </Link>
        </li>

        <li className="py-2 px-4">

          <i className="bi bi-pencil-square me-2"></i>
          <Link to="/dailyTransaction" className="text-decoration-none text-white">
            Daily Transcations
</Link>
</li>
  {/* <li className="py-2 px-4">
          <i className="bi bi-cash-coin me-2"></i>
          <Link to="/cashentry" className="text-decoration-none text-white">
            Denomination

          </Link>
        </li> */}


        <li className="py-2 px-4">

          <i className="bi bi-cash-coin me-2"></i>
          <Link to="/cashentry" className="text-decoration-none text-white">
            Denomination
</Link>
</li>
 <li className="py-2 px-4">
          <i className="bi bi-file-text me-2"></i>
          <Link to="/entry" className="text-decoration-none text-white">
            Expenses

          </Link>
        </li>

   

        <li className="py-2 px-4">
          <i className="bi bi-file-text me-2"></i>
          <Link to="/suspense" className="text-decoration-none text-white">
            Suspense
          </Link>
        </li>

 {/* <li className="py-2 px-4">
          <i className="bi bi-file-text me-2"></i>
          <Link to="/cashentry" className="text-decoration-none text-white">
            Cash Entry
          </Link>
        </li> */}


         <li className="py-2 px-4">
          <i className="bi bi-file-text me-2"></i>
          <Link to="/suspensereports" className="text-decoration-none text-white">
            Suspense Reports
          </Link>
        </li>

      </ul>
    </div>
  );
}

export default Sidebar;