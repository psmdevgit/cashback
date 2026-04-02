
// import React, { use, useEffect, useState } from "react";
// import API from "../axios";

// const InventoryDashboard = () => {
//   const [data, setData] = useState([]);
//   const userbranch = localStorage.getItem("branch").trim();
//   const [branch, setBranch] = useState(userbranch === "HO" ? "" : userbranch);
  
//   const user = JSON.parse(localStorage.getItem("user") || "{}"); // parse user object

//   const [summary, setSummary] = useState({ opening: 0, closing: 0, debit: 0, credit: 0 });
//   const [fromDate, setFromDate] = useState("");
//   const [toDate, setToDate] = useState("");

//   const [categories, setCategories] = useState([]); // for dropdown
//   const [editingRowId, setEditingRowId] = useState(null); // row being edited
//   const [selectedCategoryId, setSelectedCategoryId] = useState(null); // new description
//   const [selectedCategoryValue, setSelectedCategoryValue] = useState(null); // new description

//   useEffect(() => {
//     loadData();
//     fetchCategories();
//   }, [branch, fromDate, toDate]);

//   const loadData = async () => {
//     try {
//       const res = await API.get(`/dailyTransactions?branch=${branch}&fromDate=${fromDate}&toDate=${toDate}`);
//       setData(res.data);

