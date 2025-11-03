import React from "react";
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

const SaathjanamFooter = () => {
  const getSlug = (text) =>
    text.toLowerCase().replace(/ /g, "-").replace(/[&]/g, "");

  const styles = {
    footer: {
      backgroundColor: "#fafafa",
      padding: "50px 10%",
      borderTop: "1px solid #eee",
      fontFamily: "Arial, sans-serif",
      marginTop: "50px",
    },
    heading: {
      textAlign: "center",
      color: "#ff5a60",
      fontSize: "26px",
      fontWeight: "600",
      marginBottom: "15px",
    },
    description: {
      textAlign: "center",
      color: "#555",
      fontSize: "15px",
      maxWidth: "900px",
      margin: "0 auto 40px",
      lineHeight: "1.6",
    },
    content: {
      display: "flex",
      justifyContent: "space-between",
      flexWrap: "wrap",
      maxWidth: "1200px",
      margin: "0 auto 30px",
    },
    column: {
      width: "23%",
      minWidth: "200px",
      marginBottom: "30px",
    },
    columnTitle: {
      fontSize: "15px",
      fontWeight: "700",
      color: "#333",
      marginBottom: "15px",
    },
    list: {
      listStyle: "none",
      padding: 0,
      margin: 0,
    },
    link: {
      textDecoration: "none",
      color: "#666",
      fontSize: "14px",
      lineHeight: "1.8",
      display: "block",
      transition: "color 0.3s",
    },
    linkHover: {
      color: "#ff5a60",
    },
    copyright: {
      textAlign: "center",
      fontSize: "12px",
      color: "#999",
      paddingTop: "20px",
      borderTop: "1px solid #ddd",
    },
  };

  return (
    <footer style={styles.footer}>
      {/* Heading */}
      <h2 style={styles.heading}>Saathjanam.com - Trusted by Millions</h2>

      {/* Description */}
      <p style={styles.description}>
        Saathjanam.com, one of India's leading matrimonial platforms, was
        founded with a simple objective — to help people find happiness. By
        redefining how Indian brides and grooms meet for marriage,
        Saathjanam.com continues to connect millions of people worldwide.
      </p>

      {/* Footer Links */}
      <div style={styles.content}>
        {FOOTER_LINKS.map((column) => (
          <div key={column.title} style={styles.column}>
            <h3 style={styles.columnTitle}>{column.title}</h3>
            <ul style={styles.list}>
              {column.links.map((link) => (
                <li key={link}>
                  <a
                    href={`/${getSlug(link)}`}
                    style={styles.link}
                    onMouseOver={(e) =>
                      (e.currentTarget.style.color = "#ff5a60")
                    }
                    onMouseOut={(e) =>
                      (e.currentTarget.style.color = "#666")
                    }
                  >
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      {/* Copyright */}
      <div style={styles.copyright}>
        &copy; {new Date().getFullYear()} Saathjanam.com. All Rights Reserved.
      </div>
    </footer>
  );
};

export default SaathjanamFooter;
