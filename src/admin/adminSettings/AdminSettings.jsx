import React, { useState } from "react";
import { Button, Box } from "@mui/material";
import { useSelector } from "react-redux";
import ChangePassword from "./ChangePassword";
import CreateAdmin from "./CreateAdmin";

const AdminSettings = () => {

    const { id } = useSelector((state) => state.auth);
    const [tab, setTab] = useState(0);
    const [securityPassword, setSecurityPassword] = useState({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
    });

    const tabs = [
        { label: "Security", index: 0 },
        { label: "Create Admin", index: 1 },
    ];

    // console.log("AdminSettings rendered", id);

    return (
        <div>
            <h2>Admin Settings</h2>

            {/* 🔹 BUTTON TABS */}
            <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap", mb: 3, }}>
                {tabs.map((t) => (
                    <Button
                        key={t.index}
                        onClick={() => setTab(t.index)}
                        variant={tab === t.index ? "contained" : "outlined"}
                        sx={{
                            textTransform: "none", fontWeight: 600, borderRadius: "12px", px: 3, py: 1,
                            backgroundColor: tab === t.index ? "#0a6817ff" : "transparent",
                            color: tab === t.index ? "#efeaeaff" : "#089226ff", borderColor: "#0a6817ff",
                            "&:hover": { backgroundColor: tab === t.index ? "#089226ff" : "rgba(25, 118, 210, 0.08)", },
                        }}
                    >
                        {t.label}
                    </Button>
                ))}
            </Box>

            {/* Content */}
            <div>
                {tab === 0 && <ChangePassword securityPassword={securityPassword} setSecurityPassword={setSecurityPassword} adminId= {id} />}
                {tab === 1 && <CreateAdmin adminId={id} />}
            </div>
        </div>
    );
};

export default AdminSettings;