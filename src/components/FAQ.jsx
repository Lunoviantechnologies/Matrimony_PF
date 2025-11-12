import React, { useState } from "react";
import "../styleSheets/faq.css";
import { FaChevronDown, FaChevronUp, FaQuestionCircle, } from "react-icons/fa";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "Are all people allowed to become members?",
      answer:
        "Yes. SaathJanam welcomes people from all castes, communities, and backgrounds across the world!",
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
      question: "What is the difference between Free and Premium?",
      answer:
        "Free members can create profiles and search matches. Premium unlocks messaging, calls, privacy controls, and more.",
    },
    {
      question: "How do I request a refund?",
      answer:
        "Refunds depend on service usage. Please raise a ticket with your transaction details for quick help.",
    },
    {
      question: "How do I delete or deactivate my profile?",
      answer:
        "Go to Account Settings → Delete Profile to remove your account permanently.",
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

export default FAQ;
