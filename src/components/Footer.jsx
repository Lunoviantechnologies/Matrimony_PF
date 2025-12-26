import React, { useEffect, useState } from "react";
import "../styleSheets/Footer.css";
import axios from "axios";
import backendIP from "../api/api";

const FOOTER_LINKS = [
  {
    title: "Need Help?",
    links: [
      "Member Login",
      "Sign Up",
      "Partner Search",
      "How to Use Saathjanam.com",
      "Customer Support",
      "Site Map",
    ],
  },
  {
    title: "Company",
    links: [
      "About Us",
      "Saathjanam Blog",
      "Careers",
      "Awards & Recognition",
      "Contact Us",
    ],
  },
  {
    title: "Privacy & You",
    links: ["Terms of Use", "Privacy Policy", "Be Safe Online", "Report Misuse"],
  },
  {
    title: "More",
    links: [
      "VIP Saathjanam",
      "Select Saathjanam",
      "Success Stories",
      "Saathjanam Centres",
      "Elite Matrimony",
    ],
  },
];

const Footer = () => {

  const [profileCount, setProfileCount] = useState(0);

  const formatMemberCount = (num) => {
    if (!num) return "—";
    if (num < 1000) return num.toString();
    if (num < 100000) {
      return `${(num / 1000).toFixed(1).replace(".0", "")}K+`;
    }
    if (num < 10000000) {
      return `${(num / 100000).toFixed(1).replace(".0", "")}L+`;
    }
    return `${(num / 10000000).toFixed(1).replace(".0", "")}Cr+`;
  };

  useEffect(() => {
    axios.get(`${backendIP}/profiles/count`).then(res => {
      // console.log("count : ", res.data);
      setProfileCount(res.data.count);
    }).catch(() => setProfileCount(0));
  }, []);
  // console.log("count : ", profileCount);
  const getSlug = (text) =>
    text.toLowerCase().replace(/ /g, "-").replace(/[&]/g, "");

  return (
    <footer className="footer">
      <div className="d-flex justify-content-start">
        <div>
          <img src="/saathjanam_logo.png" alt="saathjanam_logo" height={'100px'} />
        </div>

        <div>
          <h2 className="footer-heading">Saathjanam.com - Trusted by {formatMemberCount(profileCount + 10000)} Members</h2>

          <p className="footer-description">
            Saathjanam.com, one of India's leading matrimonial platforms, was
            founded with a simple objective — to help people find happiness. By
            redefining how Indian brides and grooms meet for marriage,
            Saathjanam.com continues to connect millions of people worldwide.
          </p>
        </div>
      </div>

      <div className="footer-content">
        {FOOTER_LINKS.map((column) => (
          <div key={column.title} className="footer-column">
            <h3 className="footer-column-title">{column.title}</h3>
            <ul className="footer-list">
              {column.links.map((link) => (
                <li key={link}>
                  <a href={`/${getSlug(link)}`} className="footer-link">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="footer-copyright">
        &copy; {new Date().getFullYear()} Saathjanam.com. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;