//       if (res.data.length > 0) {
//         const totalDebit = res.data.reduce((s, r) => s + Number(r.Debit), 0);
//         const totalCredit = res.data.reduce((s, r) => s + Number(r.Credit), 0);
//         setSummary({
//           opening: res.data[res.data.length - 1].OpeningBalance,
//           closing: res.data[0].ClosingBalance,
//           debit: totalDebit,
//           credit: totalCredit
//         });
//       }
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const fetchCategories = async () => {
//     try {
//       const res = await API.get("/categories");
//       setCategories(res.data);
//     } catch (err) {
//       console.error(err);
//     }
//   };

//   const handleEditClick = (row) => {
//     setEditingRowId(row.Id);
//     setSelectedCategoryId(row.DescriptionId || null); // assuming DescriptionId matches dropdown
//   };

//   const handleUpdateClick = async (row) => {
//     if (!selectedCategoryId) {
//       alert("Select a category first!");
//       return;
//     }

//     console.log("selected Row : ", row, selectedCategoryId, selectedCategoryValue, row.Description)
//     try {
//       await API.post(`/updateDescription`, { VoucherNo: row.VoucherNo , DescriptionId: selectedCategoryId,DescriptionValue: selectedCategoryValue, existDescription:  row.Description , existLedgerName: row.LedgerName});
//       alert("Updated successfully!");
//       setEditingRowId(null);
//       loadData();
//     } catch (err) {
//       console.error(err);
//       alert("Update failed!");
//     }
//   };

//   return (
//     <div className="container-fluid mt-3">
//       <h3 className="text-center mb-4">Daily Transactions</h3>

//       {/* FILTER */}
//       <div className="row mb-3 align-items-center">
//         {userbranch === "HO" && (
//           <div className="col-md-3">
//             <select className="form-control" value={branch} onChange={(e) => setBranch(e.target.value)}>
//               <option value="">ALL</option>
//               <option value="CPT">CPT</option>
//               <option value="TVL">TVL</option>
//               <option value="CBE">CBE</option>
//               <option value="TPJ">TPJ</option>
//               <option value="TVM">TVM</option>
//               <option value="PMLE">PMLE</option>
//               <option value="SLM">SLM</option>
//               <option value="PADI">PADI</option>
//             </select>
//           </div>
//         )}

//         <div className="col-md-4 d-flex gap-2 align-items-center">
//           <input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
//           <span>To</span>
//           <input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} />
//         </div>
//       </div>

//       {/* TABLE */}
//       <div className="table-responsive">
//         <table className="table table-bordered table-striped text-center">
//           <thead className="table-dark">
//             <tr>
//               <th>Date</th>
//               <th>Voucher</th>
//               <th>Type</th>
//               <th>Description</th>
//               <th>Debit</th>
//               <th>Credit</th>
//               <th>Opening</th>
//               <th>Closing</th>

//               {user.role === "1" && <th>Action</th>}
              
//             </tr>
//           </thead>
//           <tbody>
//             {data.length > 0 ? (
//               data.map((row, i) => (
//                 <tr key={i}>
//                   <td>{new Date(row.TranDate).toLocaleDateString()}</td>
//                   <td>{row.VoucherNo}</td>
//                   <td>
//                     <span
//                       className={`badge ${
//                         row.TranType === "EXPENSE"
//                           ? "bg-danger"
//                           : row.TranType === "RECEIPT"
//                           ? "bg-success"
//                           : "bg-warning text-dark"
//                       }`}
//                     >
//                       {row.TranType}
//                     </span>
//                   </td>

//                   {/* <td>
//                     {editingRowId === row.Id ? (
//                       <select
//                         className="form-select form-select-sm"
//                         value={selectedCategoryId || ""}
//                         onChange={(e) => {setSelectedCategoryId(e.target.id), setSelectedCategoryValue(e.target.value)}}
//                       >
//                         <option value="">Select Category</option>
//                         {categories.map((c) => (
//                           <option key={c.Id} value={c.ExpenseCategory}>
//                             {c.ExpenseCategory}
//                           </option>
//                         ))}
//                       </select>
//                     ) : (
//                       row.Description
//                     )}
//                   </td> */}

//                   <td>
//                     {editingRowId === row.Id ? (
//                       <select
//                         className="form-select form-select-sm"
//                         value={selectedCategoryId || ""}
//                         onChange={(e) => {
//                           const id = e.target.value;

//                           const selected = categories.find(
//                             (c) => c.Id.toString() === id
//                           );

//                           setSelectedCategoryId(id); // ✅ ID
//                           setSelectedCategoryValue(selected?.ExpenseCategory || ""); // ✅ VALUE
//                         }}
//                       >
//                         <option value="">Select Category</option>

//                         {categories.map((c) => (
//                           <option key={c.Id} value={c.Id}>
//                             {c.ExpenseCategory}
//                           </option>
//                         ))}
//                       </select>
//                     ) : (
//                       <>
//                         <div>{row.Description}</div>
//                         <small className="text-muted">
//                           ({row.LedgerName})
//                         </small>
//                       </>
//                     )}
//                   </td>


//                   <td className="text-danger fw-bold">{row.Debit > 0 ? `₹ ${row.Debit}` : "-"}</td>
//                   <td className="text-success fw-bold">{row.Credit > 0 ? `₹ ${row.Credit}` : "-"}</td>
//                   <td>{row.OpeningBalance}</td>
//                   <td className="fw-bold">₹ {row.ClosingBalance}</td>

//                   { user.role === "1" && (
//                     <td>
//                       {editingRowId === row.Id ? (
//                         <button className="btn btn-sm btn-success" onClick={() => handleUpdateClick(row)}>
//                           Update
//                         </button>
//                       ) : (
//                         <button className="btn btn-sm btn-primary" onClick={() => handleEditClick(row)}>
//                           Edit
//                         </button>
//                       )}
//                     </td>
//                   )}
                  
//                 </tr>
//               ))
//             ) : (
//               <tr>
//                 <td colSpan="9" className="text-muted py-4">
//                   No data found
//                 </td>
//               </tr>
//             )}
//           </tbody>
//         </table>
//       </div>
//     </div>
//   );
// };

// export default InventoryDashboard;


import React, { use, useEffect, useState } from "react";
import API from "../axios";

const InventoryDashboard = () => {
  const [data, setData] = useState([]);
  const userbranch = localStorage.getItem("branch").trim();
  const [branch, setBranch] = useState(userbranch === "HO" ? "" : userbranch);
  
  const user = JSON.parse(localStorage.getItem("user") || "{}"); // parse user object

  const [summary, setSummary] = useState({ opening: 0, closing: 0, debit: 0, credit: 0 });
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [categories, setCategories] = useState([]); // for dropdown
  const [editingRowId, setEditingRowId] = useState(null); // row being edited
  const [selectedCategoryId, setSelectedCategoryId] = useState(null); // new description
  const [selectedCategoryValue, setSelectedCategoryValue] = useState(null); // new description

  useEffect(() => {
    loadData();
    fetchCategories();
  }, [branch, fromDate, toDate]);

  const loadData = async () => {
    try {
      const res = await API.get(`/dailyTransactions?branch=${branch}&fromDate=${fromDate}&toDate=${toDate}`);
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

  return (
    <div className="container-fluid mt-3">
      <h3 className="text-center mb-4">Daily Transactions</h3>

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

        <div className="col-md-4 d-flex gap-2 align-items-center">
          <input type="date" className="form-control" value={fromDate} onChange={(e) => setFromDate(e.target.value)} />
          <span>To</span>
          <input type="date" className="form-control" value={toDate} onChange={(e) => setToDate(e.target.value)} />
        </div>
      </div>

      {/* TABLE */}
      <div className="table-responsive">
        <table className="table table-bordered table-striped text-center">
          <thead className="table-primary text-white">
            <tr>
              <th>Date</th>
              <th>Branch</th>
              <th>Voucher</th>
              <th>Type</th>
              <th>Description</th>
              <th>Amount</th>
              <th>Purpose</th>

              {user.role === "1" && <th>Action</th>}
              
            </tr>
          </thead>
          <tbody>
            {data.length > 0 ? (
              data.map((row, i) => (
                <tr key={i}>
                  <td>{new Date(row.TranDate).toLocaleDateString()}</td>
                  
                  <td>{row.Branch}</td>
                  <td>{row.VoucherNo}</td>
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

                          setSelectedCategoryId(id); // ✅ ID
                          setSelectedCategoryValue(selected?.ExpenseCategory || ""); // ✅ VALUE
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
                  <td>₹ {row.Amount}</td>
                  <td>{row.Purpose}</td>

                  { user.role === "1" && (
                    <td>
                      {editingRowId === row.Id ? (
                        <button className="btn btn-sm btn-success" onClick={() => handleUpdateClick(row)}>
                          Update
                        </button>
                      ) : (
                        <button className="btn btn-sm btn-primary" onClick={() => handleEditClick(row)}>
                          Edit
                        </button>
                      )}
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