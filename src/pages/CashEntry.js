import React, { useState, useEffect } from "react";
import API from "../axios";

export default function CashEntry() {

  const userbranch = localStorage.getItem("branch");

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [opening] = useState(100000);
  const [expenses, setExpenses] = useState(0);
  const [suspense, setSuspense] = useState(0);

  const [minDate, setMinDate] = useState("");

  const [denominations, setDenominations] = useState({
    500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0,
    c10: 0, c5: 0, c2: 0, c1: 0
  });

  // 🔹 Fetch Summary
  useEffect(() => {
    if (fromDate && toDate) {
      API.get("/cash-summary", {
        params: { fromDate, toDate, userbranch }
      }).then(res => {
        setExpenses(res.data.expenses || 0);
        setSuspense(res.data.suspense || 0);
      });
    }
  }, [fromDate, toDate, userbranch]);

useEffect(() => {
  API.get("/last-entry-date", {
    params: { branch: userbranch }
  }).then(res => {
    if (res.data.lastDate) {
      const last = new Date(res.data.lastDate);

      // 👉 Next day only allowed
      last.setDate(last.getDate() + 1);

      const formatted = last.toISOString().split("T")[0];
      setMinDate(formatted);
    }
  });
}, [userbranch]);

  // 🔹 Calculate Hand Cash
  const handCash =
    denominations[500]*500 +
    denominations[200]*200 +
    denominations[100]*100 +
    denominations[50]*50 +
    denominations[20]*20 +
    denominations[10]*10 +
    // denominations.c10*10 +
    // denominations.c5*5 +
    // denominations.c2*2 +
    denominations.c1*1;

  const isBalanced = opening === (expenses + suspense + handCash);
  
  const balance = opening - expenses - suspense;

  // 🔹 Submit
  const handleSubmit = async () => {
    if (!isBalanced) {
      alert("❌ Amount not matched!");
      return;
    }

    await API.post("/cash-entry", {
      fromDate, toDate, opening, expenses, suspense, handCash, userbranch
    });

    alert("✅ Submitted Successfully");

     // 🔹 RESET STATES (LIKE PAGE RELOAD)
    // setFromDate("");
    // setToDate("");
    // setExpenses(0);
    // setSuspense(0);

    // setDenominations({
    //   500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0,
    //   c10: 0, c5: 0, c2: 0, c1: 0
    // });

  // ⏳ Wait 1 second, then reload
    setTimeout(() => {
      window.location.reload();
    }, 1000);
  };

  return (
    <div className="container mt-3">


        <h3 className="text-center mb-3">Cash Denomination</h3>

      {/* HEADER */}
      <div className="card shadow p-4 mb-3">

        <div className="row">
          <div className="col-md-6">
            <label>From Date</label>
            {/* <input type="date" className="form-control"
              onChange={e=>setFromDate(e.target.value)} /> */}

              <input
                type="date"
                className="form-control"
                min={minDate}
                value={fromDate}
                onChange={e => setFromDate(e.target.value)}
              />

          </div>

          <div className="col-md-6">
            <label>To Date</label>
            {/* <input type="date" className="form-control"
              onChange={e=>setToDate(e.target.value)} /> */}

              <input
                type="date"
                className="form-control"
                min={fromDate || minDate}
                value={toDate}
                onChange={e => setToDate(e.target.value)}
              />

          </div>
        </div>
      </div>

      {/* SUMMARY CARDS */}
      <div className="row  text-center mb-4">

        <div className="col-md-3">
          <div className="card shadow p-3 bg-light">
            <h6>Opening</h6>
            <h4 className="text-primary">₹ {opening}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow p-3 bg-light">
            <h6>Expenses</h6>
            <h4 className="text-danger">₹ {expenses}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow p-3 bg-light">
            <h6>Suspense</h6>
            <h4 className="text-warning">₹ {suspense}</h4>
          </div>
        </div>

        <div className="col-md-3">
          <div className="card shadow p-3 bg-light">
            <h6>Balance</h6>
            <h4 className="text-success">₹ {balance}</h4>
          </div>
        </div>
        
      </div>

      <div className="row"> 

        {/* DENOMINATION TABLE */}
              <div className="card col-lg-8  shadow p-3">
                {/* <h5 className="mb-3">💵 Cash Denomination</h5> */}

                <div className="table-responsive">
                  <table className="table table-bordered text-center align-middle">
                    <thead className="table-primary">
                      <tr>
                        <th>Denomination</th>
                        <th>Count</th>
                        <th>Amount</th>
                      </tr>
                    </thead>

                    <tbody>
                      {[500,200,100,50,20,10].map(d => (
                        <tr key={d}>
                          <td>₹ {d}</td>
                          <td>
                            <input
                              type="number"
                              className="form-control text-center"
                              onChange={e => setDenominations({
                                ...denominations,
                                [d]: Number(e.target.value)
                              })}
                            />
                          </td>
                          <td>₹ {denominations[d] * d}</td>
                        </tr>
                      ))}

                      {/* COINS */}
                      
                      {/* {[10,5,2,1].map(c => ( */}
                      {[1].map(c => (
                        <tr key={"c"+c}>
                          <td>₹ {c} (Coin)</td>
                          <td>
                            <input
                              type="number"
                              className="form-control text-center"
                              onChange={e => setDenominations({
                                ...denominations,
                                ["c"+c]: Number(e.target.value)
                              })}
                            />
                          </td>
                          <td>₹ {denominations["c"+c] * c}</td>
                        </tr>
                      ))}
                    </tbody>

                    {/* FOOTER */}
                    <tfoot>
                      <tr className="fw-bold">
                        <td colSpan="2">Total Hand Cash</td>
                        <td>₹ {handCash}</td>
                      </tr>
                    </tfoot>

                  </table>
                </div>
              </div>

              {/* STATUS */}
              <div className="text-center col-lg-4 mt-4">
                <h4 className={isBalanced ? "text-success" : "text-danger"}>
                  {isBalanced ? "✅ Balanced" : "❌ Not Matched"}
                </h4>

                <button
                  className="btn btn-success px-5 mt-2"
                  disabled={!isBalanced}
                  onClick={handleSubmit}
                >
                  Submit
                </button>
              </div>

      </div>

      

    </div>
  );
}