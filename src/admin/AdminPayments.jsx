import React, { useEffect, useState } from "react";
import axios from "axios";
import backendIP from "../api/api";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await axios.get(`${backendIP}/payment/successful`);
      setPayments(response.data || []);
      setLoading(false);
    } catch (err) {
      setError("Failed to load payments");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  // --- Pagination Logic ---
  const totalPages = Math.ceil(payments.length / pageSize) || 1;

  const paginatedPayments = payments.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="admin-payments-container">
      <h2 className="title">Payment Management (Admin)</h2>

      {loading && <p>Loading payments...</p>}
      {error && <p className="error">{error}</p>}

      <table className="table table-bordered table-striped mt-3">
        <thead>
          <tr>
            <th>#</th>
            <th>UserId</th>
            <th>User Name</th>
            <th>Plan</th>
            <th>Amount</th>
            <th>Transaction ID</th>
            <th>Payment Mode</th>
            <th>Payment Date</th>
            <th>Status</th>
          </tr>
        </thead>

        <tbody>
          {paginatedPayments.length === 0 && (
            <tr>
              <td colSpan="9" className="text-center">
                No payments found
              </td>
            </tr>
          )}

          {paginatedPayments.map((p, index) => (
            <tr key={p.id}>
              <td>{(page - 1) * pageSize + index + 1}</td>
              <td>{p.userId}</td>
              <td>{p.name}</td>
              <td>{p.planCode}</td>
              <td>₹{p.amount}</td>
              <td>{p.transactionId}</td>
              <td>{p.paymentMode || "N/A"}</td>
              <td>{new Date(p.createdAt).toLocaleString()}</td>
              <td>
                <span
                  className={`badge ${
                    p.status === "Success"
                      ? "bg-success"
                      : p.status === "Failed"
                      ? "bg-danger"
                      : "bg-warning"
                  }`}
                >
                  {p.status}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* --- Pagination UI --- */}
      <div className="d-flex justify-content-between align-items-center mt-3">
        <div className="text-muted">
          Showing <b>{paginatedPayments.length}</b> of <b>{payments.length}</b> records
        </div>

        <nav>
          <ul className="pagination mb-0">

            {/* Prev Button */}
            <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(page - 1)}>
                Prev
              </button>
            </li>

            {/* Page Numbers */}
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((num) => (
              <li
                key={num}
                className={`page-item ${page === num ? "active" : ""}`}
              >
                <button className="page-link" onClick={() => setPage(num)}>
                  {num}
                </button>
              </li>
            ))}

            {/* Next Button */}
            <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
              <button className="page-link" onClick={() => setPage(page + 1)}>
                Next
              </button>
            </li>

          </ul>
        </nav>
      </div>
    </div>
  );
}
