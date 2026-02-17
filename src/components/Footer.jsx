import React from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styleSheets/Footer.css";
import { FaFacebookF, FaInstagram, FaTwitter, FaQuora, FaGooglePlay, FaApple } from "react-icons/fa";
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
      "Vivahjeevan Blog",
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
  "Member Login": "/",
  "Sign Up": "/register",
  "Partner Search": "/",
  "How to Use Vivahjeevan.com": "/",
  "Customer Support": "/contactus",
  "Vivahjeevan Blog": "/resources/blog",
  "Careers": "/",
  "Awards & Recognition": "/",
  "Site Map": "/",
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
    icon: <FaTwitter />,
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
  const getSlug = (text) => text.toLowerCase().replace(/ /g, "-").replace(/[&]/g, "");

  const handleRedirect = () => {
    if (role?.[0] === "USER") navigate("/dashboard");
    else if (role?.[0] === "ADMIN") navigate("/admin");
    else navigate("/");
  }

  const handleComingSoon = (e) => {
    e.preventDefault();
    toast.info("Our mobile app is coming soon! Stay tuned.");
  };

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
        {FOOTER_LINKS.map((column) => (
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

      <div className="d-flex justify-content-evenly">
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

    </footer>

  );
};

export default Footer;