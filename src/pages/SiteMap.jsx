import React from "react";
import { Link } from "react-router-dom";
import "../styleSheets/siteMap.css";
import { Helmet } from "react-helmet";

const SITE_MAP_DATA = [
    {
        title: "Main Pages",
        links: [
            { name: "Home", path: "/" },
            { name: "About Us", path: "/aboutus" },
            { name: "Contact Us", path: "/contactus" },
            { name: "Vivahjeevan Blog", path: "/resources/blog" },
        ],
    },
    {
        title: "User Pages",
        links: [
            { name: "Register", path: "/register" },
            { name: "Login", path: "/login" },
            { name: "Partner Search", path: "/search-profiles" },
            { name: "Membership Plans", path: "/membership-plans" },
        ],
    },
    {
        title: "Privacy & Legal",
        links: [
            { name: "Privacy Policy", path: "/privacy_policy" },
            { name: "Terms & Conditions", path: "/terms&conditions" },
            { name: "Refund Policy", path: "/refund-policy" },
            { name: "Disclaimer", path: "/disclaimer" },
            { name: "Community Guidelines", path: "/community-guidelines" },
        ],
    },
];

const SiteMap = () => {
    const handleScrollTop = () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    return (
        <div className="sitemap-container">

            <Helmet>
                <title>Site Map | Vivahjeevan</title>
                <meta
                    name="description"
                    content="Explore all important pages of Vivahjeevan.com including services, membership plans, blog, privacy policies and more."
                />
                <link rel="canonical" href="https://vivahjeevan.com/sitemap" />
            </Helmet>

            <div className="sitemap-header">
                <h1>Site Map</h1>
                <p>
                    Explore all important sections of Vivahjeevan.com to easily navigate
                    through our platform.
                </p>
            </div>

            <div className="sitemap-grid">
                {SITE_MAP_DATA.map((section) => (
                    <nav key={section.title} className="sitemap-card" aria-label={section.title}>
                        <h3>{section.title}</h3>
                        <ul>
                            {section.links.map((link) => (
                                <li key={link.name}>
                                    <Link to={link.path} onClick={handleScrollTop}>
                                        {link.name}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </nav>
                ))}
            </div>

        </div>
    );
};

export default SiteMap;