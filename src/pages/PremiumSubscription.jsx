import { useEffect, useState } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import '../styleSheets/PremiumSubscription.css';
import axios from 'axios';
import backendIP from '../api/api';
import { useSelector } from 'react-redux';
import api from '../api/axiosInstance';
import { MdCelebration } from "react-icons/md";

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

  const plans = [
    {
      id: 'gold-3months',
      name: 'Gold 3 Months',
      discount: '60% off',
      originalPrice: '₹4,540',
      discountedPrice: '₹1,815',
      perMonth: '₹605/month',
      features: [
        'Send unlimited Messages',
        'View 50 Contact Numbers',
        '5 Vivahjeevan Live passes',
        'Standout from Profiles',
        'Matches contact directly'
      ],
      duration: '3 months'
    },
    {
      id: 'gold-plus-3months',
      name: 'Gold Plus 3 Months',
      discount: '65% off',
      originalPrice: '₹5,560',
      discountedPrice: '₹1,946',
      perMonth: '₹648/month',
      features: [
        'Send unlimited Messages',
        'View 75 Contact Numbers',
        '6 Vivahjeevan Live passes',
        'Standout from Profiles',
        'Matches contact directly'
      ],
      duration: '3 months'
    },
    {
      id: 'diamond-6months',
      name: 'Diamond 6 Months',
      discount: '65% off',
      originalPrice: '₹6,520',
      discountedPrice: '₹2,281',
      perMonth: '₹381/month',
      features: [
        'Send unlimited Messages',
        'View 100 Contact Numbers',
        '8 Vivahjeevan Live passes',
        'Standout from Profiles',
        'Matches contact directly'
      ],
      duration: '6 months'
    },
    {
      id: 'diamond-plus-6months',
      name: 'Diamond Plus 6 Months',
      discount: '66% off',
      originalPrice: '₹8,199',
      discountedPrice: '₹2,787',
      perMonth: '₹464/month',
      badge: 'TOP SELLER',
      features: [
        'Send unlimited Messages',
        'View 100 Contacts (Unlimited)',
        '9 Vivahjeevan Live passes',
        'Standout from Profiles',
        'Matches contact directly'
      ],
      duration: '6 months'
    },
    {
      id: 'platinum-plus-12months',
      name: 'Platinum 12 Months',
      discount: '60% off',
      originalPrice: '₹13,304',
      discountedPrice: '₹5,321',
      perMonth: '₹443/month',
      badge: 'BEST VALUE',
      features: [
        'Send unlimited Messages',
        'View 200 Contacts (Unlimited)',
        '15 Vivahjeevan Live passes',
        'Standout from Profiles',
        'Matches contact directly'
      ],
      duration: '12 months'
    }
  ];

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
          await axios.post(`${backendIP}/payment/verify`, {
            razorpay_order_id: response.razorpay_order_id,
            razorpay_payment_id: response.razorpay_payment_id,
            razorpay_signature: response.razorpay_signature
          }
          );

          navigate("/payment-success", {
            state: {
              planId: plan.id,
              planName: plan.planName,
              amount: plan.priceRupees
            }
          });
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
      return Math.round(
        basePrice - (basePrice * plan.discountValue) / 100
      );
    }

    if (plan.discountType === "FLAT") {
      return Math.max(basePrice - plan.discountValue, 0);
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

  return (
    <div>
      {/* <Outlet /> */}
      <div className="premium-subscription-container">
        <header className="subscription-header">
<<<<<<< HEAD
          <img src="/vivahjeevan_logo.png" alt="vivahjeevan_logo" className='v-logo'/>
          <div className="logo">Vivahjeevan</div>
=======
          <div className="logo">
            <img src="/vivahjeevan_logo.png" alt="vivahjeevan_logo" width={'50px'} />
            Vivahjeevan
          </div>
>>>>>>> 8daf26a0cf14f507857f169e5f71e9e32f70e0d0
        </header>

        <div className="banner-section">
          <h1>
            Upgrade now & Get upto{" "}
            {platinumPlan ? `${platinumPlan.discountValue}%` : "..."} discount!
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
            {planDetails.map((plan) => {

              const festivalActive = isFestivalActive(plan);
              const discountActive = isDiscountActive(plan);

              const basePrice = festivalActive
                ? plan.festivalPrice
                : plan.priceRupees;

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
                          ⏱ Ends in {countdown}
                        </div>
                      )}
                    </div>
                  )}

                  {/* PRICE SECTION */}
                  <div className="price-section-compact">

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

                  <div className="auto-renewal-compact">
                    Auto-renews on expiry
                  </div>

                </div>
              );
            })}
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