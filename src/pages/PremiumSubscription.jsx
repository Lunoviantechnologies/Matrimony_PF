import React from 'react';
import '../styleSheets/PremiumSubscription.css';

function App() {
  return (
    <div className="app">
      <header className="header">
        <div className="logo">shāādù</div>
      </header>
      
      <div className="banner">
        <h1>Upgrade now & Get upto 50% discount!</h1>
        <p>Save upto 50% on Premium Plains!! Valid for limited period!</p>
      </div>
      
      <div className="plans-container">
        {/* Gold 3 Months */}
        <div className="plan-card">
          <div className="plan-header">
            <h2>Gold 3 Months</h2>
            <div className="discount-badge">30% off</div>
          </div>
          <div className="price-section">
            <div className="original-price">¥14,510</div>
            <div className="discounted-price">¥3,631</div>
            <div className="per-month">11,211 per month</div>
          </div>
          <button className="continue-btn">Continue</button>
          <div className="features">
            <div className="feature">Send unlimited Messages</div>
            <div className="feature">View upto 50 Contact Numbers</div>
            <div className="feature">5 Share U-Lip passes from INKEGGI</div>
            <div className="feature">Download information</div>
            <div className="feature">Findlists</div>
            <div className="feature">Last Motivation contains you directly</div>
          </div>
        </div>
        
        {/* Gold Plus 3 Months */}
        <div className="plan-card">
          <div className="plan-header">
            <h2>Gold Plus 3 Months</h2>
            <div className="discount-badge">30% off</div>
          </div>
          <div className="price-section">
            <div className="original-price">¥15,500</div>
            <div className="discounted-price">¥3,992</div>
            <div className="per-month">11,227 per month</div>
          </div>
          <button className="continue-btn">Continue</button>
          <div className="features">
            <div className="feature">Send unlimited Messages</div>
            <div className="feature">View upto 75 Contact Numbers</div>
            <div className="feature">5 Share U-Lip passes from INKEGGI</div>
            <div className="feature">Restrict from other Parties</div>
            <div className="feature">Last Motivation contains you directly</div>
          </div>
        </div>
        
        {/* Diamond 6 Months */}
        <div className="plan-card">
          <div className="plan-header">
            <h2>Diamond 6 Months</h2>
            <div className="discount-badge">30% off</div>
          </div>
          <div className="price-section">
            <div className="original-price">¥14,520</div>
            <div className="discounted-price">¥4,564</div>
            <div className="per-month">17.91 per month</div>
          </div>
          <button className="continue-btn">Continue</button>
          <div className="features">
            <div className="feature">Send unlimited Messages</div>
            <div className="feature">View upto 100 Contact Numbers</div>
            <div className="feature">5 Share U-Lip passes from INKEGGI</div>
            <div className="feature">Download information</div>
            <div className="feature">Findlists</div>
            <div className="feature">Last Motivation contains you directly</div>
          </div>
        </div>
        
        {/* Diamond Plus 6 Months */}
        <div className="plan-card">
          <div className="plan-header">
            <h2>Diamond Plus 6 Months</h2>
            <div className="discount-badge">40% off</div>
          </div>
          <div className="price-section">
            <div className="original-price">¥14,100</div>
            <div className="discounted-price">¥4,919</div>
            <div className="per-month">18.12 per month</div>
          </div>
          <button className="continue-btn">Continue</button>
          <div className="features">
            <div className="feature">Send unlimited Messages</div>
            <div className="feature">View upto 100 Contact Numbers (Unlimited by Accreted Waiting)</div>
            <div className="feature">5 Share U-Lip passes from INKEGGI</div>
            <div className="feature">Restrict from other Parties</div>
            <div className="feature">Last Motivation contains you directly</div>
            <div className="feature">Download information</div>
            <div className="feature">Findlists</div>
            <div className="feature">Last Motivation contains you directly</div>
          </div>
        </div>
        
        {/* Platinum Plus 12 Months */}
        <div className="plan-card">
          <div className="plan-header">
            <h2>Platinum Plus 12 Months</h2>
            <div className="discount-badge">80% off</div>
          </div>
          <div className="price-section">
            <div className="original-price">¥13,504</div>
            <div className="discounted-price">¥6,652</div>
            <div className="per-month">135.54 per month</div>
          </div>
          <button className="continue-btn">Continue</button>
          <div className="features">
            <div className="feature">Send unlimited Messages</div>
            <div className="feature">View upto 200 Contact Numbers (Unlimited by Accreted Waiting)</div>
            <div className="feature">5 Share U-Lip passes from INKEGGI</div>
            <div className="feature">Restrict from other Parties</div>
            <div className="feature">Last Motivation contains you directly</div>
          </div>
        </div>
      </div>
      
      <div className="vip-section">
        <div className="vip-badge">VIPSHAAD!!</div>
        <h2>No.1 Modernaking Service for the Ellies</h2>
        <div className="vip-features">
          <div className="vip-feature">5x Success + 100% Privacy</div>
          <div className="vip-feature">50K+ VIPs + Top Consultant</div>
        </div>
        <button className="consultation-btn">Book a FREE Consultation</button>
      </div>
      
      <div className="faq-section">
        <h2>You have questions. We have the answers...</h2>
        
        <div className="faq-item">
          <h3>What are some of the benefits of Premium plans?</h3>
          <p>As a Premium member, you can chat unlimited with your Matches, even their content numbers and view hidden photos. You also get Premium Assurance on priority. These benefits will help you to accelerate your partner search.</p>
        </div>
        
        <div className="faq-item">
          <h3>What payment options do you offer?</h3>
          <p>We offer multiple Online and offline payment options for you to pick and choose from based on your location. Choose your preferred plan and move forward to see the various options available to you.</p>
        </div>
        
        <div className="faq-item">
          <h3>What offers and discounts can I avail?</h3>
          <p>We keep you informed from time to time whenever you are eligible for different discounts and offers. Login frequently to check and avail the best available offer.</p>
        </div>
        
        <div className="faq-item">
          <h3>How can I be safe on Shaaid.com?</h3>
          <p>We go to great lengths to make sure you get the best possible experience here. Every single profile is screened down matches are tailored to your preferences. But if you still hire any unpleasant experience please do report the same to us.</p>
        </div>
        
        <div className="faq-help">
          <p>Didn't find what you are looking for? Find it all our Help page.</p>
        </div>
      </div>
      
      <footer className="footer">
        <p>The safest, smartest and the most secure matchmaking service in India</p>
      </footer>
    </div>
  )
}

export default App