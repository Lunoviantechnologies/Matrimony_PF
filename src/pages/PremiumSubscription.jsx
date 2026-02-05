import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import '../styleSheets/PremiumSubscription.css';
import axios from 'axios';
import backendIP from '../api/api';
import { useSelector } from 'react-redux';
import api from '../api/axiosInstance';
import { MdCelebration } from "react-icons/md";
import { BiStopwatch } from "react-icons/bi";
import { FiPhone } from "react-icons/fi";
import { BsChatDots } from "react-icons/bs";
import { GiCrystalBall } from "react-icons/gi";
import { FaUserTie, FaStar } from "react-icons/fa";
import { IoWarningOutline } from "react-icons/io5";

function PremiumSubscription() {

  const navigate = useNavigate();
  const { id: myId } = useSelector(state => state.auth);
  const [planDetails, setPlanDetails] = useState([]);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    api.get('plans').then(res => {
      console.log("plans : ", res.data);
      setPlanDetails(res.data);
    })
  }, []);

  // Load Razorpay checkout script once
  useEffect(() => {
    const script = document.createElement('script');
    script.src = 'https://checkout.razorpay.com/v1/checkout.js';
    script.async = true;
    document.body.appendChild(script);
    return () => {
      // optional cleanup
      document.body.removeChild(script);
    };
  }, []);

  const handlePlanSelect = async (plan) => {
    try {

      // ✅ CORRECT API + PAYLOAD
      console.log("plan code : ", plan.planCode);
      const res = await api.post('/payment/create-order', {
        profileId: myId,
        planCode: plan.planCode
      }
      );

      const { razorpayOrderId, razorpayKey, amountRupees, currency } = res.data;
      console.log("response payment : ", res.data);

      const options = {
        key: razorpayKey,
        amount: amountRupees * 100, // convert to paise
        currency: currency,
        name: "Vivahjeevan Premium",
        description: plan.planName,
        order_id: razorpayOrderId,

        handler: async function (response) {
          const festivalActive = isFestivalActive(plan);
          const finalAmount = calculateDiscountedPrice(
            festivalActive ? plan.festivalPrice : plan.priceRupees,
            plan
          );

          navigate("/payment-success", {
            state: {
              planId: plan.planCode,
              planName: plan.planName,
              amount: finalAmount
            }
          });

          await axios.post(`${backendIP}/payment/verify`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          }
          );
        },

        theme: { color: "#e91e63" }
      };

      const rzp = new window.Razorpay(options);
      rzp.open();

      rzp.on("payment.failed", function (response) {
        console.error("Payment failed:", response.error);
        navigate("/payment-failed", {
          state: {
            reason: response.error.reason,
            description: response.error.description
          }
        });
      });

    } catch (err) {
      console.error("Payment error:", err);
      alert(
        "Payment failed: " +
        (err.response?.data?.error || err.message)
      );
    }
  };

  const isFestivalActive = (plan) => {
    if (!plan.festivalStart || !plan.festivalEnd) return false;

    const today = new Date();
    const start = new Date(plan.festivalStart);
    const end = new Date(plan.festivalEnd);

    return today >= start && today <= end;
  };

  const isDiscountActive = (plan) => {
    if (!plan.discountStart || !plan.discountEnd) return false;

    const today = new Date();
    const start = new Date(plan.discountStart);
    const end = new Date(plan.discountEnd);

    return today >= start && today <= end;
  };

  const calculateDiscountedPrice = (basePrice, plan) => {
    if (!isDiscountActive(plan)) return basePrice;

    if (plan.discountType === "PERCENTAGE") {
      return Number((basePrice - (basePrice * plan.discountValue) / 100).toFixed(2));
    }

    if (plan.discountType === "FLAT") {
      const discounted = Math.max(basePrice - plan.discountValue, 0);
      return Number(discounted.toFixed(2));
    }

    return basePrice;
  };

  const getFestivalCountdown = (plan) => {
    if (!isFestivalActive(plan)) return null;

    const end = new Date(plan.festivalEnd);
    const diff = end - currentTime;

    if (diff <= 0) return "Festival ended";

    const hours = Math.floor(diff / (1000 * 60 * 60));
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);

    return `${hours}h ${minutes}m ${seconds}s`;
  };

  const platinumPlan = planDetails.length
    ? planDetails.find(plan => plan.planCode.includes("PLATINUM")) : null;

  const platinumFestivalActive = platinumPlan && isFestivalActive(platinumPlan);
  const platinumCountdown = platinumFestivalActive && getFestivalCountdown(platinumPlan);

  const renderFeatureValue = (value) => {
    if (value === true) return "Yes";
    if (value === false) return "No";
    if (value === null || value === undefined) return "-";
    return value;
  };

  return (
    <div>
      {/* <Outlet /> */}
      <div className="premium-subscription-container">
        <header className="subscription-header">
          <img src="/vivahjeevan_logo.png" alt="vivahjeevan_logo" className='v-logo' />
          <div className="logo">Vivahjeevan</div>
        </header>

        <div className="banner-section">
          <h1>
            Upgrade now & Get upto{" "}
            {platinumPlan ? `${platinumPlan.discountValue}%` : "No active offers"} discount!
          </h1>

          {platinumPlan ? (
            platinumFestivalActive ? (
              <p>
                Save upto {platinumPlan.discountValue}%.
                {platinumCountdown && <> Expires in {platinumCountdown}</>}
              </p>
            ) : (
              <p>Save upto {platinumPlan.discountValue}% on Premium plans</p>
            )
          ) : (
            <p>Loading offers...</p>
          )}

          <div className="banner-actions">
            <span>Personalised Plans Help</span>
            <span>Do This Later</span>
          </div>
        </div>

        <div className="plans-section">
          <div className="plans-container-compact">

            {planDetails.length === 0 ? (
              <div className="no-plans-message">
                No plans available right now.
              </div>
            ) : (
              planDetails.map((plan) => {
                const festivalActive = isFestivalActive(plan);
                const discountActive = isDiscountActive(plan);
                const basePrice = festivalActive ? plan.festivalPrice : plan.priceRupees;
                const discountedPrice = calculateDiscountedPrice(basePrice, plan);
                const perMonth = (discountedPrice / plan.durationMonths).toFixed(2);
                const countdown = getFestivalCountdown(plan);

                return (
                  <div key={plan.planCode} className="plan-card-compact">

                    {/* HEADER */}
                    <div className="plan-header-compact">
                      <h3>{plan.planName}</h3>

                      {discountActive && (
                        <div className="discount-badge-compact">
                          {plan.discountType === "PERCENTAGE"
                            ? `${plan.discountValue}% OFF`
                            : `₹${plan.discountValue} OFF`}
                        </div>
                      )}
                    </div>

                    {/* FESTIVAL LABEL */}
                    {festivalActive && (
                      <div className="festival-center-compact">
                        <div className="festival-label-compact">
                          <MdCelebration /> Festival Price
                        </div>

                        {countdown && (
                          <div className="festival-timer-compact">
                            <BiStopwatch /> Ends in {countdown}
                          </div>
                        )}
                      </div>
                    )}

                    {/* PRICE SECTION */}
                    <div className="price-section-compact">
                      <div className="validity-month-compact">
                        {plan.durationMonths} Months
                      </div>
                      <div className="original-price-compact">
                        ₹{basePrice}
                      </div>

                      <div className="discounted-price-compact">
                        ₹{discountedPrice}
                      </div>

                      <div className="per-month-compact">
                        ₹{perMonth}/month
                      </div>

                    </div>

                    <button
                      className="continue-btn-compact"
                      onClick={() => handlePlanSelect(plan)}
                    >
                      Continue
                    </button>

                    <div className="plan-below-continue">

                      <div className="plan-info-line">
                        <FiPhone /> Contacts: {renderFeatureValue(plan.contacts)} / month
                      </div>

                      <div className="plan-info-line">
                        <BsChatDots /> Chat: {renderFeatureValue(plan.chat)}
                      </div>

                      <div className="plan-info-line">
                        <GiCrystalBall /> Astro Support: {renderFeatureValue(plan.astroSupport)}
                      </div>

                      <div className="plan-info-line">
                        <FaUserTie /> Relationship Manager: {renderFeatureValue(plan.relationshipManager)}
                      </div>

                      <div className="plan-benefit-text">
                        <FaStar /> {renderFeatureValue(plan.benefit)}
                      </div>

                      <div className="plan-warning-text">
                        <IoWarningOutline /> Contacts once viewed cannot be reversed or refunded
                      </div>

                    </div>

                    <div className="auto-renewal-compact">
                      Auto-renews on expiry
                    </div>

                  </div>
                );
              })
            )}

          </div>
        </div>

        <div className="vip-section-compact">
          <div className="vip-badge-compact">VIP Vivahjeevan</div>
          <h2>No.1 Matchmaking Service for the Elite</h2>
          <div className="vip-features-compact">
            <div className="vip-feature-compact">5x Success + 100% Privacy</div>
            <div className="vip-feature-compact">50K+ VIPs + Top Consultant</div>
          </div>
          <button className="consultation-btn-compact">Book a FREE Consultation</button>
        </div>

        <div className="faq-section-compact">
          <h2>You have questions. We have the answers...</h2>

          <div className="faq-item-compact">
            <h3>What are some of the benefits of Premium plans?</h3>
            <p>As a Premium member, you can chat unlimited with your Matches, view their contact numbers and view hidden photos. You also get Premium Assistance on priority.</p>
          </div>

          <div className="faq-item-compact">
            <h3>What payment options do you offer?</h3>
            <p>We offer multiple Online and offline payment options for you to pick and choose from based on your location.</p>
          </div>

          <div className="faq-item-compact">
            <h3>What offers and discounts can I avail?</h3>
            <p>We keep you informed from time to time whenever you are eligible for different discounts and offers.</p>
          </div>

          <div className="faq-item-compact">
            <h3>How can I be safe on Vivahjeevan.com?</h3>
            <p>We go to great lengths to make sure you get the best possible experience here. Every single profile is screened.</p>
          </div>
        </div>

        <footer className="footer-compact">
          <p>The safest, smartest and the most secure matchmaking service in India</p>
        </footer>
      </div>
    </div>
  );
}

export default PremiumSubscription;