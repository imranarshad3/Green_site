import React from "react";
import { Link } from "react-router-dom";
import { ArrowRight, Sprout } from "lucide-react";

import Navbar from "../../ReusedComponents/Navbar/Navbar";
import "./NotFoundPage.css";

function NotFoundPage() {
  return (
    <div className="not-found-page">
      <Navbar />

      <section className="not-found">
        <div className="not-found-icon">
          <Sprout size={34} strokeWidth={1.2} />
        </div>

        <p className="not-found-eyebrow">
          PAGE NOT FOUND
        </p>

        <h1>
          This page hasn't
          <br />
          sprouted yet.
        </h1>

        <p className="not-found-description">
          The page you're looking for doesn't exist or isn't available yet.
        </p>

        <Link to="/" className="not-found-button">
          <span>Back to home</span>
          <ArrowRight size={16} strokeWidth={1.5} />
        </Link>
      </section>
    </div>
  );
}

export default NotFoundPage;
