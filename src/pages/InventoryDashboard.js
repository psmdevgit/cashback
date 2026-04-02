import React, { useEffect, useState } from "react";
import API from "../axios";
import '../App.css'

const InventoryDashboard = () => {

  const [data, setData] = useState([]);
  // const [branch, setBranch] = useState(localStorage.getItem("branch") || "");

  const userbranch = localStorage.getItem("branch").trim();

  const [branch, setBranch] = useState(
    userbranch === "HO" ? "" : userbranch
  );

  const [summary, setSummary] = useState({
    opening: 0,
    closing: 0,
    debit: 0,
    credit: 0
  });

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  // 🔥 Set today date initially
  useEffect(() => {
    const today = new Date().toISOString().split("T")[0];
    setFromDate(today);
    setToDate(today);
  }, []);

  // 🔥 Load when filters change
  useEffect(() => {
    if (branch && fromDate && toDate) {
      loadData();
    }
  }, [branch, fromDate, toDate]);

  const loadData = async () => {
    try {
      const res = await API.get(
        `/inventory/${branch}?fromDate=${fromDate}&toDate=${toDate}`
      );

      setData(res.data);

      if (res.data.length > 0) {
        const totalDebit = res.data.reduce((s, r) => s + Number(r.Debit), 0);
        const totalCredit = res.data.reduce((s, r) => s + Number(r.Credit), 0);

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

      {/* HEADER */}
      <h3 className="text-center mb-4 " >Cash Inventory Dashboard</h3>

      {/* SUMMARY */}
      <div className="row mb-4">

        <div className="col-md-3">
          <div className="card invcard shadow text-center p-3 bg-light">
            <h6 className="baseTextColor">Opening Balance</h6>
            <h4>₹ {summary.opening}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card invcard shadow text-center p-3">
            <h6 className="baseTextColor">Total Debit</h6>
            <h4>₹ {summary.debit}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card invcard shadow text-center p-3">
            <h6 className="baseTextColor">Total Credit</h6>
            <h4>₹ {summary.credit}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card invcard shadow text-center p-3">
            <h6 className="baseTextColor">Closing Balance</h6>
            <h4>₹ {summary.closing}</h4>
          </div>
        </div>

      </div>

      {/* FILTER */}
      <div className="row mb-3 align-items-center filter-small">

     
        {userbranch === "HO" && (
          <div className="col-md-3">
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
          </div>
        )}


        <div className="col-md-4 d-flex gap-2 align-items-center">
          <input
            type="date"
            className="form-control"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
          <span>To</span>
          <input
            type="date"
            className="form-control"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>

      </div>

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped text-center">

          <thead className="table-primary">
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
            {data.length > 0 ? (
              data.map((row, i) => (
                <tr key={i}>
                  <td>{new Date(row.TranDate).toLocaleDateString()}</td>
                  <td>{row.VoucherNo}</td>

                  <td>
                    <span className={`badge 
                      ${row.TranType.toLowerCase() === "expense" ? "bg-success" :
                        row.TranType.toLowerCase() === "suspense" ? "bg-danger" :
                        row.TranType.toLowerCase() === "receipt" ? "bg-primary " :
                        row.TranType.toLowerCase() === "suspense_return" ? "bg-secondary " :
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
              ))
            ) : (
              <tr>
                <td colSpan="8" className="text-muted py-4">
                  No data found
                </td>
              </tr>
            )}
          </tbody>

        </table>
      </div>

    </div>
  );
};

export default InventoryDashboard;