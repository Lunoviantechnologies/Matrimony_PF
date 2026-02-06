import React, { useEffect, useState } from "react";
import api from "../../api/axiosInstance";
import { toast } from "react-toastify";
import { Container, Box, TextField, Button, Typography, InputAdornment, IconButton, Alert, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, } from "@mui/material";
import { Visibility, VisibilityOff } from "@mui/icons-material";

const CreateAdmin = () => {
    const [formData, setFormData] = useState({
        username: "",
        emailId: "",
        password: "",
        confirmPassword: "",
        adminRole: "ADMIN",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [adminData, setAdminData] = useState([]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const validate = () => {
        if (!formData.username || !formData.emailId || !formData.password || !formData.confirmPassword) {
            toast.error("All fields are required.");
            return true;
        }
        if (formData.password !== formData.confirmPassword) {
            toast.error("Passwords do not match.");
            return true;
        }
        if (!formData.emailId.includes("@")) {
            toast.error("Invalid email address.");
            return true;
        }
        if (formData.password.length < 6) {
            toast.error("Password must be at least 6 characters.");
            return true;
        }
        return false;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (validate()) return;

        try {
            setLoading(true);
            setError("");
            setSuccess("");

            await api.post("/admin/manage/create", formData);

            setSuccess("Admin created successfully!");
            setFormData({
                username: "",
                emailId: "",
                password: "",
                confirmPassword: "",
                adminRole: "ADMIN",
            });
            setAdminData((prev) => [...prev, formData]);
        } catch (err) {
            setError(err.response?.data?.message || "Failed to create admin. Try again.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        api.get("/admin/manage/all").then((res) => {
            setAdminData(res.data);
            console.log("res.data: ", res.data);
        });
    }, []);

    const handleDeleteAdmin = async (adminId) => {
        try {
            await api.delete(`/admin/manage/delete/${adminId}`);
            setAdminData((prev) => prev.filter((admin) => admin.adminId !== adminId));
            toast.success("Admin deleted successfully");
        } catch (err) {
            toast.error("Failed to delete admin");
        }
    };

    return (
        <div className="d-flex justify-content-center">
            <Container maxWidth="sm">
                <Paper elevation={10} sx={{ p: 4, mt: 4 }}>
                    <Typography variant="h5" gutterBottom>
                        Create Admin
                    </Typography>

                    {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
                    {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

                    <Box component="form" onSubmit={handleSubmit}>
                        <TextField fullWidth margin="normal" label="Name" name="username" value={formData.username} onChange={handleChange} />

                        <TextField fullWidth margin="normal" label="Email" name="emailId" type="email" value={formData.emailId} onChange={handleChange} />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            margin="normal"
                            label="Confirm Password"
                            name="confirmPassword"
                            type={showConfirmPassword ? "text" : "password"}
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            InputProps={{
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <IconButton onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
                                            {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                                        </IconButton>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button type="submit" variant="contained" fullWidth sx={{ mt: 3 }} disabled={loading}>
                            {loading ? "Creating..." : "Create Admin"}
                        </Button>
                    </Box>
                </Paper>
            </Container>

            <div style={{ marginTop: 32, padding: 16, width: "80%" }}>
                <Typography variant="h6" gutterBottom sx={{ mt: 4 }}>
                    Existing Admins
                </Typography>
                <TableContainer component={Paper} elevation={3}>
                    <Table>
                        <TableHead>
                            <TableRow>
                                <TableCell><strong>Name</strong></TableCell>
                                <TableCell><strong>Email</strong></TableCell>
                                <TableCell><strong>Role</strong></TableCell>
                                <TableCell><strong>Actions</strong></TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>
                            {adminData.length === 0 ? (
                                <TableRow>
                                    <TableCell colSpan={4} align="center">
                                        <Typography>No admins found.</Typography>
                                    </TableCell>
                                </TableRow>
                            ) : (
                                adminData.map((admin) => (
                                    <TableRow key={admin.adminId}>
                                        <TableCell>{admin.username}</TableCell>
                                        <TableCell>{admin.emailId}</TableCell>
                                        <TableCell>{admin.adminRole}</TableCell>
                                        <TableCell>
                                            <Button
                                                variant="outlined"
                                                size="small"
                                                color="secondary"
                                                onClick={() => handleDeleteAdmin(admin.adminId)}
                                            >
                                                Delete
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))
                            )}
                        </TableBody>
                    </Table>
                </TableContainer>
            </div>
        </div>
    );
};

export default CreateAdmin;