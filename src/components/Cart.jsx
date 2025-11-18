import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';
import '../styleSheets/PremiumSubscription.css';

function Cart() {
    const navigate = useNavigate();
    const { planId } = useParams();

    const [selectedPlan, setSelectedPlan] = useState(null);
    const [selectedPayment, setSelectedPayment] = useState('');
    const [paymentDetails, setPaymentDetails] = useState({
        cardNumber: '',
        cardExpiry: '',
        cardCvv: '',
        cardName: '',
        selectedBank: '',
        netbankingUsername: '',
        netbankingPassword: ''
    });
    const [isProcessing, setIsProcessing] = useState(false);
    const [showNetbankingLogin, setShowNetbankingLogin] = useState(false);

    // Plan data
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

    // Merchant details
    const merchantDetails = {
        upiId: 'saathjanam-premium@oksbi',
        merchantName: 'SaathJanam.com Premium',
        accountNumber: 'XXXXXXXXXXX',
        ifscCode: 'XXXX0000XXX'
    };

    // Load plan from URL parameter
    useEffect(() => {
        if (planId) {
            const plan = plans.find(p => p.id === planId);
            if (plan) {
                setSelectedPlan(plan);
            } else {
                navigate('/premiumPlans');
            }
        }
    }, [planId, navigate]);

    const handleBackToPlans = () => {
        navigate('/premiumPlans');
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
        alert(`🎉 Payment Successful via ${paymentMethod}! \n\nThank you for your subscription to ${selectedPlan.name}!\n\nSubscription ID: ${subscriptionId}\nAmount Paid: ₹${(getPlanAmount() * 1.18).toFixed(2)}\n\nYou now have access to all premium features. Redirecting to profile...`);

        setTimeout(() => {
            navigate('/dashboard');
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
        return `upi://pay?pa=${merchantDetails.upiId}&pn=${merchantDetails.merchantName}&am=${amount}&cu=INR&tn=SaathJanam Premium Subscription`;
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

    if (!selectedPlan) {
        return (
            <div className="premium-subscription-container">
                <div className="loading-section">
                    <h2>Loading...</h2>
                    <p>Redirecting to plans...</p>
                </div>
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
                                <div className="upi-instructions">
                                    <p>📱 Scan the QR code with your UPI app</p>
                                    <p>✅ Payment will be automatically verified</p>
                                    <p>⏱ Please wait while we process your payment</p>
                                </div>
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
                            onClick={handleBackToPlans}
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

export default Cart;