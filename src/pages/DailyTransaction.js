
import React, { use, useEffect, useState } from "react";
import API from "../axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const InventoryDashboard = () => {
  const [data, setData] = useState([]);
  const userbranch = localStorage.getItem("branch").trim();
  const [branch, setBranch] = useState(userbranch === "HO" ? "" : userbranch);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}"); // parse user object
  

  const role = user.role;

  const [summary, setSummary] = useState({ opening: 0, closing: 0, debit: 0, credit: 0 });
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  
     const [lastDate, setLastDate] = useState("No");


  const [categories, setCategories] = useState([]); // for dropdown
  const [editingRowId, setEditingRowId] = useState(null); // row being edited
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // new description
  const [selectedCategoryValue, setSelectedCategoryValue] = useState(null); // new description

  const [typeFilter, setTypeFilter] = useState("");

  const [editedAmount, setEditedAmount] = useState(null);
  const [editedPurpose, setEditedPurpose] = useState(null);


  useEffect(() => {
    loadData();
    fetchCategories();
  }, [branch, fromDate, toDate]);

  const loadData = async () => {
    try {
      const res = await API.get(`/dailyTransactions?branch=${branch}&fromDate=${fromDate}&toDate=${toDate}`);
      setData(res.data);

      console.log("date : ",res.data)

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
      toast.error("Failed to load data");
    }
  };

    useEffect(() => {
    if (!branch) return;

    API.get("/last-entry-date", {
      params: { branch: branch }
    })
    
      .then(res => {

          console.log("response : ",res)
        
        let formatted = "";

        if (res.data.lastDate) {
          const last = new Date(res.data.lastDate);


          // 👉 Allow only NEXT DAY
          // last.setDate(last.getDate() + 1);

          // formatted = last.toISOString().split("T")[0];
          formatted = last.toLocaleDateString("en-CA");
          setLastDate(formatted);

        }     

      })
      .catch(err => console.log(err));
  }, [branch]);

  const fetchCategories = async () => {
    try {
      const res = await API.get("/categories");
      setCategories(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load categories");
    }
  };

  const handleEditClick = (row) => {
    setEditingRowId(row.Id);
    setSelectedCategoryId(row.DescriptionId || null); // assuming DescriptionId matches dropdown
    setEditedAmount(row.Amount);
    setEditedPurpose(row.Purpose);
  };

  const handleUpdateClick = async (row) => {
    if (!selectedCategoryId) {
      // alert("Select a category first!");
  toast.warning("Select a category first!");
      return;
    }




    console.log("selected Row : ", row, selectedCategoryId, selectedCategoryValue, row.Description)
    try {
      await API.post(`/updateDescription`, { 
        VoucherNo: row.VoucherNo , 
        DescriptionId: selectedCategoryId,
        DescriptionValue: selectedCategoryValue, 
        existDescription:  row.Description , 
        existLedgerName: row.LedgerName,
        newAmount: editedAmount,
        newPurpose: editedPurpose, 
        Amount: row.Amount,
        Purpose: row.Purpose
      });
      // alert("Updated successfully!");
       toast.success("Updated successfully!");
      setEditingRowId(null);
      loadData();
    } catch (err) {
      console.error(err);
      // alert("Update failed!");
          toast.error("Update failed!");
    }
  };

  const filteredData = data.filter((row) => {
  return typeFilter ? row.TranType === typeFilter : true;
});

const exportToExcel = () => {
  // const exportData = filteredData.map((row) => ({
  //   Date: new Date(row.TranDate).toLocaleDateString(),
  //   Branch: row.Branch,
  //   VoucherNo: row.VoucherNo,
  //   EmpID: row.EmpID,
  //   Type: row.TranType,
  //   Description: row.Description,
  //   LedgerName: row.LedgerName,
  //   Amount: row.Amount,
  //   Purpose: row.Purpose,
  // }));

  const exportData = filteredData.map((row) => {
  const baseData = {
    Date: new Date(row.TranDate).toLocaleDateString(),
    VoucherNo: row.VoucherNo,
    Type: row.TranType,
    Description: row.Description,
    LedgerName: row.LedgerName,
    Amount: row.Amount,
  };

  // ✅ Only for role 1 & 2
  if (["1", "2"].includes(role)) {
    return {
      ...baseData,
      Branch: row.Branch,
      EmpID: row.EmpID,
      Purpose: row.Purpose,
    };
  }

  return baseData;
});

  const worksheet = XLSX.utils.json_to_sheet(exportData);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions");

  const excelBuffer = XLSX.write(workbook, {
    bookType: "xlsx",
    type: "array",
  });

  const blob = new Blob([excelBuffer], {
    type: "application/octet-stream",
  });

  // saveAs(blob, "DailyTransactions.xlsx");
    // ✅ Create DateTime filename
  const now = new Date();
  const formattedDate = now
    .toISOString()
    .replace(/[:.]/g, "-")   // remove invalid chars
    .slice(0, 19);           // keep yyyy-mm-ddThh-mm-ss

  const fileName = `DailyTransactions_${formattedDate}.xlsx`;

  saveAs(blob, fileName);

  toast.success("Excel exported successfully!");
};

  return (
    <div className="container-fluid mt-3">
      <ToastContainer position="top-right" autoClose={2000} />
      <h3 className="text-center mb-3">Daily Transactions</h3>

      {/* FILTER */}
      <div className="row mb-3 align-items-center">
        {userbranch === "HO" && (
          <div className="col-md-3">
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

        <div className="col-md-3 d-flex gap-2 align-items-center">
          <input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <span>To</span>
          <input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>

        <div className="col-md-3">
          <select
            className="form-control"
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="">All Types</option>
            <option value="Expenses">Expenses</option>
            <option value="Suspenses">Suspenses</option>
            <option value="Receipt">Receipt</option>
          </select>
        </div>

<div className="col-md-3">
  <button className="btn btn-success" onClick={exportToExcel}>
    Export to Excel
  </button>
</div>

      </div>

      

      {/* TABLE */}
      <div
        className="table-responsive"
        style={{ maxHeight: "700px", overflowY: "auto" }} // set scrollable height
      >
        <table className="table table-bordered table-striped text-center mb-0">
          <thead className="table-primary">
            <tr>
              <th style={{ position: "sticky", top: 0,  zIndex: 2 }}>Date</th>
              <th style={{ position: "sticky", top: 0, zIndex: 2 }}>Branch</th>
              <th style={{ position: "sticky", top: 0, zIndex: 2 }}>Voucher</th>
              <th style={{ position: "sticky", top: 0, zIndex: 2 }}>EmpID</th>
              <th style={{ position: "sticky", top: 0, zIndex: 2 }}>Type</th>
              <th style={{ position: "sticky", top: 0,  zIndex: 2 }}>Description</th>
              <th style={{ position: "sticky", top: 0, zIndex: 2 }}>Amount</th>
              <th style={{ position: "sticky", top: 0,  zIndex: 2 }}>Purpose</th>
              {user.role !== "2" && (
                <th style={{ position: "sticky", top: 0, zIndex: 2 }}>Action</th>
              )}
            </tr>
          </thead>
          <tbody>
            {filteredData.length > 0 ? (
              filteredData.map((row, i) => (
                <tr key={i}>
                  <td>{new Date(row.TranDate).toLocaleDateString()}</td>
                  <td>{row.Branch}</td>
                  <td>{row.VoucherNo}</td>
                  <td>{row.EmpID}</td>
                  <td>
                    <span
                      className={`badge ${
                        row.TranType.toLowerCase() === "expenses"
                          ? "bg-success"
                          : row.TranType === "Suspenses"
                          ? "bg-danger"
                          : "bg-primary"
                      }`}
                    >
                      {row.TranType}
                    </span>
                  </td>
                  {/* <td>
                    {editingRowId === row.Id ? (
                      <select
                        className="form-select form-select-sm"
                        value={selectedCategoryId || ""}
                        onChange={(e) => {
                          const id = e.target.value;
                          const selected = categories.find((c) => c.Id.toString() === id);
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
                        <small className="text-muted">({row.LedgerName})</small>
                      </>
                    )}
                  </td>
                  <td>₹ {row.Amount}</td>
                  <td>{row.Purpose}</td> */}

                  <td>
                      {editingRowId === row.Id ? (
                        <select
                          className="form-select form-select-sm"
                          value={selectedCategoryId || ""}
                          onChange={(e) => {
                            const id = e.target.value;
                            const selected = categories.find((c) => c.Id.toString() === id);
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
                          <small className="text-muted">({row.LedgerName})</small>
                        </>
                      )}
                    </td>

                    <td>
                      {editingRowId === row.Id ? (
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          value={editedAmount || ""}
                          onChange={(e) => setEditedAmount(e.target.value)}
                        />
                      ) : (
                        `₹ ${row.Amount}`
                      )}
                    </td>

                    <td>
                      {editingRowId === row.Id ? (
                        <input
                          type="text"
                          className="form-control form-control-sm"
                          value={editedPurpose || ""}
                          onChange={(e) => setEditedPurpose(e.target.value)}
                        />
                      ) : (
                        row.Purpose
                      )}
                    </td>
                  {user.role !== "2" && (
                    // <td>

                    //     {editingRowId === row.Id ? (
                    //     <button className="btn btn-sm btn-success" onClick={() => handleUpdateClick(row)}>
                    //           Update
                    //         </button>
                    //       ) : (
                    //         <button className="btn btn-sm btn-primary" onClick={() => handleEditClick(row)}>
                    //           Edit
                    //         </button>
                    //       )}
                      
                    // </td>

                      <td>
                        {user.role !== "2" && (() => {
                          // parse dates
                          const rowDate = new Date(row.TranDate);
                          const minDate = new Date(lastDate); // lastDate is like "2026-04-07"

                          // compare
                          if (rowDate <= minDate) {
                            return <label>Not Editable</label>;
                          } else {
                            return editingRowId === row.Id ? (
                              <button className="btn btn-sm btn-success" onClick={() => handleUpdateClick(row)}>
                                Update
                              </button>
                            ) : (
                              <button className="btn btn-sm btn-primary" onClick={() => handleEditClick(row)}>
                                Edit
                              </button>
                            );
                          }
                        })()}
                      </td>
                  )}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="text-muted py-4">
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