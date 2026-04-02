import React, { useEffect, useState } from "react";
import axios from "axios";
import "../style/Entry.css";
import API from "../axios";

const Entry = () => {

    
   const userbranch = localStorage.getItem("branch"); 
   const [filteredCategories, setFilteredCategories] = useState([]);

   

    const today = new Date().toISOString().split("T")[0];
const [form, setForm] = useState({
    VoucherNo: "",
    Type: "Expenses",
    ExpenseCategory: "",
    LedgerName: "",
    EmployeeCode: "",
    Date: new Date().toISOString().split("T")[0], 
    ApprovedBy: "",
    Amount: "",
    Purpose: "",
    Branch: userbranch || ""  
});
const getFormType = (type) => {
  switch (type) {
    case "Expenses":
      return "EXP";
    case "Suspenses":
      return "SUSP";
    case "Receipt":
      return "RECP";
    default:
      return "";
  }
};

    const [categories, setCategories] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");

    // Voucher Load
 useEffect(() => {
    API.get("/voucher")
        .then(res => {
            setForm(prev => ({
                ...prev,
                VoucherNo: res.data.voucher,
                Date: new Date().toISOString().split("T")[0] 
            }));
        });
}, []);

useEffect(() => {
    if (userbranch) {
        setForm(prev => ({
            ...prev,
            Branch: userbranch
        }));
    }
}, []);

const generateVoucher = async () => {
  try {
    const branch = localStorage.getItem("branch"); 
    const formType = getFormType(form.Type);

    const res = await API.get(
      `/voucher/generate?branch=${branch}&type=${formType}`
    );

    setForm(prev => ({
      ...prev,
      VoucherNo: res.data.voucher,
      Date: new Date().toISOString().split("T")[0]
    }));

  } catch (err) {
    console.error(err);
  }
};



useEffect(() => {
  if (form.Type) {
    generateVoucher();
  }
}, [form.Type]);

            useEffect(() => {
                API.get("/categories")
            .then(res => setCategories(res.data));
    }, []);

const handleDateChange = (e) => {
    setForm(prev => ({
        ...prev,
        Date: e.target.value
    }));
};

   const handleChange = (e) => {
    const { name, value } = e.target;

    if (name === "ExpenseCategory") {
        const selected = categories.find(c => c.Id == value);

        setForm(prev => ({
            ...prev,
            ExpenseCategory: selected?.ExpenseCategory || "",
            LedgerName: selected?.LedgerName || ""
        }));
    } else {
        setForm(prev => ({
            ...prev,
            [name]: value
        }));
    }
};

useEffect(() => {
  if (form.Type === "Suspenses") {
    const filtered = categories.filter(
      (c) => c.ExpenseCategory?.toLowerCase().includes("suspense")
    );
    setFilteredCategories(filtered);
  } else {
    setFilteredCategories(categories); // show all
  }
}, [form.Type, categories]);

  const handleSubmit = async () => {

    if (
        !form.VoucherNo ||
        !form.Type ||
        !form.ExpenseCategory ||
        !form.EmployeeCode ||
        !form.Date ||
        !form.ApprovedBy ||
        !form.Amount ||
        !form.Purpose   ||
        !form.Branch

    ) {
        setMessage("⚠️ All fields are mandatory!");
        return;
    }

    if (Number(form.Amount) <= 0) {
        setMessage("⚠️ Amount must be greater than 0");
        return;
    }

    if (form.Type.toLocaleLowerCase() == 'expenses'){
        if(Number(form.Amount > 10000)){
            setMessage("⚠️ Expenses Amount below 10,000 only");
            return;
        }
    }

    setLoading(true);
    
    console.log(form)

    try {
        // await API.post("/expenses", form);
         const res = await API.post("/expenses", form);


    // ✅ MESSAGE FROM API
     const apiMessage = res.data.message;


        // setMessage("✅ Expense Saved Successfully!");
          setMessage(apiMessage);


        setTimeout(() => setMessage(""), 5000);

        // alert("Expense Saved Successfully!");
        alert(apiMessage);

       
        setForm({
           
            Type: "Expenses",
            ExpenseCategory: "",
            LedgerName: "",
            EmployeeCode: "",
            Date: new Date().toISOString().split("T")[0],
            ApprovedBy: "",
            Amount: "",
            Purpose: "",
            Branch: userbranch || ""
        });
window.location.reload(); 
    } catch (err) {
        console.error(err);
        setMessage("❌ Error saving data");
    }

    setLoading(false);
};

    return (
      
        <div className="container mt-5">
            <div className="card shadow-lg p-4 rounded-4">

                <h3 className="text-center mb-4 text-black">
                      Cashbox Expense Entry
                  </h3>

                {message && (
                    <div className="alert alert-info text-center fade show">
                        {message}
                    </div>
                )}

                <div className="row g-3">

                  <div className="col-md-4">
                        <label>Voucher No</label>
                        <input
                            className="form-control"
                            value={form.VoucherNo}
                            readOnly
                        />
                        </div>

                    <div className="col-md-6">
                        <label>Type</label>
                        <select className="form-control" name="Type" onChange={handleChange}>
                            <option>Expenses</option>
                            <option>Suspenses</option>
                            <option>Receipt</option>
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label>Category</label>
                        <select className="form-control" name="ExpenseCategory" onChange={handleChange}>
                            <option value="">Select</option>
                            {/* {categories.map(c => ( */}
                            {filteredCategories.map(c => (
                                <option key={c.Id} value={c.Id}>
                                    {c.ExpenseCategory}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div className="col-md-6">
                        <label>Employee Code</label>
                        <input className="form-control" name="EmployeeCode" onChange={handleChange} />
                    </div>

                    <div className="col-md-6">
                        <label>Date</label>
                        <input
    type="date"
    className="form-control"
    name="Date"
    value={form.Date}   // ✅ bind value
    onChange={handleDateChange}
/>
                    </div>

                    

                    <div className="col-md-6">
                    <label>Approved By</label>

                    <select
                        className="form-control"
                        name="ApprovedBy"
                        value={form.ApprovedBy}  
                        onChange={handleChange}
                    >
                        <option value="">Select Approver</option>
                        <option value="Director">Director</option>
                        <option value="VP/CFO">VP/CFO</option>
                        <option value="GM/BM/SRM">GM/BM/SRM</option>
                    </select>
                    </div>

                    <div className="col-md-6">
                        <label>Amount</label>
                        <input className="form-control" name="Amount" onChange={handleChange} />
                    </div>

                    <div className="col-md-12">
                        <label>Purpose</label>
                        <textarea className="form-control" name="Purpose" onChange={handleChange}></textarea>
                    </div>

                </div>

                <div className="text-center mt-4">
                    <button
                        className=" baseBgColor text-white px-5 py-2 rounded "
                        style={{}}
                        onClick={handleSubmit}
                        disabled={loading}
                    >
                        {loading ? "Saving..." : "Submit"}
                    </button>
                </div>

            </div>
        </div>
    );
};

export default Entry;