import { useParams, useNavigate } from 'react-router-dom';
import '../styleSheets/SubscriptionDescription.css';

const SubscriptionDescription = () => {
  const { planId } = useParams();
  const navigate = useNavigate();

  const subscriptionPlans = {
    'gold-3months': {
      id: 'gold-3months',
      name: 'Gold 3 Months',
      discount: '30% off',
      originalPrice: '¥14,510',
      discountedPrice: '¥3,631',
      perMonth: '11,211 per month',
      features: [
        'Send unlimited Messages',
        'View upto 50 Contact Numbers',
        '5 Share U-Lip passes from INKEGGI',
        'Download information',
        'Findlists',
        'Last Motivation contains you directly'
      ],
      description: 'Our Gold plan offers essential premium features to enhance your matchmaking experience with basic contact viewing and messaging capabilities.',
      duration: '3 Months',
      popular: false
    },
    'gold-plus-3months': {
      id: 'gold-plus-3months',
      name: 'Gold Plus 3 Months',
      discount: '30% off',
      originalPrice: '¥15,500',
      discountedPrice: '¥3,992',
      perMonth: '11,227 per month',
      features: [
        'Send unlimited Messages',
        'View upto 75 Contact Numbers',
        '5 Share U-Lip passes from INKEGGI',
        'Restrict from other Parties',
        'Last Motivation contains you directly'
      ],
      description: 'Gold Plus includes all Gold features plus additional privacy controls and expanded contact viewing capabilities.',
      duration: '3 Months',
      popular: false
    },
    'diamond-6months': {
      id: 'diamond-6months',
      name: 'Diamond 6 Months',
      discount: '30% off',
      originalPrice: '¥14,520',
      discountedPrice: '¥4,564',
      perMonth: '17.91 per month',
      features: [
        'Send unlimited Messages',
        'View upto 100 Contact Numbers',
        '5 Share U-Lip passes from INKEGGI',
        'Download information',
        'Findlists',
        'Last Motivation contains you directly'
      ],
      description: 'Diamond plan offers extended duration with enhanced features for serious matchmaking seekers.',
      duration: '6 Months',
      popular: true
    },
    'diamond-plus-6months': {
      id: 'diamond-plus-6months',
      name: 'Diamond Plus 6 Months',
      discount: '40% off',
      originalPrice: '¥14,100',
      discountedPrice: '¥4,919',
      perMonth: '18.12 per month',
      features: [
        'Send unlimited Messages',
        'View upto 100 Contact Numbers (Unlimited by Accreted Waiting)',
        '5 Share U-Lip passes from INKEGGI',
        'Restrict from other Parties',
        'Last Motivation contains you directly',
        'Download information',
        'Findlists'
      ],
      description: 'Our most popular plan with exclusive features including unlimited contact viewing and premium privacy controls.',
      duration: '6 Months',
      popular: true
    },
    'platinum-plus-12months': {
      id: 'platinum-plus-12months',
      name: 'Platinum Plus 12 Months',
      discount: '80% off',
      originalPrice: '¥13,504',
      discountedPrice: '¥6,652',
      perMonth: '135.54 per month',
      features: [
        'Send unlimited Messages',
        'View upto 200 Contact Numbers (Unlimited by Accreted Waiting)',
        '5 Share U-Lip passes from INKEGGI',
        'Restrict from other Parties',
        'Last Motivation contains you directly'
      ],
      description: 'The ultimate premium experience with maximum savings and all features unlocked for a full year.',
      duration: '12 Months',
      popular: false
    }
  };

  const plan = subscriptionPlans[planId];

  if (!plan) {
    return (
      <div className="subscription-description">
        <div className="error-page">
          <h2>Plan Not Found</h2>
          <p>The subscription plan you're looking for doesn't exist.</p>
          <button onClick={() => navigate('/premium')} className="back-btn">
            View All Plans
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="subscription-description">
      <header className="description-header">
        <button onClick={() => navigate('/premium')} className="back-btn">
          ← Back to Plans
        </button>
        <div className="logo">shāādù</div>
      </header>

      <div className="description-container">
        <div className="plan-hero">
          <div className="plan-badge">
            {plan.popular && <span className="popular-badge">Most Popular</span>}
            <span className="duration-badge">{plan.duration}</span>
          </div>
          <h1>{plan.name}</h1>
          <p className="plan-description">{plan.description}</p>
        </div>

        <div className="content-wrapper">
          <div className="price-card">
            <div className="price-header">
              <h2>Plan Summary</h2>
              <div className="discount-badge">{plan.discount}</div>
            </div>

            <div className="price-details">
              <div className="price-original">{plan.originalPrice}</div>
              <div className="price-discounted">{plan.discountedPrice}</div>
              <div className="price-monthly">{plan.perMonth}</div>
            </div>

            <button className="subscribe-btn">
              Subscribe Now
            </button>

            <div className="guarantee">
              <span className="guarantee-icon">✓</span>
              <span>30-day money-back guarantee</span>
            </div>
          </div>

          <div className="features-section">
            <h3>What's Included</h3>
            <div className="features-list">
              {plan.features.map((feature, index) => (
                <div key={index} className="feature-item">
                  <span className="feature-icon">✓</span>
                  <span>{feature}</span>
                </div>
              ))}
            </div>

            <div className="additional-info">
              <h4>How it works:</h4>
              <ul>
                <li>Instant activation after payment</li>
                <li>Access all features immediately</li>
                <li>Cancel anytime with prorated refund</li>
                <li>Premium customer support 24/7</li>
              </ul>
            </div>

            <div className="support-section">
              <h4>Need Help?</h4>
              <p>Our support team is available to help you choose the right plan.</p>
              <button className="support-btn">
                Contact Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SubscriptionDescription;