import { Clock, MapPin, Navigation } from "lucide-react";
import "./Location.css";

const ADDRESS = "69-C, Block C3, Gulberg III, Lahore, Punjab, Pakistan";

function Location() {
  return (
    <section className="hm-section hm-location">
      <div className="hm-container hm-location-inner">
        <div className="hm-location-map">
          <iframe
            title="Map showing the Plantify studio"
            src={`https://www.google.com/maps?q=${encodeURIComponent(ADDRESS)}&output=embed`}
            loading="lazy"
            allowFullScreen
          />
        </div>

        <div className="hm-location-card">
          <span className="hm-eyebrow">Visit us</span>
          <h2 className="hm-title">
            Come say <em>hello.</em>
          </h2>

          <ul className="hm-location-details">
            <li>
              <MapPin size={18} strokeWidth={1.6} />
              <span>
                69-C, Block C3, Gulberg III
                <br />
                Lahore, Punjab, Pakistan
              </span>
            </li>
            <li>
              <Clock size={18} strokeWidth={1.6} />
              <span>Open every day, 11am – 5:30pm</span>
            </li>
          </ul>

          <a
            href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(ADDRESS)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="hm-button hm-button--dark"
          >
            <Navigation size={16} />
            Get directions
          </a>
        </div>
      </div>
    </section>
  );
}

export default Location;
