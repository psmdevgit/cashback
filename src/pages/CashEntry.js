import React, { useState, useEffect } from "react";
import axios from "axios";
import API from "../axios";
export default function CashEntry() {

  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");

  const [opening] = useState(100000);
  const [expenses, setExpenses] = useState(0);
  const [suspense, setSuspense] = useState(0);

  const [denominations, setDenominations] = useState({
    500: 0, 200: 0, 100: 0, 50: 0, 20: 0, 10: 0,
    c10: 0, c5: 0, c2: 0, c1: 0
  });

  // Fetch data
  useEffect(() => {
    if (fromDate && toDate) {
      API.get("/cash-summary", {
        params: { fromDate, toDate }
      }).then(res => {
        setExpenses(res.data.expenses);
        setSuspense(res.data.suspense);
      });
    }
  }, [fromDate, toDate]);

  // Calculate hand cash
  const handCash =
    denominations[500]*500 +
    denominations[200]*200 +
    denominations[100]*100 +
    denominations[50]*50 +
    denominations[20]*20 +
    denominations[10]*10 +
    denominations.c10*10 +
    denominations.c5*5 +
    denominations.c2*2 +
    denominations.c1*1;

  const isBalanced = opening === expenses + suspense + handCash;

  const handleSubmit = async () => {
    if (!isBalanced) {
      alert("Mismatch!");
      return;
    }

    await API.post("/cash-entry", {

      fromDate, toDate, opening, expenses, suspense, handCash
    });

    alert("Submitted!");
  };

  return (
    <div className="container">
      <h2>Pending Cash Entry</h2>

      <div>
        From: <input type="date" onChange={e=>setFromDate(e.target.value)} />
        To: <input type="date" onChange={e=>setToDate(e.target.value)} />
      </div>

      <h4>Opening: ₹ {opening}</h4>

      <h4>Expenses: ₹ {expenses}</h4>
      <h4>Suspense: ₹ {suspense}</h4>

      <table border="1">
        <thead>
          <tr>
            <th>Denomination</th>
            <th>Count</th>
            <th>Amount</th>
          </tr>
        </thead>
        <tbody>
          {[500,200,100,50,20,10].map(d=>(
            <tr key={d}>
              <td>{d}</td>
              <td>
                <input type="number"
                  onChange={e=>setDenominations({
                    ...denominations,
                    [d]: Number(e.target.value)
                  })}
                />
              </td>
              <td>{denominations[d]*d}</td>
            </tr>
          ))}
        </tbody>
      </table>

      <h3>Hand Cash: ₹ {handCash}</h3>

      <h3 style={{color:isBalanced?"green":"red"}}>
        {isBalanced ? "Balanced" : "Not Matched"}
      </h3>

      <button disabled={!isBalanced} onClick={handleSubmit}>
        Submit
      </button>
    </div>
  );
}