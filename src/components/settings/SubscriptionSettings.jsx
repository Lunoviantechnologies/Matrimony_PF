import React from "react";
import { Card, CardContent, Typography, Button, Chip } from "@mui/material";

export default function SubscriptionSettings({ myProfile, navigate }) {
    const sortedPayments = [...(myProfile?.payments || [])].sort(
        (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
    );
    const getPlanMonths = (planCode = "") => {
        const parts = planCode.split("_");
        return Number(parts[parts.length - 1]);
    };

    const getPlanEndDate = (createdAt, planCode) => {
        if (!createdAt || !planCode) return null;

        const startDate = new Date(createdAt);
        const months = getPlanMonths(planCode);

        const endDate = new Date(startDate);
        endDate.setMonth(endDate.getMonth() + months);

        return endDate;
    };

    const currentPlan = sortedPayments.find(payment => {
        const validTill = getPlanEndDate(
            payment.createdAt,
            payment.planCode
        );
        return validTill && validTill >= new Date();
    });

    return (
        <div>
            <Card>
                <CardContent>
                    <Typography variant="h6" fontWeight="600" gutterBottom>
                        Subscription Details
                    </Typography>

                    {currentPlan && (
                        <>
                            <Chip label="Active" color="success" size="small" sx={{ mt: 1 }} />
                            <Typography variant="body2">
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
                    )}

                    <Button
                        variant="contained"
                        color="success"
                        sx={{ mt: 2 }}
                        disabled={!!currentPlan}
                        onClick={() => navigate('/premium')}
                    >
                        {currentPlan ? "Plan Active" : "Upgrade Plan"}
                    </Button>
                </CardContent>
            </Card>
            <div className="mt-3">
                <Card>
                    <CardContent>
                        <Typography variant="h6" fontWeight="600" gutterBottom>
                            Payment History
                        </Typography>
                        {
                            sortedPayments.length === 0 ? (
                                <Typography variant="body1" gutterBottom>
                                    No payment history available.
                                </Typography>
                            ) : (
                                sortedPayments.map((payment, index) => {
                                    const validTill = getPlanEndDate(payment.createdAt, payment.planCode);
                                    const isExpired = validTill ? validTill < new Date() : true;

                                    return (
                                        <Card key={payment.id || index} variant="outlined" sx={{ mb: 2 }}>
                                            <CardContent>
                                                <Typography variant="body1" gutterBottom>
                                                    Plan Name: {payment.planCode}
                                                </Typography>

                                                <Typography variant="body2" gutterBottom>
                                                    Amount: {payment.amount} {payment.currency}
                                                </Typography>

                                                <Typography variant="body2">
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

                                                <Typography variant="body2" gutterBottom>
                                                    Valid Till:{" "}
                                                    {validTill
                                                        ? validTill.toLocaleDateString("en-IN", {
                                                            day: "2-digit",
                                                            month: "long",
                                                            year: "numeric",
                                                        })
                                                        : "--"}
                                                </Typography>
                                                <Chip
                                                    label={isExpired ? "Expired" : "Active"}
                                                    color={isExpired ? "error" : "success"}
                                                    size="small"
                                                    sx={{ mt: 1 }}
                                                />
                                            </CardContent>
                                        </Card>
                                    );
                                })
                            )
                        }
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

