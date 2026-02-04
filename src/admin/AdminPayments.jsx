import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";

export default function AdminPayments() {
  const [payments, setPayments] = useState([]);
  const [activeFilter, setActiveFilter] = useState("ALL");
  const [successpayments, setSuccessPayments] = useState([]);
  const [failedpayments, setFailedPayments] = useState([]);
  const [pendingpayments, setPendingPayments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Pagination state
  const [page, setPage] = useState(1);
  const pageSize = 10;

  const fetchPayments = async () => {
    try {
      setLoading(true);
      const response = await api.get(`/payment/successful`);
      setPayments(response.data || []);
      setLoading(false);
      const paidFilter = response.data.filter(payment => payment.status.toUpperCase() === "PAID");
      const failedFilter = response.data.filter(payment => payment.status.toUpperCase() === "FAILED");
      const pendingFilter = response.data.filter(payment => payment.status.toUpperCase() === "PENDING");
      setSuccessPayments(paidFilter || []);
      setFailedPayments(failedFilter || []);
      setPendingPayments(pendingFilter || []);
    } catch (err) {
      setError("Failed to load payments");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPayments();
  }, []);

  const getFilteredPayments = () => {
    switch (activeFilter) {
      case "SUCCESS":
        return successpayments;
      case "FAILED":
        return failedpayments;
      case "PENDING":
        return pendingpayments;
      default:
        return payments;
    }
  };

  const filteredPayments = getFilteredPayments();

  // --- Pagination Logic ---
  const totalPages = Math.max(1, Math.ceil(filteredPayments.length / pageSize));
  const paginatedPayments = filteredPayments.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

  return (
    <div className="admin-payments-container">
      <h2 className="title">Payment Management (Admin)</h2>

      <div className="d-flex gap-2 mb-3">
        <button
          className={`btn ${activeFilter === "ALL" ? "btn-primary" : "btn-outline-primary"}`}
          onClick={() => {
            setActiveFilter("ALL");
            setPage(1);
          }}
        >
          All
        </button>

        <button
          className={`btn ${activeFilter === "SUCCESS" ? "btn-success" : "btn-outline-success"}`}
          onClick={() => {
            setActiveFilter("SUCCESS");
            setPage(1);
          }}
        >
          Success
        </button>

        <button
          className={`btn ${activeFilter === "FAILED" ? "btn-danger" : "btn-outline-danger"}`}
          onClick={() => {
            setActiveFilter("FAILED");
            setPage(1);
          }}
        >
          Failed
        </button>

        <button
          className={`btn ${activeFilter === "PENDING" ? "btn-warning" : "btn-outline-warning"}`}
          onClick={() => {
            setActiveFilter("PENDING");
            setPage(1);
          }}
        >
          Pending
        </button>
      </div>

      {loading && <p>Loading payments...</p>}
      {error && <p className="error">{error}</p>}

      <table className="table table-bordered table-striped mt-3">
        <thead>
          <tr>
            <th style={{ color: "white", backgroundColor: "#00695C" }}>Sr. No</th>
            <th style={{ color: "white", backgroundColor: "#00695C" }}>UserId</th>
            <th style={{ color: "white", backgroundColor: "#00695C" }}>User Name</th>
            <th style={{ color: "white", backgroundColor: "#00695C" }}>Plan</th>
            <th style={{ color: "white", backgroundColor: "#00695C" }}>Amount</th>
            <th style={{ color: "white", backgroundColor: "#00695C" }}>Transaction ID</th>
            <th style={{ color: "white", backgroundColor: "#00695C" }}>Payment Mode</th>
            <th style={{ color: "white", backgroundColor: "#00695C" }}>Payment Date</th>
            <th style={{ color: "white", backgroundColor: "#00695C" }}>Status</th>
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
                  className={`badge ${p.status.toUpperCase() === "PAID"
                    ? "bg-success" : p.status.toUpperCase() === "FAILED" ? "bg-danger" : "bg-warning"}`}
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
          Showing <b>{paginatedPayments.length}</b> of <b>{filteredPayments.length}</b> records
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
