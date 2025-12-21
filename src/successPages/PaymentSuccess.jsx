import React from "react";
import { Link, useLocation } from "react-router-dom";
import "../styleSheets/successPageCSS/paymentSuccess.css";

function PaymentSuccess() {
  const { state } = useLocation();

  return (
    <div className="payment-status-wrapper">
      <div className="payment-status-card">
        <h1>🎉 Payment Successful</h1>
        <p><strong>Plan:</strong> {state?.planName}</p>
        <p><strong>Amount Paid:</strong> {state?.amount}</p>
        <p className="payment-description">Thank you for subscribing to our premium plan! Enjoy the exclusive features and benefits.</p>
        <Link to="/dashboard" className="dashboard-link">
          Click here to redirect to Dashboard
        </Link>
      </div>
    </div>
  );
}

export default PaymentSuccess;