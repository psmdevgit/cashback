import React, { useEffect, useState } from "react";
import API from "../axios";

const InventoryDashboard = () => {

  const [data, setData] = useState([]);
  const [branch, setBranch] = useState(localStorage.getItem("branch"));
  const [summary, setSummary] = useState({
    opening: 0,
    closing: 0,
    debit: 0,
    credit: 0
  });

  // 🔥 Load Data
  useEffect(() => {
    loadData();
  }, [branch]);

  const loadData = async () => {
    try {
      const res = await API.get(`/inventory/${branch}`);
      setData(res.data);

      if (res.data.length > 0) {
        const totalDebit = res.data.reduce((s, r) => s + r.Debit, 0);
        const totalCredit = res.data.reduce((s, r) => s + r.Credit, 0);

        setSummary({
          opening: res.data[res.data.length - 1].OpeningBalance,
          closing: res.data[0].ClosingBalance,
          debit: totalDebit,
          credit: totalCredit
        });
      }

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container-fluid mt-3">

      {/* 🔥 💰 HEADER */}
      <h3 className="text-center mb-4"> Cash Inventory Dashboard</h3>

      {/* 🔥 SUMMARY CARDS */}
      <div className="row mb-4">

        <div className="col-md-3">
          <div className="card shadow text-center p-3 bg-light">
            <h6>Opening Balance</h6>
            <h4>₹ {summary.opening}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow text-center p-3  text-dark">
            <h6>Total Debit</h6>
            <h4>₹ {summary.debit}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow text-center p-3  text-dark">
            <h6>Total Credit</h6>
            <h4>₹ {summary.credit}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow text-center p-3  text-dark">
            <h6>Closing Balance</h6>
            <h4>₹ {summary.closing}</h4>
          </div>
        </div>

      </div>
<div className="text-start mb-2">
          <p className="text-muted">Transaction History</p>
        </div>
      {/* 🔥 FILTER */}
      <div className="row mb-3">
        <div className="col-md-3">
          <select
            className="form-control"
            value={branch}
            onChange={(e) => setBranch(e.target.value)}
          >
            <option value="CPT">CPT</option>
            <option value="PNM">PNM</option>
            <option value="CBE">CBE</option>
          </select>
        </div>
      </div>

      {/* 🔥 TABLE */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped text-center">

          <thead className="table-dark">
            <tr>
              <th>Date</th>
              <th>Voucher</th>
              <th>Type</th>
              <th>Description</th>
              <th>Debit</th>
              <th>Credit</th>
              <th>Opening</th>
              <th>Closing</th>
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => (
              <tr key={i}>

                <td>
                  {new Date(row.TranDate).toLocaleDateString()}
                </td>

                <td>{row.VoucherNo}</td>

                <td>
                  <span className={`badge 
                    ${row.TranType === "EXPENSE" ? "bg-danger" :
                      row.TranType === "RECEIPT" ? "bg-success" :
                      "bg-warning text-dark"}`}>
                    {row.TranType}
                  </span>
                </td>

                <td>{row.Description}</td>

                <td className="text-danger fw-bold">
                  {row.Debit > 0 ? `₹ ${row.Debit}` : "-"}
                </td>

                <td className="text-success fw-bold">
                  {row.Credit > 0 ? `₹ ${row.Credit}` : "-"}
                </td>

                <td>{row.OpeningBalance}</td>

                <td className="fw-bold">
                  ₹ {row.ClosingBalance}
                </td>

              </tr>
            ))}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default InventoryDashboard;