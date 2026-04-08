// import React, { useEffect, useState } from "react";
// import API from "../axios";
// import * as XLSX from "xlsx";
// import { saveAs } from "file-saver";

// export default function ExpenseReport() {
//   const [data, setData] = useState([]);
//   const [branches, setBranches] = useState([]);
//   const [categories, setCategories] = useState([]);
//   const [totals, setTotals] = useState({});
//   const [filters, setFilters] = useState({
//     branch: "",
//     category: "",
//     fromDate: "",
//     toDate: "",
//   });

//   const userbranch = localStorage.getItem("branch") || "";

//   useEffect(() => {
//     fetchFilters();
//     fetchReport();
//   }, []);

//   const fetchFilters = async () => {
//     const res = await API.get("/filters");
//     setBranches(res.data.branches);
//     setCategories(res.data.categories);
//   };

//   const fetchReport = async () => {
//     const res = await API.post("/expense-report", filters);
//     const cleanedData = res.data.map((row) => {
//       let newRow = {};
//       Object.keys(row).forEach((key) => {
//         newRow[key] = row[key] === null ? 0 : row[key];
//       });
//       return newRow;
//     });
//     setData(cleanedData);
//     calculateTotals(cleanedData);
//   };

//   const calculateTotals = (rows) => {
//     let totalObj = {};
//     rows.forEach((row) => {
//       Object.keys(row).forEach((key) => {
//         if (key !== "ExpenseCategory") {
//           totalObj[key] = (totalObj[key] || 0) + Number(row[key] || 0);
//         }
//       });
//     });
//     setTotals(totalObj);
//   };

//   const handleChange = (e) => {
//     setFilters({ ...filters, [e.target.name]: e.target.value });
//   };

//   const handleSearch = () => {
//     fetchReport();
//   };

//   // ✅ Export Table to Excel
//   const exportToExcel = () => {
//     if (data.length === 0) return alert("No data to export");

//     // Filter branch column for non-HO users
//     const exportData = data.map((row) => {
//       if (userbranch === "HO") return { ...row };
//       const { Branch, ...rest } = row;
//       return rest;
//     });

//     // Add totals row
//     const totalsRow = {};
//     Object.keys(exportData[0]).forEach((key) => {
//       totalsRow[key] = key === "ExpenseCategory" ? "Total" : totals[key] || 0;
//     });
//     exportData.push(totalsRow);

//     // Create workbook
//     const worksheet = XLSX.utils.json_to_sheet(exportData, { skipHeader: false });
//     const workbook = XLSX.utils.book_new();
//     XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

//     // Save file
//     const now = new Date();
//     const datetime = `${now.getFullYear()}${(now.getMonth() + 1)
//       .toString()
//       .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}_${now
//       .getHours()
//       .toString()
//       .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}`;
//     const fileName = `OverallReport_${datetime}.xlsx`;

//     const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
//     const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
//     saveAs(blob, fileName);
//   };

//   // Columns to show in table
//   const columns = data.length > 0
//     ? Object.keys(data[0]).filter((key) => key !== "Branch" || userbranch === "HO")
//     : [];

//   return (
//     <div className="container-fluid mt-3">
//       <h3 className="text-center mb-4">Expense Report</h3>

//       {/* Filters */}
//       <div className="row mb-3 g-2 align-items-center">
//         <div className="col-md-2">
//           <select
//             name="branch"
//             onChange={handleChange}
//             className="form-select form-select-sm"
//           >
//             <option value="">ALL</option>
//             {branches.map((b, i) => (
//               <option key={i} value={b}>
//                 {b}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="col-md-2">
//           <select
//             name="category"
//             onChange={handleChange}
//             className="form-select form-select-sm"
//           >
//             <option value="">All Categories</option>
//             {categories.map((c, i) => (
//               <option key={i} value={c}>
//                 {c}
//               </option>
//             ))}
//           </select>
//         </div>

