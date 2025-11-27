import React, { useEffect, useState } from "react";
import "../stylesheets/ManageUsers.css";

const MOCK_USERS = Array.from({ length: 24 }).map((_, i) => ({
  userId: `u_${1000 + i}`,
  name: ["Asha Rao", "Rahul Kumar", "Sita Devi", "Vikram"][i % 4] + ` ${i}`,
  age: 23 + (i % 10),
  gender: i % 2 === 0 ? "Female" : "Male",
  city: ["Hyderabad", "Delhi", "Bengaluru", "Chennai"][i % 4],
  membership: i % 3 === 0 ? "Premium" : "Free",
  profileStatus: i % 5 === 0 ? "pending_verification" : i % 7 === 0 ? "suspended" : "active",
  lastActive: new Date(Date.now() - i * 1000 * 60 * 60).toISOString(),
  verified: i % 5 !== 0,
  photos: [],
}));

export default function ManageUser({ apiBase = "", pageSize = 10 }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  // UI state
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [selected, setSelected] = useState(new Set());
  const [detailUser, setDetailUser] = useState(null);
  const [confirm, setConfirm] = useState({ open: false, action: null, user: null });

  // Fetch users from API or fallback to mock
  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        if (!apiBase) {
          // fallback to mock
          await new Promise((r) => setTimeout(r, 300));
          if (mounted) setUsers(MOCK_USERS);
        } else {
          const res = await fetch(`${apiBase}/admin/users`);
          if (!res.ok) throw new Error("Failed to fetch");
          const data = await res.json();
          if (mounted) setUsers(data);
        }
      } catch (err) {
        console.error("Load users error:", err);
        if (mounted && users.length === 0) setUsers(MOCK_USERS);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => (mounted = false);
    // eslint-disable-next-line
  }, [apiBase]);

  // Derived filtered list
  const filtered = users.filter((u) => {
    const query = search.trim().toLowerCase();
    if (query) {
      const match =
        u.name.toLowerCase().includes(query) ||
        (u.email && u.email.toLowerCase().includes(query)) ||
        u.userId.toLowerCase().includes(query) ||
        (u.phone && u.phone.includes(query));
      if (!match) return false;
    }
    if (statusFilter !== "all" && u.profileStatus !== statusFilter) return false;
    if (genderFilter !== "all" && u.gender.toLowerCase() !== genderFilter) return false;
    if (membershipFilter !== "all" && u.membership.toLowerCase() !== membershipFilter) return false;
    return true;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  // selection helpers
  const toggleSelect = (userId) => {
    const s = new Set(selected);
    if (s.has(userId)) s.delete(userId);
    else s.add(userId);
    setSelected(s);
  };
  const toggleSelectAll = () => {
    const idsOnPage = pageItems.map((u) => u.userId);
    const s = new Set(selected);
    const allSelected = idsOnPage.every((id) => s.has(id));
    if (allSelected) {
      idsOnPage.forEach((id) => s.delete(id));
    } else {
      idsOnPage.forEach((id) => s.add(id));
    }
    setSelected(s);
  };

  // Backend actions (replace with real API calls)
  const postAction = async (userId, action, payload = {}) => {
    // optimistic UI update
    setUsers((prev) =>
      prev.map((u) => (u.userId === userId ? { ...u, profileStatus: action === "suspend" ? "suspended" : u.profileStatus } : u))
    );
    if (!apiBase) return { ok: true };
    try {
      const res = await fetch(`${apiBase}/admin/users/${userId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...payload }),
      });
      return res;
    } catch (err) {
      console.error("postAction err", err);
      return { ok: false };
    }
  };

  const handleAction = (user, action) => {
    // show confirm for destructive actions
    if (action === "delete" || action === "suspend" || action === "ban") {
      setConfirm({ open: true, action, user });
      return;
    }
    // immediate actions: verify / restore
    doAction(user, action);
  };

  const doAction = async (user, action, reason = "") => {
    setConfirm({ open: false, action: null, user: null });
    setLoading(true);
    const res = await postAction(user.userId, action, { reason });
    // simple feedback - for production, use toast
    if (res?.ok === false) {
      alert("Action failed. See console.");
    } else {
      // refresh or mutate local state
      if (action === "verify") {
        setUsers((prev) => prev.map((u) => (u.userId === user.userId ? { ...u, verified: true, profileStatus: "active" } : u)));
      } else if (action === "suspend") {
        setUsers((prev) => prev.map((u) => (u.userId === user.userId ? { ...u, profileStatus: "suspended" } : u)));
      } else if (action === "restore") {
        setUsers((prev) => prev.map((u) => (u.userId === user.userId ? { ...u, profileStatus: "active" } : u)));
      } else if (action === "delete") {
        setUsers((prev) => prev.filter((u) => u.userId !== user.userId));
      } else if (action === "ban") {
        setUsers((prev) => prev.map((u) => (u.userId === user.userId ? { ...u, profileStatus: "banned" } : u)));
      }
    }
    setLoading(false);
  };

  const handleBulkAction = async (action) => {
    if (selected.size === 0) return alert("Select at least one user");
    if (action === "delete" || action === "suspend") {
      const ok = window.confirm(`Apply "${action}" to ${selected.size} users? This is irreversible.`);
      if (!ok) return;
    }
    setLoading(true);
    // Post to /admin/users/bulk (replace with real call)
    if (!apiBase) {
      // mock update
      setUsers((prev) =>
        prev.map((u) => (selected.has(u.userId) ? { ...u, profileStatus: action === "suspend" ? "suspended" : u.profileStatus } : u))
      );
    } else {
      try {
        await fetch(`${apiBase}/admin/users/bulk`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, userIds: Array.from(selected) }),
        });
      } catch (err) {
        console.error("bulk err", err);
      }
    }
    setSelected(new Set());
    setLoading(false);
  };

  const openDetail = (user) => setDetailUser(user);

  return (
    <div className="manage-users-root">
      <div className="mu-header">
        <h2>Manage Users</h2>
        <div className="mu-controls">
          <input
            className="mu-search"
            placeholder="Search by name, id, email..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
          />
          <select className="mu-filter" value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending_verification">Pending Verification</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
            <option value="deleted">Deleted</option>
          </select>

          <select className="mu-filter" value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)}>
            <option value="all">All Genders</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>

          <select className="mu-filter" value={membershipFilter} onChange={(e) => setMembershipFilter(e.target.value)}>
            <option value="all">All Memberships</option>
            <option value="premium">Premium</option>
            <option value="free">Free</option>
          </select>
        </div>
      </div>

      <div className="mu-bulk">
        <button className="btn" onClick={() => handleBulkAction("verify")}>
          Verify Selected
        </button>
        <button className="btn" onClick={() => handleBulkAction("suspend")}>
          Suspend Selected
        </button>
        <button className="btn btn-danger" onClick={() => handleBulkAction("delete")}>
          Delete Selected
        </button>
        <div className="mu-bulk-info">{selected.size} selected</div>
      </div>

      <div className="mu-table-wrap">
        {loading ? (
          <div className="mu-loading">Loading...</div>
        ) : (
          <table className="mu-table">
            <thead>
              <tr>
                <th>
                  <input
                    type="checkbox"
                    checked={pageItems.length > 0 && pageItems.every((u) => selected.has(u.userId))}
                    onChange={toggleSelectAll}
                  />
                </th>
                <th>User</th>
                <th>Age</th>
                <th>Gender</th>
                <th>Location</th>
                <th>Membership</th>
                <th>Status</th>
                <th>Last Active</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pageItems.length === 0 ? (
                <tr>
                  <td colSpan={9} className="mu-empty">
                    No users found
                  </td>
                </tr>
              ) : (
                pageItems.map((u) => (
                  <tr key={u.userId} className={u.profileStatus !== "active" ? "mu-row-muted" : ""}>
                    <td>
                      <input type="checkbox" checked={selected.has(u.userId)} onChange={() => toggleSelect(u.userId)} />
                    </td>
                    <td className="mu-user-cell" onClick={() => openDetail(u)}>
                      <div className="mu-avatar">{u.name.charAt(0)}</div>
                      <div>
                        <div className="mu-name">{u.name}</div>
                        <div className="mu-id">{u.userId}</div>
                      </div>
                    </td>
                    <td>{u.age}</td>
                    <td>{u.gender}</td>
                    <td>{u.city}</td>
                    <td>
                      <span className={`mu-badge ${u.membership === "Premium" || u.membership === "premium" ? "premium" : ""}`}>
                        {u.membership}
                      </span>
                    </td>
                    <td>
                      <span className={`mu-status ${u.profileStatus}`}>{u.profileStatus.replace("_", " ")}</span>
                    </td>
                    <td>{new Date(u.lastActive).toLocaleString()}</td>
                    <td className="mu-actions">
                      {!u.verified && (
                        <button className="btn btn-small" onClick={() => handleAction(u, "verify")}>
                          Verify
                        </button>
                      )}
                      {u.profileStatus !== "suspended" && u.profileStatus !== "banned" ? (
                        <button className="btn btn-small" onClick={() => handleAction(u, "suspend")}>
                          Suspend
                        </button>
                      ) : (
                        <button className="btn btn-small" onClick={() => handleAction(u, "restore")}>
                          Restore
                        </button>
                      )}
                      <button className="btn btn-danger btn-small" onClick={() => handleAction(u, "delete")}>
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        )}
      </div>

      <div className="mu-footer">
        <div className="mu-pagination">
          <button className="btn" disabled={page <= 1} onClick={() => setPage((p) => Math.max(1, p - 1))}>
            Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button className="btn" disabled={page >= totalPages} onClick={() => setPage((p) => Math.min(totalPages, p + 1))}>
            Next
          </button>
        </div>
        <div className="mu-rows-info">{filtered.length} results</div>
      </div>

      {/* Detail modal */}
      {detailUser && (
        <div className="mu-modal-backdrop" onClick={() => setDetailUser(null)}>
          <div className="mu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mu-modal-header">
              <h3>{detailUser.name}</h3>
              <div className="mu-modal-actions">
                {!detailUser.verified && (
                  <button className="btn" onClick={() => doAction(detailUser, "verify")}>
                    Verify
                  </button>
                )}
                <button className="btn" onClick={() => handleAction(detailUser, detailUser.profileStatus === "suspended" ? "restore" : "suspend")}>
                  {detailUser.profileStatus === "suspended" ? "Restore" : "Suspend"}
                </button>
                <button className="btn btn-danger" onClick={() => handleAction(detailUser, "delete")}>
                  Delete
                </button>
              </div>
            </div>
            <div className="mu-modal-body">
              <div className="mu-detail-row">
                <strong>User ID:</strong> {detailUser.userId}
              </div>
              <div className="mu-detail-row">
                <strong>Age / Gender:</strong> {detailUser.age} / {detailUser.gender}
              </div>
              <div className="mu-detail-row">
                <strong>Location:</strong> {detailUser.city}
              </div>
              <div className="mu-detail-row">
                <strong>Membership:</strong> {detailUser.membership}
              </div>
              <div className="mu-detail-row">
                <strong>Status:</strong> {detailUser.profileStatus}
              </div>
              <div className="mu-detail-row">
                <strong>Last Active:</strong> {new Date(detailUser.lastActive).toLocaleString()}
              </div>
              <div className="mu-detail-row">
                <strong>Verified:</strong> {detailUser.verified ? "Yes" : "No"}
              </div>
              <div className="mu-detail-row">
                <strong>Admin Notes:</strong>
                <div className="mu-notes">No notes yet (sample UI)</div>
              </div>
            </div>

            <div className="mu-modal-footer">
              <button className="btn" onClick={() => setDetailUser(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Confirm dialog */}
      {confirm.open && (
        <div className="mu-modal-backdrop" onClick={() => setConfirm({ open: false, action: null, user: null })}>
          <div className="mu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mu-modal-header">
              <h3>Confirm {confirm.action}</h3>
            </div>
            <div className="mu-modal-body">
              <p>
                Are you sure you want to <strong>{confirm.action}</strong> user <strong>{confirm.user?.name}</strong> ({confirm.user?.userId})?
              </p>
              <p>This action may be irreversible. Provide a reason (optional):</p>
              <textarea id="confirm-reason" placeholder="Reason (optional)" rows="3" />
            </div>
            <div className="mu-modal-footer">
              <button
                className="btn"
                onClick={() => {
                  const reason = document.getElementById("confirm-reason")?.value || "";
                  doAction(confirm.user, confirm.action, reason);
                }}
              >
                Yes, {confirm.action}
              </button>
              <button className="btn btn-danger" onClick={() => setConfirm({ open: false, action: null, user: null })}>
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
