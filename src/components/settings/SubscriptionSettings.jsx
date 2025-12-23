import React from "react";
import { Card, CardContent, Typography, Button, Chip } from "@mui/material";

export default function SubscriptionSettings({ myProfile, navigate }) {

    /* -------------------- SORT PAYMENTS (LATEST FIRST) -------------------- */
    const sortedPayments = [...(myProfile?.payments || [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    /* -------------------- PLAN HELPERS -------------------- */
    const getPlanMonths = (planCode = "") => {
        const parts = planCode.split("_");
        return Number(parts[parts.length - 1]) || 0;
    };

    const getPlanEndDate = (createdAt, planCode) => {
        if (!createdAt || !planCode) return null;

        const startDate = new Date(createdAt);
        const months = getPlanMonths(planCode);

        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + months);

        return endDate;
    };

    /* -------------------- PAYMENT STATUS LOGIC -------------------- */
    const getPaymentStatus = (payment, validTill) => {
        const status = payment.status?.toUpperCase();

        if (status === "FAILED") return "FAILED";
        if (status === "PENDING") return "PENDING";

        if (status === "PAID") {
            return validTill && validTill >= new Date()
                ? "ACTIVE"
                : "EXPIRED";
        }

        return "UNKNOWN";
    };

    const getStatusChipProps = (status) => {
        switch (status) {
            case "ACTIVE":
                return { label: "Active", color: "success" };
            case "EXPIRED":
                return { label: "Expired", color: "warning" };
            case "FAILED":
                return { label: "Failed", color: "error" };
            case "PENDING":
                return { label: "Pending", color: "info" };
            default:
                return { label: "Unknown", color: "default" };
        }
    };

    /* -------------------- CURRENT ACTIVE PLAN -------------------- */
    const currentPlan = sortedPayments.find(payment => {
        if (payment.status?.toUpperCase() !== "PAID") return false;

        const validTill = getPlanEndDate(payment.createdAt, payment.planCode);
        return validTill && validTill >= new Date();
    });

    /* -------------------- UI -------------------- */
    return (
        <div>

            {/* ================= SUBSCRIPTION DETAILS ================= */}
            <Card>
                <CardContent>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                        Subscription Details
                    </Typography>

                    {currentPlan ? (
                        <>
                            <Chip label="Active" color="success" size="small" sx={{ mt: 1 }} />

                            <Typography variant="body2" sx={{ mt: 1 }}>
                                Amount: {currentPlan.amount} {currentPlan.currency}
                            </Typography>

                            <Typography variant="body2">
                                Valid Till:{" "}
                                {getPlanEndDate(
                                    currentPlan.createdAt,
                                    currentPlan.planCode
                                )?.toLocaleDateString("en-IN", {
                                    day: "2-digit",
                                    month: "long",
                                    year: "numeric",
                                })}
                            </Typography>
                        </>
                    ) : (
                        <Typography variant="body2" color="text.secondary">
                            No active subscription
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        color="success"
                        sx={{ mt: 2 }}
                        disabled={!!currentPlan}
                        onClick={() => navigate("/premium")}
                    >
                        {currentPlan ? "Plan Active" : "Upgrade Plan"}
                    </Button>
                </CardContent>
            </Card>

            {/* ================= PAYMENT HISTORY ================= */}
            <div className="mt-3">
                <Card>
                    <CardContent>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Payment History
                        </Typography>

                        {sortedPayments.length === 0 ? (
                            <Typography variant="body1">
                                No payment history available.
                            </Typography>
                        ) : (
                            sortedPayments.map((payment, index) => {
                                const validTill = getPlanEndDate(
                                    payment.createdAt,
                                    payment.planCode
                                );

                                const status = getPaymentStatus(payment, validTill);
                                const chipProps = getStatusChipProps(status);

                                return (
                                    <Card
                                        key={payment.id || index}
                                        variant="outlined"
                                        sx={{ mb: 2 }}
                                    >
                                        <CardContent>
                                            <Typography variant="body1" gutterBottom>
                                                Plan Name: {payment.planCode}
                                            </Typography>

                                            <Typography variant="body2" gutterBottom>
                                                Amount: {payment.amount} {payment.currency}
                                            </Typography>

                                            <Typography variant="body2" gutterBottom>
                                                Date:{" "}
                                                {new Date(payment.createdAt).toLocaleDateString("en-IN", {
                                                    year: "numeric",
                                                    month: "long",
                                                    day: "numeric",
                                                })}
                                            </Typography>

                                            <Typography variant="body2" gutterBottom>
                                                Payment Mode: {payment.paymentMode || "N/A"}
                                            </Typography>

                                            <Typography variant="body2" gutterBottom>
                                                Transaction Id: {payment.transactionId || "N/A"}
                                            </Typography>

                                            {(status === "ACTIVE" || status === "EXPIRED") && (
                                                <Typography variant="body2" gutterBottom>
                                                    Valid Till:{" "}
                                                    {validTill?.toLocaleDateString("en-IN", {
                                                        day: "2-digit",
                                                        month: "long",
                                                        year: "numeric",
                                                    })}
                                                </Typography>
                                            )}

                                            <Chip
                                                label={chipProps.label}
                                                color={chipProps.color}
                                                size="small"
                                                sx={{ mt: 1 }}
                                            />
                                        </CardContent>
                                    </Card>
                                );
                            })
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};