import React, { useEffect, useState } from "react";
import API from "../axios";
import VoucherDropdown from "../components/VoucherDropDown";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const SuspenseGrid = () => {

  const [voucher, setVoucher] = useState("");
  const [master, setMaster] = useState({});
  const [rows, setRows] = useState([]);
  const [message, setMessage] = useState("");
  const [categories, setCategories] = useState([]);

  const [approvedBy, setApprovedBy] = useState("");
  const [narration, setNarration] = useState("");

  
  //  const userBranch = localStorage.getItem("branch").trim(); 


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


    useEffect(() => {
  if (currentUsed > (master.AdvanceAmount || 0)) {
    // alert("❌ Current Entry exceeds Total Advance!");
    toast.warning(" Current Entry exceeds Total Advance!");
  }
}, [currentUsed, master.AdvanceAmount]);

  // 🔹 Submit
// const handleSubmit = async () => {

//   const confirmSave = window.confirm("Are you sure you want to submit?");

//   if (!confirmSave) return;
//     if (currentUsed > (master.AdvanceAmount || 0)) {
//     alert("❌ Current Entry exceeds Total Advance!");
//     return;
//   }


//   try {
//     const newRows = rows.filter(r => !r.saved);

//     const res = await API.post("/suspense/save", {
//       VoucherNo: voucher,
//       rows: newRows
//     });

//     const updated = rows.map(r => {
//       if (!r.saved) {
//         return {
//           ...r,
//           saved: true,
//           SuspenseId: res.data.ids.shift()
//         };
//       }
//       return r;
//     });

//     setRows(updated);
//     setMessage("✅ Saved Successfully");

//      // 🔥 wait 2 seconds → reload
//     setTimeout(() => {
//       window.location.reload();
//     }, 1000);


//   } catch (err) {
//     alert(err.response?.data || "Error saving");
//   }
// };
        const handleSubmit = async () => {

        if (!approvedBy) {
          // alert("❌ Please select Approved By!");
          toast.warning(" Please select Approved By!");
          return;
        }

        //   if (!narration.trim()) {
        //   alert("❌ Please enter narration!");
        //   return;
        // }

        // const confirmSave = window.confirm("Are you sure you want to submit?");
        // if (!confirmSave) return;

        if (currentUsed > (master.AdvanceAmount || 0)) {
          // alert("❌ Current Entry exceeds Total Advance!");
          toast.warning("Current Entry exceeds Total Advance!");
          return;
        }

        try {
          const newRows = rows
            .filter(r => !r.saved)
            .map(r => ({
              ...r,
              ApprovedBy: approvedBy,
              Narration: narration 
            }));

          const res = await API.post("/suspense/save", {
            VoucherNo: voucher,
             narration: narration,
            rows: newRows
          });

          const updated = rows.map(r => {
            if (!r.saved) {
              return {
                ...r,
                saved: true,
                ApprovedBy: approvedBy, 
                Narration: narration,
                SuspenseId: res.data.ids.shift()
              };
            }
            return r;
          });

          setRows(updated);
          setMessage("✅ Saved Successfully");
          toast.success("Saved Successfully");

          setTimeout(() => {
            window.location.reload();
          }, 2000);

        } catch (err) {
          // alert(err.response?.data || "Error saving");
          toast.error(err.response?.data || "Error saving");
        }
      };
  return (
    <div className="container mt-3">

      <ToastContainer position="top-right" autoClose={3000} />

      <h3 className="text-center mb-4">Suspense Entry</h3>


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
<thead className="table-primary">
  <tr>
    <th>ID</th>
    <th>Expense Category</th>
    {/* <th>Approved By</th> */}
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
      {/* <td>
       
         <select
    className="form-control"
    value={row.ApprovedBy || ""}
    disabled={row.saved}
    onChange={(e) =>
      handleChange(i, "ApprovedBy", e.target.value)
    }
  >
    <option value="">Select</option>
    <option value="Director">Director</option>
    <option value="VP/CFO">VP/CFO</option>
    <option value="GM/BM/SRM">GM/BM/SRM</option>
  </select>
  
      </td> */}

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
              <td colSpan="2">Already Used</td>
              <td>{alreadyUsed}</td>
              <td></td>
            </tr>

            <tr className="fw-bold">
              <td colSpan="2">Current Entry</td>
              <td>{currentUsed}</td>
              <td></td>
            </tr>

            <tr className="fw-bold">
              <td colSpan="2">Remaining Balance</td>
              <td className={remaining < 0 ? "text-danger" : "text-success"}>
                {remaining}
              </td>
              <td></td>
            </tr>
          </tfoot>

        </table>
      </div>

      <div className="row">        

        <div className="col-md-8">
          {/* <label className="fw-bold">Narration</label> */}
          <textarea
            className="form-control"
            rows="3"
            placeholder="Enter narration..."
            value={narration}
            onChange={(e) => setNarration(e.target.value)}
          ></textarea>
        </div>

        <div className="col-md-4">
  
              <select
                className="form-control w-100"
                value={approvedBy}
                onChange={(e) => setApprovedBy(e.target.value)}
              >
                <option value="">Select Approver</option>
                <option value="Director">Director</option>
                <option value="VP/CFO">VP/CFO</option>
                <option value="GM/BM/SRM">GM/BM/SRM</option>
              </select>

            </div>


      </div>
      {/* 🔹 ACTION */}
      <div className="d-flex justify-content-betwen gap-3 mt-3">        

        <button className="btn btn-secondary btn-sm px-lg-4 rounded" onClick={addRow}>
        Add Row
        </button>

        <button
          className="btn btn-success btn-sm px-lg-4 rounded"
          onClick={handleSubmit}
          disabled={master.Status === "Completed"}
        >
          Save
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