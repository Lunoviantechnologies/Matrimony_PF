// src/pages/PremiumSubscription.jsx
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import '../styleSheets/PremiumSubscription.css';

function PremiumSubscription() {
  const navigate = useNavigate();
  const [selectedPlan, setSelectedPlan] = useState(null);
  const [paymentStep, setPaymentStep] = useState('plan'); // 'plan', 'payment'
  const [selectedPayment, setSelectedPayment] = useState('');
  const [paymentDetails, setPaymentDetails] = useState({
    upiTransactionId: '',
    cardNumber: '',
    cardExpiry: '',
    cardCvv: '',
    cardName: '',
    selectedBank: '',
    netbankingUsername: '',
    netbankingPassword: '',
    upiId: ''
  });
  const [isProcessing, setIsProcessing] = useState(false);
  const [showNetbankingLogin, setShowNetbankingLogin] = useState(false);

  // Merchant details
  const merchantDetails = {
    upiId: 'shaadi-premium@oksbi',
    merchantName: 'Shaadi.com Premium',
    accountNumber: 'XXXXXXXXXXX',
    ifscCode: 'XXXX0000XXX'
  };

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
        '5 Shaadi Live passes',
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
        '6 Shaadi Live passes',
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
        '8 Shaadi Live passes',
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
        '9 Shaadi Live passes',
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
        '15 Shaadi Live passes',
        'Standout from Profiles',
        'Matches contact directly'
      ],
      duration: '12 months'
    }
  ];

  const handlePlanSelect = (plan) => {
    setSelectedPlan(plan);
    setPaymentStep('payment');
  };

  const handlePaymentInputChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value
    });
  };

  const validatePaymentDetails = () => {
    switch (selectedPayment) {
      case 'upi':
        if (!paymentDetails.upiTransactionId.trim()) {
          alert('Please enter UPI Transaction ID');
          return false;
        }
        if (paymentDetails.upiTransactionId.length < 8) {
          alert('Please enter a valid UPI Transaction ID');
          return false;
        }
        break;
      case 'card':
        if (!paymentDetails.cardNumber.trim() ||
          !paymentDetails.cardExpiry.trim() ||
          !paymentDetails.cardCvv.trim() ||
          !paymentDetails.cardName.trim()) {
          alert('Please fill all card details');
          return false;
        }
        if (paymentDetails.cardNumber.replace(/\s/g, '').length !== 16) {
          alert('Please enter valid 16-digit card number');
          return false;
        }
        if (paymentDetails.cardCvv.length !== 3) {
          alert('Please enter valid 3-digit CVV');
          return false;
        }
        break;
      case 'netbanking':
        if (!paymentDetails.selectedBank) {
          alert('Please select your bank');
          return false;
        }
        if (!paymentDetails.netbankingUsername.trim()) {
          alert('Please enter your Net Banking username');
          return false;
        }
        if (!paymentDetails.netbankingPassword.trim()) {
          alert('Please enter your Net Banking password');
          return false;
        }
        break;
      default:
        alert('Please select a payment method');
        return false;
    }
    return true;
  };

  const processUPIPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const subscriptionDetails = {
        subscriptionId: 'SUB' + Date.now(),
        plan: selectedPlan,
        total: getPlanAmount(),
        paymentMethod: 'upi',
        paymentDetails: {
          transactionId: paymentDetails.upiTransactionId,
          upiId: merchantDetails.upiId
        },
        date: new Date().toISOString(),
        status: 'active',
        expiryDate: calculateExpiryDate(selectedPlan.duration)
      };
      saveSubscription(subscriptionDetails);
      showSuccessAlert('UPI', subscriptionDetails.subscriptionId);
    }, 3000);
  };

  const processCardPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const subscriptionDetails = {
        subscriptionId: 'SUB' + Date.now(),
        plan: selectedPlan,
        total: getPlanAmount(),
        paymentMethod: 'card',
        paymentDetails: {
          cardLastFour: paymentDetails.cardNumber.slice(-4),
          cardType: getCardType(paymentDetails.cardNumber)
        },
        date: new Date().toISOString(),
        status: 'active',
        expiryDate: calculateExpiryDate(selectedPlan.duration)
      };
      saveSubscription(subscriptionDetails);
      showSuccessAlert('Card', subscriptionDetails.subscriptionId);
    }, 3000);
  };

  const processNetBankingPayment = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      const subscriptionDetails = {
        subscriptionId: 'SUB' + Date.now(),
        plan: selectedPlan,
        total: getPlanAmount(),
        paymentMethod: 'netbanking',
        paymentDetails: {
          bank: paymentDetails.selectedBank,
          username: paymentDetails.netbankingUsername
        },
        date: new Date().toISOString(),
        status: 'active',
        expiryDate: calculateExpiryDate(selectedPlan.duration)
      };
      saveSubscription(subscriptionDetails);
      showSuccessAlert('Net Banking', subscriptionDetails.subscriptionId);
    }, 3000);
  };

  const handlePaymentSubmit = () => {
    if (!validatePaymentDetails()) {
      return;
    }

    switch (selectedPayment) {
      case 'upi':
        processUPIPayment();
        break;
      case 'card':
        processCardPayment();
        break;
      case 'netbanking':
        processNetBankingPayment();
        break;
      default:
        alert('Please select a payment method');
    }
  };

  const handleNetBankingSelect = () => {
    setSelectedPayment('netbanking');
    setShowNetbankingLogin(true);
  };

  const handleBankSelection = (e) => {
    handlePaymentInputChange(e);
    setShowNetbankingLogin(true);
  };

  const saveSubscription = (subscriptionDetails) => {
    const existingSubscriptions = JSON.parse(localStorage.getItem('subscriptions') || '[]');
    existingSubscriptions.push(subscriptionDetails);
    localStorage.setItem('subscriptions', JSON.stringify(existingSubscriptions));
  };

  const showSuccessAlert = (paymentMethod, subscriptionId) => {
    alert(`🎉 Payment Successful via ${ paymentMethod }! \n\nThank you for your subscription to ${ selectedPlan.name } !\n\nSubscription ID: ${ subscriptionId } \nAmount Paid: ₹${ (getPlanAmount() * 1.18).toFixed(2) } \n\nYou now have access to all premium features.Redirecting to profile...`);

    setTimeout(() => {
      navigate('/profile');
    }, 2000);
  };

  const getPlanAmount = () => {
    if (!selectedPlan) return 0;
    return parseFloat(selectedPlan.discountedPrice.replace('₹', '').replace(',', ''));
  };

  const calculateExpiryDate = (duration) => {
    const months = parseInt(duration);
    const expiry = new Date();
    expiry.setMonth(expiry.getMonth() + months);
    return expiry.toISOString();
  };

  const generateUPILink = () => {
    const amount = getPlanAmount().toFixed(2);
    return `upi://pay?pa=${merchantDetails.upiId}&pn=${merchantDetails.merchantName}&am=${amount}&cu=INR&tn=Shaadi Premium Subscription`;
  };

  const formatCardNumber = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{4})(?=\d)/g, '$1 ').slice(0, 19);
  };

  const formatExpiryDate = (value) => {
    return value.replace(/\D/g, '').replace(/(\d{2})(?=\d)/g, '$1/').slice(0, 5);
  };

  const getCardType = (cardNumber) => {
    const cleanNumber = cardNumber.replace(/\s/g, '');
    if (/^4/.test(cleanNumber)) return 'Visa';
    if (/^5[1-5]/.test(cleanNumber)) return 'Mastercard';
    if (/^3[47]/.test(cleanNumber)) return 'American Express';
    return 'Card';
  };

  if (paymentStep === 'plan') {
    return (
      <div className="premium-subscription-container">
        <header className="subscription-header">
          <div className="logo">shādhi</div>
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
          <div className="vip-badge-compact">VIP SHAADI</div>
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
            <h3>How can I be safe on Shaadi.com?</h3>
            <p>We go to great lengths to make sure you get the best possible experience here. Every single profile is screened.</p>
          </div>
        </div>

        <footer className="footer-compact">
          <p>The safest, smartest and the most secure matchmaking service in India</p>
        </footer>
      </div>
    );
  }

  return (
    <div className="premium-subscription-container">
      <div className="checkout-section">
        <h1>Payment Methods</h1>
        <div className="payment-flex-container">
          <div className="payment-methods">
            <div className="merchant-info">
              <h3>Payment for Premium Subscription</h3>
              <p><strong>Plan:</strong> {selectedPlan.name}</p>
              <p><strong>Merchant:</strong> {merchantDetails.merchantName}</p>
              <p><strong>UPI ID:</strong> {merchantDetails.upiId}</p>
            </div>

            <div className="payment-option">
              <input
                type="radio"
                id="upi"
                name="payment"
                value="upi"
                onChange={(e) => setSelectedPayment(e.target.value)}
              />
              <label htmlFor="upi">UPI Payment</label>
            </div>
            {selectedPayment === 'upi' && (
              <div className="upi-details">
                <div className="qr-code-wrapper">
                  <QRCodeSVG
                    value={generateUPILink()}
                    size={200}
                    level="M"
                    includeMargin={true}
                    bgColor="#FFFFFF"
                    fgColor="#000000"
                  />
                </div>
                <p>Scan QR code with any UPI app</p>
                <p className="upi-id">Pay to: {merchantDetails.upiId}</p>
                <p className="amount">Amount: {selectedPlan.discountedPrice}</p>
                <input
                  type="text"
                  name="upiTransactionId"
                  placeholder="Enter Transaction ID after payment"
                  className="upi-input"
                  value={paymentDetails.upiTransactionId}
                  onChange={handlePaymentInputChange}
                  required
                />
              </div>
            )}

            <div className="payment-option">
              <input
                type="radio"
                id="card"
                name="payment"
                value="card"
                onChange={(e) => setSelectedPayment(e.target.value)}
              />
              <label htmlFor="card">Credit/Debit Card</label>
            </div>
            {selectedPayment === 'card' && (
              <div className="card-details">
                <p className="payment-note">Card payments will be processed through secure payment gateway</p>
                <input
                  type="text"
                  name="cardNumber"
                  placeholder="Card Number"
                  className="card-input"
                  maxLength="19"
                  value={formatCardNumber(paymentDetails.cardNumber)}
                  onChange={handlePaymentInputChange}
                  required
                />
                <div className="card-row">
                  <input
                    type="text"
                    name="cardExpiry"
                    placeholder="MM/YY"
                    className="card-input"
                    maxLength="5"
                    value={formatExpiryDate(paymentDetails.cardExpiry)}
                    onChange={handlePaymentInputChange}
                    required
                  />
                  <input
                    type="text"
                    name="cardCvv"
                    placeholder="CVV"
                    className="card-input"
                    maxLength="3"
                    value={paymentDetails.cardCvv}
                    onChange={handlePaymentInputChange}
                    required
                  />
                </div>
                <input
                  type="text"
                  name="cardName"
                  placeholder="Cardholder Name"
                  className="card-input"
                  value={paymentDetails.cardName}
                  onChange={handlePaymentInputChange}
                  required
                />
              </div>
            )}

            <div className="payment-option">
              <input
                type="radio"
                id="netbanking"
                name="payment"
                value="netbanking"
                onChange={handleNetBankingSelect}
              />
              <label htmlFor="netbanking">Net Banking</label>
            </div>
            {selectedPayment === 'netbanking' && (
              <div className="netbanking-details">
                <p className="payment-note">You will be redirected to your bank's website</p>

                {/* Bank Selection */}
                <div className="form-group">
                  <label>Select Your Bank *</label>
                  <select
                    className="bank-select"
                    name="selectedBank"
                    value={paymentDetails.selectedBank}
                    onChange={handleBankSelection}
                    required
                  >
                    <option value="">Select Bank</option>
                    <option value="sbi">State Bank of India</option>
                    <option value="hdfc">HDFC Bank</option>
                    <option value="icici">ICICI Bank</option>
                    <option value="axis">Axis Bank</option>
                    <option value="pnb">Punjab National Bank</option>
                  </select>
                </div>

                {/* Net Banking Login Form */}
                {showNetbankingLogin && paymentDetails.selectedBank && (
                  <div className="netbanking-login-form">
                    <div className="bank-header">
                      <h4>Login to {getBankName(paymentDetails.selectedBank)}</h4>
                      <div className="secure-badge">🔒 Secure Login</div>
                    </div>

                    <div className="form-group">
                      <label>Customer ID / Username *</label>
                      <input
                        type="text"
                        name="netbankingUsername"
                        placeholder="Enter your Customer ID or Username"
                        className="netbanking-input"
                        value={paymentDetails.netbankingUsername}
                        onChange={handlePaymentInputChange}
                        required
                      />
                    </div>

                    <div className="form-group">
                      <label>Password *</label>
                      <input
                        type="password"
                        name="netbankingPassword"
                        placeholder="Enter your Net Banking password"
                        className="netbanking-input"
                        value={paymentDetails.netbankingPassword}
                        onChange={handlePaymentInputChange}
                        required
                      />
                    </div>

                    <div className="netbanking-security">
                      <div className="security-features">
                        <span>✓ 128-bit SSL Encryption</span>
                        <span>✓ Secure Transaction</span>
                        <span>✓ RBI Approved</span>
                      </div>
                    </div>

                    <div className="payment-amount-info">
                      <p><strong>Amount to Pay:</strong> ₹{(getPlanAmount() * 1.18).toFixed(2)}</p>
                      <p><strong>Merchant:</strong> {merchantDetails.merchantName}</p>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="order-summary">
            <h2>Order Summary</h2>
            <div className="summary-plan">
              <h4>{selectedPlan.name}</h4>
              <div className="plan-features">
                {selectedPlan.features.slice(0, 3).map((feature, index) => (
                  <div key={index} className="feature-summary">✓ {feature}</div>
                ))}
              </div>
            </div>
            <div className="summary-items">
              <div className="summary-item">
                <span>Plan Price:</span>
                <span>{selectedPlan.originalPrice}</span>
              </div>
              <div className="summary-item discount">
                <span>Discount:</span>
                <span>- {selectedPlan.discount}</span>
              </div>
            </div>
            <div className="summary-row">
              <span>Subtotal:</span>
              <span>{selectedPlan.discountedPrice}</span>
            </div>
            <div className="summary-row">
              <span>GST (18%):</span>
              <span>₹ {(getPlanAmount() * 0.18).toFixed(2)}</span>
            </div>
            <div className="summary-row total">
              <span>Total Amount:</span>
              <span>₹ {(getPlanAmount() * 1.18).toFixed(2)}</span>
            </div>
            <button
              onClick={handlePaymentSubmit}
              className="place-order-btn"
              disabled={!selectedPayment || isProcessing}
            >
              {isProcessing ? 'Processing...' : 'Complete Payment'}
            </button>
            <button
              onClick={() => setPaymentStep('plan')}
              className="back-btn"
              disabled={isProcessing}
            >
              Back to Plans
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Helper function to get bank name
function getBankName(bankCode) {
  const banks = {
    sbi: 'State Bank of India',
    hdfc: 'HDFC Bank',
    icici: 'ICICI Bank',
    axis: 'Axis Bank',
    pnb: 'Punjab National Bank'
  };
  return banks[bankCode] || 'Your Bank';
}

export default PremiumSubscription;