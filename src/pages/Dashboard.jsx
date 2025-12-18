import React, { useState, useEffect } from "react";
import "../styleSheets/Dashboard.css";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import backendIP from "../api/api";
import { useNavigate } from "react-router-dom";
import { fetchMyProfile } from "../redux/thunk/myProfileThunk";

const Dashboard = () => {

  const navigate = useNavigate();
  const [acceptedRequests, setAcceptedRequests] = useState([]);
  const [receivedRequests, setReceivedRequests] = useState([]);
  const [rejectedRequests, setRejectedRequests] = useState([]);
  const { id, myProfile } = useSelector(state => state.auth);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchMyProfile(id));
  }, [id]);
  console.log("My Profile in Dashboard:", myProfile);

  useEffect(() => {
    const fetchAcceptedRequests = async () => {
      try {
        // 1) Requests YOU accepted (receiver = you)
        const receivedAccepted = await axios.get(`${backendIP}/friends/accepted/received/${id}`);

        // 2) Requests THEY accepted (sender = you)
        const sentAccepted = await axios.get(`${backendIP}/friends/accepted/sent/${id}`);

        // Combine both
        const merged = [...receivedAccepted.data, ...sentAccepted.data];
        setAcceptedRequests(merged);

        console.log("Accepted requests:", merged);
      } catch (error) {
        console.error("Error fetching accepted requests:", error);
      }
    };

    fetchAcceptedRequests();

    axios.get(`${backendIP}/friends/received/${id}`).then((response) => {
      console.log("Received requests:", response.data);
      setReceivedRequests(response.data);
    }).catch((error) => {
      console.error("Error fetching received requests:", error);
    });

    const fetchRejectedRequests = async () => {
      try {
        // 1) Requests YOU rejected (receiver = you)
        const receivedRejected = await axios.get(`${backendIP}/friends/rejected/received/${id}`);

        // 2) Requests THEY rejected (sender = you)
        const sentRejected = await axios.get(`${backendIP}/friends/rejected/sent/${id}`);

        // Combine both
        const merged = [...receivedRejected.data, ...sentRejected.data];
        setRejectedRequests(merged);

        console.log("Rejected requests:", merged);
      } catch (error) {
        console.error("Error fetching accepted requests:", error);
      }
    };

    fetchRejectedRequests();
  }, [id]);

  const handleAccept = async (requestId) => {
    try {
      const response = await axios.post(`${backendIP}/friends/respond/${requestId}?accept=true`);
      console.log("Request accepted:", response.data);
      alert("Request accepted successfully");
      setReceivedRequests(receivedRequests.filter(req => req.requestId !== requestId));
    } catch (error) {
      console.error("Error accepting request:", error);
    }
  };

  const handleReject = async (requestId) => {
    try {
      const response = await axios.post(`${backendIP}/friends/respond/${requestId}?accept=false`);
      console.log("Request rejected:", response.data);
      alert("Request rejected successfully");
      setReceivedRequests(receivedRequests.filter(req => req.requestId !== requestId));
    } catch (error) {
      console.error("Error rejecting request:", error);
    }
  };

  return (
    <div className="dashboard_body">
      {/* ====== Matches Section ====== */}
      <section className="matchSection">
        <h2 style={{ color: "#695019", marginBottom: 15 }}>
          New Profile Matches
        </h2>

        <div style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
          {[1, 2, 3, 4].map((i) => (
            <div className="matchSection_map" key={i}>
              <img src={`https://picsum.photos/80?random=${i + 30}`} alt={`Profile ${i}`}
                style={{ width: "100%", height: "100%", objectFit: "cover", filter: "brightness(80%)", }} />
              <div
                style={{ position: "absolute", bottom: 15, left: 0, right: 0, textAlign: "center", color: "#fff", }}>
                <div style={{ fontWeight: "bold", fontSize: 18 }}>Julia Ann</div>
                <div style={{ fontSize: 14 }}>New York • 22 Years old</div>
              </div>
              {/* Online Indicator */}
              <div
                style={{
                  position: "absolute", top: 10, right: 10, width: 14, height: 14, borderRadius: "50%", background: "#2ECC71",
                  border: "2px solid #fff",
                }}
              ></div>
            </div>
          ))}
        </div>
      </section>

      {/* ====== Request Section ====== */}
      <section
        style={{ background: "#fff", borderRadius: 15, padding: 24, marginBottom: 32, boxShadow: "0 1px 6px #ddd", }}>
        <h2 style={{ color: "#695019", marginBottom: 15 }}>Interest Requests</h2>

        <div style={{ display: "flex", gap: 15, marginBottom: 20 }}>
          <button onClick={() => { navigate('/dashboard/requests/received') }}
            style={{ fontWeight: "bold", color: "green", background: "#e8fff2", border: "none", padding: "10px 20px", borderRadius: 25, }}>
            New Requests <span style={{ backgroundColor: 'red', color: "white", borderRadius: '50%', padding: '2px 5px' }}>{receivedRequests.length}</span>
          </button>

          <button onClick={() => { navigate('/dashboard/requests/accepted') }}
            style={{ fontWeight: "bold", color: "#000", background: "#F8F6F1", border: "none", padding: "10px 20px", borderRadius: 25, }}>
            Accepted <span style={{ backgroundColor: 'red', color: "white", borderRadius: '50%', padding: '2px 5px' }}>{acceptedRequests.length}</span>
          </button>

          <button onClick={() => { navigate('/dashboard/requests/rejected') }}
            style={{ fontWeight: "bold", color: "#000", background: "#F8F6F1", border: "none", padding: "10px 20px", borderRadius: 25, }}>
            Denied <span style={{ backgroundColor: 'red', color: "white", borderRadius: '50%', padding: '2px 5px' }}>{rejectedRequests.length}</span>
          </button>
        </div>

        {receivedRequests.map((req) => (
          <div
            key={req.requestId}
            style={{ display: "flex", alignItems: "center", marginBottom: 22, background: "#fff", padding: 10, borderRadius: 10, boxShadow: "0 1px 6px #ddd", }}>
            <img
              src={`https://picsum.photos/110?random=${req.requestId}`}
              alt="User"
              style={{ width: 110, height: 90, borderRadius: 15, marginRight: 22, objectFit: "cover", }} />
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: "bold", fontSize: 20 }}>{req.senderName}</div>
            </div>
            <div>
              <button onClick={() => { handleAccept(req.requestId) }}
                style={{ marginRight: 8, background: "#117A65", color: "#fff", border: "none", borderRadius: 8, padding: "7px 18px", }}>
                Accept
              </button>
              <button onClick={() => { handleReject(req.requestId) }}
                style={{ background: "#F25C5C", color: "#fff", border: "none", borderRadius: 8, padding: "7px 18px", }}>
                Deny
              </button>
            </div>
          </div>
        ))}
      </section>

      {/* ====== Plan and Chat Section ====== */}
      <section style={{ display: "flex", gap: 32, flexWrap: "wrap" }}>
        {/* Plan Details */}
        <div className="planSection">
          <h3 style={{ color: "#695019" }}>Plan Details</h3>
          <img
            src="https://img.icons8.com/emoji/96/gift-emoji.png"
            alt="Plan"
            style={{ margin: "20px auto" }}
          />
          <p style={{ fontWeight: "bold" }}>Plan Name: Standard</p>
          <p>Validity: 6 Months</p>
        </div>

        {/* Recent Chat List */}
        <div className="chatList">
          <h3 style={{ color: "#695019", marginBottom: 20 }}>
            Recent Chat List
          </h3>

          {[1, 2, 3, 4].map((i) => (
            <div className="chatList_map" key={i}>
              <img
                src={`https://picsum.photos/60?random=${i + 50}`}
                alt="User"
                style={{ width: 60, height: 60, borderRadius: 15, objectFit: "cover", marginRight: 15, }} />
              <div>
                <div style={{ fontWeight: "bold", fontSize: 18, color: "#5C4218", }}>
                  Julia Ann
                </div>
                <div style={{ color: "#8A6F47" }}>Illinois, United States</div>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Dashboard;