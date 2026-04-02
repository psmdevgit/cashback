import React, { useEffect, useState } from "react";
import API from "../axios";


export default function ExpenseReport() {
  const [data, setData] = useState([]);
  const [branches, setBranches] = useState([]);
  const [categories, setCategories] = useState([]);

  const [totals, setTotals] = useState({});
  const [filters, setFilters] = useState({
    branch: "",
    category: "",
    fromDate: "",
    toDate: ""
  });

  // Fetch dropdown data
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
    const res = await API.post("/expense-report", filters);
      const cleanedData = res.data.map(row => {
      let newRow = {};
      Object.keys(row).forEach(key => {
        newRow[key] = row[key] === null ? 0 : row[key];
      });
      return newRow;
    });

    setData(cleanedData);
    calculateTotals(cleanedData);
  };
const calculateTotals = (rows) => {
    let totalObj = {};

    rows.forEach(row => {
      Object.keys(row).forEach(key => {
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

  const exportToExcel = () => {
    window.open("/export-excel?" + new URLSearchParams(filters));
  };

  return (
    <div className="p-4 overflow-x-auto">
      <h2 className="text-xl font-bold mb-4">Expense Report</h2>

      {/* Filters */}
      <div className=" mb-4 flex flex-wrap gap-2">
        <select name="branch" onChange={handleChange} className="border p-2">
          <option value="">All Branches</option>
          {branches.map((b, i) => (
            <option key={i} value={b}>{b}</option>
          ))}
        </select>

        <select name="category" onChange={handleChange} className="border p-2">
          <option value="">All Categories</option>
          {categories.map((c, i) => (
            <option key={i} value={c}>{c}</option>
          ))}
        </select>

        <input type="date" name="fromDate" onChange={handleChange} className="border p-2" />
        <input type="date" name="toDate" onChange={handleChange} className="border p-2" />

        <button onClick={handleSearch} className="bg-primary text-white p-2 rounded">Search</button>  <button onClick={exportToExcel} className="bg-success text-white p-2 rounded mb-4 flex-end items-center gap-1">
        Export Excel
      </button>
      </div>

      {/* Export */}
     

      {/* Table */}
      <div className="overflow-x-auto ">
        <table className="table table-bordered table-striped text-center w-75 m-auto h-25">
          <thead className="table-primary  text-white">
            <tr>
              {data.length > 0 && Object.keys(data[0]).map((key, i) => (
                <th key={i} className="border p-2 bg-gray-200">{key}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row, i) => (
              <tr key={i}>
                {Object.values(row).map((val, j) => (
                  <td key={j} className="border p-2 text-center">{val}</td>
                ))}
              </tr>
            ))}
          </tbody>
           {data.length > 0 && (
            <tfoot className="table-success text-white font-bold">
              <tr>
                {Object.keys(data[0]).map((key, i) => (
                  <td key={i} className="px-4 py-3 border text-center">
                    {key === "ExpenseCategory"
                      ? "Total"
                      : totals[key] || 0}
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
