import {
  ArrowUpRightIcon,
  BookOpenIcon,
  ChevronRightIcon,
  CircleHelpIcon,
  HeadphonesIcon,
  LeafIcon,
  MailIcon,
  MessageCircleIcon,
  PackageIcon,
  PhoneIcon,
  SearchIcon
} from "lucide-react";
import React, { useState } from "react";
import { Link } from "react-router-dom";
import "./AccountSupport.css";

const supportOptions = [
  {
    id: 1,
    icon: PackageIcon,
    title: "Order support",
    description: "Questions about an order, delivery, or return?",
    action: "View orders",
    link: "/orders"
  },
  {
    id: 2,
    icon: LeafIcon,
    title: "Plant care",
    description: "Need help keeping your plants happy and healthy?",
    action: "Open plant guide",
    link: "/guide"
  },
  {
    id: 3,
    icon: MessageCircleIcon,
    title: "Talk to us",
    description: "Our team is here when you need a little help.",
    action: "Contact Plantify",
    link: "/contact"
  }
];

const faqs = [
  {
    question: "Where is my order?",
    answer:
      "You can track your latest order from the Orders section of your account."
  },
  {
    question: "How do I care for my new plant?",
    answer:
      "Visit the Plant Guide for watering, light, placement, and seasonal care advice."
  },
  {
    question: "Can I change my delivery address?",
    answer:
      "You can manage your saved addresses from the Addresses section of your account."
  },
  {
    question: "How do I return an item?",
    answer:
      "Contact Plantify support with your order details and our team will guide you through the process."
  }
];

function AccountSupport() {
  const [openFaq, setOpenFaq] = useState(null);
  const [search, setSearch] = useState("");

  const filteredFaqs = faqs.filter((faq) =>
    faq.question.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <section className="account-support-section">
      <div className="account-support-container">

        <div className="account-support-hero">

          <div className="account-support-hero-content">

            <p className="account-support-kicker">
              HERE WHEN YOU NEED US
            </p>

            <h2>
              A little help
              <span> goes a long way.</span>
            </h2>

            <p className="account-support-description">
              Whether you're looking for plant-care advice,
              checking an order, or simply have a question,
              we're here to help.
            </p>

            <div className="account-support-hero-actions">

              <Link
                to="/contact"
                className="account-support-primary-button"
              >
                <MessageCircleIcon size={16} />
                Talk to Plantify
                <ArrowUpRightIcon size={14} />
              </Link>

              <Link
                to="/guide"
                className="account-support-secondary-button"
              >
                Explore plant guide
              </Link>

            </div>

          </div>

          <div className="account-support-hero-art">

            <div className="account-support-circle circle-one" />
            <div className="account-support-circle circle-two" />

            <div className="account-support-art-leaf">
              <LeafIcon size={76} strokeWidth={1} />
            </div>

            <div className="account-support-art-card">

              <HeadphonesIcon size={17} />

              <div>
                <strong>
                  Plantify Care
                </strong>

                <span>
                  We're here for you
                </span>
              </div>

            </div>

          </div>

        </div>

        <div className="account-support-options">

          {supportOptions.map((option) => {
            const Icon = option.icon;

            return (
              <Link
                to={option.link}
                className="account-support-option"
                key={option.id}
              >

                <div className="account-support-option-icon">
                  <Icon size={19} />
                </div>

                <div className="account-support-option-content">

                  <h3>
                    {option.title}
                  </h3>

                  <p>
                    {option.description}
                  </p>

                  <span>
                    {option.action}
                    <ArrowUpRightIcon size={13} />
                  </span>

                </div>

              </Link>
            );
          })}

        </div>

        <div className="account-support-faq-section">

          <div className="account-support-faq-heading">

            <div>
              <p className="account-support-small-kicker">
                QUICK ANSWERS
              </p>

              <h3>
                Frequently asked
                <span> questions.</span>
              </h3>
            </div>

            <div className="account-support-search">

              <SearchIcon size={15} />

              <input
                type="text"
                placeholder="Search questions..."
                value={search}
                onChange={(event) =>
                  setSearch(event.target.value)
                }
              />

            </div>

          </div>

          <div className="account-support-faq-list">

            {filteredFaqs.length > 0 ? (
              filteredFaqs.map((faq, index) => (
                <div
                  className={`account-support-faq ${
                    openFaq === index ? "is-open" : ""
                  }`}
                  key={faq.question}
                >

                  <button
                    type="button"
                    onClick={() =>
                      setOpenFaq(
                        openFaq === index ? null : index
                      )
                    }
                  >

                    <span>
                      {faq.question}
                    </span>

                    <ChevronRightIcon size={16} />

                  </button>

                  {openFaq === index && (
                    <div className="account-support-faq-answer">
                      {faq.answer}
                    </div>
                  )}

                </div>
              ))
            ) : (
              <div className="account-support-no-results">
                <CircleHelpIcon size={20} />

                <span>
                  No questions found.
                </span>
              </div>
            )}

          </div>

        </div>

        <div className="account-support-contact">

          <div className="account-support-contact-icon">
            <MailIcon size={20} />
          </div>

          <div className="account-support-contact-content">

            <p>
              STILL NEED HELP?
            </p>

            <h3>
              Let's talk about it.
            </h3>

            <span>
              Send us a message and our team will get back
              to you as soon as possible.
            </span>

          </div>

          <div className="account-support-contact-actions">

            <Link to="/contact">
              Contact us
              <ArrowUpRightIcon size={14} />
            </Link>

            <a href="mailto:hello@plantify.com">
              hello@plantify.com
            </a>

          </div>

        </div>

        <div className="account-support-footer">

          <div>
            <BookOpenIcon size={15} />

            <span>
              More plant knowledge?
            </span>
          </div>

          <Link to="/guide">
            Visit Plant Guide
            <ArrowUpRightIcon size={13} />
          </Link>

        </div>

      </div>
    </section>
  );
}

export default AccountSupport;
