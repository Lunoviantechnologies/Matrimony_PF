import React, { useEffect, useState } from "react";
import api from "../api/axiosInstance";
import { toast } from "react-toastify";

const EMPTY_FORM = {
    planCode: "",
    planName: "",
    durationMonths: 0,
    priceRupees: 0,
    festivalPrice: 0,
    festivalStart: "",
    festivalEnd: "",
    discountType: "",
    discountValue: 0,
    discountStart: "",
    discountEnd: "",
    active: true,
};

const PaymentDisplayData = () => {
    const [plans, setPlans] = useState([]);
    const [editId, setEditId] = useState(null);

    const [formData, setFormData] = useState(EMPTY_FORM);

    const fetchPlans = async () => {
        try {
            const res = await api.get("/admin/plans/all");
            setPlans(res.data);
            console.log("plan details:", res.data);
        } catch (error) {
            console.error("Failed to fetch plans", error);
        }
    };

    useEffect(() => {
        fetchPlans();
    }, []);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({ ...formData, [name]: type === "checkbox" ? checked : value });
    };

    const resetForm = () => {
        setFormData(EMPTY_FORM);
        setEditId(null);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const payload = {
            ...formData,
            durationMonths: Number(formData.durationMonths),
            priceRupees: Number(formData.priceRupees),
            festivalPrice: formData.festivalPrice ? Number(formData.festivalPrice) : null,
            festivalStart: formData.festivalStart ? `${formData.festivalStart}T00:00:00` : null,
            festivalEnd: formData.festivalEnd ? `${formData.festivalEnd}T00:00:00` : null,
            discountValue: formData.discountValue ? Number(formData.discountValue) : null,
            discountStart: formData.discountStart ? `${formData.discountStart}T00:00:00` : null,
            discountEnd: formData.discountEnd ? `${formData.discountEnd}T00:00:00` : null,
        };

        if (editId) {
            try {
                await api.put(`/admin/plan/${editId}`, payload);
                console.log("edited plan : ", formData);
                toast.success("Plan updated Successfull");
                resetForm();
            } catch (err) {
                toast.error("Plan updated Failed");
            }
        } else {
            try {
                await api.post("/admin/plan", payload);
                toast.success("Plan posted Successfull");
                console.log("post plan : ", payload);
                resetForm();
            } catch (err) {
                toast.error("Plan posted Failed");
            }
        }

        fetchPlans();
    };

    const handleEdit = (plan) => {
        // console.log("plan : ", plan);
        setFormData({
            planCode: plan.planCode || "",
            planName: plan.planName || "",
            durationMonths: plan.durationMonths || 0,
            priceRupees: plan.priceRupees || 0,
            festivalPrice: plan.festivalPrice || 0,
            festivalStart: plan.festivalStart || "",
            festivalEnd: plan.festivalEnd || "",
            discountType: plan.discountType || "",
            discountValue: plan.discountValue || 0,
            discountStart: plan.discountStart || "",
            discountEnd: plan.discountEnd || "",
            active: plan.active ?? true,
        });
        setEditId(plan.id);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="container-fluid mt-4">

            {/* ================= FORM ================= */}
            <div className="card shadow-sm border-0 mb-4" style={{ backgroundColor: "#D9F5E4" }}>
                <div className="card-body p-3">
                    <h5 className="fw-semibold mb-3">
                        {editId ? "Update Subscription Plan" : "Create Subscription Plan"}
                    </h5>

                    <form onSubmit={handleSubmit} className="row g-3">

                        {/* ===== PLAN INFO ===== */}
                        <div className="col-12 fw-semibold text-primary border-bottom pb-1">
                            Plan Information
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Plan Code</label>
                            <input
                                className="form-control form-control-sm"
                                name="planCode"
                                value={formData.planCode}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Plan Name</label>
                            <input
                                className="form-control form-control-sm"
                                name="planName"
                                value={formData.planName}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Duration (Months)</label>
                            <input
                                type="number"
                                className="form-control form-control-sm"
                                name="durationMonths"
                                value={formData.durationMonths}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        {/* ===== PRICING ===== */}
                        <div className="col-12 fw-semibold text-primary border-bottom pb-1 mt-2">
                            Pricing
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Base Price (₹)</label>
                            <input
                                type="number"
                                className="form-control form-control-sm"
                                name="priceRupees"
                                value={formData.priceRupees}
                                onChange={handleChange}
                                required
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Festival Price (₹)</label>
                            <input
                                type="number"
                                className="form-control form-control-sm"
                                name="festivalPrice"
                                value={formData.festivalPrice}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Festival Start</label>
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                name="festivalStart"
                                value={formData.festivalStart}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Festival End</label>
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                name="festivalEnd"
                                value={formData.festivalEnd}
                                onChange={handleChange}
                            />
                        </div>

                        {/* ===== DISCOUNTS ===== */}
                        <div className="col-12 fw-semibold text-primary border-bottom pb-1 mt-2">
                            Discount Settings
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Discount Type</label>
                            <select
                                className="form-select form-select-sm"
                                name="discountType"
                                value={formData.discountType}
                                onChange={handleChange}
                            >
                                <option value="">Select</option>
                                <option value="PERCENTAGE">Percentage</option>
                                <option value="FLAT">Flat</option>
                            </select>
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Discount Value</label>
                            <input
                                type="number"
                                className="form-control form-control-sm"
                                name="discountValue"
                                value={formData.discountValue}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Discount Start</label>
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                name="discountStart"
                                value={formData.discountStart}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="col-md-4">
                            <label className="form-label">Discount End</label>
                            <input
                                type="date"
                                className="form-control form-control-sm"
                                name="discountEnd"
                                value={formData.discountEnd}
                                onChange={handleChange}
                            />
                        </div>

                        {/* ===== ACTIONS ===== */}
                        <div className="col-12 d-flex justify-content-between align-items-center mt-2">
                            <div className="form-check form-switch">
                                <input
                                    className="form-check-input"
                                    type="checkbox"
                                    name="active"
                                    checked={formData.active}
                                    onChange={handleChange}
                                />
                                <label className="form-check-label">Active</label>
                            </div>

                            <div className="d-flex gap-2">
                                {editId && (
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary btn-sm"
                                        onClick={resetForm}
                                    >
                                        Cancel
                                    </button>
                                )}
                                <button type="submit" className="btn btn-primary btn-sm px-4">
                                    {editId ? "Update" : "Create"}
                                </button>
                            </div>
                        </div>

                    </form>
                </div>
            </div>

            {/* ================= TABLE ================= */}
            <div className="card shadow-sm border-0" style={{ backgroundColor: "#D9F5E4" }}>
                <div className="card-body p-3">
                    <h6 className="fw-semibold mb-3">Plans List</h6>

                    <div className="table-responsive">
                        <table className="table table-sm table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th className="text-center" style={{ backgroundColor: "#00695C", color: "white" }}>ID</th>
                                    <th className="text-center" style={{ backgroundColor: "#00695C", color: "white" }}>Code</th>
                                    <th className="text-center" style={{ backgroundColor: "#00695C", color: "white" }}>Name</th>
                                    <th className="text-center" style={{ backgroundColor: "#00695C", color: "white" }}>Month</th>
                                    <th className="text-center" style={{ backgroundColor: "#00695C", color: "white" }}>Discount</th>
                                    <th className="text-center" style={{ backgroundColor: "#00695C", color: "white" }}>Price</th>
                                    <th className="text-center" style={{ backgroundColor: "#00695C", color: "white" }}>Festival Price</th>
                                    <th className="text-center" style={{ backgroundColor: "#00695C", color: "white" }}>Status</th>
                                    <th className="text-center" style={{ backgroundColor: "#00695C", color: "white" }}>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {
                                    plans?.length === 0 ? (
                                        <tr>
                                            <td colSpan="7" className="text-center text-muted">
                                                No Plan Details
                                            </td>
                                        </tr>
                                    ) : (
                                        plans?.map((plan) => (
                                            <tr key={plan.id}>
                                                <td>{plan.id}</td>
                                                <td>{plan.planCode}</td>
                                                <td>{plan.planName}</td>
                                                <td>{plan.durationMonths}</td>
                                                <td>{plan.discountValue || 0}%</td>
                                                <td>₹{plan.priceRupees}</td>
                                                <td>₹{plan.festivalPrice}</td>
                                                <td>
                                                    <span className={`badge ${plan.active ? "bg-success" : "bg-secondary"}`}>
                                                        {plan.active ? "Active" : "Inactive"}
                                                    </span>
                                                </td>
                                                <td>
                                                    <button
                                                        className="btn btn-sm btn-outline-warning"
                                                        onClick={() => handleEdit(plan)}
                                                    >
                                                        Edit
                                                    </button>
                                                </td>
                                            </tr>
                                        ))
                                    )
                                }
                            </tbody>
                        </table>
                    </div>

                </div>
            </div>
        </div>
    );
};

export default PaymentDisplayData;