//         <div className="col-md-3 d-flex gap-2">
//           <input
//             type="date"
//             name="fromDate"
//             onChange={handleChange}
//             className="form-control form-control-sm"
//           />
//           <input
//             type="date"
//             name="toDate"
//             onChange={handleChange}
//             className="form-control form-control-sm"
//           />
//         </div>

//         <div className="col-md-3 d-flex gap-2">
//           <button
//             onClick={handleSearch}
//             className="btn btn-primary btn-sm text-white"
//           >
//             Search
//           </button>
//           <button
//             onClick={exportToExcel}
//             className="btn btn-success btn-sm text-white"
//           >
//             Export Excel
//           </button>
//         </div>
//       </div>

//       {/* Table */}
//       <div className="table-responsive" style={{ maxHeight: "700px", overflowY: "auto" }}>
//         <table className="table table-bordered table-striped text-center w-100">
//           <thead className="table-primary text-white" style={{ position: "sticky", top: 0, zIndex: 2 }}>
//             <tr>
//               {columns.map((key, i) => (
//                 <th key={i} className="border p-2">{key}</th>
//               ))}
//             </tr>
//           </thead>

//           <tbody>
//             {data.map((row, i) => (
//               <tr key={i}>
//                 {columns.map((key, j) => (
//                   <td key={j} className="border p-2 text-center">
//                     {row[key]}
//                   </td>
//                 ))}
//               </tr>
//             ))}
//           </tbody>

//           {data.length > 0 && (
//             <tfoot className="table-success text-white fw-bold" style={{ position: "sticky", bottom: 0, zIndex: 2 }}>
//               <tr>
//                 {columns.map((key, i) => (
//                   <td key={i} className="px-4 py-3 border text-center">
//                     {key === "ExpenseCategory" ? "Total" : totals[key] || 0}
//                   </td>
//                 ))}
//               </tr>
//             </tfoot>
//           )}
//         </table>
//       </div>
//     </div>
//   );
// }

import React, { useEffect, useState } from "react";
import API from "../axios";
import * as XLSX from "xlsx";
import { saveAs } from "file-saver";

