
import React, { useEffect, useState } from "react";
import API from "../axios";

export default function Approval() {

  const userbranch = localStorage.getItem("branch").trim();
  
  // const user = localStorage.getItem("user");
  const user = JSON.parse(localStorage.getItem("user") || "{}"); // parse user object

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [branch, setBranch] = useState(
    userbranch === "HO" ? "" : userbranch
  );

  //   useEffect(() => {
  //   const today = new Date().toISOString().split("T")[0];
  //   setFromDate(today);
  //   setToDate(today);
  // }, []);

  const [data, setData] = useState([]);
  const [summaryData, setSummaryData] = useState([]);

  const [selected, setSelected] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const [showModal, setShowModal] = useState(false); // ✅ FIXED

  // 🔥 CLOSE MODAL
  const closeModal = () => setShowModal(false);

  // 🔥 OPEN MODAL
  const openModal = async (fromDate, toDate, branch) => {
    try {
      const formatDate = (date) => {
        if (!date) return null;

        if (/^\d{4}-\d{2}-\d{2}$/.test(date)) return date;

        if (/^\d{2}-\d{2}-\d{4}$/.test(date)) {
          const [day, month, year] = date.split("-");
          return `${year}-${month}-${day}`;
        }

        const d = new Date(date);
        if (isNaN(d)) return null;

        return d.toISOString().split("T")[0];
      };

      const formattedFromDate = formatDate(fromDate);
      const formattedToDate = formatDate(toDate);

      if (!formattedFromDate || !formattedToDate) {
        alert("Invalid date");
        return;
      }

      const res = await API.get("/expense-summary", {
        params: {
          fromDate: formattedFromDate,
          toDate: formattedToDate,
          branch: branch,
        },
      });

      setSummaryData(res.data);   // ✅ correct state
      setShowModal(true);         // ✅ open modal

    } catch (err) {
      console.error(err);
    }
  };

  // useEffect(() => {
  //   loadData();
  // }, []);

  useEffect(() => {
    loadData();
  console.log(user);
}, [fromDate, toDate, branch]);


  // const loadData = async () => {
  //   const res = await API.get("/cash-entry-list");
  //   setData(res.data);
  // };
  const loadData = async () => {
  try {
    const res = await API.get(`/cash-entry-list?branch=${branch}&fromDate=${fromDate}&toDate=${toDate}`, {
    });

    setData(res.data);
  } catch (err) {
    console.error(err);
  }
};


  // 🔥 APPROVE
  const handleApprove = async () => {
    try {
      setLoadingId(selected.id);

      if (selected.level === "L1") {
        await API.post(`/approve-l1/${selected.id}`);
      } else {
        await API.post(`/approve-l2/${selected.id}`);
      }

      setSelected(null);
      loadData();

    } catch (err) {
      console.error(err);
      alert("Error approving!");
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="container-fluid mt-3">

      <h3 className="mb-3 text-center">Cash Entry Approval</h3>


      <div className="row mb-3 align-items-center">

          <div className="col-md-3">
            <label>Branch</label>

            {userbranch === "HO" ? (
              <select
                className="form-control"
                value={branch}
                onChange={(e) => setBranch(e.target.value)}
              >
                <option value="">ALL</option>
                <option value="CPT">CPT</option>
                <option value="TVL">TVL</option>
                <option value="CBE">CBE</option>
                <option value="TPJ">TPJ</option>
                <option value="TVM">TVM</option>
                <option value="PMLE">PMLE</option>
                <option value="SLM">SLM</option>
                <option value="PADI">PADI</option>
              </select>
            ) : (
              <input
                className="form-control"
                value={branch}
                readOnly
              />
            )}
          </div>
          <div className="col-md-3">
            <label>From Date</label>
            <input
              type="date"
              className="form-control"
              value={fromDate}
              onChange={(e) => setFromDate(e.target.value)}
            />
          </div>

          <div className="col-md-3">
            <label>To Date</label>
            <input
              type="date"
              className="form-control"
              value={toDate}
              onChange={(e) => setToDate(e.target.value)}
            />
          </div>

        </div>


<div className="table-responsive" style={{ maxHeight: "700px", overflowY: "auto" }}>
  
  <table className="table table-striped table-hover align-middle text-center">

    {/* 🔥 Sticky Header */}
    <thead
      className="table-primary"
      style={{ position: "sticky", top: 0, zIndex: 2 }}
    >
      <tr>
        <th>Branch</th>
        <th>From</th>
        <th>To</th>
        <th>Opening</th>
        <th>Expenses</th>
        <th>Suspense</th>
        <th>Hand Cash</th>
        <th>Status</th>
        {(user.role === '1' || user.role === '2') && <th>Action</th>}
        <th>View</th>
      </tr>
    </thead>

    <tbody>
      {data.map((row) => (
        <tr key={row.Id}>
          <td>{row.branch}</td>
          <td>{row.FromDate}</td>
          <td>{row.ToDate}</td>

          <td>₹ {row.Opening}</td>
          <td className="text-danger">₹ {row.Expenses}</td>
          <td className="text-warning">₹ {row.Suspense}</td>
          <td className="fw-bold">₹ {row.HandCash}</td>

          <td>
            <span className={`badge px-3 py-2
              ${row.Status === "Pending L1" ? "text-warning" :
                row.Status === "Approved L1" ? "text-info" :
                "text-success"}`}>
              {row.Status === "Pending L1"
                ? "Pending"
                : row.Status === "Approved L1"
                ? "GM Approved"
                : "HO Approved"}
            </span>
          </td>

          {/* ROLE 2 */}
          {user.role === "2" && (
            <td>
              {row.Status === "Pending L1" ? (
                <button
                  className="btn btn-sm btn-warning"
                  onClick={() => setSelected({ id: row.Id, level: "L1" })}
                >
                  Approve L1
                </button>
              ) : (
                <span className="badge bg-success text-white">Approved</span>
              )}

              {loadingId === row.Id && (
                <div className="spinner-border spinner-border-sm ms-2"></div>
              )}
            </td>
          )}

          {/* ROLE 1 */}
          {user.role === "1" && (
            <td>
              {row.Status === "Approved L1" ? (
                <button
                  className="btn btn-sm btn-success"
                  onClick={() => setSelected({ id: row.Id, level: "L2" })}
                >
                  Approve L2
                </button>
              ) : (
                <span className="badge bg-success text-white">Approved</span>
              )}

              {loadingId === row.Id && (
                <div className="spinner-border spinner-border-sm ms-2"></div>
              )}
            </td>
          )}

          <td>
            <button
              className="btn btn-info btn-sm"
              onClick={() => openModal(row.FromDate, row.ToDate, row.branch)}
            >
              👁 View
            </button>
          </td>
        </tr>
      ))}
    </tbody>

  </table>
</div>

      {/* 🔥 EXPENSE SUMMARY MODAL */}
      {showModal && (
        <div className="modal fade show d-block" style={{ background: "#00000080" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">

              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Expense Summary</h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>

              <div className="modal-body">
              <div className="table-responsive">
  <table className="table table-bordered table-hover text-center align-middle">

    <thead className="table-dark">
      <tr>
        <th style={{ width: "60%" }}>Expense Category</th>
        <th style={{ width: "40%" }}>Amount (₹)</th>
      </tr>
    </thead>

    <tbody>
      {summaryData.length > 0 ? (
        summaryData.map((item, index) => (
          <tr key={index}>
            <td className="text-start fw-semibold">
              {item.ExpenseCategory}
            </td>

            <td className="text-success fw-bold">
              ₹ {Number(item.TotalAmount).toLocaleString()}
            </td>
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="2">No data available</td>
        </tr>
      )}
    </tbody>

    {/* 🔥 TOTAL ROW */}
    <tfoot>
      <tr className="table-secondary">
        <th className="text-end">Total</th>
        <th className="text-success">
          ₹ {summaryData
            .reduce((sum, i) => sum + Number(i.TotalAmount), 0)
            .toLocaleString()}
        </th>
      </tr>
    </tfoot>

  </table>
</div>

                <div className="mt-3 text-end">
                  <h5>
                    Total: ₹ {summaryData.reduce((sum, i) => sum + Number(i.TotalAmount), 0)}
                  </h5>
                </div>
              </div>

              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      {/* 🔥 APPROVAL CONFIRM MODAL */}
      {selected && (
        <div className="modal show fade d-block">
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content rounded-4">

              <div className="modal-header">
                <h5 className="modal-title">Confirm Approval</h5>
                <button className="btn-close" onClick={() => setSelected(null)}></button>
              </div>

              <div className="modal-body text-center">
                Are you sure to approve as <strong>{selected.level}</strong>?
              </div>

              <div className="modal-footer justify-content-center">
                <button className="btn btn-secondary" onClick={() => setSelected(null)}>
                  Cancel
                </button>

                <button className="btn btn-primary" onClick={handleApprove}>
                  Yes, Approve
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

    </div>
  );
}