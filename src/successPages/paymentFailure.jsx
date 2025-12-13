import { useLocation } from "react-router-dom";

function PaymentFailed() {
  const { state } = useLocation();

  return (
    <div>
      <h1>❌ Payment Failed</h1>
      <p>{state?.reason || "Something went wrong"}</p>
    </div>
  );
}

export default PaymentFailed;