export default function ExpenseReport() {
  const [data, setData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);
  const [totals, setTotals] = useState({});

   const userbranch = localStorage.getItem("branch").trim();
    const [branch, setBranch] = useState(
       userbranch === "HO" ? "" : userbranch
     );
  const [filters, setFilters] = useState({
    branch: branch,
    category: "",
    fromDate: "",
    toDate: "",
  });
  
    // const [branch, setBranch] = useState(userbranch === "HO" ? "" : userbranch);

  useEffect(() => {
    fetchFilters();
    fetchReport();
  }, []);

  const fetchFilters = async () => {
    const res = await API.get("/filters");
    setBranches(res.data.branches);
    setCategories(res.data.categories);
  };

  const fetchReport = async () => {
    console.log('The filters',filters)
    const res = await API.post("/expense-report", filters);

    console.log("data : ",res.data)
    const cleanedData = res.data.map((row) => { 
      let newRow = {};
      Object.keys(row).forEach((key) => {
        newRow[key] = row[key] === null ? 0 : row[key];
      });
      return newRow;
    });
    setData(cleanedData);
    calculateTotals(cleanedData);
  };

  const calculateTotals = (rows) => {
    let totalObj = {};
    rows.forEach((row) => {
      Object.keys(row).forEach((key) => {
        if (key !== "ExpenseCategory") {
          totalObj[key] = (totalObj[key] || 0) + Number(row[key] || 0);
        }
      });
    });
    setTotals(totalObj);
  };

  const handleChange = (e) => {
    setFilters({ ...filters, [e.target.name]: e.target.value });
  };

  const handleSearch = () => {
    fetchReport();
  };

  // ✅ Export Table to Excel
  const exportToExcel = () => {
    if (data.length === 0) return alert("No data to export");

    // Build worksheet data
    const exportData = data.map((row) => ({ ...row }));
    // Add totals row
    const totalsRow = {};
    Object.keys(data[0]).forEach((key) => {
      totalsRow[key] = key === "ExpenseCategory" ? "Total" : totals[key] || 0;
    });
    exportData.push(totalsRow);

    // Create workbook
    const worksheet = XLSX.utils.json_to_sheet(exportData, { skipHeader: false });

    // Make header bold
    const range = XLSX.utils.decode_range(worksheet["!ref"]);
    for (let C = range.s.c; C <= range.e.c; ++C) {
      const cellAddress = XLSX.utils.encode_cell({ r: 0, c: C });
      if (!worksheet[cellAddress]) continue;
      worksheet[cellAddress].s = { font: { bold: true } };
    }

    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Report");

    const now = new Date();
    const datetime = `${now.getFullYear()}${(now.getMonth() + 1)
      .toString()
      .padStart(2, "0")}${now.getDate().toString().padStart(2, "0")}_${now
      .getHours()
      .toString()
      .padStart(2, "0")}${now.getMinutes().toString().padStart(2, "0")}`;
    const fileName = `OverallReport_${datetime}.xlsx`;

    const excelBuffer = XLSX.write(workbook, { bookType: "xlsx", type: "array" });
    const blob = new Blob([excelBuffer], { type: "application/octet-stream" });
    saveAs(blob, fileName);
  };

  return (
    <div className="container-fluid mt-3">
      <h3 className="text-center mb-4">Expense Report</h3>

      {/* Filters */}
      <div className="row mb-3 g-2 align-items-center">

        {
          branch == 'ho' && (
            <div className="col-md-2">
              <select
                name="branch"
                onChange={handleChange}
                className="form-select form-select-sm"
              >
                <option value="">ALL</option>
                {branches.map((b, i) => (
                  <option key={i} value={b}>
                    {b}
                  </option>
                ))}
              </select>
            </div>
          )
        }
        

        <div className="col-md-2">
          <select
            name="category"
            onChange={handleChange}
            className="form-select form-select-sm"
          >
            <option value="">All Categories</option>
            {categories.map((c, i) => (
              <option key={i} value={c}>
                {c}
              </option>
            ))}
          </select>
        </div>

        <div className="col-md-3 d-flex gap-2">
          <input
            type="date"
            name="fromDate"
            onChange={handleChange}
            className="form-control form-control-sm"
          />
          <input
            type="date"
            name="toDate"
            onChange={handleChange}
            className="form-control form-control-sm"
          />
        </div>

        <div className="col-md-3 d-flex gap-2">
          <button
            onClick={handleSearch}
            className="btn btn-primary btn-sm text-white"
          >
            Search
          </button>
          <button
            onClick={exportToExcel}
            className="btn btn-success btn-sm text-white"
          >
            Export Excel
          </button>
        </div>
      </div>

      {/* Table */}
      <div
        className="table-responsive"
        style={{ maxHeight: "700px", overflowY: "auto" }}
      >
        <table className="table table-bordered table-striped text-center w-100">
          <thead
            className="table-primary text-white"
            style={{ position: "sticky", top: 0, zIndex: 2 }}
          >
            <tr>
              {data.length > 0 &&
                Object.keys(data[0]).map((key, i) => (
                  <th key={i} className="border p-2">
                    {key}
                  </th>
                ))}
            </tr>
          </thead>

          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j} className="border p-2 text-center">
                    {val}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>

          {data.length > 0 && (
            <tfoot
              className="table-success text-white fw-bold"
              style={{ position: "sticky", bottom: 0, zIndex: 2 }}
            >
              <tr>
                {Object.keys(data[0]).map((key, i) => (
                  <td key={i} className="px-4 py-3 border text-center">
                    {key === "ExpenseCategory" ? "Total" : totals[key] || 0}
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}