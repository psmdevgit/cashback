import React, { useEffect, useState } from "react";
import API from "../axios";
import VoucherDropdown from "../components/VoucherDropDown";

const SuspenseGrid = () => {

  const [voucher, setVoucher] = useState("");
  const [master, setMaster] = useState({});
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);

useEffect(() => {
  API.get("/categories").then(res => {
    setCategories(res.data);
  });
}, []);

  // ✅ Load when voucher changes
  useEffect(() => {
    if (voucher) {
      loadData();
    }
  }, [voucher]);

 const loadData = async () => {
  const res = await API.get(`/suspense?voucher=${voucher}`);

  setMaster(res.data.master || {});

  const existingRows = (res.data.details || []).map((r, index) => ({
    ...r,
    saved: true,
    SuspenseId: index + 1
  }));

  setRows(existingRows);
};

  // 🔹 Handle Change
 const handleChange = (index, field, value) => {
  const updated = [...rows];

  if (field === "ExpenseCategory") {
    const selected = categories.find(c => c.Id == value);

    updated[index].ExpenseCategory = selected?.ExpenseCategory;
    updated[index].LedgerName = selected?.LedgerName;
    updated[index].CategoryId = value;
  } else {
    updated[index][field] = value;
  }

  setRows(updated);
};

  // 🔹 Add Row
 const addRow = () => {
  setRows([
    ...rows,
    {
      SuspenseId: rows.length + 1,
      ExpenseCategory: "",
      LedgerName: "",
      Amount: "",
      ApprovedBy: "",
      saved: false
    }
  ]);
};

  // 🔹 Remove Row
  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
  };

  // 🔥 CALCULATION (IMPORTANT FIX)

  // DB used amount
  const alreadyUsed = master.UsedAmount || 0;

  // Current grid entered
  const currentUsed = rows.reduce(
    (sum, r) => sum + Number(r.Amount || 0),
    0
  );

  // Total used = DB + current
  const totalUsed = alreadyUsed + currentUsed;

  const remaining =
    (master.AdvanceAmount || 0) - totalUsed;

  // 🔹 Submit
const handleSubmit = async () => {

  const confirmSave = window.confirm("Are you sure you want to submit?");

  if (!confirmSave) return;

  try {
    const newRows = rows.filter(r => !r.saved);

    const res = await API.post("/suspense/save", {
      VoucherNo: voucher,
      rows: newRows
    });

    const updated = rows.map(r => {
      if (!r.saved) {
        return {
          ...r,
          saved: true,
          SuspenseId: res.data.ids.shift()
        };
      }
      return r;
    });

    setRows(updated);
    setMessage("✅ Saved Successfully");

  } catch (err) {
    alert(err.response?.data || "Error saving");
  }
};
  
  return (
    <div className="container mt-4">

      <h2 className="text-center mb-4">Suspense Entry</h2>

      {/* 🔹 TOP SECTION */}
      <div className="row mb-3">

        <div className="col-md-4">
          <VoucherDropdown setVoucher={setVoucher} />
        </div>

        <div className="col-md-4">
          <label>Total Advance</label>
          <input
            className="form-control"
            value={master.AdvanceAmount || 0}
            readOnly
          />
        </div>

        <div className="col-md-4">
          <label>Remaining</label>
          <input
            className={`form-control fw-bold ${
              remaining < 0 ? "text-danger" : "text-success"
            }`}
            value={remaining}
            readOnly
          />
        </div>
      </div>

      {/* 🔹 GRID */}
      <div className="table-responsive">
        <table className="table table-bordered text-center">
<thead className="table-dark">
  <tr>
    <th>ID</th>
    <th>Expense Category</th>
    <th>Approved By</th>
    <th>Amount</th>
    <th>Action</th>
  </tr>
</thead>

<tbody>
  {rows.map((row, i) => (
    <tr key={i} className={row.saved ? "table-light" : ""}>

      {/* 🔥 SuspenseId */}
      <td>{row.SuspenseId}</td>

      {/* 🔥 Category Dropdown */}
      <td>
        <select
          className="form-control"
        value={
  row.CategoryId ||
  categories.find(c => c.ExpenseCategory === row.ExpenseCategory)?.Id ||
  ""
}
          onChange={(e) =>
            handleChange(i, "ExpenseCategory", e.target.value)
          }
          disabled={row.saved}
        >
          <option value="">Select</option>
          {categories.map(c => (
            <option key={c.Id} value={c.Id}>
              {c.ExpenseCategory}
            </option>
          ))}
        </select>
      </td>

      {/* Approved */}
      <td>
        <input
          className="form-control"
          value={row.ApprovedBy}
          disabled={row.saved}
          onChange={(e) =>
            handleChange(i, "ApprovedBy", e.target.value)
          }
        />
      </td>

      {/* Amount */}
      <td>
        <input
          type="number"
          className="form-control"
          value={row.Amount}
          disabled={row.saved}
          onChange={(e) =>
            handleChange(i, "Amount", e.target.value)
          }
        />
      </td>

      {/* Action */}
      <td>
        {!row.saved && (
          <button
            className="btn btn-danger btn-sm"
            onClick={() => removeRow(i)}
          >
            ✖
          </button>
        )}
      </td>

    </tr>
  ))}
</tbody>

          {/* 🔥 FOOTER */}
          <tfoot>
            <tr className="fw-bold">
              <td colSpan="3">Already Used</td>
              <td>{alreadyUsed}</td>
              <td></td>
            </tr>

            <tr className="fw-bold">
              <td colSpan="3">Current Entry</td>
              <td>{currentUsed}</td>
              <td></td>
            </tr>

            <tr className="fw-bold">
              <td colSpan="3">Remaining Balance</td>
              <td className={remaining < 0 ? "text-danger" : "text-success"}>
                {remaining}
              </td>
              <td></td>
            </tr>
          </tfoot>

        </table>
      </div>

      {/* 🔹 ACTION */}
      <div className="d-flex justify-content-between mt-3">
        <button className="btn btn-primary" onClick={addRow}>
          ➕ Add Row
        </button>

       <button
  className="btn btn-success"
  onClick={handleSubmit}
  disabled={master.Status === "Completed"}
>
  💾 Save
</button>
      </div>

      {message && (
        <div className="alert alert-info mt-3 text-center">
          {message}
        </div>
      )}
    </div>
  );
};

export default SuspenseGrid;