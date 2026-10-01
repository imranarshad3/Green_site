import { Mail, Phone } from "lucide-react";
import "./Services.css";
import background from "./Images/background.webp";

function Services() {
  return (
    <section className="hm-section hm-services">
      <div className="hm-container">
        <div className="hm-services-banner">
          <img className="hm-services-image" src={background} alt="" />

          <div className="hm-services-content">
            <span className="hm-eyebrow">Delivered with care</span>
            <h2 className="hm-title">
              Free shipping on orders <em>over $50.</em>
            </h2>
            <p className="hm-lead">
              Every plant is carefully packed and shipped within 1–2
              business days. Questions? We're happy to help.
            </p>

            <div className="hm-services-contact">
              <a href="tel:+923001223344">
                <Phone size={17} strokeWidth={1.6} />
                0300 1223344
              </a>
              <a href="mailto:order@platify.co">
                <Mail size={17} strokeWidth={1.6} />
                order@platify.co
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Services;
