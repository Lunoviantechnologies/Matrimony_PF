import { useEffect } from 'react';
import { Outlet, useNavigate } from 'react-router-dom';
import '../styleSheets/PremiumSubscription.css';
import axios from 'axios';
import backendIP from '../api/api';
import { useSelector } from 'react-redux';

function PremiumSubscription() {

  const navigate = useNavigate();
  const { id: myId } = useSelector(state => state.auth);

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
        '5 SaathJanam Live passes',
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
        '6 SaathJanam Live passes',
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
        '8 SaathJanam Live passes',
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
        '9 SaathJanam Live passes',
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
        '15 SaathJanam Live passes',
        'Standout from Profiles',
        'Matches contact directly'
      ],
      duration: '12 months'
    }
  ];

  const handlePlanSelect = async (plan) => {
    try {
      const planCodeMap = {
        "gold-3months": "GOLD_3",
        "gold-plus-3months": "GOLDPLUS_3",
        "diamond-6months": "DIAMOND_6",
        "diamond-plus-6months": "DIAMONDPLUS_6",
        "platinum-plus-12months": "PLATINUM_12"
      };

      const backendPlanCode = planCodeMap[plan.id];
      if (!backendPlanCode) {
        alert("Invalid plan selected");
        return;
      }

      // ✅ CORRECT API + PAYLOAD
      const res = await axios.post(`${backendIP}/payment/create-order`, {
        profileId: myId,
        planCode: backendPlanCode
      }
      );

      const { razorpayOrderId, razorpayKey, amountRupees, currency } = res.data;

      const options = {
        key: razorpayKey,
        amount: amountRupees * 100, // convert to paise
        currency: currency,
        name: "SaathJanam Premium",
        description: plan.name,
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
              planName: plan.name,
              amount: plan.discountedPrice
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

  return (
    <div>
      {/* <Outlet /> */}
      <div className="premium-subscription-container">
        <header className="subscription-header">
          <div className="logo">SaathJanam</div>
        </header>

        <div className="banner-section">
          <h1>Upgrade now & Get upto 66% discount!</h1>
          <p>Save upto 66%. Expires in 07h: 48m: 27s</p>
          <div className="banner-actions">
            <span>Personalised Plans Help</span>
            <span>Do This Later</span>
          </div>
        </div>

        <div className="plans-section">
          <div className="plans-container-compact">
            {plans.map((plan) => (
              <div key={plan.id} className="plan-card-compact">
                {plan.badge && <div className="plan-badge-compact">{plan.badge}</div>}
                <div className="plan-header-compact">
                  <h3>{plan.name}</h3>
                  <div className="discount-badge-compact">{plan.discount}</div>
                </div>
                <div className="price-section-compact">
                  <div className="original-price-compact">{plan.originalPrice}</div>
                  <div className="discounted-price-compact">{plan.discountedPrice}</div>
                  <div className="per-month-compact">{plan.perMonth}</div>
                </div>
                <button
                  className="continue-btn-compact"
                  onClick={() => handlePlanSelect(plan)}
                >
                  Continue
                </button>
                <div className="features-compact">
                  {plan.features.map((feature, index) => (
                    <div key={index} className="feature-item-compact">✔ {feature}</div>
                  ))}
                </div>
                <div className="auto-renewal-compact">Auto-renews on expiry</div>
              </div>
            ))}
          </div>
        </div>

        <div className="vip-section-compact">
          <div className="vip-badge-compact">VIP SAATHJANAM</div>
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
            <h3>How can I be safe on SaathJanam.com?</h3>
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