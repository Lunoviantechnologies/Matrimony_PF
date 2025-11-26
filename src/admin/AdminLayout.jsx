import React from "react";
import Navbar from "../components/Navbar";
import AdminSidebar from "./AdminSidebar";
import { Outlet } from "react-router-dom";

const AdminLayout = () => {
    return (  
        <div className="">
            <Navbar />

            <div style={{ display: "flex", }}>
                <AdminSidebar />

                <main className="admin-main" style={{marginLeft : '180px'}}>
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;
