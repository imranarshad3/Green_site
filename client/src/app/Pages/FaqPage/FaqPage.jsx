import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, ChevronDown } from "lucide-react";

import Navbar from "../../ReusedComponents/Navbar/Navbar";
import HomeFooter from "../HomePage/Components/HomeFooter/HomeFooter";
import {
  DELIVERY_FEE,
  DISCOUNT_AMOUNT,
  DISCOUNT_MIN,
  FREE_DELIVERY_MIN,
} from "../../utils/cart";
import { GUARANTEE_DAYS, RETURN_DAYS, STORE } from "../../utils/storeInfo";
import "./FaqPage.css";

const SECTIONS = [
  {
    id: "delivery",
    title: "Ordering & delivery",
    questions: [
      {
        q: "How much is delivery?",
        a: `Delivery is free on orders of $${FREE_DELIVERY_MIN} or more. Below that, a flat $${DELIVERY_FEE} delivery fee is added at checkout. Your cart shows how much more you need for free delivery.`,
      },
      {
        q: "How quickly will my plants ship?",
        a: "Every plant is carefully packed and shipped within 1–2 business days.",
      },
      {
        q: "Is there a discount for bigger orders?",
        a: `Yes. Orders of $${DISCOUNT_MIN} or more get $${DISCOUNT_AMOUNT} off automatically; you'll see it in your order summary before you check out.`,
      },
      {
        q: "Do I need an account to order?",
        a: "You can fill your cart as a guest. To check out, sign in or create an account; anything already in your cart comes with you.",
      },
    ],
  },
  {
    id: "orders",
    title: "Your orders & account",
    questions: [
      {
        q: "Where can I see my orders?",
        a: "Open My Orders from the account menu. Each order shows its status: Processing, Shipped or Delivered.",
        link: { to: "/orders", label: "Go to My Orders" },
      },
      {
        q: "Can I save plants for later?",
        a: "Tap the heart on any plant to add it to your wishlist. It's saved to your account, so it's there on any device you sign in on.",
        link: { to: "/wishlist", label: "Open your wishlist" },
      },
      {
        q: "Can I choose the size and pot?",
        a: "Yes. Each plant comes in Small, Medium or Large, with an Ivory, Sand or Charcoal pot. Choose on the plant's page; quick-add buttons use Medium with an Ivory pot.",
      },
    ],
  },
  {
    id: "returns",
    title: "Returns & guarantee",
    questions: [
      {
        q: "What is your returns policy?",
        a: `Returns are hassle-free within ${RETURN_DAYS} days. Get in touch with your order number and we'll help.`,
        link: { to: "/contact", label: "Contact us" },
      },
      {
        q: "What if my plant arrives unwell?",
        a: `Every plant is covered by our ${GUARANTEE_DAYS}-day healthy plant guarantee. If it arrives unwell, send us a message with your order number and a photo, and we'll make it right.`,
        link: { to: "/contact", label: "Contact us" },
      },
    ],
  },
  {
    id: "care",
    title: "Plant care",
    questions: [
      {
        q: "How do I know if a plant suits me?",
        a: "Every plant page lists its light, watering and care level (Easy, Moderate or Expert), and whether it's pet friendly. You can also filter the shop by care level.",
        link: { to: "/products", label: "Browse plants" },
      },
      {
        q: "Do you have care advice?",
        a: "Our Plant Care Guide covers light, watering, seasonal care and a simple weekly routine.",
        link: { to: "/guide", label: "Read the guide" },
      },
      {
        q: "Which fertilizer should I use?",
        a: "Balanced Growth is for everyday foliage growth, Root Revival for stronger roots, and Leaf & Bloom for vibrant leaves and flowers.",
        link: { to: "/fertilizers", label: "Shop fertilizers" },
      },
    ],
  },
];

function FaqPage() {
  return (
    <div className="faq-page">
      <Navbar />

      <header className="faq-header">
        <div className="hm-container">
          <span className="hm-eyebrow">Help centre</span>
          <h1 className="hm-title faq-title">
            Questions, <em>answered.</em>
          </h1>
          <nav className="faq-jump" aria-label="FAQ sections">
            {SECTIONS.map((section) => (
              <a key={section.id} href={`#${section.id}`}>
                {section.title}
              </a>
            ))}
          </nav>
        </div>
      </header>

      <main className="hm-container faq-body">
        {SECTIONS.map((section) => (
          <section className="faq-section" id={section.id} key={section.id}>
            <h2>{section.title}</h2>

            {section.questions.map((item) => (
              <details className="faq-item" key={item.q}>
                <summary>
                  {item.q}
                  <ChevronDown size={18} aria-hidden="true" />
                </summary>
                <div className="faq-answer">
                  <p>{item.a}</p>
                  {item.link && (
                    <Link to={item.link.to} className="hm-text-link">
                      {item.link.label}
                      <ArrowRight size={15} />
                    </Link>
                  )}
                </div>
              </details>
            ))}
          </section>
        ))}

        <div className="faq-cta">
          <div>
            <h2>Still have a question?</h2>
            <p>
              Call {STORE.phone} or send us a message. We're open every day.
            </p>
          </div>
          <Link to="/contact" className="hm-button hm-button--light">
            Contact us
            <ArrowRight size={18} />
          </Link>
        </div>
      </main>

      <HomeFooter />
    </div>
  );
}

export default FaqPage;
