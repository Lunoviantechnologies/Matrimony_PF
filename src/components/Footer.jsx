import React, { useEffect, useState } from "react";
import "../styleSheets/Footer.css";

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
    links: ["Terms of Use", "Privacy Policy", "Be Safe Online", "Report Misuse"],
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

const Footer = () => {

  const getSlug = (text) =>
    text.toLowerCase().replace(/ /g, "-").replace(/[&]/g, "");

  return (
    <footer className="footer">
      <div className="d-flex justify-content-start">
        <div>
          <img src="/vivahjeevan_logo.png" alt="Vivahjeevan_logo" height={'100px'} />
        </div>

        <div>
          <h2 className="footer-heading">Vivahjeevan.com - Serving members worldwide</h2>

          <p className="footer-description">
<<<<<<< HEAD
            Viviahjeevan.com, one of India's leading matrimonial platforms, was
            founded with a simple objective — to help people find happiness. By
            redefining how Indian brides and grooms meet for marriage,
            Viviahjeevan.com continues to connect millions of people worldwide.
=======
            Vivahjeevan.com, one of India's leading matrimonial platforms, was
            founded with a simple objective — to help people find happiness. By
            redefining how Indian brides and grooms meet for marriage,
            Vivahjeevan.com continues to connect millions of people worldwide.
>>>>>>> 8daf26a0cf14f507857f169e5f71e9e32f70e0d0
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
        &copy; {new Date().getFullYear()} Vivahjeevan.com. All Rights Reserved.
      </div>
    </footer>
  );
};

export default Footer;