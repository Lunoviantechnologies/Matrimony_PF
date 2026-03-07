import React, { useState } from "react";
import "../styleSheets/FAQ.css";
import { FaChevronDown, FaChevronUp, FaQuestionCircle, } from "react-icons/fa";

const FAQ = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleFAQ = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqData = [
    {
      question: "What is ISKCON matrimony?",
      answer:
        "ISKCON matrimony is a spiritual matchmaking platform created for Krishna devotees who wish to build marriages based on devotion, values, and dharmic principles. It connects individuals and families who follow the teachings of ISKCON and Vaishnav traditions, helping them find compatible life partners who share similar spiritual beliefs and lifestyle.",
    },
    {
      question: "How does Vaishnav matrimony work?",
      answer:
        "Vaishnav matrimony platforms help devotees find suitable life partners within the Vaishnav community. Users create a profile with their personal, spiritual, and family details. Based on these details, they can browse or connect with compatible profiles that share similar spiritual values, traditions, and life goals.",
    },
    {
      question: "Is VivahJeevan a spiritual matrimony app?",
      answer:
        "Yes, VivahJeevan is a spiritual matrimony platform designed specifically for ISKCON devotees and Vaishnav families. The platform focuses on sacred relationships rooted in devotion, culture, and shared spiritual values rather than only modern matchmaking criteria.",
    },
    {
      question: "Can parents create profiles?",
      answer:
        "Yes, parents or family members can create and manage profiles on behalf of their children. This allows families to actively participate in the matchmaking process while ensuring that the search aligns with family traditions and spiritual values.",
    },
    {
      question: "Is this only for Krishna devotees?",
      answer:
        "Vivah Jeevan primarily serves Krishna devotees and members of the Vaishnav community. However, individuals who respect and wish to follow Vaishnav spiritual values and lifestyle are also welcome to join the platform and find compatible partners.",
    },
    {
      question: "Are all people allowed to become members?",
      answer:
        "Yes. VivahJeevan welcomes people from all castes, communities, and backgrounds across the world!",
    },
    {
      question: "How long does membership approval take?",
      answer:
        "Usually within 24 hours. If delayed, please raise a support ticket for faster approval.",
    },
    {
      question: "Can I meet my life partner online?",
      answer:
        "Of course! Thousands of successful couples found love on VivahJeevan. Build a strong profile and connect respectfully.",
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
