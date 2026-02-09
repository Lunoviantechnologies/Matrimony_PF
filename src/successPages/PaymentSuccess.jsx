import React, { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import "../styleSheets/successPageCSS/paymentSuccess.css";

function PaymentSuccess() {
  const { state } = useLocation();
  const [seconds, setSeconds] = useState(5);

  useEffect(() => {
    // countdown
    const interval = setInterval(() => {
      setSeconds((prev) => prev - 1);
    }, 1000);

    // redirect
    const timeout = setTimeout(() => {
      window.location.href = "/";
    }, 5000);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <div className="payment-status-wrapper">
      <div className="payment-status-card">
        <h1>🎉 Payment Successful</h1>
        <p><strong>Plan:</strong> {state?.planName}</p>
        <p><strong>Amount Paid:</strong> {state?.amount}</p>
        <p className="payment-description">Thank you for subscribing to our premium plan! Enjoy the exclusive features and benefits.</p>
        <Link to="/dashboard" className="dashboard-link">
          Redirecting to dashboard in <strong>{seconds}</strong> seconds…
        </Link>
      </div>
    </div>
  );
}

export default PaymentSuccess;