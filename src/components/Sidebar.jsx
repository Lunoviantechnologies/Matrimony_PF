import React from "react";

const Sidebar = () => {
    return (
        <div
            style={{
                width: "250px",
                backgroundColor: "#fff",
                borderRight: "1px solid #ddd",
                height: "100vh",
                position: "sticky",
                top: "70px", // matches Navbar height
                padding: "20px",
                boxShadow: "2px 0 5px rgba(0,0,0,0.05)",
            }}
        >
            <h4 style={{ color: "#5C4218", marginBottom: 20 }}>Filters / Menu</h4>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, lineHeight: "2" }}>
                <li>All Matches</li>
                <li>Shortlisted</li>
                <li>Requests</li>
                <li>Messages</li>
                <li>Settings</li>
            </ul>
        </div>
    );
};

export default Sidebar;