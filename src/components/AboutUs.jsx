import React from "react";
import { motion } from "framer-motion";

export default function AboutUsFooter() {
  return (
    <motion.footer
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-white text-gray-700 border-t border-gray-200 py-12"
    >
      <div className="max-w-7xl mx-auto px-6">

        {/* Logo + Headline */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-extrabold text-gray-800 mb-2" style={{ fontFamily: 'Georgia, "Times New Roman", serif' }}>
            SaathJanam.com
          </h1>
          <h2 className="text-lg font-semibold text-gray-700">Trusted by Millions</h2>
        </div>

        {/* Description */}
        <p className="text-center max-w-3xl mx-auto text-gray-600 mb-6">
          SaathJanam helps people find happiness through marriage by connecting like-minded individuals
          with verified profiles and thoughtful matchmaking. We prioritize safety, privacy, and meaningful
          connections to make every journey towards togetherness easier.
        </p>

        {/* Country links */}
        <div className="flex flex-wrap justify-center gap-4 mb-8">
          {["India","USA","Canada","UK","Singapore","Australia","UAE","NRI Matrimonials"].map((c) => (
            <a key={c} href="#" className="text-blue-600 text-sm hover:underline">
              {c}
            </a>
          ))}
        </div>

        {/* Button */}
        <div className="text-center mb-12">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="px-8 py-2 bg-teal-500 text-white rounded-full font-medium shadow-md hover:shadow-lg transition-all"
          >
            Trusted by Millions
          </motion.button>
        </div>

        <hr className="border-gray-200 mb-12" />

        {/* Icons */}
        <div className="flex flex-wrap justify-center gap-12 mb-12">
          {[
            { label: "Best Matches", color: "#e6f9f2" },
            { label: "Verified Profiles", color: "#fff6f6" },
            { label: "100% Privacy", color: "#eef7ff" },
          ].map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * i }}
              className="flex flex-col items-center"
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center shadow-sm"
                style={{ background: item.color }}
              >
                <span className="text-lg font-bold text-gray-700">{item.label[0]}</span>
              </div>
              <p className="text-sm font-medium text-gray-700 mt-2">{item.label}</p>
            </motion.div>
          ))}
        </div>

        <hr className="border-gray-200 mb-12" />

        {/* Footer Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center md:text-left">
          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Need Help?</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:underline">Contact Us</a></li>
              <li><a href="#" className="hover:underline">How It Works</a></li>
              <li><a href="#" className="hover:underline">Safety Tips</a></li>
              <li><a href="#" className="hover:underline">Support Center</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Company</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:underline">About Us</a></li>
              <li><a href="#" className="hover:underline">Careers</a></li>
              <li><a href="#" className="hover:underline">Press</a></li>
              <li><a href="#" className="hover:underline">Blog</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">Privacy & You</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:underline">Privacy Policy</a></li>
              <li><a href="#" className="hover:underline">Terms of Use</a></li>
              <li><a href="#" className="hover:underline">Cookie Settings</a></li>
              <li><a href="#" className="hover:underline">Report Abuse</a></li>
            </ul>
          </div>

          <div>
            <h3 className="text-sm font-semibold text-gray-800 mb-3">More</h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li><a href="#" className="hover:underline">Success Stories</a></li>
              <li><a href="#" className="hover:underline">Premium Plans</a></li>
              <li><a href="#" className="hover:underline">Mobile App</a></li>
              <li><a href="#" className="hover:underline">Affiliate</a></li>
            </ul>
          </div>
        </div>

        <hr className="border-gray-200 my-8" />

        {/* Bottom note */}
        <div className="text-center text-sm text-gray-500">
          © {new Date().getFullYear()} SaathJanam.com. All rights reserved.
        </div>
      </div>
    </motion.footer>
  );
}
