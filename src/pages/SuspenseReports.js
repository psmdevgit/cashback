import React, { use, useEffect, useState } from "react";
import API from "../axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

const SuspenseReports = () => {
  const [data, setData] = useState([]);
  const userbranch = localStorage.getItem("branch").trim();
  const [branch, setBranch] = useState(userbranch === "HO" ? "" : userbranch);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}"); // parse user object
  
  const role = user.role;
  const [summary, setSummary] = useState({ opening: 0, closing: 0, debit: 0, credit: 0 });
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [categories, setCategories] = useState([]); // for dropdown
  const [editingRowId, setEditingRowId] = useState(null); // row being edited
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // new description
  const [selectedCategoryValue, setSelectedCategoryValue] = useState(null); // new description

  const [statusFilter, setStatusFilter] = useState("completed"); // default


  // useEffect(() => {
  //   loadData();
  //   fetchCategories();
  // }, [branch, fromDate, toDate]);

  useEffect(() => {
  loadData();
  fetchCategories();
}, [branch, fromDate, toDate, statusFilter]); // 👈 added statusFilter

  // const loadData = async () => {
  //   try {
  //     const res = await API.get(`/allSuspenses?branch=${branch}&fromDate=${fromDate}&toDate=${toDate}`);
  //     setData(res.data);

  //     if (res.data.length > 0) {
  //       const totalDebit = res.data.reduce((s, r) => s + Number(r.Debit), 0);
  //       const totalCredit = res.data.reduce((s, r) => s + Number(r.Credit), 0);
  //       setSummary({
  //         opening: res.data[res.data.length - 1].OpeningBalance,
  //         closing: res.data[0].ClosingBalance,
  //         debit: totalDebit,
  //         credit: totalCredit
  //       });
  //     }
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const loadData = async () => {
  try {
    const res = await API.get(
      `/allSuspenses?branch=${branch}&fromDate=${fromDate}&toDate=${toDate}`
    );

    const completedData = res.data.completed || [];
    const pendingData = res.data.pending || [];

    // 🔥 switch based on dropdown
    const finalData =
      statusFilter === "completed" ? completedData : pendingData;

    setData(finalData);

    if (finalData.length > 0) {
      const totalDebit = finalData.reduce((s, r) => s + Number(r.Debit || 0), 0);
      const totalCredit = finalData.reduce((s, r) => s + Number(r.Credit || 0), 0);

      setSummary({
        opening: finalData[finalData.length - 1]?.OpeningBalance || 0,
        closing: finalData[0]?.ClosingBalance || 0,
        debit: totalDebit,
        credit: totalCredit,
      });
    } else {
      setSummary({ opening: 0, closing: 0, debit: 0, credit: 0 });
    }
  } catch (err) {
    console.error(err);
  }
};

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleEditClick = (row) => {
    setEditingRowId(row.Id);
    setSelectedCategoryId(row.DescriptionId || null); // assuming DescriptionId matches dropdown
  };

  const handleUpdateClick = async (row) => {
    if (!selectedCategoryId) {
      alert("Select a category first!");
      return;
    }

    console.log("selected Row : ", row, selectedCategoryId, selectedCategoryValue, row.Description)
    try {
      await API.post(`/updateDescription`, { VoucherNo: row.VoucherNo , DescriptionId: selectedCategoryId,DescriptionValue: selectedCategoryValue, existDescription:  row.Description , existLedgerName: row.LedgerName});
      alert("Updated successfully!");
      setEditingRowId(null);
      loadData();
    } catch (err) {
      console.error(err);
      alert("Update failed!");
    }
  };

