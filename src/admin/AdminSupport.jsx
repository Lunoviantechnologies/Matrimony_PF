import React, { useEffect, useState } from "react";
import axios from "axios";
import backendIP from "../api/api";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";

export default function AdminSupport() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const pageSize = 10; // <<< SHOW 10 ITEMS PER PAGE

  const fetchTickets = async () => {
    try {
      setLoading(true);
      const res = await api.get(`/tickets/all`);
      setTickets(res.data || []);
      console.log("Fetched tickets:", res.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching tickets:", error);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTickets();
  }, []);

  const resolveTicket = async (ticketId) => {
    try {
      await api.delete( `/tickets/${ticketId}/resolve` );
      fetchTickets();
      toast.success("Ticket resolved successfully!");
    } catch (error) {
      toast.error("Failed to resolve ticket!");
    }
  };

  // Pagination Logic
  const totalPages = Math.ceil(tickets.length / pageSize);

  const currentTickets = tickets.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  return (
    <div className="container mt-4">
      <h2 className="fw-bold mb-3">User Support Tickets</h2>

      {loading && <p>Loading tickets...</p>}

      <table className="table table-striped table-bordered">
        <thead>
          <tr>
            <th style={{ color: "white", backgroundColor: "#00695C" }}>S.No</th>
            <th style={{ color: "white", backgroundColor: "#00695C" }}>User</th>
            <th style={{ color: "white", backgroundColor: "#00695C" }}>Issue Category</th>
            <th style={{ color: "white", backgroundColor: "#00695C" }}>Description</th>
            <th style={{ color: "white", backgroundColor: "#00695C" }}>Raised On</th>
            <th style={{ color: "white", backgroundColor: "#00695C" }}>Action</th>
          </tr>
        </thead>

        <tbody>
          {currentTickets.length === 0 && (
            <tr>
              <td colSpan="6" className="text-center">
                🎉 No pending tickets — all issues resolved!
              </td>
            </tr>
          )}

          {currentTickets.map((t, index) => (
            <tr key={t.id}>
              <td>{(page - 1) * pageSize + (index + 1)}</td>
              <td>{t.name}</td>
              <td>{t.issueCategory}</td>
              <td>{t.description}</td>
              <td>{new Date(t.createdAt).toLocaleString()}</td>
              <td>
                <button
                  className="btn btn-success btn-sm"
                  onClick={() => resolveTicket(t.id)}
                >
                  Mark as Resolved
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination — ALWAYS Visible */}
      <div className="d-flex justify-content-center mt-4">
        <ul className="pagination">

          {/* Prev Button */}
          <li className={`page-item ${page === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => page > 1 && setPage(page - 1)}
            >
              Prev
            </button>
          </li>

          {/* Page Numbers (always show even if only 1 page) */}
          {Array.from({ length: totalPages || 1 }, (_, i) => (
            <li
              key={i}
              className={`page-item ${page === i + 1 ? "active" : ""}`}
            >
              <button className="page-link" onClick={() => setPage(i + 1)}>
                {i + 1}
              </button>
            </li>
          ))}

          {/* Next Button */}
          <li className={`page-item ${page === totalPages ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => page < totalPages && setPage(page + 1)}
            >
              Next
            </button>
          </li>

        </ul>
      </div>
    </div>
  );
}
