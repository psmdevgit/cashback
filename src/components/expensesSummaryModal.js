import React, { useState } from "react";
import API from "../axios";

const ExpenseSummaryModal = () => {

  console.log('the function is running')

  const [show, setShow] = useState(true);
  const [data, setData] = useState([]);

  // const openModal = async (fromDate, toDate) => {
  //   try {
  //     const res = await API.get("/expense-summary", {
  //       params: { fromDate, toDate }
  //     });

  //     setData(res.data);
  //     setShow(true);
  //   } catch (err) {
  //     console.error(err);
  //   }
  // };

  const closeModal = () => setShow(false);

  return (
    <>
      {/* 🔹 MODAL */}
      {show && (
        <div className="modal fade show d-block" style={{ background: "#00000080" }}>
          <div className="modal-dialog modal-lg">
            <div className="modal-content">

              {/* HEADER */}
              <div className="modal-header bg-primary text-white">
                <h5 className="modal-title">Expense Summary</h5>
                <button className="btn-close" onClick={closeModal}></button>
              </div>

              {/* BODY */}
              <div className="modal-body">

                <div className="row">
                  {data.map((item, index) => (
                    <div className="col-md-6 mb-3" key={index}>
                      <div className="card shadow-sm p-3 border-0">
                        <h6 className="text-muted">{item.ExpenseCategory}</h6>
                        <h4 className="text-success">₹ {item.TotalAmount}</h4>
                      </div>
                    </div>
                  ))}
                </div>

                {/* TOTAL */}
                <div className="mt-3 text-end">
                  <h5>
                    Total: ₹ {data.reduce((sum, i) => sum + Number(i.TotalAmount), 0)}
                  </h5>
                </div>

              </div>

              {/* FOOTER */}
              <div className="modal-footer">
                <button className="btn btn-secondary" onClick={closeModal}>
                  Close
                </button>
              </div>

            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ExpenseSummaryModal;