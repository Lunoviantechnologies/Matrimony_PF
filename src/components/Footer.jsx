import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styleSheets/Footer.css";
import { FaFacebookF, FaInstagram, FaQuora, FaGooglePlay, FaApple } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";
import { useSelector } from "react-redux";
import { toast } from "react-toastify";

const FOOTER_LINKS = [
  {
    title: "Need Help?",
    links: [
      "Member Login",
      "Sign Up",
      "Partner Search",
      "How to Use Vivahjeevan.com",
      "Customer Support",
      "Site Map",
    ],
  },
  {
    title: "Company",
    links: [
      "About Us",
      "Blog",
      "Careers",
      "Awards & Recognition",
      "Contact Us",
    ],
  },
  {
    title: "Privacy & You",
    links: [
      "Terms & Conditions",
      "Privacy Policy",
      "Refund Policy",
      "Disclaimer",
      "Community Guidelines",
    ],
  },
  {
    title: "More",
    links: [
      "VIP Vivahjeevan",
      "Select Vivahjeevan",
      "Success Stories",
      "Vivahjeevan Centres",
      "Elite Matrimony",
    ],
  },
];

const ROUTE_MAP = {
  "Member Login": "/login",
  "Sign Up": "/register",
  "Partner Search": "/",
  "How to Use Vivahjeevan.com": "/",
  "Customer Support": "/contactus",
  "Blog": "/resources/blog",
  "Careers": "/",
  "Awards & Recognition": "/",
  "Site Map": "/sitemap",
  "About Us": "/aboutus",
  "Contact Us": "/contactus",
  "Terms & Conditions": "/terms&conditions",
  "Privacy Policy": "/privacy_policy",
  "Refund Policy": "/refund-policy",
  "Disclaimer": "/disclaimer",
  "Community Guidelines": "/community-guidelines",
  "VIP Vivahjeevan": "/",
  "Select Vivahjeevan": "/",
  "Success Stories": "/",
  "Vivahjeevan Centres": "/",
  "Elite Matrimony": "/",
  "Dashboard": "/dashboard",
  "My Profile": "/matches",
  "Membership Plans": "/dashboard/premium",
};

const SOCIAL_LINKS = [
  {
    icon: <FaFacebookF />,
    url: "https://www.facebook.com/profile.php?id=61587939295674",
  },
  {
    icon: <FaInstagram />,
    url: "https://www.instagram.com/vivah_jeevan/",
  },
  {
    icon: <FaXTwitter />,
    url: "https://x.com/vivahjeewan",
  },
  {
    icon: <FaQuora />,
    url: "https://www.quora.com/profile/Vivah-Jeevan",
  },
];

const Footer = () => {

  const { role } = useSelector(state => state.auth);
  const navigate = useNavigate();
  const [showAppModal, setShowAppModal] = useState(false);

  // Auto close after 5 seconds
  useEffect(() => {
    let timer;
    if (showAppModal) {
      timer = setTimeout(() => {
        setShowAppModal(false);
      }, 3000);
    }
    return () => clearTimeout(timer);
  }, [showAppModal]);

  // ESC key close
  useEffect(() => {
    const handleEsc = (e) => {
      if (e.key === "Escape") {
        setShowAppModal(false);
      }
    };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  const handleComingSoon = (e) => {
    e.preventDefault();
    setShowAppModal(true);
  };

  const isUser = role?.[0] === "USER";

  const getSlug = (text) => text.toLowerCase().replace(/ /g, "-").replace(/[&]/g, "");

  const handleRedirect = () => {
    if (role?.[0] === "USER") navigate("/dashboard");
    else if (role?.[0] === "ADMIN") navigate("/admin");
    else navigate("/");
  };

  const dynamicFooterLinks = isUser
    ? [
      {
        title: "My Account",
        links: [
          "Dashboard",
          "My Profile",
          "Partner Search",
          "Membership Plans",
        ],
      },
      ...FOOTER_LINKS.filter(col => col.title !== "Need Help?")
    ]
    : FOOTER_LINKS;

  return (
    <footer className="footer">

      <div className="footer-top">

        <div className="footer-brand" onClick={handleRedirect}>
          <img
            src="/vivahjeevan_logo.png"
            alt="Vivahjeevan_logo"
            className="footer-brand-logo"
            width="60px" height="60px" />
          <span className="footer-brand-text">Vivahjeevan</span>
        </div>


        <div className="footer-top-text">
          <h2 className="footer-heading">
            Vivahjeevan.com - Serving members worldwide
          </h2>

          <p className="footer-description">
            Viviahjeevan.com, one of India's leading matrimonial platforms, was
            founded with a simple objective — to help people find happiness. By
            redefining how Indian brides and grooms meet for marriage,
            Viviahjeevan.com continues to connect millions of people worldwide.
          </p>
        </div>

      </div>

      <div className="footer-content">
        {dynamicFooterLinks.map((column) => (
          <div key={column.title} className="footer-column">
            <h3 className="footer-column-title">{column.title}</h3>

            <ul className="footer-list">
              {column.links.map((link) => {
                const route = ROUTE_MAP[link] || `/${getSlug(link)}`;

                return (
                  <li key={link}>
                    <Link
                      to={route}
                      className="footer-link"
                      onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                    >
                      {link}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-bottom">
        <div className="footer-social">
          {SOCIAL_LINKS.map((social, i) => (
            <a
              key={i}
              href={social.url}
              target="_blank"
              rel="noopener noreferrer"
              className="social-icon"
            >
              {social.icon}
            </a>
          ))}
        </div>

        <div className="store-logos">
          <h5>Download Our App</h5>

          <a
            href="#"
            onClick={handleComingSoon}
            className="store-link"
          >
            <FaGooglePlay className="store-icon" />
          </a>

          <a
            href="#"
            onClick={handleComingSoon}
            className="store-link"
          >
            <FaApple className="store-icon" />
          </a>
        </div>
      </div>

      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} Vivahjeevan.com. All Rights Reserved.
      </div>

      {showAppModal && (
        <div
          className="custom-modal-overlay"
          onClick={() => setShowAppModal(false)}
        >
          <div
            className="custom-modal"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="modal-icon">
              <i className="bi bi-phone-fill"></i>
            </div>

            <h4 className="fw-bold mt-3">Mobile App Coming Soon</h4>

            <p className="text-muted">
              Our Android & iOS app is launching soon.
              Stay tuned for an amazing experience!
            </p>

            <button
              className="modal-btn"
              onClick={() => setShowAppModal(false)}
            >
              Got it
            </button>
          </div>
        </div>
      )}

    </footer>

  );
};

export default Footer;