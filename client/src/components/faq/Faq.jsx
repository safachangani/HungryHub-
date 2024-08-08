import React, { useState } from 'react';
import './faq.css';
import NavBar from '../navbar/NavBar';
function Faq() {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "What is HungryHub?",
      answer: "HungryHub is a food delivery platform where you can order meals from a variety of restaurants."
    },
    {
      question: "How do I place an order?",
      answer: "You can place an order by selecting your favorite restaurant, choosing items from the menu, and proceeding to checkout."
    },
    {
      question: "What payment methods are accepted?",
      answer: "We accept various payment methods including credit/debit cards, net banking, and digital wallets."
    },
    {
      question: "How do I track my order?",
      answer: "You can track your order status in the 'Orders' section after logging into your account."
    },
    {
      question: "How do I contact customer support?",
      answer: "You can contact our customer support via the 'Help' section on our website or app."
    }
  ];

  const toggleAccordion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <>
    <NavBar></NavBar>
    <div className="faq-container">
      <h1>Frequently Asked Questions</h1>
      <div className="faq-list">
        {faqs.map((faq, index) => (
          <div
            key={index}
            className={`faq-item ${activeIndex === index ? 'active' : ''}`}
            onClick={() => toggleAccordion(index)}
          >
            <div className="faq-question">
              {faq.question}
              <span className="arrow">{activeIndex === index ? '-' : '+'}</span>
            </div>
            <div className="faq-answer">{faq.answer}</div>
          </div>
        ))}
      </div>
    </div>
    </>
  );
}

export default Faq;
