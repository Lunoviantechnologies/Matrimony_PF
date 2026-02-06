import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";

export default function Admin_UserTickets() {
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(false);

  // Pagination State
  const [page, setPage] = useState(1);
  const pageSize = 10;

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
      await api.delete(`/tickets/${ticketId}/resolve`);
      fetchTickets();
      toast.success("Ticket resolved successfully!");
    } catch (error) {
      toast.error("Failed to resolve ticket!");
    }
  };

  // Pagination Logic
  const totalPages = Math.max(1, Math.ceil(tickets.length / pageSize));
  const currentTickets = tickets.slice(
    (page - 1) * pageSize,
    page * pageSize
  );

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [totalPages, page]);

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
      <div className="mu-pagination mt-3">
        <button
          className="pagination_btn"
          disabled={page === 1}
          onClick={() => setPage((p) => p - 1)}
        >
          Prev
        </button>

        <span className="mm-page-number">{page}</span>

        <button
          className="pagination_btn"
          disabled={page === totalPages}
          onClick={() => setPage((p) => p + 1)}
        >
          Next
        </button>
      </div>

    </div>
  );
};