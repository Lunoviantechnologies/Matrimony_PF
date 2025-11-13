import React from "react";
import "../styleSheets/Footer.css";

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
  const getSlug = (text) =>
    text.toLowerCase().replace(/ /g, "-").replace(/[&]/g, "");

  return (
    <footer className="footer">
      <h2 className="footer-heading">Saathjanam.com - Trusted by Millions</h2>

      <p className="footer-description">
        Saathjanam.com, one of India's leading matrimonial platforms, was
        founded with a simple objective — to help people find happiness. By
        redefining how Indian brides and grooms meet for marriage,
        Saathjanam.com continues to connect millions of people worldwide.
      </p>

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