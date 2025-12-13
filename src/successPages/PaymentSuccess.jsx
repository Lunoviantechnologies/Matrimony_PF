import { useLocation } from "react-router-dom";

function PaymentSuccess() {
  const { state } = useLocation();

  return (
    <div>
      <h1>🎉 Payment Successful</h1>
      <p>Plan: {state?.planName}</p>
      <p>Amount Paid: {state?.amount}</p>
    </div>
  );
}

export default PaymentSuccess;
