import React, { useState } from "react";
import "../styleSheets/faq.css";
import { FaChevronDown, FaChevronUp, FaQuestionCircle, } from "react-icons/fa";

const FAQ_user = () => {
    const [openIndex, setOpenIndex] = useState(null);

    const toggleFAQ = (index) => {
        setOpenIndex(openIndex === index ? null : index);
    };

    const faqData = [
        {
            question: "Can I edit my profile details later?",
            answer:
                "Absolutely. You can update personal details, preferences, photo, and career at any time from My Profile.",
        },
        {
            question: "Can I hide my profile temporarily?",
            answer:
                "Yes. You can deactivate or hide your profile from search results through Privacy Settings",
        },
        {
            question: "How do I express interest in someone?",
            answer:
                "Click on Send Request on a profile. If accepted, you may be able to communicate based on your plan.",
        },
        {
            question: "Can I message members for free?",
            answer:
                "No, Basic accounts unable to communication each other. Messaging is available with a premium membership only.",
        },
        {
            question: "Is my personal information safe?",
            answer:
                "Yes. We follow strict data protection and privacy standards. Your contact details are shared only with your consent.",
        },
        {
            question: "How do I report a fake or inappropriate profile?",
            answer:
                "Use the Help option which displayed on navigation and describe the issue completely. Our moderation team will review it promptly.",
        },
        {
            question: "How long does membership approval take?",
            answer:
                "Usually within 24 hours. If delayed, please raise a support ticket for faster approval.",
        },
        {
            question: "Can I meet my life partner online?",
            answer:
                "Of course! Thousands of successful couples found love on SaathJanam. Build a strong profile and connect respectfully.",
        },
        {
            question: "How do I request a refund?",
            answer:
                "Refunds depend on service usage. Please raise a ticket with your transaction details for quick help.",
        },
        {
            question: "How to update your password?",
            answer:
                "Go to Settings → Security. If you have forgotten old password, then your have to update the password in forget password with the register email id.",
        },
        {
            question: "How do I delete or deactivate my profile?",
            answer:
                "Go to Settings → Support. Delete Account to remove your account permanently(completely will be deleted after 30 days).",
        },
    ];

    return (
        <div className="faq-container">
            <h2><FaQuestionCircle className="faq-icon" /> Frequently Asked Questions</h2>
            <p className="faq-subtitle">
                Answers to the most common questions from our global community
            </p>

            <div className="faq-list">
                {faqData.map((item, index) => (
                    <div
                        className={`faq-item ${openIndex === index ? "open" : ""}`}
                        key={index}
                        onClick={() => toggleFAQ(index)}
                    >
                        <div className="faq-question">
                            {item.question}
                            {openIndex === index ? (
                                <FaChevronUp className="faq-arrow" />
                            ) : (
                                <FaChevronDown className="faq-arrow" />
                            )}
                        </div>
                        {openIndex === index && (
                            <div className="faq-answer">{item.answer}</div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
};

export default FAQ_user;
