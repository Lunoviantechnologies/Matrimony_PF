import React from "react";
import { Card, CardContent, Typography, Button, Chip, Box, Stack,} from "@mui/material";

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
        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + getPlanMonths(planCode));
        return endDate;
    };

    const getPaymentStatus = (payment, validTill) => {
        const status = payment.status?.toUpperCase();
        if (status === "FAILED") return "FAILED";
        if (status === "PENDING") return "PENDING";
        if (status === "PAID") {
            return validTill && validTill >= new Date() ? "ACTIVE" : "EXPIRED";
        }
        return "UNKNOWN";
    };

    const getStatusChipProps = (status) => {
        switch (status) {
            case "ACTIVE":
                return { label: "Active", color: "success" };
            case "EXPIRED":
                return { label: "Expired", color: "secondary" };
            case "FAILED":
                return { label: "Failed", color: "danger" };
            case "PENDING":
                return { label: "Pending", color: "warning" };
            default:
                return { label: "Unknown", color: "default" };
        }
    };

    const currentPlan = sortedPayments.find((payment) => {
        if (payment.status?.toUpperCase() !== "PAID") return false;
        const validTill = getPlanEndDate(payment.createdAt, payment.planCode);
        return validTill && validTill >= new Date();
    });

    console.log("Current Plan: ", currentPlan);

    /* -------------------- UI -------------------- */
    return (
        <Box
            sx={{
                maxWidth: 900,
                mx: "auto",
                px: { xs: 2, sm: 3 },
                py: 3,
            }}
        >
            <Stack spacing={3}>

                {/* ================= SUBSCRIPTION DETAILS ================= */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Subscription Details
                        </Typography>

                        {currentPlan ? (
                            <>
                                <Chip label="Active" color="success" size="small" />

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
                            fullWidth
                            variant="contained"
                            color="success"
                            sx={{ mt: 2 }}
                            disabled={!!currentPlan}
                            onClick={() => navigate("/dashboard/premium")}
                        >
                            {currentPlan ? "Plan Active" : "Upgrade Plan"}
                        </Button>
                    </CardContent>
                </Card>

                {/* ================= PAYMENT HISTORY ================= */}
                <Card>
                    <CardContent>
                        <Typography variant="h6" fontWeight={600} gutterBottom>
                            Payment History
                        </Typography>

                        {sortedPayments.length === 0 ? (
                            <Typography>No payment history available.</Typography>
                        ) : (
                            <Stack spacing={2}>
                                {sortedPayments.map((payment, index) => {
                                    const validTill = getPlanEndDate(
                                        payment.createdAt,
                                        payment.planCode
                                    );
                                    const status = getPaymentStatus(payment, validTill);
                                    const chipProps = getStatusChipProps(status);

                                    return (
                                        <Card key={payment.id || index} variant="outlined">
                                            <CardContent>
                                                <Typography variant="body1">
                                                    Plan: {payment.planCode}
                                                </Typography>

                                                <Typography variant="body2">
                                                    Amount: {payment.amount} {payment.currency}
                                                </Typography>

                                                <Typography variant="body2">
                                                    Date:{" "}
                                                    {new Date(payment.createdAt).toLocaleDateString(
                                                        "en-IN"
                                                    )}
                                                </Typography>

                                                <Typography variant="body2">
                                                    Payment Mode: {payment.paymentMode || "N/A"}
                                                </Typography>

                                                <Typography variant="body2">
                                                    Transaction ID: {payment.transactionId || "N/A"}
                                                </Typography>

                                                {(status === "ACTIVE" || status === "EXPIRED") && (
                                                    <Typography variant="body2">
                                                        Valid Till:{" "}
                                                        {validTill?.toLocaleDateString("en-IN")}
                                                    </Typography>
                                                )}

                                                <Chip
                                                    {...chipProps}
                                                    size="small"
                                                    sx={{ mt: 1 }}
                                                />
                                            </CardContent>
                                        </Card>
                                    );
                                })}
                            </Stack>
                        )}
                    </CardContent>
                </Card>

            </Stack>
        </Box>
    );
};