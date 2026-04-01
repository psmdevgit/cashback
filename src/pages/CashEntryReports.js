import React, { useEffect, useState } from "react";
import axios from "axios";
import API from "../axios";
export default function Approval() {
  const [data, setData] = useState([]);

  useEffect(() => {
    API.get("/cash-entry-list")
      .then(res => setData(res.data));
  }, []);

  const approveL1 = (id) => {
    API.post(`/approve-l1/${id}`).then(()=>window.location.reload());
  };

  const approveL2 = (id) => {
    API.post(`/approve-l2/${id}`).then(()=>window.location.reload());
  };

  return (
    <table border="1">
      <thead>
        <tr>
          <th>From</th>
          <th>To</th>
          <th>Opening</th>
          <th>Expenses</th>
          <th>Suspense</th>
          <th>Hand Cash</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        {data.map(row=>(
          <tr key={row.Id}>
            <td>{row.FromDate}</td>
            <td>{row.ToDate}</td>
            <td>{row.Opening}</td>
            <td>{row.Expenses}</td>
            <td>{row.Suspense}</td>
            <td>{row.HandCash}</td>
            <td>{row.Status}</td>
            <td>
              {row.Status==="Pending L1" &&
                <button onClick={()=>approveL1(row.Id)}>Approve L1</button>}
              {row.Status==="Approved L1" &&
                <button onClick={()=>approveL2(row.Id)}>Approve L2</button>}
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}