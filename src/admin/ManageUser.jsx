import React, { useEffect, useMemo, useState } from "react";
import "../styleSheets/ManageUsers.css";

const MOCK_USERS = Array.from({ length: 24 }).map((_, i) => {
  const id = `u_${1000 + i}`;
  const names = ["Asha Rao", "Rahul Kumar", "Sita Devi", "Vikram"];
  const name = `${names[i % names.length]} ${i}`;
  const city = ["Hyderabad", "Delhi", "Bengaluru", "Chennai"][i % 4];
  const membership = i % 3 === 0 ? "Premium" : "Free";
  const status =
    i % 5 === 0
      ? "pending_verification"
      : i % 7 === 0
      ? "suspended"
      : "active";
  const joined = new Date(Date.now() - i * 1000 * 60 * 60).toISOString();
  return {
    userId: id,
    name,
    age: 23 + (i % 10),
    gender: i % 2 === 0 ? "Female" : "Male",
    city,
    membership,
    profileStatus: status,
    lastActive: joined,
    verified: i % 5 !== 0,
    image: null,
    bio: i % 4 === 0 ? "Loves cooking and travelling." : "",
  };
});

export default function ManageUser({ apiBase = "", pageSize = 10 }) {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [genderFilter, setGenderFilter] = useState("all");
  const [membershipFilter, setMembershipFilter] = useState("all");
  const [page, setPage] = useState(1);

  const [detailUser, setDetailUser] = useState(null);
  const [confirm, setConfirm] = useState({
    open: false,
    action: null,
    user: null,
  });

  useEffect(() => {
    let mounted = true;
    async function load() {
      setLoading(true);
      try {
        if (!apiBase) {
          await new Promise((r) => setTimeout(r, 200));
          if (mounted) setUsers(MOCK_USERS);
        } else {
          const res = await fetch(`${apiBase}/admin/users`);
          if (!res.ok) throw new Error("Fetch error");
          const data = await res.json();
          if (mounted) setUsers(data);
        }
      } catch (err) {
        console.error(err);
        if (mounted && users.length === 0) setUsers(MOCK_USERS);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => {
      mounted = false;
    };
  }, [apiBase]);

  // FILTER + PAGINATION
  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase();
    return users.filter((u) => {
      if (q) {
        const match =
          (u.name && u.name.toLowerCase().includes(q)) ||
          (u.userId && u.userId.toLowerCase().includes(q)) ||
          (u.city && u.city.toLowerCase().includes(q));
        if (!match) return false;
      }
      if (statusFilter !== "all" && u.profileStatus !== statusFilter) {
        return false;
      }
      if (genderFilter !== "all" && u.gender.toLowerCase() !== genderFilter) {
        return false;
      }
      if (
        membershipFilter !== "all" &&
        u.membership.toLowerCase() !== membershipFilter
      ) {
        return false;
      }
      return true;
    });
  }, [users, search, statusFilter, genderFilter, membershipFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageItems = filtered.slice((page - 1) * pageSize, page * pageSize);

  // ACTIONS (verify logic kept but no button uses it)
  const postAction = async (userId, action) => {
    setUsers((prev) =>
      prev.map((u) =>
        u.userId === userId
          ? {
              ...u,
              profileStatus:
                action === "suspend"
                  ? "suspended"
                  : action === "restore"
                  ? "active"
                  : u.profileStatus,
              verified: action === "verify" ? true : u.verified,
            }
          : u
      )
    );
    if (!apiBase) return { ok: true };
    try {
      const res = await fetch(`${apiBase}/admin/users/${userId}/status`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action }),
      });
      return res;
    } catch (err) {
      console.error(err);
      return { ok: false };
    }
  };

  const doAction = async (user, action) => {
    setConfirm({ open: false, action: null, user: null });
    setLoading(true);
    const res = await postAction(user.userId, action);
    if (res && res.ok === false) {
      alert("Action failed");
    }
    setLoading(false);
  };

  const handleAction = (user, action) => {
    if (action === "delete" || action === "suspend") {
      setConfirm({ open: true, action, user });
      return;
    }
    doAction(user, action);
  };

  const openDetail = (user) => setDetailUser(user);
  const closeDetail = () => setDetailUser(null);

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

          <select
            className="mu-filter"
            value={statusFilter}
            onChange={(e) => {
              setStatusFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending_verification">Pending Verification</option>
            <option value="suspended">Suspended</option>
            <option value="banned">Banned</option>
          </select>

          <select
            className="mu-filter"
            value={genderFilter}
            onChange={(e) => {
              setGenderFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Genders</option>
            <option value="female">Female</option>
            <option value="male">Male</option>
          </select>

          <select
            className="mu-filter"
            value={membershipFilter}
            onChange={(e) => {
              setMembershipFilter(e.target.value);
              setPage(1);
            }}
          >
            <option value="all">All Memberships</option>
            <option value="premium">Premium</option>
            <option value="free">Free</option>
          </select>
        </div>
      </div>

      <div className="mu-table-wrap">
        {loading ? (
          <div className="mu-loading">Loading...</div>
        ) : (
          <table className="mu-table">
            <thead>
              <tr>
                <th>Avatar</th>
                <th>Name</th>
                <th>Age</th>
                <th>Gender</th>
                <th>City</th>
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
                  <tr
                    key={u.userId}
                    className={u.profileStatus !== "active" ? "mu-row-muted" : ""}
                  >
                    <td className="mu-user-cell" onClick={() => openDetail(u)}>
                      <div className="mu-avatar">{u.name.charAt(0)}</div>
                    </td>

                    <td onClick={() => openDetail(u)}>
                      <div className="mu-name">{u.name}</div>
                      <div className="mu-id">{u.userId}</div>
                    </td>

                    <td>{u.age}</td>
                    <td>{u.gender}</td>
                    <td>{u.city}</td>

                    <td>
                      <span
                        className={`mu-badge ${
                          u.membership === "Premium" ||
                          u.membership === "premium"
                            ? "premium"
                            : ""
                        }`}
                      >
                        {u.membership}
                      </span>
                    </td>

                    <td>
                      <span className={`mu-status ${u.profileStatus}`}>
                        {u.profileStatus.replace("_", " ")}
                      </span>
                    </td>

                    <td>{new Date(u.lastActive).toLocaleString()}</td>

                    <td className="mu-actions">
                      {u.profileStatus !== "suspended" &&
                      u.profileStatus !== "banned" ? (
                        <button
                          className="btn small"
                          onClick={() => handleAction(u, "suspend")}
                        >
                          Suspend
                        </button>
                      ) : (
                        <button
                          className="btn small"
                          onClick={() => handleAction(u, "restore")}
                        >
                          Restore
                        </button>
                      )}

                      <button
                        className="btn-danger small"
                        onClick={() => handleAction(u, "delete")}
                      >
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
          <button
            className="btn"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Prev
          </button>
          <span>
            Page {page} / {totalPages}
          </span>
          <button
            className="btn"
            disabled={page >= totalPages}
            onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
          >
            Next
          </button>
        </div>
        <div className="mu-rows-info">{filtered.length} results</div>
      </div>

      {detailUser && (
        <div className="mu-modal-backdrop" onClick={closeDetail}>
          <div className="mu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mu-modal-header">
              <h3>{detailUser.name}</h3>
            </div>
            <div className="mu-modal-body">
              <div className="mu-detail-row">
                <strong>User ID:</strong> {detailUser.userId}
              </div>
              <div className="mu-detail-row">
                <strong>Age / Gender:</strong> {detailUser.age} /{" "}
                {detailUser.gender}
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
                <strong>Last Active:</strong>{" "}
                {new Date(detailUser.lastActive).toLocaleString()}
              </div>
              <div className="mu-detail-row">
                <strong>Verified:</strong>{" "}
                {detailUser.verified ? "Yes" : "No"}
              </div>
              <div className="mu-detail-row">
                <strong>Bio:</strong> {detailUser.bio || "—"}
              </div>
            </div>
            <div className="mu-modal-footer">
              <button className="btn" onClick={closeDetail}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {confirm.open && (
        <div
          className="mu-modal-backdrop"
          onClick={() =>
            setConfirm({ open: false, action: null, user: null })
          }
        >
          <div className="mu-modal" onClick={(e) => e.stopPropagation()}>
            <div className="mu-modal-header">
              <h3>Confirm {confirm.action}</h3>
            </div>
            <div className="mu-modal-body">
              <p>
                Are you sure you want to <strong>{confirm.action}</strong> user{" "}
                <strong>{confirm.user?.name}</strong>?
              </p>
            </div>
            <div className="mu-modal-footer">
              <button
                className="btn"
                onClick={() => doAction(confirm.user, confirm.action)}
              >
                Yes
              </button>
              <button
                className="btn btn-danger"
                onClick={() =>
                  setConfirm({ open: false, action: null, user: null })
                }
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
