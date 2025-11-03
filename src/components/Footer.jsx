import React from "react";

const Footer = () => {
  return (
    <footer className="bg-white text-gray-800 border-t border-gray-300 py-12 px-6">
      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8 text-sm">

        {/* Column 1 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Trusted by Millions</h3>
          <p className="text-gray-600">
            SaathJanam.com is India's No.1 Matrimony Service with millions of
            successful matches. Find your perfect life partner with trust and privacy.
          </p>
        </div>

        {/* Column 2 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Company</h3>
          <ul className="space-y-2 text-gray-600">
            <li><a href="#">About Us</a></li>
            <li><a href="#">Contact Us</a></li>
            <li><a href="#">Careers</a></li>
            <li><a href="#">Privacy Policy</a></li>
            <li><a href="#">Terms of Use</a></li>
          </ul>
        </div>

        {/* Column 3 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Explore</h3>
          <ul className="space-y-2 text-gray-600">
            <li><a href="#">Member Login</a></li>
            <li><a href="#">Join Now</a></li>
            <li><a href="#">Community Matrimony</a></li>
            <li><a href="#">Premium Plans</a></li>
            <li><a href="#">Success Stories</a></li>
          </ul>
        </div>

        {/* Column 4 */}
        <div>
          <h3 className="text-lg font-semibold mb-4">Follow Us</h3>
          <div className="flex space-x-4">
            <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733547.png" alt="Facebook" className="w-6 h-6" /></a>
            <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733558.png" alt="Instagram" className="w-6 h-6" /></a>
            <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733579.png" alt="Twitter" className="w-6 h-6" /></a>
            <a href="#"><img src="https://cdn-icons-png.flaticon.com/512/733/733585.png" alt="YouTube" className="w-6 h-6" /></a>
          </div>
          <p className="mt-4 text-gray-600">
            Download the SaathJanam App
          </p>
          <div className="flex space-x-3 mt-3">
            <img
              src="https://upload.wikimedia.org/wikipedia/commons/7/78/Google_Play_Store_badge_EN.svg"
              alt="Play Store"
              className="w-28"
            />
            <img
              src="https://developer.apple.com/assets/elements/badges/download-on-the-app-store.svg"
              alt="App Store"
              className="w-28"
            />
          </div>
        </div>
      </div>

      <div className="border-t border-gray-300 mt-8 pt-6 text-center text-gray-600 text-sm">
        © 2025 SaathJanam.com - All Rights Reserved
      </div>
    </footer>
  );
};

export default Footer;
