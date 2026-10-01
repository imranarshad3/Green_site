import React from "react";
import { BookOpen, RotateCcw, ShieldCheck, Truck } from "lucide-react";
import "./ValueStrip.css";
import { GUARANTEE_DAYS, RETURN_DAYS } from "../../../../utils/storeInfo";

// Promises already made elsewhere in the store (cart, product page, guide).
const VALUES = [
  { Icon: Truck, title: "Free delivery", text: "On orders over $50" },
  { Icon: ShieldCheck, title: "Plant guarantee", text: `${GUARANTEE_DAYS}-day healthy plant promise` },
  { Icon: RotateCcw, title: "Easy returns", text: `Hassle-free within ${RETURN_DAYS} days` },
  { Icon: BookOpen, title: "Care guidance", text: "Simple guides for every plant" },
];

function ValueStrip() {
  return (
    <div className="hm-container">
      <ul className="hm-values">
        {VALUES.map(({ Icon, title, text }) => (
          <li className="hm-value" key={title}>
            <span className="hm-value-icon">
              <Icon size={20} strokeWidth={1.6} />
            </span>
            <div>
              <p className="hm-value-title">{title}</p>
              <p className="hm-value-text">{text}</p>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ValueStrip;