const handleExport = () => {
  if (data.length === 0) {
    alert("No data to export");
    return;
  }

  // const exportData = data.map((row) => ({
  //   Date: new Date(row.Date).toLocaleDateString(),
  //   Branch: row.Branch,
  //   Voucher: row.VoucherNo,
  //   EmpID: row.EmpID,
  //   Description: row.Description,
  //   Ledger: row.LedgerName,
  //   "Adv Amount": row.AdvAmount,
  //   "Used Amount": row.UsedAmount,
  //   Balance: row.Balance,
  //   "Expense ID": row.ExpenseID,
  //   Status: row.Status,
  //   Approved: row.Approved || "-"
  // }));

  const exportData = data.map((row) => {
  const baseData = {
    Date: new Date(row.Date).toLocaleDateString(),
    Voucher: row.VoucherNo,
    Description: row.Description,
    Ledger: row.LedgerName,
    "Adv Amount": row.AdvAmount,
    "Used Amount": row.UsedAmount,
    Balance: row.Balance,
    "Expense ID": row.ExpenseID,
    Approved: row.Approved || "-"
  };

  // Show extra fields only for role 1 & 2
  if (["1", "2"].includes(role)) {
    return {
      ...baseData,
      Branch: row.Branch,
      EmpID: row.EmpID,
      Status: row.Status
    };
  }

  return baseData;
});

  const worksheet = XLSX.utils.json_to_sheet(exportData);

  // ✅ Make header bold
  const range = XLSX.utils.decode_range(worksheet["!ref"]);
  for (let col = range.s.c; col <= range.e.c; col++) {
    const cellAddress = XLSX.utils.encode_cell({ r: 0, c: col }); // first row
    if (worksheet[cellAddress]) {
      worksheet[cellAddress].s = {
        font: { bold: true }
      };
    }
  }

  // Workbook
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

  // File name
  const now = new Date();
  const formattedDate = now.toISOString().replace(/[:.]/g, "-");

  const fileName =
    statusFilter === "completed"
      ? `SuspenseCompletedReport_${formattedDate}.xlsx`
      : `SuspensePendingReport_${formattedDate}.xlsx`;

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
    cellStyles: true // 🔥 important for styling
  });

  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  saveAs(blob, fileName);
};

  return (
    <div className="container-fluid mt-3">
      <h3 className="text-center mb-4">Suspense Reports</h3>

      {/* FILTER */}
      {/* <div className="row mb-3 align-items-center">
        {userbranch === "HO" && (
          <div className="col-md-2">
            <select className="form-control" value={branch} onChange={(e) => setBranch(e.target.value)}>
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

        <div className="col-md-2">
          <select
            className="form-control"
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
          >
            <option value="completed">Completed</option>
            <option value="pending">Pending</option>
          </select>
        </div>

        <div className="col-md-4 d-flex gap-2 align-items-center">
          <input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <span>To</span>
          <input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>

      <div className="col-md-2">
        <button className="btn btn-success btn-sm" onClick={handleExport}>
          Export Excel
        </button>
      </div>        

      </div> */}

 <div className="row mb-3 align-items-center g-2">
    {/* Branch Dropdown (only for HO) */}
    {userbranch === "HO" && (
      <div className="col-md-2">
        <select
          className="form-select form-select-sm"
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

    {/* Status Dropdown */}
    <div className="col-md-2">
      <select
        className="form-select form-select-sm"
        value={statusFilter}
        onChange={(e) => setStatusFilter(e.target.value)}
      >
        <option value="completed">Completed</option>
        <option value="pending">Pending</option>
      </select>
    </div>

    {/* Date Range */}
    <div className="col-md-4 d-flex gap-2 align-items-center">
      <input
        type="date"
        className="form-control form-control-sm"
        value={fromDate}
        onChange={(e) => setFromDate(e.target.value)}
      />
      <span className="mx-1">To</span>
      <input
        type="date"
        className="form-control form-control-sm"
        value={toDate}
        onChange={(e) => setToDate(e.target.value)}
      />
    </div>

    {/* Export Button */}
    <div className="col-md-2 d-flex justify-content-start">
      <button
        className="btn btn-success btn-sm"
        onClick={handleExport}
      >
        Export Excel
      </button>
    </div>
  </div>


      {/* TABLE */}
     <div
  className="table-responsive"
  style={{ maxHeight: "700px", overflowY: "auto" }}
>
  <table className="table table-bordered table-striped text-center">

    {/* 🔥 Sticky Header */}
    <thead
      className="table-primary"
      style={{ position: "sticky", top: 0, zIndex: 2 }}
    >
      <tr>
        <th>Date</th>
        <th>Branch</th>
        <th>Voucher</th>
        <th>Emp ID</th>
        <th>Description</th>
        <th>Adv Amount</th>
        <th>Used Amount</th>
        <th>Balance</th>
        <th>Expense ID</th>
        <th>Status</th>
        <th>Approved</th>
        {user.role === "999" && <th>Action</th>}
      </tr>
    </thead>

    <tbody>
      {data.length > 0 ? (
        data.map((row, i) => (
          <tr key={i}>
            <td>{new Date(row.Date).toLocaleDateString()}</td>
            <td>{row.Branch}</td>
            <td>{row.VoucherNo}</td>
            <td>{row.EmpID}</td>
            <td>
              {editingRowId === row.Id ? (
                <select
                  className="form-select form-select-sm"
                  value={selectedCategoryId || ""}
                  onChange={(e) => {
                    const id = e.target.value;

                    const selected = categories.find(
                      (c) => c.Id.toString() === id
                    );

                    setSelectedCategoryId(id);
                    setSelectedCategoryValue(selected?.ExpenseCategory || "");
                  }}
                >
                  <option value="">Select Category</option>
                  {categories.map((c) => (
                    <option key={c.Id} value={c.Id}>
                      {c.ExpenseCategory}
                    </option>
                  ))}
                </select>
              ) : (
                <>
                  <div>{row.Description}</div>
                  <small className="text-muted">
                    ({row.LedgerName})
                  </small>
                </>
              )}
            </td>

            <td>₹ {row.AdvAmount}</td>
            <td>₹ {row.UsedAmount}</td>
            <td>₹ {row.Balance}</td>
            <td>{row.ExpenseID}</td>

            <td>
              <span
                className={`badge ${
                  row.Status.toLowerCase() === "completed"
                    ? "bg-success"
                    : "bg-warning"
                }`}
              >
                {row.Status.toLowerCase() === "completed"
                  ? "Completed"
                  : "Pending"}
              </span>
            </td>

            <td>{row.Approved || "-"}</td>

            {user.role === "999" && (
              <td>
                {editingRowId === row.Id ? (
                  <button
                    className="btn btn-sm btn-success"
                    onClick={() => handleUpdateClick(row)}
                  >
                    Update
                  </button>
                ) : (
                  <button
                    className="btn btn-sm btn-primary"
                    onClick={() => handleEditClick(row)}
                  >
                    Edit
                  </button>
                )}
              </td>
            )}
          </tr>
        ))
      ) : (
        <tr>
          <td colSpan="10" className="text-muted py-4">
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

export default SuspenseReports;