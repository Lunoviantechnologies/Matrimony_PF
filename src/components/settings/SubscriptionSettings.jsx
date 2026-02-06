import React from "react";
import { Card, CardContent, Typography, Button, Chip, Box, Stack,} from "@mui/material";

export default function SubscriptionSettings({ myProfile, navigate }) {

    /* -------------------- SORT PAYMENTS (LATEST FIRST) -------------------- */
    const sortedPayments = [...(myProfile?.payments || [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );

    /* -------------------- STATUS HELPERS -------------------- */
    const getPaymentStatus = (payment) => {
        const status = payment.status?.toUpperCase();
        if (status === "FAILED") return "FAILED";
        if (status === "PENDING") return "PENDING";
        if (status === "PAID") {
            const end = payment.premiumEnd ? new Date(payment.premiumEnd) : null;
            return end && end >= new Date() ? "ACTIVE" : "EXPIRED";
        }

        return "UNKNOWN";
    };

    const getStatusChipProps = (status) => {
        switch (status) {
            case "ACTIVE":
                return { label: "Active", color: "success" };
            case "EXPIRED":
                return { label: "Expired", color: "error" };
            case "FAILED":
                return { label: "Failed", color: "error" };
            case "PENDING":
                return { label: "Pending", color: "warning" };
            default:
                return { label: "Unknown", color: "default" };
        }
    };

    /* -------------------- FIND CURRENT ACTIVE PLAN -------------------- */
    const currentPlan = sortedPayments.find(
        (payment) => getPaymentStatus(payment) === "ACTIVE"
    );

    console.log("Current Plan:", currentPlan);
    console.log("Sorted Payments:", sortedPayments);

    /* -------------------- DATE FORMATTER -------------------- */
    const formatDate = (date) =>
        date
            ? new Date(date).toLocaleDateString("en-IN", {
                day: "2-digit",
                month: "long",
                year: "numeric",
            })
            : "N/A";

    /* -------------------- UI -------------------- */

    return (
        <Box sx={{ maxWidth: 600, mx: "auto", px: 2, py: 3 }}>
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
                                    Plan: {currentPlan.planName}
                                </Typography>

                                <Typography variant="body2">
                                    Amount: {currentPlan.amount} {currentPlan.currency}
                                </Typography>

                                <Typography variant="body2">
                                    Valid From: {formatDate(currentPlan.premiumStart)}
                                </Typography>

                                <Typography variant="body2">
                                    Valid Till: {formatDate(currentPlan.premiumEnd)}
                                </Typography>

                                {currentPlan.expiryMessage && (
                                    <Typography variant="body2" color="text.secondary">
                                        {currentPlan.expiryMessage}
                                    </Typography>
                                )}
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
                                    const status = getPaymentStatus(payment);
                                    const chipProps = getStatusChipProps(status);

                                    return (
                                        <Card key={payment.id || index} variant="outlined">
                                            <CardContent>

                                                <Typography variant="body1">
                                                    Plan: {payment.planName}
                                                </Typography>

                                                <Typography variant="body2">
                                                    Amount: {payment.amount} {payment.currency}
                                                </Typography>

                                                <Typography variant="body2">
                                                    Purchased: {formatDate(payment.createdAt)}
                                                </Typography>

                                                <Typography variant="body2">
                                                    Valid From: {formatDate(payment.premiumStart)}
                                                </Typography>

                                                <Typography variant="body2">
                                                    Valid Till: {formatDate(payment.premiumEnd)}
                                                </Typography>

                                                <Typography variant="body2">
                                                    Payment Mode: {payment.paymentMode || "N/A"}
                                                </Typography>

                                                <Typography variant="body2">
                                                    Transaction ID: {payment.transactionId || "N/A"}
                                                </Typography>

                                                <Chip {...chipProps} size="small" sx={{ mt: 1 }} />

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